import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb, DeckEvaluationRecord } from '@/lib/store';

function extractTextFromPdfBuffer(buffer: Buffer): { text: string; estimatedPages: number } {
  const raw = buffer.toString('latin1');
  // Estimate page count from PDF /Type /Page objects
  const pageMatches = raw.match(/\/Type\s*\/Page\b/g);
  const estimatedPages = pageMatches ? Math.max(1, pageMatches.length) : 1;

  // Extract readable text tokens from PDF parenthesized strings and plain ASCII runs
  const parenStrings: string[] = [];
  const parenRegex = /\(([^()\\]{3,120})\)/g;
  let match: RegExpExecArray | null;
  while ((match = parenRegex.exec(raw)) !== null && parenStrings.length < 1500) {
    const cleaned = match[1].replace(/[^\x20-\x7E]/g, ' ').trim();
    if (cleaned.length >= 3 && /[a-zA-Z]{2,}/.test(cleaned)) {
      parenStrings.push(cleaned);
    }
  }

  let extracted = parenStrings.join(' ');
  if (extracted.length < 80) {
    // Fallback to readable ASCII runs (handles plain text / uncompressed PDFs)
    const asciiRuns = raw.match(/[A-Za-z0-9 ,.%$₹:;\-/]{6,}/g) || [];
    extracted = asciiRuns.slice(0, 800).join(' ');
  }

  return { text: extracted.slice(0, 15000), estimatedPages };
}

interface RubricCheck {
  name: string;
  keywords: RegExp;
  slideHint: string;
  missingAction: string;
}

const VC_RUBRIC: RubricCheck[] = [
  {
    name: 'Problem & Pain Point',
    keywords: /\b(problem|pain|challenge|inefficien|bottleneck|broken|costly)\b/i,
    slideHint: 'Problem Slide',
    missingAction: 'Define the specific customer pain point and quantify its financial or operational cost.',
  },
  {
    name: 'Solution & Product',
    keywords: /\b(solution|platform|product|workflow|architecture|engine|demo)\b/i,
    slideHint: 'Solution Slide',
    missingAction: 'Clarify how your product directly solves the stated problem with concrete workflow steps.',
  },
  {
    name: 'Market Opportunity (TAM / SAM / SOM)',
    keywords: /\b(tam|sam|som|market size|addressable|cagr|billion|opportunity)\b/i,
    slideHint: 'Market Sizing Slide',
    missingAction: 'Include both top-down and bottom-up TAM, SAM, and SOM calculations with cited sources.',
  },
  {
    name: 'Traction & Retention',
    keywords: /\b(traction|arr|mrr|revenue|growth|users|customers|retention|nrr|pilot|loi)\b/i,
    slideHint: 'Traction Slide',
    missingAction: 'Add verifiable traction metrics (MRR/ARR, MoM growth, cohort retention, or signed pilots).',
  },
  {
    name: 'Business Model & Unit Economics',
    keywords: /\b(business model|pricing|cac|ltv|margin|payback|unit economics|subscription)\b/i,
    slideHint: 'Unit Economics Slide',
    missingAction: 'Detail pricing tiers, gross margin, CAC, LTV, and payback period assumptions.',
  },
  {
    name: 'Competition & Defensibility',
    keywords: /\b(competit|moat|defensib|advantage|differenti|ip|patent|landscape)\b/i,
    slideHint: 'Competitive Landscape Slide',
    missingAction: 'Present an honest competitor matrix and explain your durable moat or switching costs.',
  },
  {
    name: 'Financial Forecast & Runway',
    keywords: /\b(forecast|projection|burn|runway|p&l|cash flow|ebitda|break-even)\b/i,
    slideHint: 'Financial Projections Slide',
    missingAction: 'Provide a 3-to-5 year financial summary showing monthly burn, runway, and key assumptions.',
  },
  {
    name: 'Team & Execution Pedigree',
    keywords: /\b(team|founder|ceo|cto|experience|background|advisor)\b/i,
    slideHint: 'Team Slide',
    missingAction: 'Highlight relevant domain expertise and why your team is uniquely positioned to execute.',
  },
  {
    name: 'The Ask & Use of Funds',
    keywords: /\b(ask|raising|round|seed|pre-seed|use of funds|milestone|allocation)\b/i,
    slideHint: 'Fundraising Ask Slide',
    missingAction: 'State the exact raise target, instrument (e.g. Post-Money SAFE), and 18-month milestone allocation.',
  },
];

async function tryExternalAiEvaluation(
  text: string,
  fileName: string,
  estimatedPages: number
): Promise<Omit<DeckEvaluationRecord, 'id' | 'userId' | 'fileName' | 'fileSizeBytes' | 'createdAt'> | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || text.trim().length < 50) return null;

  try {
    const prompt = `You are an institutional VC partner evaluating a startup pitch deck (${fileName}, ~${estimatedPages} pages).
Extracted deck text:
"""
${text.slice(0, 8000)}
"""
Return strictly valid JSON with keys:
- overallScore (number 0-100)
- summary (string)
- presentSections (string[])
- missingInformation (string[])
- weakSlides (array of {slide, issue, fix})
- financialNarrativeGaps (string[])
- recommendations (string[])`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content);
    return {
      estimatedSlides: estimatedPages,
      overallScore: Number(parsed.overallScore) || 70,
      aiPowered: true,
      summary: String(parsed.summary || ''),
      presentSections: Array.isArray(parsed.presentSections) ? parsed.presentSections : [],
      missingInformation: Array.isArray(parsed.missingInformation) ? parsed.missingInformation : [],
      weakSlides: Array.isArray(parsed.weakSlides) ? parsed.weakSlides : [],
      financialNarrativeGaps: Array.isArray(parsed.financialNarrativeGaps)
        ? parsed.financialNarrativeGaps
        : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = readDb();
  const evaluations = db.deckEvaluations
    .filter((e) => e.userId === user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({ evaluations });
}

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized. Please log in as a Startup.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('deck');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Please upload a valid pitch deck PDF file.' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: 'Uploaded file is empty.' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Pitch deck file must be under 20 MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const { text, estimatedPages } = extractTextFromPdfBuffer(buffer);

    // Attempt LLM evaluation if configured, otherwise run deterministic institutional rubric analysis
    let evalResult = await tryExternalAiEvaluation(text, file.name, estimatedPages);

    if (!evalResult) {
      const presentSections: string[] = [];
      const missingInformation: string[] = [];
      const weakSlides: Array<{ slide: string; issue: string; fix: string }> = [];
      const financialNarrativeGaps: string[] = [];
      const recommendations: string[] = [];

      const hasReadableText = text.trim().length >= 60;

      if (!hasReadableText) {
        weakSlides.push({
          slide: 'Full Document',
          issue:
            'Limited machine-readable text extracted (deck may be image-only or flattened vectors).',
          fix: 'Export your pitch deck with selectable text layers so institutional screening tools and investors can parse key metrics.',
        });
      }

      for (const item of VC_RUBRIC) {
        if (hasReadableText && item.keywords.test(text)) {
          presentSections.push(item.name);
        } else {
          missingInformation.push(item.name);
          recommendations.push(item.missingAction);
          if (
            item.name.includes('Financial') ||
            item.name.includes('Unit Economics') ||
            item.name.includes('Ask')
          ) {
            financialNarrativeGaps.push(item.missingAction);
          } else {
            weakSlides.push({
              slide: item.slideHint,
              issue: `No clear coverage of ${item.name} detected in the uploaded deck.`,
              fix: item.missingAction,
            });
          }
        }
      }

      if (estimatedPages < 8) {
        weakSlides.push({
          slide: 'Deck Length',
          issue: `Detected ${estimatedPages} page(s). Institutional seed decks typically span 10–14 focused slides.`,
          fix: 'Expand missing core sections (Market Sizing, Unit Economics, and Use of Funds) without adding filler.',
        });
      } else if (estimatedPages > 20) {
        weakSlides.push({
          slide: 'Deck Length',
          issue: `Detected ${estimatedPages} pages, which may cause narrative bloat during initial partner screening.`,
          fix: 'Move supporting charts and deep technical tables to an Appendix or Virtual Data Room.',
        });
      }

      const rubricRatio = presentSections.length / VC_RUBRIC.length;
      const lengthScore = estimatedPages >= 8 && estimatedPages <= 18 ? 15 : 8;
      const overallScore = hasReadableText
        ? Math.min(96, Math.max(28, Math.round(rubricRatio * 80 + lengthScore)))
        : 32;

      const summary = hasReadableText
        ? `Analyzed "${file.name}" (~${estimatedPages} slides). Detected ${presentSections.length} of ${VC_RUBRIC.length} core institutional underwriting sections.`
        : `Analyzed "${file.name}" (~${estimatedPages} pages). The file appears image-based with minimal extractable text; structural recommendations are listed below.`;

      evalResult = {
        estimatedSlides: estimatedPages,
        overallScore,
        aiPowered: false,
        summary,
        presentSections,
        missingInformation,
        weakSlides,
        financialNarrativeGaps,
        recommendations,
      };
    }

    const record: DeckEvaluationRecord = {
      id: crypto.randomUUID(),
      userId: user.id,
      fileName: file.name,
      fileSizeBytes: file.size,
      ...evalResult,
      createdAt: new Date().toISOString(),
    };

    const db = readDb();
    db.deckEvaluations.push(record);
    writeDb(db);

    return NextResponse.json({ success: true, evaluation: record }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to evaluate pitch deck';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
