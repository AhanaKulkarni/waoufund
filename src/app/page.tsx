'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Calculator,
  FolderLock,
  HelpCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  // Waitlist form state
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistType, setWaitlistType] = useState<'Startup' | 'Investor' | 'Solopreneur'>('Startup');
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState<string | null>(null);

  // Legal modal state
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitlistError(null);
    setWaitlistSuccess(null);

    if (!waitlistName.trim() || waitlistName.trim().length < 2) {
      setWaitlistError('Please enter your full name.');
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
      {/* 1. HERO + HEADER WITH BACKRR-INSPIRED SUBTLE BLUE-TO-LAVENDER GRADIENT */}
      <div className="backrr-hero-gradient border-b border-[#E9EAF2]">
        <Navbar />

        <section className="max-w-4xl mx-auto px-6 sm:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-semibold text-[#171A2E] tracking-[-0.03em] leading-[1.12] mb-6">
            Raise Faster. Meet the{' '}
            <span className="bg-gradient-to-r from-[#5368EA] to-[#8069EA] bg-clip-text text-transparent">
              Right Investors.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#68738A] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            WaoU Fund helps high-growth startups discover the right investors, diagnose pitch decks,
            stress-test financials, and navigate due diligence — powered by institutional AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/auth/startup/register"
              className="w-full sm:w-auto btn-waou-gradient px-8 py-3.5 text-sm inline-flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#waitlist"
              className="w-full sm:w-auto btn-waou-outline px-7 py-3.5 text-sm inline-flex items-center justify-center"
            >
              Join Waitlist
            </a>
          </div>
        </section>
      </div>

      {/* 2. SIMPLE PLATFORM EXPLANATION (PRESERVING EXISTING CONTENT, CLEAN BACKRR LAYOUT) */}
      <section className="py-20 sm:py-28 max-w-5xl mx-auto px-6 sm:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#5368EA]">
            For Founders, Solopreneurs &amp; Investors
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#171A2E] tracking-tight">
            One workspace for fundraising preparation, financial planning, and diligence.
          </h2>
          <p className="text-sm sm:text-base text-[#68738A] leading-relaxed">
            Whether you are building independently as a solopreneur or preparing for an institutional
            seed round, WaoU Fund organizes every step before partner meetings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="waou-card p-7 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DDEBFF]/70 text-[#5368EA] flex items-center justify-center mb-3">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#171A2E]">Pitch Deck Evaluation</h3>
            <p className="text-sm text-[#68738A] leading-relaxed">
              Multimodal slide geometry and narrative parser benchmarking slides against 10,000+
              funded seed presentations, identifying narrative bloat and financial gaps.
            </p>
          </div>

          <div className="waou-card p-7 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8DEFF]/70 text-[#8069EA] flex items-center justify-center mb-3">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#171A2E]">Financial Forecast</h3>
            <p className="text-sm text-[#68738A] leading-relaxed">
              Deterministic 5-year interconnected financial model (P&amp;L, Cash Flow, Debt Schedule,
              Runway sensitivity) with structured exports and clear assumptions.
            </p>
          </div>

          <div className="waou-card p-7 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DDEBFF]/70 text-[#5368EA] flex items-center justify-center mb-3">
              <FolderLock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#171A2E]">Due Diligence</h3>
            <p className="text-sm text-[#68738A] leading-relaxed">
              Stage-aware due diligence repository with cryptographic SHA-256 hash stamping and
              automated diligence clearance before investors review your files.
            </p>
          </div>

          <div className="waou-card p-7 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8DEFF]/70 text-[#8069EA] flex items-center justify-center mb-3">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-[#171A2E]">Investor FAQs &amp; Readiness</h3>
            <p className="text-sm text-[#68738A] leading-relaxed">
              Clear underwriting answers covering stage-aware VC expectations, data security,
              financial model exports, and institutional diligence standards.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WAITLIST ENTRY POINT */}
      <section id="waitlist" className="py-16 sm:py-20 border-y border-[#E9EAF2] bg-white">
        <div className="max-w-xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-8 space-y-2">
            <h2 className="text-2xl font-semibold text-[#171A2E] tracking-tight">
              Join the WaoU Fund Waitlist
            </h2>
            <p className="text-sm text-[#68738A]">
              Request priority access for upcoming cohorts and institutional investor introductions.
            </p>
          </div>

          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            {waitlistError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{waitlistError}</span>
              </div>
            )}

            {waitlistSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>{waitlistSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  placeholder="Alex Harrison"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
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
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
                Account Type
              </label>
              <select
                value={waitlistType}
                onChange={(e) =>
                  setWaitlistType(e.target.value as 'Startup' | 'Investor' | 'Solopreneur')
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              >
                <option value="Startup">Startup</option>
                <option value="Solopreneur">Solopreneur / Independent Founder</option>
                <option value="Investor">Investor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={waitlistLoading}
              className="w-full btn-waou-gradient py-3 px-6 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {waitlistLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Join Priority Waitlist</span>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* 4. CLOSING CTA SECTION (BACKRR-INSPIRED) */}
      <section className="py-24 sm:py-28 backrr-hero-gradient">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#171A2E] tracking-tight">
            Ready to prepare your next round?
          </h2>
          <p className="text-sm sm:text-base text-[#68738A] max-w-xl mx-auto leading-relaxed">
            Create your WaoU Fund account to evaluate your pitch deck, build your financial
            forecast, and organize your due diligence in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/auth/startup/register"
              className="w-full sm:w-auto btn-waou-gradient px-8 py-3.5 text-sm inline-flex items-center justify-center gap-2"
            >
              <span>Register as a Startup</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/investor/register"
              className="w-full sm:w-auto btn-waou-outline px-8 py-3.5 text-sm inline-flex items-center justify-center"
            >
              Register as an Investor
            </Link>
          </div>
        </div>
      </section>

      {/* 5. MINIMAL FOOTER */}
      <footer className="mt-auto border-t border-[#E9EAF2] bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#68738A]">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="WaoU Fund"
              width={24}
              height={24}
              className="rounded-md border border-[#E9EAF2]"
            />
            <span className="font-semibold text-[#171A2E]">WaoU Fund</span>
            <span>&copy; {new Date().getFullYear()} WaoU Fund Intelligence Inc.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-[#171A2E] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-[#171A2E] transition-colors"
            >
              Terms of Use
            </button>
            <a
              href="mailto:support@waoufund.com"
              className="text-[#5368EA] font-medium hover:underline"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>

      {/* Privacy / Terms Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171A2E]/30 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E9EAF2] max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold text-[#171A2E]">
              {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Use'}
            </h3>
            <p className="text-sm text-[#68738A] leading-relaxed">
              {legalModal === 'privacy'
                ? 'WaoU Fund stores your account details, pitch decks, and financial forecasts securely to provide fundraising preparation tools. Your confidential materials are never sold or used to train public models.'
                : 'WaoU Fund provides AI-assisted pitch deck diagnostics, financial forecasting templates, and due diligence organization tools. All outputs and legal templates should be reviewed with qualified financial or legal counsel.'}
            </p>
            <button
              type="button"
              onClick={() => setLegalModal(null)}
              className="w-full btn-waou-gradient py-2.5 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
