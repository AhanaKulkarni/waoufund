'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import AuthCardShell from '@/components/AuthCardShell';

export default function InvestorRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firmName, setFirmName] = useState('');
  const [firmDetails, setFirmDetails] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'investor',
          fullName,
          email,
          password,
          firmName,
          firmDetails,
          portfolio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      router.push('/dashboard/investor');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to register.');
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      heading="For Investors"
      subheading="Create your investor account to manage your firm profile, thesis, and portfolio."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1.5">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Elena Vance"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

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
          <label className="block text-xs font-medium text-[#171A2E] mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
            Investment Firm Name
          </label>
          <input
            type="text"
            required
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            placeholder="e.g. Horizon Seed Partners"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
            Firm Details
          </label>
          <input
            type="text"
            value={firmDetails}
            onChange={(e) => setFirmDetails(e.target.value)}
            placeholder="Stage focus & typical check size (e.g. Pre-Seed/Seed, $100k–$500k)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
            Investment Portfolio <span className="text-[#68738A] font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="Notable portfolio companies or sectors (can be updated later)"
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
              <span>Creating Investor Account...</span>
            </>
          ) : (
            <>
              <span>Create Investor Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#68738A] pt-3">
          Already have an investor account?{' '}
          <Link href="/auth/investor/login" className="text-[#5368EA] font-medium hover:underline">
            Login as an Investor
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
