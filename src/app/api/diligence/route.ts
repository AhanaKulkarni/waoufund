import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb, getDefaultDueDiligenceChecklist } from '@/lib/store';

export async function GET() {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = readDb();
  let items = db.dueDiligenceByUser[user.id];
  if (!items) {
    items = getDefaultDueDiligenceChecklist();
    db.dueDiligenceByUser[user.id] = items;
    writeDb(db);
  }

  return NextResponse.json({ items });
}

export async function PATCH(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { itemId, completed } = body;

    const db = readDb();
    const items = db.dueDiligenceByUser[user.id] || getDefaultDueDiligenceChecklist();
    const idx = items.findIndex((i) => i.id === itemId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Due diligence item not found.' }, { status: 404 });
    }

    items[idx].completed = Boolean(completed);
    items[idx].updatedAt = new Date().toISOString();
    if (items[idx].completed && !items[idx].hash) {
      items[idx].hash = crypto
        .createHash('sha256')
        .update(`${user.id}:${items[idx].id}:${items[idx].updatedAt}`)
        .digest('hex')
        .slice(0, 16);
    }

    db.dueDiligenceByUser[user.id] = items;
    writeDb(db);

    return NextResponse.json({ success: true, items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update item';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
