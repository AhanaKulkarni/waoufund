import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb, getDefaultStrategyState } from '@/lib/store';

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const companyName = (body.companyName || user.companyName || 'WaoU Venture').trim();
    const initials =
      companyName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w: string) => w[0].toUpperCase())
        .join('') || 'WV';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
      <defs>
        <linearGradient id="waouGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4285F4"/>
          <stop offset="50%" stop-color="#5368EA"/>
          <stop offset="100%" stop-color="#8069EA"/>
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="30" fill="url(#waouGrad)"/>
      <circle cx="96" cy="32" r="8" fill="#FFFFFF" fill-opacity="0.35"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="44" font-weight="700" letter-spacing="-1">${initials}</text>
    </svg>`;

    const logoUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    const db = readDb();
    const uIdx = db.users.findIndex((u) => u.id === user.id);
    if (uIdx !== -1) {
      db.users[uIdx].companyLogoUrl = logoUrl;
    }

    const strategy = db.strategyByUser[user.id] || getDefaultStrategyState();
    strategy.hasLogo = false;
    strategy.closingLogoUrl = logoUrl;
    strategy.updatedAt = new Date().toISOString();
    db.strategyByUser[user.id] = strategy;
    writeDb(db);

    return NextResponse.json({ success: true, logoUrl, strategy });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Logo generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
