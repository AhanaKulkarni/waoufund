'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistType, setWaitlistType] = useState('Startup / MSME');
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState<string | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistError(null);
    setWaitlistSuccess(null);

    if (!waitlistName.trim() || waitlistName.trim().length < 2) {
      setWaitlistError('Please enter your name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!waitlistEmail.trim() || !emailRegex.test(waitlistEmail.trim())) {
      setWaitlistError('Please enter a valid email address.');
      return;
    }

    setWaitlistLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: waitlistName.trim(),
          email: waitlistEmail.trim(),
          accountType: waitlistType,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to join waitlist.');
      }
      setWaitlistSuccess(data.message || 'You have been added to the WaoU Fund waitlist.');
      setWaitlistName('');
      setWaitlistEmail('');
    } catch (err: unknown) {
      setWaitlistError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setWaitlistLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBFF] text-[#171A2E]">
      {/* HERO WITH FOUR-COLOUR GOOGLE AMBIENT GRADIENT */}
      <div className="hero-google-ambient flex-1 flex flex-col justify-between">
        <Navbar />

        <main className="max-w-6xl mx-auto px-6 sm:px-8 py-10 sm:py-16 relative z-10 w-full my-auto space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* LEFT: ALL TEXT LEFT-ALIGNED */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E9EAF2] shadow-xs text-xs font-medium text-[#68738A]">
                <span className="flex items-center gap-1" aria-hidden="true">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC05]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                </span>
                <span>Powered by WaoU AI.</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-semibold text-[#171A2E] tracking-[-0.03em] leading-[1.1]">
                AI-Powered{' '}
                <span className="bg-gradient-to-r from-[#5368EA] to-[#8069EA] bg-clip-text text-transparent block sm:inline">
                  Fundraising Platform.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-[#68738A] max-w-xl leading-relaxed font-normal">
                Startups / MSMEs &amp; Investors / Lenders.
              </p>

              {/* Primary Role Entry Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 pt-1 flex-wrap">
                <Link
                  href="/auth/startup/register"
                  className="btn-waou-gradient px-6 py-3.5 text-sm inline-flex items-center justify-center gap-2"
                >
                  <span>Startups / MSMEs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/investor/register"
                  className="btn-waou-outline px-6 py-3.5 text-sm inline-flex items-center justify-center shadow-xs"
                >
                  Investors / Lenders
                </Link>
                <Link
                  href="/meetings"
                  className="px-5 py-3.5 rounded-full text-sm font-medium text-[#171A2E] hover:text-[#5368EA] bg-white/90 hover:bg-white border border-[#E9EAF2] transition-all inline-flex items-center justify-center gap-2 shadow-xs"
                >
                  <Calendar className="w-4 h-4 text-[#5368EA]" />
                  <span>Partner Investor Meetings</span>
                </Link>
              </div>

              {/* Ecosystem Enablers Registration (Left-Aligned) */}
              <div className="max-w-lg bg-white/90 backdrop-blur-xs rounded-2xl border border-[#E9EAF2] p-5 shadow-xs">
                <div className="flex items-center justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-[#68738A] mb-3">
                  <Users className="w-3.5 h-3.5 text-[#5368EA]" />
                  <span>Ecosystem Enablers</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <Link
                    href="/auth/consultant/register"
                    className="px-4 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] hover:bg-white hover:border-[#5368EA]/40 text-xs font-medium text-[#171A2E] hover:text-[#5368EA] transition-all text-center"
                  >
                    Consultants
                  </Link>
                  <Link
                    href="/auth/mentor/register"
                    className="px-4 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] hover:bg-white hover:border-[#5368EA]/40 text-xs font-medium text-[#171A2E] hover:text-[#5368EA] transition-all text-center"
                  >
                    Mentors
                  </Link>
                  <Link
                    href="/auth/incubator/register"
                    className="px-4 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] hover:bg-white hover:border-[#5368EA]/40 text-xs font-medium text-[#171A2E] hover:text-[#5368EA] transition-all text-center"
                  >
                    Incubators
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT: BRIGHT GRAPHICS OF THE GOOGLE COLOURS (#4285F4, #EA4335, #FBBC05, #34A853) */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[440px] aspect-square relative rounded-3xl bg-white/90 border border-[#E9EAF2] shadow-lg shadow-[#171A2E]/5 p-6 flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full"
                  role="img"
                  aria-label="Bright Google-colour geometric fundraising intelligence graphic"
                >
                  <defs>
                    <linearGradient id="gBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4285F4" />
                      <stop offset="100%" stopColor="#1A73E8" />
                    </linearGradient>
                    <linearGradient id="gRed" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF5252" />
                      <stop offset="100%" stopColor="#EA4335" />
                    </linearGradient>
                    <linearGradient id="gYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD54F" />
                      <stop offset="100%" stopColor="#FBBC05" />
                    </linearGradient>
                    <linearGradient id="gGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4ADE80" />
                      <stop offset="100%" stopColor="#34A853" />
                    </linearGradient>
                  </defs>

                  <g stroke="#E9EAF2" strokeWidth="1">
                    <line x1="40" y1="100" x2="360" y2="100" />
                    <line x1="40" y1="200" x2="360" y2="200" />
                    <line x1="40" y1="300" x2="360" y2="300" />
                    <line x1="100" y1="40" x2="100" y2="360" />
                    <line x1="200" y1="40" x2="200" y2="360" />
                    <line x1="300" y1="40" x2="300" y2="360" />
                  </g>

                  <circle cx="135" cy="135" r="76" fill="url(#gBlue)" opacity="0.92" />
                  <circle cx="265" cy="130" r="64" fill="url(#gRed)" opacity="0.9" />
                  <rect x="64" y="218" width="128" height="118" rx="34" fill="url(#gYellow)" opacity="0.94" />
                  <rect x="212" y="182" width="124" height="154" rx="34" fill="url(#gGreen)" opacity="0.92" />

                  <path
                    d="M 75 295 C 125 275, 145 215, 200 198 C 250 182, 278 122, 330 92"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <circle cx="75" cy="295" r="9" fill="#FFFFFF" stroke="#FBBC05" strokeWidth="4" />
                  <circle cx="200" cy="198" r="9" fill="#FFFFFF" stroke="#4285F4" strokeWidth="4" />
                  <circle cx="265" cy="140" r="9" fill="#FFFFFF" stroke="#EA4335" strokeWidth="4" />
                  <circle cx="330" cy="92" r="11" fill="#FFFFFF" stroke="#34A853" strokeWidth="4" />

                  <rect x="242" y="248" width="66" height="14" rx="7" fill="#FFFFFF" opacity="0.9" />
                  <rect x="242" y="272" width="46" height="14" rx="7" fill="#FFFFFF" opacity="0.7" />
                  <rect x="92" y="250" width="72" height="14" rx="7" fill="#FFFFFF" opacity="0.9" />
                  <rect x="92" y="274" width="48" height="14" rx="7" fill="#FFFFFF" opacity="0.7" />
                </svg>
              </div>
            </div>
          </div>

          {/* JOIN THE WAITLIST FORM ON THE FIRST PAGE */}
          <section
            id="waitlist"
            className="bg-white/95 backdrop-blur-xs rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 shadow-sm text-left"
          >
            <div className="mb-5">
              <h2 className="text-lg sm:text-xl font-semibold text-[#171A2E] tracking-tight">
                Join the Waitlist
              </h2>
              <p className="text-xs sm:text-sm text-[#68738A] mt-1">
                Enter your details below to join the WaoU Fund waitlist.
              </p>
            </div>

            {waitlistError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{waitlistError}</span>
              </div>
            )}

            {waitlistSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{waitlistSuccess}</span>
              </div>
            )}

            <form
              onSubmit={handleWaitlistSubmit}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
            >
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-[#171A2E] mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  placeholder="Alex Harrison"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-medium text-[#171A2E] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-[#171A2E] mb-1">
                  Account Type
                </label>
                <select
                  value={waitlistType}
                  onChange={(e) => setWaitlistType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
                >
                  <option value="Startup / MSME">Startup / MSME</option>
                  <option value="Investor / Lender">Investor / Lender</option>
                  <option value="Consultant">Consultant</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Incubator">Incubator</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={waitlistLoading}
                  className="w-full btn-waou-gradient py-2.5 px-4 text-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {waitlistLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Join Waitlist</span>
                  )}
                </button>
              </div>
            </form>
          </section>
        </main>

        {/* MINIMAL FOOTER */}
        <footer className="border-t border-[#E9EAF2]/80 bg-white/80 backdrop-blur-xs py-6 relative z-10">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#68738A]">
            <div className="flex items-center gap-3">
              <Image
                src="/waou-logo.png"
                alt="WaoU Fund"
                width={120}
                height={38}
                className="h-7 w-auto object-contain"
              />
              <span>• Powered by WaoU AI.</span>
            </div>
            <div className="flex items-center gap-5">
              <a
                href="mailto:support@waoufund.com"
                className="text-[#5368EA] font-medium hover:underline"
              >
                support@waoufund.com
              </a>
              <span>&copy; {new Date().getFullYear()} WaoU Fund</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
