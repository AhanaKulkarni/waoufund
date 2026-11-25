'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import AuthCardShell from '@/components/AuthCardShell';

export default function InvestorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, expectedRole: 'investor' }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      router.push('/dashboard/investor');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to log in.');
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError(null);
    if (!email.trim()) {
      setError('Enter your email address above first to request a password reset.');
      return;
    }
    setResetMessage(
      `If an account exists for ${email.trim()}, password reset instructions have been queued via support@waoufund.com.`
    );
  };

  return (
    <AuthCardShell
      heading="For Investors"
      subheading="Log in to manage your investment firm profile, thesis, and portfolio."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetMessage && (
          <div className="p-3 rounded-xl bg-[#DDEBFF]/50 border border-[#5368EA]/30 text-[#171A2E] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#5368EA] flex-shrink-0" />
            <span>{resetMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1.5">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="elena@fund.vc"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-[#171A2E]">Password</label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs text-[#5368EA] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-waou-gradient py-3 px-6 text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Logging In...</span>
            </>
          ) : (
            <>
              <span>Login as an Investor</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#68738A] pt-3">
          New to WaoU Fund?{' '}
          <Link href="/auth/investor/register" className="text-[#5368EA] font-medium hover:underline">
            Register as an Investor
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
