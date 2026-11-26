'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import AuthCardShell from '@/components/AuthCardShell';

interface EnablerAuthFormProps {
  role: 'consultant' | 'mentor' | 'incubator';
  mode: 'register' | 'login';
  title: string;
}

export default function EnablerAuthForm({ role, mode, title }: EnablerAuthFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [expertiseDetails, setExpertiseDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetMessage(null);
    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload =
        mode === 'register'
          ? {
              role,
              fullName,
              email,
              password,
              organizationName,
              linkedinProfile,
              expertiseDetails,
            }
          : {
              email,
              password,
              expectedRole: role,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      router.push('/dashboard/enabler');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to authenticate.');
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      heading={`For ${title}`}
      subheading={
        mode === 'register'
          ? `Register as a ${title.slice(0, -1)} on WaoU Fund.`
          : `Log in to your ${title.slice(0, -1)} account.`
      }
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

        {mode === 'register' && (
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
        )}

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
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-[#171A2E]">Password</label>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() =>
                  email.trim()
                    ? setResetMessage(`Reset instructions queued for ${email.trim()}.`)
                    : setError('Enter your email address above first.')
                }
                className="text-xs text-[#5368EA] hover:underline"
              >
                Forgot Password?
              </button>
            )}
          </div>
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

        {mode === 'register' && (
          <>
            <div>
              <label className="block text-xs font-medium text-[#171A2E] mb-1">
                {role === 'incubator' ? 'Incubator Name' : 'Organization / Practice Name'}
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder={role === 'incubator' ? 'e.g. Venture Hub' : 'Independent / Firm'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171A2E] mb-1">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={linkedinProfile}
                onChange={(e) => setLinkedinProfile(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#171A2E] mb-1">
                Focus / Expertise
              </label>
              <input
                type="text"
                value={expertiseDetails}
                onChange={(e) => setExpertiseDetails(e.target.value)}
                placeholder="Sectors or stages supported"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-waou-gradient py-3 px-6 text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Please wait...</span>
            </>
          ) : (
            <>
              <span>{mode === 'register' ? `Register as ${title.slice(0, -1)}` : 'Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#68738A] pt-2">
          {mode === 'register' ? 'Already have an account?' : 'Need an account?'}{' '}
          <Link
            href={mode === 'register' ? `/auth/${role}/login` : `/auth/${role}/register`}
            className="text-[#5368EA] font-medium hover:underline"
          >
            {mode === 'register' ? 'Login' : 'Register'}
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
