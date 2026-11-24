'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  FileText,
  Mic,
  Calculator,
  FolderLock,
  PieChart,
  Scale,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
  Lock,
  ExternalLink,
  Users,
  Compass,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import LeadCaptureModal from '@/components/LeadCaptureModal';
import FounderStudioWorkspace from '@/components/FounderStudioWorkspace';

export default function HomePage() {
  // Navigation & Access State
  const [modalOpen, setModalOpen] = useState(false);
  const [targetDestination, setTargetDestination] = useState<string>('Founder Studio');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('dashboard');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Fundability Audit interactive tab
  const [selectedVector, setSelectedVector] = useState(0);

  // Check registration on mount
  useEffect(() => {
    const reg = localStorage.getItem('waou_lead_registered');
    if (reg === 'true') {
      setIsRegistered(true);
    }
  }, []);

  // Intercept all product CTA clicks with the mandatory Lead Generation Gate
  const handleProductAccess = (destination: string, tabId: string = 'dashboard') => {
    if (isRegistered) {
      setActiveWorkspaceTab(tabId);
      setShowWorkspace(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTargetDestination(destination);
      setActiveWorkspaceTab(tabId);
      setModalOpen(true);
    }
  };

  const handleRegistrationSuccess = (destination: string) => {
    setIsRegistered(true);
    setModalOpen(false);
    setShowWorkspace(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in workspace mode, render the full Founder Studio
  if (showWorkspace) {
    return (
      <FounderStudioWorkspace
        initialTab={activeWorkspaceTab}
        onBackToHome={() => setShowWorkspace(false)}
      />
    );
  }

  const fundabilityVectors = [
    {
      title: 'Financial Health & Runway',
      weight: '30%',
      score: '88/100',
      description:
        'Evaluates deterministic cash flow models, 14+ months default runway, unit economics (CAC:LTV > 3.5x), and gross margin sustainability.',
      benchmarks: 'Top 5% of Seed Cohort',
    },
    {
      title: 'Market Opportunity & TAM',
      weight: '25%',
      score: '92/100',
      description:
        'Analyzes top-down and bottom-up market sizing models. Requires clear Serviceable Obtainable Market (SOM) targeting >$400M with verifiable CAGR.',
      benchmarks: 'Top 3% of Seed Cohort',
    },
    {
      title: 'Traction & Retention',
      weight: '20%',
      score: '84/100',
      description:
        'Inspects Month-over-Month organic revenue expansion, user retention cohort decay curves, and paid enterprise pilot conversion velocities.',
      benchmarks: 'Top 10% of Seed Cohort',
    },
    {
      title: 'Team Pedigree & Moats',
      weight: '15%',
      score: '86/100',
      description:
        'Measures technical depth, proprietary IP defensibility, high customer switching friction, and founder-market problem alignment.',
      benchmarks: 'Top 8% of Seed Cohort',
    },
    {
      title: 'Due Diligence Readiness',
      weight: '10%',
      score: '94/100',
      description:
        'Audits corporate charter hygiene, cap table clean state, SHA-256 stamped data room records, and standard YC Post-Money SAFE readiness.',
      benchmarks: 'Top 2% of Seed Cohort',
    },
  ];

  const faqs = [
    {
      q: 'How is WaoU Fund different from generic AI tools?',
      a: 'Generic LLMs lack contextual awareness of institutional venture underwriting criteria. WaoU Fund is structured on 10,000+ institutional seed and Series-A term sheets, financial models, and diligence checklists. Our engine applies strict stage-aware benchmarks: assessing founder pedigree and TAM at Pre-Seed, while scrutinizing CAC payback, unit economics, and Net Revenue Retention at Seed and Series-A.',
    },
    {
      q: 'How does the Fundability Score work?',
      a: 'The Fundability Score uses a 5-Vector audit: Financial Health & Runway (30%), Market Opportunity & TAM (25%), Traction & Retention (20%), Team Pedigree & Moats (15%), and Due Diligence Readiness (10%). Rather than producing unearned vanity metrics, incomplete venture profiles highlight missing parameters and required documents.',
    },
    {
      q: 'Is my pitch deck and financial data secure?',
      a: 'Confidentiality is paramount. All uploaded materials are encrypted at rest and in transit using 256-bit AES standards. Your confidential data and models are never used to train public or foundational models. Only you and explicitly authorized advisors can access your Virtual Data Room.',
    },
    {
      q: 'How does investor intelligence work?',
      a: 'Our intelligence layer maps active seed and Series-A checkwriters based on sector mandates, check size parameters, geographic focus, and actual deal flow velocity. This prevents wasted time chasing misaligned investors.',
    },
    {
      q: 'How does the Virtual Data Room work?',
      a: 'The Virtual Data Room provides stage-aware checklist organization for your corporate charter, cap table, financials, and contracts. It includes cryptographic SHA-256 hash stamping and verification states to ensure diligence readiness before lead partners review your files.',
    },
    {
      q: 'Who is WaoU Fund designed for?',
      a: 'WaoU Fund is built for ambitious founders raising Pre-Seed, Seed, and Series-A rounds who want institutional-grade preparation, deterministic financial models, and defensible answers before stepping into partner meetings.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-[#171C2F] selection:bg-[#E0EDFF] selection:text-[#5268E8] relative">
      {/* 1. MINIMAL BRAND SIGNATURE (NO TOP NAVIGATION BAR) */}
      <header className="max-w-7xl mx-auto px-6 sm:px-10 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="WaoU Fund Logo"
            width={38}
            height={38}
            className="rounded-xl border border-[#E6EAF2] shadow-xs"
            priority
          />
          <div>
            <span className="text-xl font-extrabold tracking-tight text-[#171C2F]">
              WaoU Fund
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full bg-[#EAE5FF] text-[#5268E8] text-[0.68rem] font-bold tracking-wide uppercase">
              Venture Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleProductAccess('Founder Studio', 'dashboard')}
            className="text-xs font-semibold text-[#69748A] hover:text-[#171C2F] px-4 py-2 rounded-full border border-[#E6EAF2] bg-white hover:bg-[#F8FAFF] transition-all shadow-xs"
          >
            {isRegistered ? 'Open Founder Studio' : 'Founder Sign In'}
          </button>
          <button
            onClick={() => handleProductAccess('Get Early Access', 'dashboard')}
            className="hidden sm:inline-flex text-xs font-semibold text-white bg-[#5268E8] hover:bg-[#4358d6] px-4 py-2 rounded-full transition-all shadow-sm"
          >
            Get Early Access
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION — BACKRR-INSPIRED */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-28 backrr-hero-bg overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0EDFF]/80 border border-[#5268E8]/20 text-[#5268E8] text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Institutional Venture Intelligence Platform</span>
          </div>

          {/* Large Bold Expressive Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-[4.25rem] font-extrabold text-[#171C2F] tracking-tight leading-[1.08] mb-6">
            Build Investor Confidence.{' '}
            <span className="bg-gradient-to-r from-[#5268E8] via-[#7064EE] to-[#8271ED] bg-clip-text text-transparent block sm:inline">
              Raise With Clarity.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#69748A] max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            WaoU Fund brings investor intelligence, fundraising preparation, financial modelling and
            institutional-grade due diligence into one intelligent platform. Build a stronger venture and approach investors with confidence.
          </p>

          {/* Two Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-16">
            <button
              onClick={() => handleProductAccess('Explore WaoU Fund', 'dashboard')}
              className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-sm"
            >
              <span>Explore WaoU Fund</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleProductAccess('Get Early Access', 'dashboard')}
              className="w-full sm:w-auto btn-secondary text-sm"
            >
              Get Early Access
            </button>
          </div>
        </div>

        {/* Hero Visual Mockup: Sophisticated Real Venture Product Composition */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="backrr-card p-4 sm:p-7 bg-white relative overflow-hidden border border-[#E6EAF2]">
            {/* Top Bar of the Mockup */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E6EAF2]">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#E6EAF2]" />
                <div className="w-3 h-3 rounded-full bg-[#E6EAF2]" />
                <div className="w-3 h-3 rounded-full bg-[#E6EAF2]" />
                <span className="text-xs font-semibold text-[#69748A] ml-2">
                  Active Venture Profile: <strong className="text-[#171C2F]">AetherX Technologies • Seed Stage</strong>
                </span>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[0.7rem] font-bold border border-emerald-100">
                <CheckCircle2 className="w-3 h-3" />
                Diligence Ready
              </span>
            </div>

            {/* Inner Grid of the Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Left Column: Fundability Scorecard (5 cols) */}
              <div className="md:col-span-5 bg-[#F8FAFF] rounded-2xl p-5 border border-[#E6EAF2] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[0.72rem] font-bold uppercase tracking-wider text-[#69748A]">
                      Fundability Score
                    </span>
                    <span className="text-xs font-semibold text-[#5268E8] bg-[#E0EDFF] px-2 py-0.5 rounded-full">
                      Institutional Underwriting
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-black text-[#5268E8] tracking-tight">86</span>
                    <span className="text-base text-[#69748A] font-semibold">/ 100</span>
                    <span className="text-xs font-semibold text-emerald-600 ml-auto">
                      Top 8% in Seed Cohort
                    </span>
                  </div>
                  <p className="text-xs text-[#69748A] leading-relaxed mb-4">
                    Strong financial runway and clear TAM defensibility. 2 diligence clearance items recommended.
                  </p>
                </div>

                {/* 5-Vector Bars Mini */}
                <div className="space-y-2 pt-2 border-t border-[#E6EAF2]/60">
                  <div className="flex justify-between text-[0.7rem] font-semibold text-[#171C2F]">
                    <span>Financial Runway (30%)</span>
                    <span className="text-[#5268E8]">88%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E6EAF2] rounded-full overflow-hidden">
                    <div className="w-[88%] h-full bg-[#5268E8] rounded-full" />
                  </div>

                  <div className="flex justify-between text-[0.7rem] font-semibold text-[#171C2F]">
                    <span>Market Opportunity (25%)</span>
                    <span className="text-[#8271ED]">92%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E6EAF2] rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-[#8271ED] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Right Column: Investor Intelligence & Financial Metrics (7 cols) */}
              <div className="md:col-span-7 flex flex-col justify-between gap-4">
                {/* Metric Strip */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2]">
                    <span className="text-[0.68rem] font-bold text-[#69748A] uppercase tracking-wider block">
                      Default Runway
                    </span>
                    <span className="text-lg font-black text-[#171C2F] mt-1 block">14.2 Mos</span>
                    <span className="text-[0.68rem] text-emerald-600 font-semibold">Burn $22k/mo</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2]">
                    <span className="text-[0.68rem] font-bold text-[#69748A] uppercase tracking-wider block">
                      Net Retention
                    </span>
                    <span className="text-lg font-black text-[#171C2F] mt-1 block">128% NRR</span>
                    <span className="text-[0.68rem] text-[#5268E8] font-semibold">Pilot Expansions</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2]">
                    <span className="text-[0.68rem] font-bold text-[#69748A] uppercase tracking-wider block">
                      Diligence Stamped
                    </span>
                    <span className="text-lg font-black text-[#171C2F] mt-1 block">8 / 10 Docs</span>
                    <span className="text-[0.68rem] text-purple-600 font-semibold">SHA-256 Verified</span>
                  </div>
                </div>

                {/* Live VC Simulation Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#F8FAFF] to-[#E0EDFF]/30 border border-[#E6EAF2] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E0EDFF] text-[#5268E8] flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#171C2F]">
                        Partner Simulation: Unit Economics Interrogation
                      </div>
                      <div className="text-[0.72rem] text-[#69748A]">
                        Live audio waveform • 12 tough partner objections prepared
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleProductAccess('AI Investor Grill', 'grill')}
                    className="text-xs font-semibold text-[#5268E8] hover:text-[#4358d6] bg-white px-3 py-1.5 rounded-lg border border-[#E6EAF2] shadow-xs flex-shrink-0"
                  >
                    Simulate →
                  </button>
                </div>

                {/* Presentation Slide Benchmark */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#5268E8]" />
                    <span className="text-[#69748A]">
                      Pitch Deck Diagnostic: <strong className="text-[#171C2F]">Seed_Deck_v4.2.pdf</strong>
                    </span>
                  </div>
                  <span className="font-bold text-emerald-600">86/100 Benchmark</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF & PLATFORM METRICS */}
      <section className="py-12 border-y border-[#E6EAF2] bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center md:text-left">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#5268E8] tracking-tight">
                5,000+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#69748A] mt-1">
                Institutional Investor Network
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#171C2F] tracking-tight">
                10,000+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#69748A] mt-1">
                Seed Decks Benchmarked
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#8271ED] tracking-tight">
                ₹1,200 Cr+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#69748A] mt-1">
                Evaluated Venture Capital
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
                3.4x Faster
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#69748A] mt-1">
                Lead Term-Sheet Turnaround
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPLETE PRODUCT FEATURE SHOWCASE (ALTERNATING SPLIT-LAYOUT SECTIONS — BACKRR STYLE) */}
      <section className="py-20 sm:py-32 space-y-24 sm:space-y-36 max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Intro */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="pill-tag">Comprehensive Diligence Ecosystem</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171C2F] tracking-tight">
            Designed for Founders Who Refuse to Raise Blindly.
          </h2>
          <p className="text-sm sm:text-base text-[#69748A]">
            Every capability required to evaluate your idea, stress-test numbers, and defend your business before institutional partners.
          </p>
        </div>

        {/* FEATURE A: Idea & Pitch Deck Blueprint */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5268E8]">
              01 • Product Blueprint Engine
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171C2F] tracking-tight leading-snug">
              Turn Your Startup Idea Into an Investor-Ready Roadmap.
            </h3>
            <p className="text-sm sm:text-base text-[#69748A] leading-relaxed">
              Provides comprehensive startup idea evaluation, 3-month, 6-month, and 12-month execution roadmaps,
              recommended technology stacks, deep market research dossiers, and defensible objection preparations.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#171C2F] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Deterministic 3, 6, and 12-month execution roadmaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Pre-vetted architecture and infrastructure recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Anticipated partner objections and strategic defense dossiers</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Idea & Pitch Deck Blueprint', 'blueprint')}
                className="btn-primary text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>Explore Blueprint Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="backrr-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF2]">
                <span className="text-xs font-bold text-[#171C2F]">Venture Execution Blueprint</span>
                <span className="px-2 py-0.5 rounded-full bg-[#EAE5FF] text-[#5268E8] text-[0.68rem] font-bold">
                  Seed Milestone Model
                </span>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2]">
                  <div className="text-[0.7rem] font-bold text-[#5268E8] uppercase">Month 1–3: Foundation & Alpha</div>
                  <div className="text-xs font-semibold text-[#171C2F] mt-1">Deploy Core Microservices & Telemetry</div>
                  <div className="text-[0.72rem] text-[#69748A] mt-0.5">5 Pilot LOIs signed • Deterministic logging enabled</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2]">
                  <div className="text-[0.7rem] font-bold text-[#8271ED] uppercase">Month 4–6: Monetization Engine</div>
                  <div className="text-xs font-semibold text-[#171C2F] mt-1">Convert LOIs to Paid Subscriptions</div>
                  <div className="text-[0.72rem] text-[#69748A] mt-0.5">Achieve CAC payback &lt; 5 months • SOC2 Type 1 preparation</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2]">
                  <div className="text-[0.7rem] font-bold text-emerald-600 uppercase">Month 7–12: Institutional Seed</div>
                  <div className="text-xs font-semibold text-[#171C2F] mt-1">Scale ARR & Approach Institutional Leads</div>
                  <div className="text-[0.72rem] text-[#69748A] mt-0.5">Data Room clearance 100% • YC Post-Money SAFE terms ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE B: AI Pitch Deck Diagnostic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5268E8]">
              02 • Deck Diagnostic Engine
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171C2F] tracking-tight leading-snug">
              Your Pitch Deck. Evaluated Through an Investor&apos;s Lens.
            </h3>
            <p className="text-sm sm:text-base text-[#69748A] leading-relaxed">
              Multimodal PDF and slide analysis evaluating narrative structure, slide geometry, financial gaps,
              and storytelling improvements — benchmarked against 10,000+ funded seed presentations.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#171C2F] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Multimodal geometry and typography bloat detection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Automatic financial inconsistencies and omission flags</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Benchmarking against funded decks in your exact vertical</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Pitch Deck Diagnostic', 'diagnostic')}
                className="btn-primary text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>Diagnose Your Deck</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="backrr-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF2]">
                <span className="text-xs font-bold text-[#171C2F]">Slide Deck Diagnostic Report</span>
                <span className="text-xs font-extrabold text-[#5268E8]">86/100 Overall</span>
              </div>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Slide 2: Problem Statement (Grade: A+)</span>
                  </div>
                  <div className="text-[0.72rem] text-emerald-700 mt-1">
                    Clear narrative hook with quantifiable operational cost metrics.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Slide 7: Unit Economics (Grade: B-)</span>
                  </div>
                  <div className="text-[0.72rem] text-amber-700 mt-1">
                    Blended CAC lacks SDR compensation breakdown. Partners will probe this.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Slide 10: Moat & Defensibility (Grade: A)</span>
                  </div>
                  <div className="text-[0.72rem] text-emerald-700 mt-1">
                    Strong data gravity argument with concrete high switching barriers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE C: AI Investor Grill */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5268E8]">
              03 • Simulated Partner Interrogation
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171C2F] tracking-tight leading-snug">
              Walk Into Your Investor Meeting Prepared.
            </h3>
            <p className="text-sm sm:text-base text-[#69748A] leading-relaxed">
              Voice-interactive partner simulations emulating rigorous Call 1 investor questioning: unit economics,
              churn, retention decay, moat defensibility, and real-time founder delivery feedback.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#171C2F] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Simulated partner interrogation by top seed and Series-A VCs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Voice stream waveform with delivery pacing and clarity metrics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Immediate objection stress-testing on margin and churn assumptions</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('AI Investor Grill', 'grill')}
                className="btn-primary text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>Experience Investor Grill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="backrr-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF2]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-[#171C2F]">Live Interrogation Session</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E0EDFF] text-[#5268E8] text-[0.68rem] font-bold">
                  Voice Waveform Stream
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2] space-y-2">
                <div className="text-[0.7rem] font-bold text-[#5268E8] uppercase tracking-wider">
                  Partner Interrogator: Devang Raja (VC Partner)
                </div>
                <p className="text-xs font-semibold text-[#171C2F] italic">
                  &ldquo;Why is your gross margin projected at 82% when your third-party inference compute costs scale linearly with active tokens?&rdquo;
                </p>
                <div className="flex items-center gap-1.5 h-6 pt-2">
                  {[10, 20, 14, 26, 18, 8, 22, 16, 24, 12, 18, 10].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#5268E8] rounded-full waveform-bar"
                      style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                  <span className="text-[0.68rem] text-[#69748A] ml-2">Response Clarity: 92%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-[0.72rem] text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Founder defense validated: Proprietary quantization caches reduce API cost by 64%.</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE D: Financial Command Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5268E8]">
              04 • Deterministic Financial Modeling
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171C2F] tracking-tight leading-snug">
              Know Your Numbers Before Investors Ask.
            </h3>
            <p className="text-sm sm:text-base text-[#69748A] leading-relaxed">
              Five-year interconnected financial models covering Profit & Loss, 3-section Cash Flow,
              Debt schedules, Runway sensitivity analysis, and multi-tab Excel export with formulas intact.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#171C2F] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Deterministic 5-year model with scenario toggles</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>P&L, Cash Flow, and Debt schedules connected automatically</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Clean Excel export with verified mathematical formulas</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Financial Command Center', 'finance')}
                className="btn-primary text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>Open Financial Command</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="backrr-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF2]">
                <span className="text-xs font-bold text-[#171C2F]">5-Year Interconnected P&L Preview</span>
                <span className="text-xs font-bold text-emerald-600">Runway: 14.2 Months</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFF] text-[#69748A] border-b border-[#E6EAF2]">
                    <tr>
                      <th className="py-2 px-2.5 font-semibold">Metric</th>
                      <th className="py-2 px-2.5 font-semibold">Q1 2026</th>
                      <th className="py-2 px-2.5 font-semibold">Q3 2026</th>
                      <th className="py-2 px-2.5 font-semibold">Q1 2027</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EAF2]">
                    <tr>
                      <td className="py-2 px-2.5 font-medium text-[#171C2F]">ARR Expansion</td>
                      <td className="py-2 px-2.5">$180,000</td>
                      <td className="py-2 px-2.5">$480,000</td>
                      <td className="py-2 px-2.5">$1,250,000</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-medium text-[#171C2F]">Gross Margin</td>
                      <td className="py-2 px-2.5">78.5%</td>
                      <td className="py-2 px-2.5">82.1%</td>
                      <td className="py-2 px-2.5">84.6%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2.5 font-medium text-[#171C2F]">Net Burn Rate</td>
                      <td className="py-2 px-2.5 text-amber-600">-$24,500</td>
                      <td className="py-2 px-2.5 text-amber-600">-$18,200</td>
                      <td className="py-2 px-2.5 text-emerald-600">+$12,400</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pt-1 flex items-center justify-between text-[0.7rem] text-[#69748A]">
                <span>Scenario: Base Case (Realistic)</span>
                <span className="text-[#5268E8] font-semibold cursor-pointer">Export to Excel (.xlsx)</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE E: Virtual Data Room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5268E8]">
              05 • Diligence Vault
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171C2F] tracking-tight leading-snug">
              Every Important Document. One Secure Place.
            </h3>
            <p className="text-sm sm:text-base text-[#69748A] leading-relaxed">
              Structured document management and stage-aware due diligence repository. Integrated with
              Google Cloud Storage with cryptographic SHA-256 document hash stamping and diligence readiness clearance.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#171C2F] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Stage-aware due diligence checklists (Pre-Seed to Series-A)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Cryptographic SHA-256 document hash stamping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Granular permission controls and authorized access sharing</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Virtual Data Room', 'dataroom')}
                className="btn-primary text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>Explore Virtual Data Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="backrr-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF2]">
                <div className="flex items-center gap-2">
                  <FolderLock className="w-4 h-4 text-[#5268E8]" />
                  <span className="text-xs font-bold text-[#171C2F]">Stage-Aware Data Room Vault</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[0.68rem] font-bold border border-emerald-100">
                  Diligence Score: 94%
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-[#171C2F]">Certificate_of_Incorporation.pdf</div>
                      <div className="text-[0.68rem] text-[#69748A]">SHA-256: e3b0c44298fc1c149afb...</div>
                    </div>
                  </div>
                  <span className="text-[0.7rem] font-bold text-emerald-600">Verified</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-[#171C2F]">Cap_Table_Fully_Diluted.xlsx</div>
                      <div className="text-[0.68rem] text-[#69748A]">SHA-256: 9f86d081884c7d659a2f...</div>
                    </div>
                  </div>
                  <span className="text-[0.7rem] font-bold text-emerald-600">Verified</span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-[#171C2F]">YC_Post_Money_SAFE_Signed.pdf</div>
                      <div className="text-[0.68rem] text-[#69748A]">SHA-256: 5e884898da28047151d0...</div>
                    </div>
                  </div>
                  <span className="text-[0.7rem] font-bold text-emerald-600">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE F: Market & TAM Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5268E8]">
              06 • Market Sizing Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171C2F] tracking-tight leading-snug">
              Understand the Market You&apos;re About to Enter.
            </h3>
            <p className="text-sm sm:text-base text-[#69748A] leading-relaxed">
              Showcases relevant market research, TAM, SAM, SOM, and competitive intelligence capabilities
              built to satisfy institutional due diligence standards.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-[#171C2F] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Top-down and bottom-up market sizing validation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Competitive quadrant positioning and differentiation vectors</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5268E8]" />
                <span>Addressable expansion opportunities across international markets</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Market & TAM Intelligence', 'market')}
                className="btn-primary text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>Explore Market Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="backrr-card p-6 bg-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF2]">
                <span className="text-xs font-bold text-[#171C2F]">Market Sizing Model</span>
                <span className="text-xs font-bold text-[#5268E8]">TAM / SAM / SOM</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2]">
                  <div className="text-[0.68rem] font-bold text-[#69748A]">TAM</div>
                  <div className="text-2xl font-extrabold text-[#5268E8] mt-1">$14.2B</div>
                  <div className="text-[0.65rem] text-[#69748A] mt-0.5">Global Market</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2]">
                  <div className="text-[0.68rem] font-bold text-[#69748A]">SAM</div>
                  <div className="text-2xl font-extrabold text-[#8271ED] mt-1">$3.8B</div>
                  <div className="text-[0.65rem] text-[#69748A] mt-0.5">Serviceable</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2]">
                  <div className="text-[0.68rem] font-bold text-[#69748A]">SOM</div>
                  <div className="text-2xl font-extrabold text-emerald-600 mt-1">$420M</div>
                  <div className="text-[0.65rem] text-[#69748A] mt-0.5">Target Capture</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE G: Legal Standards & SAFE Locker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5268E8]">
              07 • Institutional Legal Infrastructure
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171C2F] tracking-tight leading-snug">
              Get Your Legal Fundamentals in Place.
            </h3>
            <p className="text-sm sm:text-base text-[#69748A] leading-relaxed">
              Standardized legal documents built on Y Combinator Post-Money SAFE templates, founder vesting agreements,
              and 10%–15% ESOP pool documentation with instant generation and exports.
            </p>
            <p className="text-xs text-[#69748A] italic">
              Note: All generated legal documents require independent legal counsel review before formal execution.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Legal Standards & SAFE Locker', 'legaldocs')}
                className="btn-primary text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>View Legal Standards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="backrr-card p-6 bg-white space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-[#E6EAF2]">
                <span className="text-xs font-bold text-[#171C2F]">Standard Legal Templates</span>
                <span className="text-xs font-bold text-emerald-600">Institutional Formats</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#5268E8]" />
                    <span className="font-semibold text-[#171C2F]">YC Post-Money SAFE (Valuation Cap)</span>
                  </div>
                  <span className="text-[0.68rem] font-bold text-[#5268E8]">Available</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#8271ED]" />
                    <span className="font-semibold text-[#171C2F]">Founder Vesting & Reverse Dilution</span>
                  </div>
                  <span className="text-[0.68rem] font-bold text-[#8271ED]">Available</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F8FAFF] border border-[#E6EAF2] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-[#171C2F]">10%–15% ESOP Pool Manual</span>
                  </div>
                  <span className="text-[0.68rem] font-bold text-emerald-600">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5-VECTOR FUNDABILITY AUDIT SECTION */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF] border-y border-[#E6EAF2]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="pill-tag">Proprietary Underwriting Standard</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171C2F] tracking-tight">
              The 5-Vector Fundability Audit
            </h2>
            <p className="text-sm sm:text-base text-[#69748A]">
              Underwriting institutional venture deals requires quantitative rigor across five core dimensions.
              Profiles with insufficient data display missing parameter checklists rather than arbitrary numbers.
            </p>
          </div>

          {/* Interactive Vector Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
            {fundabilityVectors.map((v, i) => (
              <button
                key={i}
                onClick={() => setSelectedVector(i)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedVector === i
                    ? 'border-[#5268E8] bg-[#E0EDFF]/50 shadow-xs'
                    : 'border-[#E6EAF2] bg-[#F8FAFF] hover:bg-white'
                }`}
              >
                <div className="text-xs font-bold text-[#5268E8]">{v.weight}</div>
                <div className="text-xs font-bold text-[#171C2F] truncate mt-1">{v.title}</div>
                <div className="text-[0.7rem] text-[#69748A] mt-0.5">{v.score}</div>
              </button>
            ))}
          </div>

          {/* Detailed Selected Vector Panel */}
          <div className="backrr-card p-6 sm:p-8 bg-white border border-[#E6EAF2]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6EAF2]">
              <div>
                <span className="text-xs font-bold text-[#5268E8] uppercase tracking-wider">
                  Weight: {fundabilityVectors[selectedVector].weight} of Overall Score
                </span>
                <h3 className="text-2xl font-extrabold text-[#171C2F] mt-1">
                  {fundabilityVectors[selectedVector].title}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-3xl font-black text-[#5268E8]">
                  {fundabilityVectors[selectedVector].score}
                </span>
                <div className="text-xs font-semibold text-emerald-600 mt-0.5">
                  {fundabilityVectors[selectedVector].benchmarks}
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-[#69748A] leading-relaxed pt-5">
              {fundabilityVectors[selectedVector].description}
            </p>

            <div className="pt-6">
              <button
                onClick={() => handleProductAccess('Fundability Score Audit', 'dashboard')}
                className="btn-primary text-xs sm:text-sm inline-flex items-center gap-2"
              >
                <span>Calculate Your Venture Score</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (4-STEP CONNECTED PROCESS) */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="pill-tag">Clear Step-by-Step Path</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171C2F] tracking-tight">
            How WaoU Fund Works
          </h2>
          <p className="text-sm sm:text-base text-[#69748A]">
            A structured path from raw startup idea to closed institutional rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="backrr-card p-6 bg-white space-y-3 border border-[#E6EAF2]">
            <div className="w-10 h-10 rounded-full bg-[#EAE5FF] text-[#5268E8] flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="font-bold text-base text-[#171C2F]">Build Venture Profile</h3>
            <p className="text-xs text-[#69748A] leading-relaxed">
              Connect pitch materials, corporate charter details, financial models, and sector metrics in one secure repository.
            </p>
          </div>

          <div className="backrr-card p-6 bg-white space-y-3 border border-[#E6EAF2]">
            <div className="w-10 h-10 rounded-full bg-[#EAE5FF] text-[#5268E8] flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="font-bold text-base text-[#171C2F]">Evaluate Fundability</h3>
            <p className="text-xs text-[#69748A] leading-relaxed">
              Benchmark your business against the 5-Vector Fundability Audit and 10,000+ funded seed presentations.
            </p>
          </div>

          <div className="backrr-card p-6 bg-white space-y-3 border border-[#E6EAF2]">
            <div className="w-10 h-10 rounded-full bg-[#EAE5FF] text-[#5268E8] flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="font-bold text-base text-[#171C2F]">Strengthen Strategy</h3>
            <p className="text-xs text-[#69748A] leading-relaxed">
              Run partner voice simulations, stress-test 5-year financial models, and assemble a SHA-256 stamped data room.
            </p>
          </div>

          <div className="backrr-card p-6 bg-white space-y-3 border border-[#E6EAF2]">
            <div className="w-10 h-10 rounded-full bg-[#EAE5FF] text-[#5268E8] flex items-center justify-center font-black text-sm">
              04
            </div>
            <h3 className="font-bold text-base text-[#171C2F]">Approach Investors</h3>
            <p className="text-xs text-[#69748A] leading-relaxed">
              Connect with aligned checkwriters across our 5,000+ institutional network with verified diligence clearance.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-20 sm:py-28 bg-white border-y border-[#E6EAF2]">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12 space-y-3">
            <div className="pill-tag">Frequently Asked Questions</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#171C2F] tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="text-sm text-[#69748A]">
              Clear answers regarding our underwriting standards, data security, and platform capabilities.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E6EAF2] bg-[#F8FAFF] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#171C2F]">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#5268E8] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#69748A] flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#69748A] leading-relaxed border-t border-[#E6EAF2]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FINAL CONVERSION SECTION */}
      <section className="py-24 sm:py-32 backrr-hero-bg text-center relative">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <div className="pill-tag">Start Your Journey Today</div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#171C2F] tracking-tight leading-tight">
            Your Next Funding Milestone Starts Here.
          </h2>
          <p className="text-base sm:text-lg text-[#69748A] max-w-xl mx-auto leading-relaxed">
            Build a stronger venture, understand your investor readiness and prepare for the conversations that move your business forward.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => handleProductAccess('Final Conversion CTA', 'dashboard')}
              className="btn-primary flex items-center gap-2 text-sm sm:text-base py-3.5 px-8"
            >
              <span>Get Started With WaoU Fund</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#69748A] pt-1">
            Join founders building investor-ready businesses.
          </p>
        </div>
      </section>

      {/* 9. MINIMAL EDITORIAL FOOTER */}
      <footer className="border-t border-[#E6EAF2] bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#69748A]">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="WaoU Fund Logo"
              width={28}
              height={28}
              className="rounded-lg border border-[#E6EAF2]"
            />
            <span className="font-bold text-sm text-[#171C2F]">WaoU Fund</span>
            <span>• Empowering venture founders worldwide</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => alert('Privacy Notice: Submitted details are solely used to create requested venture profiles and process institutional registrations under bank-grade encryption.')}
              className="hover:text-[#171C2F] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => alert('Terms of Use: WaoU Fund provides AI fundraising intelligence and diagnostic tooling. Legal templates require formal independent counsel review.')}
              className="hover:text-[#171C2F] transition-colors"
            >
              Terms of Use
            </button>
            <a
              href="mailto:support@waoufund.com"
              className="text-[#5268E8] font-semibold hover:underline"
            >
              support@waoufund.com
            </a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} WaoU Fund Intelligence Inc.
          </div>
        </div>
      </footer>

      {/* MANDATORY LEAD CAPTURE MODAL */}
      <LeadCaptureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
        destination={targetDestination}
      />
    </div>
  );
}
