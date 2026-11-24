import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Store leads in memory and optional JSON file for persistence
const memoryLeads: Array<{
  fullName: string;
  email: string;
  role: string;
  companyName?: string;
  createdAt: string;
}> = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, role, companyName } = body;

    // Server-side validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please enter a valid full name (minimum 2 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid work or personal email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanRole = role || 'Founder';
    const cleanCompany = (companyName || '').trim();

    // Check duplicate in memory
    const existingIndex = memoryLeads.findIndex((l) => l.email === cleanEmail);
    const leadRecord = {
      fullName: cleanName,
      email: cleanEmail,
      role: cleanRole,
      companyName: cleanCompany,
      createdAt: new Date().toISOString(),
    };

    if (existingIndex === -1) {
      memoryLeads.push(leadRecord);
    } else {
      // Update existing record
      memoryLeads[existingIndex] = leadRecord;
    }

    // Try to safely persist to local data file if writable
    try {
      const dataDir = path.join(process.cwd(), '.data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(dataDir, 'leads.json'),
        JSON.stringify(memoryLeads, null, 2),
        'utf8'
      );
    } catch {
      // Running in read-only serverless environment (e.g. Vercel Edge/Serverless) is totally fine
    }

    return NextResponse.json({
      success: true,
      message: 'Profile successfully registered.',
      lead: {
        fullName: cleanName,
        email: cleanEmail,
        role: cleanRole,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { error: 'Unable to process registration.', details: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    count: memoryLeads.length,
  });
}
