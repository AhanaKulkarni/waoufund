'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import AuthCardShell from '@/components/AuthCardShell';

export default function StartupRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [startupName, setStartupName] = useState('');
  const [startupDetails, setStartupDetails] = useState('');
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
          role: 'startup',
          fullName,
          email,
          password,
          startupName,
          startupDetails,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      router.push('/dashboard/startup');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to register.');
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      heading="For Startups"
      subheading="Create your startup account to evaluate your pitch deck, build financial forecasts, and prepare due diligence."
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
            placeholder="Alex Harrison"
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
            placeholder="alex@startup.com"
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
            Startup / Business Name
          </label>
          <input
            type="text"
            required
            value={startupName}
            onChange={(e) => setStartupName(e.target.value)}
            placeholder="e.g. AetherX Labs"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
            Basic Startup Details
          </label>
          <textarea
            rows={2}
            value={startupDetails}
            onChange={(e) => setStartupDetails(e.target.value)}
            placeholder="Stage (e.g. Pre-Seed / Solopreneur) and one-line summary"
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
              <span>Creating Startup Account...</span>
            </>
          ) : (
            <>
              <span>Create Startup Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#68738A] pt-3">
          Already have a startup account?{' '}
          <Link href="/auth/startup/login" className="text-[#5368EA] font-medium hover:underline">
            Login as a Startup
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
