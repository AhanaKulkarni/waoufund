'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import AuthCardShell from '@/components/AuthCardShell';

export default function StartupRegisterPage() {
  const router = useRouter();
  // Personal Profile
  const [fullName, setFullName] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Company Profile
  const [companyDetails, setCompanyDetails] = useState('');
  const [hasWebsite, setHasWebsite] = useState<boolean>(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [weeklyEmailConsent, setWeeklyEmailConsent] = useState<boolean>(false);

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
          linkedinProfile,
          mobileNumber,
          email,
          password,
          companyDetails,
          hasWebsite,
          websiteUrl: hasWebsite ? websiteUrl : '',
          weeklyEmailConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      // Automatically initiate pitch deck upload step immediately after account creation
      router.push('/dashboard/startup?onboarding=upload');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to register.');
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      heading="Startups / MSMEs"
      subheading="Create your account. Your pitch deck upload will start automatically next."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* PERSONAL PROFILE */}
        <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#68738A] pt-1">
          Personal Profile
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">Name</label>
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
          <label className="block text-xs font-medium text-[#171A2E] mb-1">LinkedIn Profile</label>
          <input
            type="url"
            required
            value={linkedinProfile}
            onChange={(e) => setLinkedinProfile(e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">Mobile Number</label>
          <input
            type="tel"
            required
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171A2E] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
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
              placeholder="Min 6 chars"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
            />
          </div>
        </div>

        {/* COMPANY PROFILE */}
        <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#68738A] pt-2 border-t border-[#E9EAF2]">
          Company Profile
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">Company Details</label>
          <textarea
            rows={2}
            required
            value={companyDetails}
            onChange={(e) => setCompanyDetails(e.target.value)}
            placeholder="Brief description of what your company builds (Company Name & Logo will be extracted from your pitch deck)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
            Does your company have a website?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setHasWebsite(true)}
              className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-colors ${
                hasWebsite
                  ? 'border-[#5368EA] bg-[#DDEBFF]/50 text-[#5368EA]'
                  : 'border-[#E9EAF2] bg-[#FAFBFF] text-[#68738A]'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setHasWebsite(false)}
              className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-colors ${
                !hasWebsite
                  ? 'border-[#5368EA] bg-[#DDEBFF]/50 text-[#5368EA]'
                  : 'border-[#E9EAF2] bg-[#FAFBFF] text-[#68738A]'
              }`}
            >
              No
            </button>
          </div>
        </div>

        {hasWebsite && (
          <div>
            <label className="block text-xs font-medium text-[#171A2E] mb-1">Website URL</label>
            <input
              type="url"
              required
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yourcompany.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
            />
          </div>
        )}

        <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={weeklyEmailConsent}
            onChange={(e) => setWeeklyEmailConsent(e.target.checked)}
            className="mt-0.5 rounded border-[#E9EAF2] accent-[#5368EA]"
          />
          <span className="text-xs text-[#68738A] leading-relaxed">
            I consent to receive weekly fundraising readiness updates and communication via email.
          </span>
        </label>

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
              <span>Continue to Pitch Deck Upload</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#68738A] pt-2">
          Already registered?{' '}
          <Link href="/auth/startup/login" className="text-[#5368EA] font-medium hover:underline">
            Login as Startup / MSME
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
