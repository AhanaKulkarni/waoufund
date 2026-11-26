import crypto from 'crypto';
import { cookies } from 'next/headers';
import { readDb, UserRecord, UserRole } from './store';

export const SESSION_COOKIE_NAME = 'waou_session';

function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'waoufund-dev-session-secret-change-in-production'
  );
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const keyBuf = Buffer.from(key, 'hex');
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

export function signSessionToken(
  userId: string,
  role: UserRole,
  fullName?: string,
  email?: string
): string {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(
    JSON.stringify({ userId, role, fullName: fullName || '', email: email || '', exp })
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', getAuthSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySessionToken(
  token: string
): { userId: string; role: UserRole; fullName?: string; email?: string; exp: number } | null {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    const expectedSig = crypto
      .createHmac('sha256', getAuthSecret())
      .update(payload)
      .digest('base64url');
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      userId: string;
      role: UserRole;
      fullName?: string;
      email?: string;
      exp: number;
    };
    if (!decoded.exp || decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

export function getCurrentUser(): Omit<UserRecord, 'passwordHash'> | null {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = verifySessionToken(token);
  if (!session) return null;

  const db = readDb();
  const user = db.users.find((u) => u.id === session.userId);
  if (user) {
    const { passwordHash: _ignored, ...safeUser } = user;
    return safeUser;
  }

  // Stateless fallback across serverless instances
  if (session.userId && session.role) {
    return {
      id: session.userId,
      role: session.role,
      fullName: session.fullName || 'Founder',
      email: session.email || '',
      createdAt: new Date().toISOString(),
    };
  }

  return null;
}

export function getInitials(name?: string): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
