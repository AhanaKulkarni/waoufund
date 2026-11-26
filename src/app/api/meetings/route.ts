import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb, writeDb } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, roleType, preferredDate, notes } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!preferredDate || typeof preferredDate !== 'string') {
      return NextResponse.json({ error: 'Please select a preferred date.' }, { status: 400 });
    }

    const db = readDb();
    const meeting = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      roleType: String(roleType || 'Startup / MSME'),
      preferredDate,
      notes: String(notes || '').trim(),
      createdAt: new Date().toISOString(),
    };

    db.partnerMeetings.push(meeting);
    writeDb(db);

    return NextResponse.json({
      success: true,
      message: 'Partner Investor Meeting request submitted.',
      meeting,
    }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to schedule meeting';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
