import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDb, writeDb, UserRole, getDefaultStrategyState } from '@/lib/store';
import { hashPassword, signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

const VALID_ROLES: UserRole[] = ['startup', 'investor', 'consultant', 'mentor', 'incubator'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      role,
      fullName,
      email,
      password,
      linkedinProfile,
      mobileNumber,
      companyDetails,
      hasWebsite,
      websiteUrl,
      weeklyEmailConsent,
      firmName,
      firmDetails,
      portfolio,
      organizationName,
      expertiseDetails,
    } = body;

    if (!VALID_ROLES.includes(role)) {
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

    if (role === 'startup') {
      if (!linkedinProfile || typeof linkedinProfile !== 'string' || !linkedinProfile.trim()) {
        return NextResponse.json(
          { error: 'LinkedIn Profile is required for Startup / MSME registration.' },
          { status: 400 }
        );
      }
      if (!mobileNumber || typeof mobileNumber !== 'string' || !mobileNumber.trim()) {
        return NextResponse.json(
          { error: 'Mobile Number is required for Startup / MSME registration.' },
          { status: 400 }
        );
      }
      if (!companyDetails || typeof companyDetails !== 'string' || !companyDetails.trim()) {
        return NextResponse.json(
          { error: 'Company details are required.' },
          { status: 400 }
        );
      }
      if (hasWebsite === true && (!websiteUrl || !String(websiteUrl).trim())) {
        return NextResponse.json(
          { error: 'Please provide your company website URL.' },
          { status: 400 }
        );
      }
    }

    if (role === 'investor' && (!firmName || typeof firmName !== 'string' || !firmName.trim())) {
      return NextResponse.json(
        { error: 'Please enter your investment firm or lender name.' },
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
      linkedinProfile: linkedinProfile ? String(linkedinProfile).trim() : undefined,
      mobileNumber: mobileNumber ? String(mobileNumber).trim() : undefined,
      companyDetails: role === 'startup' ? String(companyDetails || '').trim() : undefined,
      hasWebsite: role === 'startup' ? Boolean(hasWebsite) : undefined,
      websiteUrl:
        role === 'startup' && hasWebsite && websiteUrl ? String(websiteUrl).trim() : undefined,
      weeklyEmailConsent: role === 'startup' ? Boolean(weeklyEmailConsent) : undefined,
      firmName: role === 'investor' ? String(firmName || '').trim() : undefined,
      firmDetails: role === 'investor' ? String(firmDetails || '').trim() : undefined,
      portfolio: role === 'investor' ? String(portfolio || '').trim() : undefined,
      organizationName:
        role === 'consultant' || role === 'mentor' || role === 'incubator'
          ? String(organizationName || '').trim()
          : undefined,
      expertiseDetails:
        role === 'consultant' || role === 'mentor' || role === 'incubator'
          ? String(expertiseDetails || '').trim()
          : undefined,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    if (role === 'startup') {
      db.strategyByUser[userId] = getDefaultStrategyState();
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
