'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Startup/MSME');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your Name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid Email ID.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          accountType: category,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to join waitlist.');
      }
      setSuccess(data.message || 'Added to the waitlist.');
      setName('');
      setEmail('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // 6 colour segments in exact order: Red, Orange, Yellow, Light Green, Green, Dark Green
  const frsSegments = [
    { a1: 151.5, a2: 188.5, color: '#EF4444' }, // Red
    { a1: 191.5, a2: 228.5, color: '#F97316' }, // Orange
    { a1: 231.5, a2: 268.5, color: '#FACC15' }, // Yellow
    { a1: 271.5, a2: 308.5, color: '#84CC16' }, // Light Green
    { a1: 311.5, a2: 348.5, color: '#22C55E' }, // Green
    { a1: 351.5, a2: 388.5, color: '#15803D' }, // Dark Green
  ];

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between hero-google-ambient text-[#171A2E]">
      {/* 1. HEADER */}
      <Navbar />

      {/* 2. MAIN HERO + WAITLIST (FITS WITHIN ONE DESKTOP SCREEN) */}
      <main className="max-w-6xl w-full mx-auto px-6 sm:px-8 flex-1 flex flex-col justify-center gap-6 lg:gap-8 relative z-10 py-4 lg:py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT SIDE */}
          <div className="lg:col-span-7 text-left space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-semibold text-[#171A2E] tracking-[-0.03em] leading-[1.12]">
              Raise Faster, Meet The Right Investors.
            </h1>

            <p className="text-base sm:text-lg font-medium text-[#68738A]">
              Get Started for Free
            </p>

            {/* EXACTLY THREE SEPARATE BUTTONS IN ORDER */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
              <Link
                href="/auth/startup/register"
                className="btn-waou-gradient px-5 py-3 text-xs sm:text-sm text-center"
              >
                Register as Startup/MSME
              </Link>
              <Link
                href="/auth/investor/register"
                className="btn-waou-outline px-5 py-3 text-xs sm:text-sm text-center shadow-xs"
              >
                Register as Investor/Lender
              </Link>
              <Link
                href="/auth/enabler/register"
                className="btn-waou-outline px-5 py-3 text-xs sm:text-sm text-center shadow-xs"
              >
                Register as Ecosystem Enablers
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE — FUNDABILITY READINESS SCORE (6 SEGMENTS + METER BELOW + LABEL) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-[330px] bg-white/95 border border-[#E9EAF2] rounded-3xl px-6 py-5 shadow-sm flex flex-col items-center">
              {/* Six Colour Segments Visual */}
              <svg
                viewBox="0 0 360 225"
                className="w-full h-auto"
                role="img"
                aria-label="Fundability Readiness Score (FRS)"
              >
                {frsSegments.map((seg, idx) => {
                  const rad = (deg: number) => (deg * Math.PI) / 180;
                  const cx = 180;
                  const cy = 180;
                  const R = 132;
                  const r = 82;
                  const x1 = cx + R * Math.cos(rad(seg.a1));
                  const y1 = cy + R * Math.sin(rad(seg.a1));
                  const x2 = cx + R * Math.cos(rad(seg.a2));
                  const y2 = cy + R * Math.sin(rad(seg.a2));
                  const x3 = cx + r * Math.cos(rad(seg.a2));
                  const y3 = cy + r * Math.sin(rad(seg.a2));
                  const x4 = cx + r * Math.cos(rad(seg.a1));
                  const y4 = cy + r * Math.sin(rad(seg.a1));
                  const d = `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${R} ${R} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${r} ${r} 0 0 0 ${x4.toFixed(2)} ${y4.toFixed(2)} Z`;
                  return <path key={idx} d={d} fill={seg.color} />;
                })}

                {/* Center Needle Pivot */}
                <g transform="translate(180, 180) rotate(-18)">
                  <polygon points="-5,-6 92,0 -5,6" fill="#171A2E" />
                  <circle cx="0" cy="0" r="12" fill="#171A2E" />
                  <circle cx="0" cy="0" r="5.5" fill="#FFFFFF" />
                </g>
              </svg>

              {/* Meter below the colour visual */}
              <div className="w-full mt-1 mb-2.5">
                <div className="h-2 w-full rounded-full overflow-hidden flex bg-[#F1F4FA]">
                  <div className="flex-1 bg-[#EF4444]" />
                  <div className="flex-1 bg-[#F97316]" />
                  <div className="flex-1 bg-[#FACC15]" />
                  <div className="flex-1 bg-[#84CC16]" />
                  <div className="flex-1 bg-[#22C55E]" />
                  <div className="flex-1 bg-[#15803D]" />
                </div>
              </div>

              <div className="text-xs font-semibold text-[#171A2E] tracking-tight text-center">
                Fundability Readiness Score (FRS)
              </div>
            </div>
          </div>
        </div>

        {/* 4. COMPACT WAITLIST SECTION */}
        <section className="bg-white/95 border border-[#E9EAF2] rounded-2xl px-5 py-4 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-[#171A2E] whitespace-nowrap">
              Join the waitlist
            </h2>

            <form
              onSubmit={handleWaitlistSubmit}
              className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
            >
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                aria-label="Name"
                className="sm:col-span-3 px-3.5 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-xs sm:text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email ID"
                aria-label="Email ID"
                className="sm:col-span-4 px-3.5 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-xs sm:text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="User category"
                className="sm:col-span-3 px-3.5 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-xs sm:text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              >
                <option value="Startup/MSME">Startup/MSME</option>
                <option value="Investor/Lender">Investor/Lender</option>
                <option value="Ecosystem Enablers">Ecosystem Enablers</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-2 btn-waou-gradient py-2 px-4 text-xs sm:text-sm flex items-center justify-center disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join waitlist'}
              </button>
            </form>
          </div>

          {error && (
            <div className="mt-2.5 text-xs text-red-600 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mt-2.5 text-xs text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}
        </section>
      </main>

      {/* 5. COMPACT FOOTER */}
      <footer className="border-t border-[#E9EAF2]/80 bg-white/80 py-3 relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#68738A]">
          <span>&copy; {new Date().getFullYear()} WaoU Fund. All rights reserved.</span>
          <a
            href="mailto:support@waoufund.com"
            className="text-[#5368EA] font-medium hover:underline"
          >
            support@waoufund.com
          </a>
        </div>
      </footer>
    </div>
  );
}
