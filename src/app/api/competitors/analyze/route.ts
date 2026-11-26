import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb, getDefaultStrategyState, CompetitorItem } from '@/lib/store';

async function fetchWebsiteSnippet(rawUrl: string): Promise<{ title?: string; description?: string }> {
  try {
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(normalized, {
      signal: controller.signal,
      headers: { 'User-Agent': 'WaoUFund-ResearchBot/1.0' },
    });
    clearTimeout(timeout);
    if (!res.ok) return {};
    const html = (await res.text()).slice(0, 32000);
    const titleMatch = html.match(/<title[^>]*>([^<]{2,140})<\/title>/i);
    const descMatch = html.match(
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']{5,260})["']/i
    );
    return {
      title: titleMatch ? titleMatch[1].trim() : undefined,
      description: descMatch ? descMatch[1].trim() : undefined,
    };
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const rawCompetitors = body.competitors as Array<{ name?: string; url?: string }>;

    if (!Array.isArray(rawCompetitors)) {
      return NextResponse.json({ error: 'Competitors list is required.' }, { status: 400 });
    }

    const validInputs = rawCompetitors
      .map((c) => ({
        name: String(c.name || '').trim(),
        url: String(c.url || '').trim(),
      }))
      .filter((c) => c.name.length > 0 && c.url.length > 0);

    if (validInputs.length < 3 || validInputs.length > 15) {
      return NextResponse.json(
        { error: 'Please provide between 3 and 15 competitors with both name and website URL.' },
        { status: 400 }
      );
    }

    const researched: CompetitorItem[] = await Promise.all(
      validInputs.map(async (comp) => {
        const meta = await fetchWebsiteSnippet(comp.url);
        const offeringSummary = meta.description
          ? meta.description
          : meta.title
            ? `${comp.name} — ${meta.title}`
            : `${comp.name} (${comp.url}) operates in the target category with standard legacy or point-solution workflows.`;
        const positioning = meta.title
          ? `Positioned around "${meta.title}" — leaves an opening for unified AI-driven automation and faster onboarding.`
          : `Focused on traditional feature parity; lacks integrated fundraising & intelligence workflows.`;

        return {
          name: comp.name,
          url: comp.url,
          offeringSummary,
          positioning,
        };
      })
    );

    const companyName = user.companyName || 'Your Startup';
    const competitorNames = researched.map((r) => r.name).join(', ');

    const improvedSolutionSlide = `Improved Solution Slide — ${companyName}
• Differentiated Core: While ${competitorNames} address isolated fragments of the workflow, ${companyName} delivers a unified, AI-assisted operating layer from day one.
• Key Advantage: Eliminates manual setup overhead, surfaces actionable gaps automatically, and aligns execution directly with institutional standards.`;

    const competitorAnalysisSlide = `Competitor Analysis (${researched.length} Competitors Researched)
${researched
  .map((r, i) => `${i + 1}. ${r.name} (${r.url}): ${r.offeringSummary}`)
  .join('\n')}
• Strategic White Space: ${companyName} captures the unserved intersection of speed, intelligence, and end-to-end readiness.`;

    const tamSamSomSlide = `Market Opportunity — TAM / SAM / SOM
• TAM (Total Addressable Market): Global addressable spend across startups, MSMEs, and ecosystem participants adopting automated workflows.
• SAM (Serviceable Available Market): Active early-stage & growth businesses within ${companyName}'s target geography and digital channel reach.
• SOM (Serviceable Obtainable Market): Disciplined 3-year market capture anchored by direct founder onboarding and ecosystem partnerships.`;

    const businessModelSlide = `Business Model & Unit Economics
• Monetization: Tiered recurring platform subscriptions paired with institutional workspace capabilities.
• Unit Economics Focus: High-margin software delivery (>75% gross margin target), low-touch onboarding, and disciplined CAC payback.`;

    const proposedUspMoat = `${companyName} combines automated domain intelligence with structured execution workflows—creating compounding data gravity and high switching friction compared to ${validInputs[0].name} and peers.`;

    const db = readDb();
    const strategy = db.strategyByUser[user.id] || getDefaultStrategyState();
    strategy.competitors = researched;
    strategy.improvedSolutionSlide = improvedSolutionSlide;
    strategy.uspMoatContent = strategy.uspMoatContent || proposedUspMoat;
    strategy.generatedSlides = {
      competitorAnalysis: competitorAnalysisSlide,
      tamSamSom: tamSamSomSlide,
      businessModelUnitEconomics: businessModelSlide,
    };
    strategy.updatedAt = new Date().toISOString();
    db.strategyByUser[user.id] = strategy;
    writeDb(db);

    return NextResponse.json({
      success: true,
      strategy,
      proposedUspMoat,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Competitor analysis failed';
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
    const { changeUspMoat, uspMoatContent } = body;

    const db = readDb();
    const strategy = db.strategyByUser[user.id] || getDefaultStrategyState();
    strategy.changeUspMoat = Boolean(changeUspMoat);
    if (changeUspMoat && typeof uspMoatContent === 'string' && uspMoatContent.trim()) {
      strategy.uspMoatContent = uspMoatContent.trim();
    }
    strategy.updatedAt = new Date().toISOString();
    db.strategyByUser[user.id] = strategy;
    writeDb(db);

    return NextResponse.json({ success: true, strategy });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update USP & Moat';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
