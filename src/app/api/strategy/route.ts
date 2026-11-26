import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb, getDefaultStrategyState } from '@/lib/store';

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = readDb();
  let strategy = db.strategyByUser[user.id];
  if (!strategy) {
    strategy = getDefaultStrategyState();
    db.strategyByUser[user.id] = strategy;
    writeDb(db);
  }

  return NextResponse.json({ strategy });
}

export async function PATCH(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const db = readDb();
    const strategy = db.strategyByUser[user.id] || getDefaultStrategyState();

    if (typeof body.gtmStrategy === 'string') strategy.gtmStrategy = body.gtmStrategy;
    if (typeof body.revenueModel === 'string') strategy.revenueModel = body.revenueModel;
    if (typeof body.stageSlides === 'string') strategy.stageSlides = body.stageSlides;
    if (typeof body.stage === 'string') {
      const uIdx = db.users.findIndex((u) => u.id === user.id);
      if (uIdx !== -1) db.users[uIdx].stage = body.stage;
    }
    if (typeof body.hasLogo === 'boolean') strategy.hasLogo = body.hasLogo;
    if (typeof body.closingLogoUrl === 'string') strategy.closingLogoUrl = body.closingLogoUrl;

    strategy.updatedAt = new Date().toISOString();
    db.strategyByUser[user.id] = strategy;
    writeDb(db);

    return NextResponse.json({ success: true, strategy });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save strategy';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
