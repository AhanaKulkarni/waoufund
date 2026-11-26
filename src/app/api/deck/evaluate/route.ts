import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb, FrsArea, FrsState } from '@/lib/store';

function extractTextFromPdfBuffer(buffer: Buffer): { text: string; estimatedPages: number } {
  const raw = buffer.toString('latin1');
  const pageMatches = raw.match(/\/Type\s*\/Page\b/g);
  const estimatedPages = pageMatches ? Math.max(1, pageMatches.length) : 1;

  const parenStrings: string[] = [];
  const parenRegex = /\(([^()\\]{2,140})\)/g;
  let match: RegExpExecArray | null;
  while ((match = parenRegex.exec(raw)) !== null && parenStrings.length < 1800) {
    const cleaned = match[1].replace(/[^\x20-\x7E]/g, ' ').trim();
    if (cleaned.length >= 2 && /[a-zA-Z0-9]{2,}/.test(cleaned)) {
      parenStrings.push(cleaned);
    }
  }

  let extracted = parenStrings.join(' ');
  if (extracted.length < 80) {
    const asciiRuns = raw.match(/[A-Za-z0-9 ,.%$₹:;\-/]{5,}/g) || [];
    extracted = asciiRuns.slice(0, 900).join(' ');
  }

  return { text: extracted.slice(0, 18000), estimatedPages };
}

function extractCompanyName(text: string, fileName: string): string {
  const cleanFileBase = fileName
    .replace(/\.pdf$/i, '')
    .replace(/[-_]*(pitch|deck|seed|series[-_]?a|presentation|v\d+(\.\d+)?)/gi, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  const titleMatch = text.match(/(?:^|\s)([A-Z][A-Za-z0-9]{2,20}(?:\s+[A-Z][A-Za-z0-9]{2,15})?)\s+(?:Pitch Deck|Series|Seed|Inc\.|Labs|AI|Technologies)/);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  return cleanFileBase.length >= 2 ? cleanFileBase : 'Venture Startup';
}

function buildBrandLogoDataUri(companyName: string): string {
  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'WF';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#5368EA"/>
        <stop offset="100%" stop-color="#8069EA"/>
      </linearGradient>
    </defs>
    <rect width="96" height="96" rx="22" fill="url(#g)"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

interface FrsRubricSpec {
  id: string;
  name: string;
  maxScore: number;
  keywords: RegExp;
  missingInfo: string;
  suggestedImprovement: string;
  generateContent: (company: string) => string;
}

const FRS_RUBRIC: FrsRubricSpec[] = [
  {
    id: 'problem',
    name: 'Problem & Pain Point',
    maxScore: 15,
    keywords: /\b(problem|pain|challenge|inefficien|bottleneck|broken|costly|friction)\b/i,
    missingInfo: 'Clear problem statement quantifying customer pain and financial impact is missing or underspecified.',
    suggestedImprovement: 'Define the target persona, frequency of the problem, and measurable cost of the status quo.',
    generateContent: (company) =>
      `${company} addresses a high-frequency operational bottleneck where target customers lose measurable time and margin using fragmented legacy workflows.`,
  },
  {
    id: 'solution',
    name: 'Solution & Product',
    maxScore: 15,
    keywords: /\b(solution|platform|product|workflow|architecture|engine|automate|software)\b/i,
    missingInfo: 'Concrete explanation of how the product resolves the core problem is incomplete.',
    suggestedImprovement: 'Present a concise 3-step product workflow and highlight the primary customer outcome.',
    generateContent: (company) =>
      `${company} delivers an integrated platform that automates end-to-end execution, cutting manual turnaround time while preserving auditability.`,
  },
  {
    id: 'usp',
    name: 'USP & Moat',
    maxScore: 15,
    keywords: /\b(usp|moat|defensib|proprietary|unique|patent|switching cost|network effect)\b/i,
    missingInfo: 'Unique Selling Proposition (USP) and long-term defensibility moat are not explicitly articulated.',
    suggestedImprovement: 'Specify proprietary data advantages, workflow lock-in, or IP that prevents fast replication.',
    generateContent: (company) =>
      `${company}'s moat compounds via proprietary domain datasets, deep workflow integration, and high switching costs across customer teams.`,
  },
  {
    id: 'competitors',
    name: 'Competitor Analysis',
    maxScore: 15,
    keywords: /\b(competit|alternative|landscape|incumbent|versus|comparison|matrix)\b/i,
    missingInfo: 'Structured comparison against direct and indirect competitors is missing.',
    suggestedImprovement: 'Include a positioning matrix comparing at least 3–5 relevant competitors on price, capability, and speed.',
    generateContent: (company) =>
      `Unlike legacy point tools, ${company} unifies intelligence and execution in one workflow at a fraction of traditional onboarding overhead.`,
  },
  {
    id: 'tam',
    name: 'TAM / SAM / SOM',
    maxScore: 15,
    keywords: /\b(tam|sam|som|market size|addressable|cagr|billion|opportunity)\b/i,
    missingInfo: 'Bottom-up and top-down TAM / SAM / SOM market sizing figures were not detected.',
    suggestedImprovement: 'Show Total Addressable Market, Serviceable Available Market, and a realistic 3-year SOM.',
    generateContent: (company) =>
      `${company} targets a multi-billion dollar global category (TAM), with a focused regional Serviceable Market (SAM) and disciplined 3-year capture (SOM).`,
  },
  {
    id: 'traction',
    name: 'Traction / Retention',
    maxScore: 10,
    keywords: /\b(traction|arr|mrr|revenue|growth|users|customers|retention|nrr|pilot|loi)\b/i,
    missingInfo: 'Early validation signals (pilots, LOIs, revenue, or retention metrics) are not clearly stated.',
    suggestedImprovement: 'Highlight signed pilots, active users, or early customer retention proof points.',
    generateContent: (company) =>
      `Early customer cohorts demonstrate strong engagement and repeat workflow usage across initial pilot deployments.`,
  },
  {
    id: 'business_model',
    name: 'Business Model & Unit Economics',
    maxScore: 15,
    keywords: /\b(business model|pricing|cac|ltv|margin|payback|unit economics|subscription|monetization)\b/i,
    missingInfo: 'Pricing model, gross margin, and CAC/LTV unit economics are missing.',
    suggestedImprovement: 'State your pricing structure, target gross margin, and expected CAC payback period.',
    generateContent: (company) =>
      `${company} operates a recurring SaaS + usage model targeting >75% gross margins with disciplined customer acquisition payback.`,
  },
];

function recalculateFrs(areas: FrsArea[]): { overallScore: number; errorCount: number } {
  const overallScore = areas.reduce((sum, a) => sum + a.score, 0);
  const errorCount = areas.filter((a) => a.status === 'issue').length;
  return { overallScore, errorCount };
}

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const db = readDb();
  const frs = db.frsByUser[user.id] || null;
  return NextResponse.json({ frs });
}

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let fileName = 'Pitch_Deck.pdf';
    let text = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      fileName = String(body.fileName || 'Pitch_Deck.pdf');
      text = String(body.extractedText || '').slice(0, 18000);
    } else {
      const formData = await request.formData();
      const file = formData.get('deck');

      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: 'Please upload a pitch deck PDF file.' }, { status: 400 });
      }
      if (file.size === 0 || file.size > 20 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Pitch deck PDF must be between 1 byte and 20 MB.' },
          { status: 400 }
        );
      }

      fileName = file.name;
      const buffer = Buffer.from(await file.arrayBuffer());
      const extracted = extractTextFromPdfBuffer(buffer);
      text = extracted.text;
    }

    const extractedCompanyName = extractCompanyName(text, fileName);
    const extractedLogoUrl = buildBrandLogoDataUri(extractedCompanyName);

    const hasReadableText = text.trim().length >= 50;

    const areas: FrsArea[] = FRS_RUBRIC.map((item) => {
      const found = hasReadableText && item.keywords.test(text);
      return {
        id: item.id,
        name: item.name,
        score: found ? item.maxScore : Math.round(item.maxScore * 0.25),
        maxScore: item.maxScore,
        status: found ? 'complete' : 'issue',
        missingInfo: found ? 'Detected in uploaded deck.' : item.missingInfo,
        suggestedImprovement: item.suggestedImprovement,
        generatedContent: item.generateContent(extractedCompanyName),
      };
    });

    const { overallScore, errorCount } = recalculateFrs(areas);

    const frsState: FrsState = {
      fileName,
      extractedCompanyName,
      overallScore,
      errorCount,
      areas,
      updatedAt: new Date().toISOString(),
    };

    const db = readDb();
    db.frsByUser[user.id] = frsState;

    // Auto-populate Company Profile with extracted Company Name & Company Logo
    const userIdx = db.users.findIndex((u) => u.id === user.id);
    if (userIdx !== -1) {
      db.users[userIdx].companyName = extractedCompanyName;
      db.users[userIdx].companyLogoUrl = extractedLogoUrl;
    }

    writeDb(db);

    return NextResponse.json({
      success: true,
      frs: frsState,
      extractedProfile: {
        companyName: extractedCompanyName,
        companyLogoUrl: extractedLogoUrl,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Pitch deck evaluation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { areaId, approvedContent, fallbackFrs } = body;

    const db = readDb();
    const frs = db.frsByUser[user.id] || (fallbackFrs as FrsState | undefined);
    if (!frs) {
      return NextResponse.json({ error: 'No pitch deck evaluation found.' }, { status: 404 });
    }

    const idx = frs.areas.findIndex((a) => a.id === areaId);
    if (idx === -1) {
      return NextResponse.json({ error: 'FRS area not found.' }, { status: 404 });
    }

    frs.areas[idx].status = 'complete';
    frs.areas[idx].score = frs.areas[idx].maxScore;
    frs.areas[idx].approvedContent =
      typeof approvedContent === 'string' && approvedContent.trim()
        ? approvedContent.trim()
        : frs.areas[idx].generatedContent;
    frs.areas[idx].missingInfo = 'Approved & applied by founder.';

    const recalculated = recalculateFrs(frs.areas);
    frs.overallScore = recalculated.overallScore;
    frs.errorCount = recalculated.errorCount;
    frs.updatedAt = new Date().toISOString();

    db.frsByUser[user.id] = frs;
    writeDb(db);

    return NextResponse.json({ success: true, frs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to apply improvement';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
