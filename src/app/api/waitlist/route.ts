import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb, writeDb } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, accountType } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter your name (minimum 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const validTypes = ['Startup', 'Investor', 'Solopreneur'];
    const cleanType = validTypes.includes(accountType) ? accountType : 'Startup';
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    const db = readDb();
    const existing = db.waitlist.find((w) => w.email === cleanEmail);
    if (existing) {
      return NextResponse.json(
        {
          error: 'This email is already on the WaoU Fund waitlist.',
          alreadyRegistered: true,
        },
        { status: 409 }
      );
    }

    const record = {
      id: crypto.randomUUID(),
      name: cleanName,
      email: cleanEmail,
      accountType: cleanType as 'Startup' | 'Investor' | 'Solopreneur',
      createdAt: new Date().toISOString(),
    };

    // Optional AWS API Gateway / Lambda waitlist integration if configured
    const awsEndpoint = process.env.AWS_WAITLIST_ENDPOINT;
    if (awsEndpoint) {
      const awsRes = await fetch(awsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.AWS_WAITLIST_API_KEY
            ? { 'x-api-key': process.env.AWS_WAITLIST_API_KEY }
            : {}),
        },
        body: JSON.stringify(record),
      });
      if (!awsRes.ok) {
        return NextResponse.json(
          { error: 'Failed to save waitlist entry to cloud storage.' },
          { status: 502 }
        );
      }
    }

    db.waitlist.push(record);
    writeDb(db);

    return NextResponse.json(
      {
        success: true,
        message: 'You have been added to the WaoU Fund waitlist.',
        entry: record,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to process waitlist submission';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const db = readDb();
  return NextResponse.json({ count: db.waitlist.length });
}
