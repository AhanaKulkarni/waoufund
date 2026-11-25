import { NextResponse } from 'next/server';
import { readDb } from '@/lib/store';
import { verifyPassword, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, expectedRole } = body;

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email address and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDb();
    const user = db.users.find((u) => u.email === cleanEmail);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid email address or password.' },
        { status: 401 }
      );
    }

    if (expectedRole && user.role !== expectedRole) {
      return NextResponse.json(
        {
          error: `This email is registered as a ${
            user.role === 'startup' ? 'Startup' : 'Investor'
          }. Please use the ${user.role === 'startup' ? 'For Startups' : 'For Investors'} login page.`,
        },
        { status: 403 }
      );
    }

    const token = signSessionToken(user.id, user.role);
    const { passwordHash: _ignored, ...safeUser } = user;

    const response = NextResponse.json({ success: true, user: safeUser });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
