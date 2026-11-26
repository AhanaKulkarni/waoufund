import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/auth';
import { readDb, writeDb, getDefaultStrategyState, TeamAdvisorMember } from '@/lib/store';

export async function POST(request: Request) {
  const user = getCurrentUser();
  if (!user || user.role !== 'startup') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, linkedinProfile, role, email, sendInvite } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Team/Advisor name is required.' }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Valid Email ID is required.' }, { status: 400 });
    }
    if (!role || typeof role !== 'string' || !role.trim()) {
      return NextResponse.json({ error: 'Role is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const companyName = user.companyName || 'a WaoU Fund Venture';
    let inviteStatus = 'Saved without sending invite';

    if (sendInvite) {
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const mailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'WaoU Fund <noreply@waoufund.com>',
            to: [cleanEmail],
            subject: `${user.fullName} invited you to collaborate on ${companyName} (WaoU Fund)`,
            html: `<p>Hello ${name.trim()},</p><p>${user.fullName} has added you as <strong>${role.trim()}</strong> for <strong>${companyName}</strong> on WaoU Fund and invited you to collaborate on the pitch deck.</p>`,
          }),
        });
        inviteStatus = mailRes.ok
          ? `Automated invitation email sent to ${cleanEmail}`
          : `Saved member; email provider returned status ${mailRes.status}`;
      } else {
        inviteStatus = `Invitation queued for ${cleanEmail} (configure RESEND_API_KEY for live SMTP/email dispatch)`;
      }
    }

    const member: TeamAdvisorMember = {
      id: crypto.randomUUID(),
      name: name.trim(),
      linkedinProfile: String(linkedinProfile || '').trim(),
      role: role.trim(),
      email: cleanEmail,
      invited: Boolean(sendInvite),
      inviteStatus,
      invitedAt: sendInvite ? new Date().toISOString() : undefined,
    };

    const db = readDb();
    const strategy = db.strategyByUser[user.id] || getDefaultStrategyState();
    strategy.teamAdvisors.push(member);
    strategy.updatedAt = new Date().toISOString();
    db.strategyByUser[user.id] = strategy;
    writeDb(db);

    return NextResponse.json({ success: true, member, strategy }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to invite member';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
