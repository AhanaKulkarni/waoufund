import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb, writeDb, UserRole, getDefaultDueDiligenceChecklist } from '@/lib/store';
import { hashPassword, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      role,
      fullName,
      email,
      password,
      startupName,
      startupDetails,
      firmName,
      firmDetails,
      portfolio,
    } = body;

    if (role !== 'startup' && role !== 'investor') {
      return NextResponse.json({ error: 'Invalid account role.' }, { status: 400 });
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (role === 'startup' && (!startupName || typeof startupName !== 'string' || !startupName.trim())) {
      return NextResponse.json(
        { error: 'Please enter your startup or business name.' },
        { status: 400 }
      );
    }

    if (role === 'investor' && (!firmName || typeof firmName !== 'string' || !firmName.trim())) {
      return NextResponse.json(
        { error: 'Please enter your investment firm name.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDb();

    if (db.users.some((u) => u.email === cleanEmail)) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please log in instead.' },
        { status: 409 }
      );
    }

    const userId = crypto.randomUUID();
    const newUser = {
      id: userId,
      role: role as UserRole,
      fullName: fullName.trim(),
      email: cleanEmail,
      passwordHash: hashPassword(password),
      startupName: role === 'startup' ? startupName?.trim() : undefined,
      startupDetails: role === 'startup' ? (startupDetails || '').trim() : undefined,
      firmName: role === 'investor' ? firmName?.trim() : undefined,
      firmDetails: role === 'investor' ? (firmDetails || '').trim() : undefined,
      portfolio: role === 'investor' ? (portfolio || '').trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    if (role === 'startup') {
      db.dueDiligenceByUser[userId] = getDefaultDueDiligenceChecklist();
    }
    writeDb(db);

    const token = signSessionToken(userId, role);
    const { passwordHash: _ignored, ...safeUser } = newUser;

    const response = NextResponse.json({ success: true, user: safeUser }, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
