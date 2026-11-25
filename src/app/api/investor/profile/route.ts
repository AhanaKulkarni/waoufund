import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb } from '@/lib/store';

export async function PATCH(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== 'investor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { firmName, firmDetails, portfolio } = body;

    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === user.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Investor profile not found.' }, { status: 404 });
    }

    if (typeof firmName === 'string' && firmName.trim()) {
      db.users[idx].firmName = firmName.trim();
    }
    if (typeof firmDetails === 'string') {
      db.users[idx].firmDetails = firmDetails.trim();
    }
    if (typeof portfolio === 'string') {
      db.users[idx].portfolio = portfolio.trim();
    }

    writeDb(db);
    const { passwordHash: _ignored, ...safeUser } = db.users[idx];
    return NextResponse.json({ success: true, user: safeUser });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update profile';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
