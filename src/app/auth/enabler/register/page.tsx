'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import AuthCardShell from '@/components/AuthCardShell';

export default function EcosystemEnablerRegisterPage() {
  const router = useRouter();
  const [enablerType, setEnablerType] = useState<'consultant' | 'mentor' | 'incubator'>('consultant');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
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
          role: enablerType,
          fullName,
          email,
          password,
          organizationName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      router.push('/dashboard/enabler');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to register.');
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      heading="Register as Ecosystem Enablers"
      subheading="Create your Consultant, Mentor, or Incubator account on WaoU Fund."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">Enabler Type</label>
          <select
            value={enablerType}
            onChange={(e) =>
              setEnablerType(e.target.value as 'consultant' | 'mentor' | 'incubator')
            }
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          >
            <option value="consultant">Consultant</option>
            <option value="mentor">Mentor</option>
            <option value="incubator">Incubator</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organization.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">Password</label>
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
          <label className="block text-xs font-medium text-[#171A2E] mb-1">
            Organization Name
          </label>
          <input
            type="text"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Organization or Practice Name"
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Register as Ecosystem Enabler</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#68738A] pt-2">
          <Link href="/" className="text-[#5368EA] hover:underline">
            ← Back to Home
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
