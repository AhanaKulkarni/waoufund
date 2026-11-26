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

            {/* RIGHT: PREMIUM SEGMENTED FUNDABILITY GAUGE GRAPHIC */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[440px] aspect-square relative rounded-3xl bg-white/95 border border-[#E9EAF2] shadow-lg shadow-[#171A2E]/5 p-6 flex flex-col items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 400 360"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Fundability Readiness Score segmented gauge"
                >
                  <defs>
                    <filter id="needleShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#171A2E" floodOpacity="0.18" />
                    </filter>
                    <linearGradient id="seg0" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#DC2626" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                    <linearGradient id="seg1" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#EA580C" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                    <linearGradient id="seg2" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>
                    <linearGradient id="seg3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FACC15" />
                      <stop offset="100%" stopColor="#FDE047" />
                    </linearGradient>
                    <linearGradient id="seg4" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#BEF264" />
                      <stop offset="100%" stopColor="#84CC16" />
                    </linearGradient>
                    <linearGradient id="seg5" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4ADE80" />
                      <stop offset="100%" stopColor="#22C55E" />
                    </linearGradient>
                    <linearGradient id="seg6" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#16A34A" />
                      <stop offset="100%" stopColor="#15803D" />
                    </linearGradient>
                    <linearGradient id="seg7" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0D9488" />
                      <stop offset="100%" stopColor="#115E59" />
                    </linearGradient>
                  </defs>

                  {/* Subtle outer guide ring */}
                  <circle
                    cx="200"
                    cy="205"
                    r="160"
                    fill="none"
                    stroke="#F1F4FA"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                  />

                  {/* 8 Precision Segmented Gauge Arcs (151.5° to 388.5°, R=146, r=90) */}
                  {[
                    { a1: 151.5, a2: 178.5, fill: 'url(#seg0)' },
                    { a1: 181.5, a2: 208.5, fill: 'url(#seg1)' },
                    { a1: 211.5, a2: 238.5, fill: 'url(#seg2)' },
                    { a1: 241.5, a2: 268.5, fill: 'url(#seg3)' },
                    { a1: 271.5, a2: 298.5, fill: 'url(#seg4)' },
                    { a1: 301.5, a2: 328.5, fill: 'url(#seg5)' },
                    { a1: 331.5, a2: 358.5, fill: 'url(#seg6)' },
                    { a1: 361.5, a2: 388.5, fill: 'url(#seg7)' },
                  ].map((seg, i) => {
                    const rad = (deg: number) => (deg * Math.PI) / 180;
                    const cx = 200;
                    const cy = 205;
                    const R = 146;
                    const r = 90;
                    const x1 = cx + R * Math.cos(rad(seg.a1));
                    const y1 = cy + R * Math.sin(rad(seg.a1));
                    const x2 = cx + R * Math.cos(rad(seg.a2));
                    const y2 = cy + R * Math.sin(rad(seg.a2));
                    const x3 = cx + r * Math.cos(rad(seg.a2));
                    const y3 = cy + r * Math.sin(rad(seg.a2));
                    const x4 = cx + r * Math.cos(rad(seg.a1));
                    const y4 = cy + r * Math.sin(rad(seg.a1));
                    const d = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${r} ${r} 0 0 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
                    return <path key={i} d={d} fill={seg.fill} />;
                  })}

                  {/* Inner subtle dial arc */}
                  <path
                    d="M 131 245 A 80 80 0 1 1 269 245"
                    fill="none"
                    stroke="#E9EAF2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />

                  {/* Sleek Tapered Needle pointing toward High Readiness (Green zone) */}
                  <g transform="translate(200, 205) rotate(10)" filter="url(#needleShadow)">
                    <polygon points="-6,-7 104,0 -6,7" fill="#171A2E" />
                    <circle cx="0" cy="0" r="15" fill="#171A2E" />
                    <circle cx="0" cy="0" r="7" fill="#FFFFFF" />
                  </g>
                </svg>

                <div className="text-center -mt-3">
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#68738A]">
                    Fundability Readiness
                  </div>
                </div>
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
