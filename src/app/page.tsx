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
  const [modalOpen, setModalOpen] = useState(false);
  const [targetDestination, setTargetDestination] = useState<string>('Founder Studio');
  const [isRegistered, setIsRegistered] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('dashboard');

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedVector, setSelectedVector] = useState(0);

  useEffect(() => {
    const reg = localStorage.getItem('waou_lead_registered');
    if (reg === 'true') {
      setIsRegistered(true);
    }
  }, []);

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
    <div className="min-h-screen google-subtle-mesh-bg text-[#1E2330] selection:bg-[#E0EDFF] selection:text-[#4285F4] relative font-sans">
      {/* 1. SLEEK BRAND SIGNATURE (NO TOP NAVIGATION BAR) */}
      <header className="max-w-6xl mx-auto px-6 sm:px-8 pt-7 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="WaoU Fund Logo"
            width={34}
            height={34}
            className="rounded-xl border border-[#E8EDF5] shadow-xs"
            priority
          />
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold tracking-tight text-[#1E2330]">
              WaoU Fund
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-[0.65rem] font-semibold tracking-wide">
              Venture Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleProductAccess('Founder Studio', 'dashboard')}
            className="text-xs font-medium text-[#5F6B82] hover:text-[#1E2330] px-3.5 py-1.5 rounded-full border border-[#E2E8F0] bg-white/80 hover:bg-white transition-all shadow-xs"
          >
            {isRegistered ? 'Founder Studio' : 'Sign In'}
          </button>
          <button
            onClick={() => handleProductAccess('Get Early Access', 'dashboard')}
            className="btn-sleek-accent !py-1.5 !px-3.5 !text-xs !shadow-xs"
          >
            Get Early Access
          </button>
        </div>
      </header>

      {/* 2. SLEEK HERO SECTION — SUBTLE GOOGLE GRADIENT & CRISP TYPOGRAPHY */}
      <section className="relative pt-14 sm:pt-20 pb-20 sm:pb-28 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center">
          {/* Subtle Google-tinted pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-[#E2E8F0] text-[#1A73E8] text-xs font-medium mb-6 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]" />
            <span>Institutional Venture Intelligence</span>
          </div>

          {/* Crisp, Sleek Typography (Refined, Not Loud) */}
          <h1 className="text-3xl sm:text-5xl md:text-[3.5rem] font-semibold text-[#1E2330] tracking-[-0.03em] leading-[1.12] mb-5">
            Build Investor Confidence.{' '}
            <span className="bg-gradient-to-r from-[#4285F4] via-[#5C6BC0] to-[#7E57C2] bg-clip-text text-transparent font-normal sm:font-semibold">
              Raise With Clarity.
            </span>
          </h1>

          {/* Crisp Supporting Text */}
          <p className="text-sm sm:text-base text-[#5F6B82] max-w-xl mx-auto leading-relaxed mb-8 font-normal">
            WaoU Fund brings investor intelligence, fundraising preparation, financial modelling and
            institutional-grade due diligence into one intelligent platform.
          </p>

          {/* Sleek Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto mb-14">
            <button
              onClick={() => handleProductAccess('Explore WaoU Fund', 'dashboard')}
              className="w-full sm:w-auto btn-sleek-primary flex items-center justify-center gap-2"
            >
              <span>Explore WaoU Fund</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleProductAccess('Get Early Access', 'dashboard')}
              className="w-full sm:w-auto btn-sleek-secondary"
            >
              Get Early Access
            </button>
          </div>
        </div>

        {/* Hero Visual Mockup: Crisp, Sleek Product Composition */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="google-mesh-card p-5 sm:p-6 bg-white/95">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E8EDF5]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC05]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
                <span className="text-xs font-medium text-[#5F6B82] ml-2">
                  Active Venture: <strong className="text-[#1E2330] font-semibold">AetherX AI • Seed Stage</strong>
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] text-[0.68rem] font-medium border border-[#CEEAD6]">
                <CheckCircle2 className="w-3 h-3" />
                Diligence Ready
              </span>
            </div>

            {/* Inner Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left Column: Fundability Scorecard */}
              <div className="md:col-span-5 bg-[#F8FAFD] rounded-xl p-4 border border-[#E8EDF5] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#5F6B82]">
                      Fundability Score
                    </span>
                    <span className="text-[0.68rem] font-medium text-[#1A73E8] bg-[#E8F0FE] px-2 py-0.5 rounded-full">
                      Institutional Score
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1.5">
                    <span className="text-4xl font-bold text-[#1A73E8] tracking-tight">86</span>
                    <span className="text-sm text-[#5F6B82] font-normal">/ 100</span>
                    <span className="text-[0.72rem] font-medium text-[#137333] ml-auto">
                      Top 8% in Seed Cohort
                    </span>
                  </div>
                  <p className="text-[0.72rem] text-[#5F6B82] leading-relaxed mb-3">
                    Verified financial runway with defensible TAM architecture.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#E8EDF5]">
                  <div className="flex justify-between text-[0.68rem] text-[#1E2330]">
                    <span>Runway & Burn (30%)</span>
                    <span className="font-semibold text-[#1A73E8]">88%</span>
                  </div>
                  <div className="w-full h-1 bg-[#E8EDF5] rounded-full overflow-hidden">
                    <div className="w-[88%] h-full bg-[#4285F4] rounded-full" />
                  </div>

                  <div className="flex justify-between text-[0.68rem] text-[#1E2330]">
                    <span>Market & TAM (25%)</span>
                    <span className="font-semibold text-[#7E57C2]">92%</span>
                  </div>
                  <div className="w-full h-1 bg-[#E8EDF5] rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-[#7E57C2] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Right Column: Key Metrics & VC Interrogation Preview */}
              <div className="md:col-span-7 flex flex-col justify-between gap-3">
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5]">
                    <span className="text-[0.65rem] font-medium text-[#5F6B82] block">Default Runway</span>
                    <span className="text-base font-bold text-[#1E2330] mt-0.5 block">14.2 Mos</span>
                    <span className="text-[0.65rem] text-[#137333] font-medium">Burn $22k/mo</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5]">
                    <span className="text-[0.65rem] font-medium text-[#5F6B82] block">Net Retention</span>
                    <span className="text-base font-bold text-[#1E2330] mt-0.5 block">128% NRR</span>
                    <span className="text-[0.65rem] text-[#1A73E8] font-medium">Pilot Conversions</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5]">
                    <span className="text-[0.65rem] font-medium text-[#5F6B82] block">SHA-256 Vault</span>
                    <span className="text-base font-bold text-[#1E2330] mt-0.5 block">8 / 10 Docs</span>
                    <span className="text-[0.65rem] text-[#7E57C2] font-medium">Verified Clean</span>
                  </div>
                </div>

                {/* Live Simulation Card */}
                <div className="p-3 rounded-lg bg-gradient-to-r from-[#F8FAFD] to-[#E8F0FE]/40 border border-[#E8EDF5] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center flex-shrink-0">
                      <Mic className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#1E2330]">
                        Partner Simulation: Unit Economics Interrogation
                      </div>
                      <div className="text-[0.68rem] text-[#5F6B82]">
                        Live voice waveform • 12 partner objections mapped
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleProductAccess('AI Investor Grill', 'grill')}
                    className="text-xs font-medium text-[#1A73E8] bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-xs flex-shrink-0 hover:bg-[#F8FAFD]"
                  >
                    Simulate →
                  </button>
                </div>

                {/* Slide Benchmark */}
                <div className="p-2.5 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span className="text-[#5F6B82] text-[0.72rem]">
                      Pitch Deck Diagnostic: <strong className="text-[#1E2330]">Seed_Deck_v4.2.pdf</strong>
                    </span>
                  </div>
                  <span className="font-semibold text-[#137333] text-[0.72rem]">86/100 Benchmark</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF & PLATFORM METRICS */}
      <section className="py-10 border-y border-[#E8EDF5] bg-white/80 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1A73E8] tracking-tight">
                5,000+
              </div>
              <div className="text-xs font-medium text-[#5F6B82] mt-0.5">
                Institutional Investor Network
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#1E2330] tracking-tight">
                10,000+
              </div>
              <div className="text-xs font-medium text-[#5F6B82] mt-0.5">
                Seed Decks Benchmarked
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#7E57C2] tracking-tight">
                ₹1,200 Cr+
              </div>
              <div className="text-xs font-medium text-[#5F6B82] mt-0.5">
                Evaluated Venture Capital
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-[#137333] tracking-tight">
                3.4x Faster
              </div>
              <div className="text-xs font-medium text-[#5F6B82] mt-0.5">
                Lead Term-Sheet Turnaround
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPLETE PRODUCT FEATURE SHOWCASE (7 ALTERNATING SPLIT-LAYOUT SECTIONS — SLEEK) */}
      <section className="py-20 sm:py-28 space-y-20 sm:space-y-28 max-w-6xl mx-auto px-6 sm:px-8">
        <div className="max-w-xl mx-auto text-center space-y-2.5">
          <div className="sleek-pill">Comprehensive Diligence Ecosystem</div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1E2330] tracking-tight">
            Designed for Founders Who Refuse to Raise Blindly.
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6B82]">
            Every capability required to evaluate your idea, stress-test numbers, and defend your business before institutional partners.
          </p>
        </div>

        {/* FEATURE A: Idea & Pitch Deck Blueprint */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#1A73E8]">
              01 • Product Blueprint Engine
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2330] tracking-tight leading-snug">
              Turn Your Startup Idea Into an Investor-Ready Roadmap.
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6B82] leading-relaxed">
              Provides comprehensive startup idea evaluation, 3-month, 6-month, and 12-month execution roadmaps,
              recommended technology stacks, deep market research dossiers, and defensible objection preparations.
            </p>
            <ul className="space-y-1.5 text-xs text-[#1E2330] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Deterministic 3, 6, and 12-month execution roadmaps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Pre-vetted architecture and infrastructure recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Anticipated partner objections and strategic defense dossiers</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Idea & Pitch Deck Blueprint', 'blueprint')}
                className="btn-sleek-primary text-xs inline-flex items-center gap-1.5"
              >
                <span>Explore Blueprint Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="google-mesh-card p-5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E8EDF5]">
                <span className="text-xs font-semibold text-[#1E2330]">Venture Execution Blueprint</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-[0.65rem] font-medium">
                  Seed Milestone Model
                </span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5]">
                  <div className="text-[0.68rem] font-semibold text-[#1A73E8] uppercase">Month 1–3: Foundation & Alpha</div>
                  <div className="text-xs font-semibold text-[#1E2330] mt-0.5">Deploy Core Microservices & Telemetry</div>
                  <div className="text-[0.68rem] text-[#5F6B82] mt-0.5">5 Pilot LOIs signed • Deterministic logging enabled</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5]">
                  <div className="text-[0.68rem] font-semibold text-[#7E57C2] uppercase">Month 4–6: Monetization Engine</div>
                  <div className="text-xs font-semibold text-[#1E2330] mt-0.5">Convert LOIs to Paid Subscriptions</div>
                  <div className="text-[0.68rem] text-[#5F6B82] mt-0.5">Achieve CAC payback &lt; 5 months • SOC2 Type 1 preparation</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5]">
                  <div className="text-[0.68rem] font-semibold text-[#137333] uppercase">Month 7–12: Institutional Seed</div>
                  <div className="text-xs font-semibold text-[#1E2330] mt-0.5">Scale ARR & Approach Institutional Leads</div>
                  <div className="text-[0.68rem] text-[#5F6B82] mt-0.5">Data Room clearance 100% • YC Post-Money SAFE terms ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE B: AI Pitch Deck Diagnostic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-4">
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#1A73E8]">
              02 • Deck Diagnostic Engine
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2330] tracking-tight leading-snug">
              Your Pitch Deck. Evaluated Through an Investor&apos;s Lens.
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6B82] leading-relaxed">
              Multimodal PDF and slide analysis evaluating narrative structure, slide geometry, financial gaps,
              and storytelling improvements — benchmarked against 10,000+ funded seed presentations.
            </p>
            <ul className="space-y-1.5 text-xs text-[#1E2330] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Multimodal geometry and typography bloat detection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Automatic financial inconsistencies and omission flags</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Benchmarking against funded decks in your exact vertical</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Pitch Deck Diagnostic', 'diagnostic')}
                className="btn-sleek-primary text-xs inline-flex items-center gap-1.5"
              >
                <span>Diagnose Your Deck</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="google-mesh-card p-5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E8EDF5]">
                <span className="text-xs font-semibold text-[#1E2330]">Slide Deck Diagnostic Report</span>
                <span className="text-xs font-bold text-[#1A73E8]">86/100 Overall</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg border border-[#CEEAD6] bg-[#E6F4EA]/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#137333]">
                    <CheckCircle2 className="w-3 h-3 text-[#137333]" />
                    <span>Slide 2: Problem Statement (Grade: A+)</span>
                  </div>
                  <div className="text-[0.68rem] text-[#137333]/90 mt-0.5">
                    Clear narrative hook with quantifiable operational cost metrics.
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-[#FEEFC3] bg-[#FEF7E0]/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B06000]">
                    <AlertTriangle className="w-3 h-3 text-[#B06000]" />
                    <span>Slide 7: Unit Economics (Grade: B-)</span>
                  </div>
                  <div className="text-[0.68rem] text-[#B06000]/90 mt-0.5">
                    Blended CAC lacks SDR compensation breakdown. Partners will probe this.
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-[#CEEAD6] bg-[#E6F4EA]/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#137333]">
                    <CheckCircle2 className="w-3 h-3 text-[#137333]" />
                    <span>Slide 10: Moat & Defensibility (Grade: A)</span>
                  </div>
                  <div className="text-[0.68rem] text-[#137333]/90 mt-0.5">
                    Strong data gravity argument with concrete high switching barriers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE C: AI Investor Grill */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#1A73E8]">
              03 • Simulated Partner Interrogation
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2330] tracking-tight leading-snug">
              Walk Into Your Investor Meeting Prepared.
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6B82] leading-relaxed">
              Voice-interactive partner simulations emulating rigorous Call 1 investor questioning: unit economics,
              churn, retention decay, moat defensibility, and real-time founder delivery feedback.
            </p>
            <ul className="space-y-1.5 text-xs text-[#1E2330] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Simulated partner interrogation by top seed and Series-A VCs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Voice stream waveform with delivery pacing and clarity metrics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Immediate objection stress-testing on margin and churn assumptions</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('AI Investor Grill', 'grill')}
                className="btn-sleek-primary text-xs inline-flex items-center gap-1.5"
              >
                <span>Experience Investor Grill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="google-mesh-card p-5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E8EDF5]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                  <span className="text-xs font-semibold text-[#1E2330]">Live Interrogation Session</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-[0.65rem] font-medium">
                  Voice Waveform Stream
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5] space-y-1.5">
                <div className="text-[0.68rem] font-semibold text-[#1A73E8] uppercase tracking-wider">
                  Partner Interrogator: Devang Raja (VC Partner)
                </div>
                <p className="text-xs font-medium text-[#1E2330] italic">
                  &ldquo;Why is your gross margin projected at 82% when your third-party inference compute costs scale linearly with active tokens?&rdquo;
                </p>
                <div className="flex items-center gap-1.5 h-5 pt-1.5">
                  {[8, 16, 12, 20, 14, 6, 18, 12, 19, 10, 14, 8].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#4285F4] rounded-full waveform-bar"
                      style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
                    />
                  ))}
                  <span className="text-[0.65rem] text-[#5F6B82] ml-1.5">Clarity Score: 92%</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#E6F4EA]/40 border border-[#CEEAD6] text-[0.68rem] text-[#137333] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#137333] flex-shrink-0" />
                <span>Founder defense validated: Proprietary quantization caches reduce API cost by 64%.</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE D: Financial Command Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-4">
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#1A73E8]">
              04 • Deterministic Financial Modeling
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2330] tracking-tight leading-snug">
              Know Your Numbers Before Investors Ask.
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6B82] leading-relaxed">
              Five-year interconnected financial models covering Profit & Loss, 3-section Cash Flow,
              Debt schedules, Runway sensitivity analysis, and multi-tab Excel export with formulas intact.
            </p>
            <ul className="space-y-1.5 text-xs text-[#1E2330] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Deterministic 5-year model with scenario toggles</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>P&L, Cash Flow, and Debt schedules connected automatically</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Clean Excel export with verified mathematical formulas</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Financial Command Center', 'finance')}
                className="btn-sleek-primary text-xs inline-flex items-center gap-1.5"
              >
                <span>Open Financial Command</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="google-mesh-card p-5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E8EDF5]">
                <span className="text-xs font-semibold text-[#1E2330]">5-Year P&L Model Preview</span>
                <span className="text-xs font-semibold text-[#137333]">Runway: 14.2 Months</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFD] text-[#5F6B82] border-b border-[#E8EDF5]">
                    <tr>
                      <th className="py-1.5 px-2 font-medium">Metric</th>
                      <th className="py-1.5 px-2 font-medium">Q1 2026</th>
                      <th className="py-1.5 px-2 font-medium">Q3 2026</th>
                      <th className="py-1.5 px-2 font-medium">Q1 2027</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8EDF5]">
                    <tr>
                      <td className="py-2 px-2 text-[#1E2330]">ARR Growth</td>
                      <td className="py-2 px-2">$180,000</td>
                      <td className="py-2 px-2">$480,000</td>
                      <td className="py-2 px-2">$1,250,000</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-[#1E2330]">Gross Margin</td>
                      <td className="py-2 px-2">78.5%</td>
                      <td className="py-2 px-2">82.1%</td>
                      <td className="py-2 px-2">84.6%</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-[#1E2330]">Net Burn Rate</td>
                      <td className="py-2 px-2 text-[#B06000]">-$24,500</td>
                      <td className="py-2 px-2 text-[#B06000]">-$18,200</td>
                      <td className="py-2 px-2 text-[#137333]">+$12,400</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="pt-1 flex items-center justify-between text-[0.68rem] text-[#5F6B82]">
                <span>Scenario: Base Case (Realistic)</span>
                <span className="text-[#1A73E8] font-medium cursor-pointer">Export to Excel (.xlsx)</span>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE E: Virtual Data Room */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#1A73E8]">
              05 • Diligence Vault
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2330] tracking-tight leading-snug">
              Every Important Document. One Secure Place.
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6B82] leading-relaxed">
              Structured document management and stage-aware due diligence repository. Integrated with
              Google Cloud Storage with cryptographic SHA-256 document hash stamping and diligence readiness clearance.
            </p>
            <ul className="space-y-1.5 text-xs text-[#1E2330] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Stage-aware due diligence checklists (Pre-Seed to Series-A)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Cryptographic SHA-256 document hash stamping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Granular permission controls and authorized access sharing</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Virtual Data Room', 'dataroom')}
                className="btn-sleek-primary text-xs inline-flex items-center gap-1.5"
              >
                <span>Explore Virtual Data Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="google-mesh-card p-5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E8EDF5]">
                <div className="flex items-center gap-1.5">
                  <FolderLock className="w-3.5 h-3.5 text-[#1A73E8]" />
                  <span className="text-xs font-semibold text-[#1E2330]">Stage-Aware Data Room Vault</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#E6F4EA] text-[#137333] text-[0.65rem] font-medium border border-[#CEEAD6]">
                  Diligence Score: 94%
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137333]" />
                    <div>
                      <div className="font-medium text-[#1E2330] text-[0.72rem]">Certificate_of_Incorporation.pdf</div>
                      <div className="text-[0.65rem] text-[#5F6B82]">SHA-256: e3b0c44298fc1c149afb...</div>
                    </div>
                  </div>
                  <span className="text-[0.68rem] font-medium text-[#137333]">Verified</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137333]" />
                    <div>
                      <div className="font-medium text-[#1E2330] text-[0.72rem]">Cap_Table_Fully_Diluted.xlsx</div>
                      <div className="text-[0.65rem] text-[#5F6B82]">SHA-256: 9f86d081884c7d659a2f...</div>
                    </div>
                  </div>
                  <span className="text-[0.68rem] font-medium text-[#137333]">Verified</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#137333]" />
                    <div>
                      <div className="font-medium text-[#1E2330] text-[0.72rem]">YC_Post_Money_SAFE_Signed.pdf</div>
                      <div className="text-[0.65rem] text-[#5F6B82]">SHA-256: 5e884898da28047151d0...</div>
                    </div>
                  </div>
                  <span className="text-[0.68rem] font-medium text-[#137333]">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE F: Market & TAM Intelligence */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-4">
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#1A73E8]">
              06 • Market Sizing Architecture
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2330] tracking-tight leading-snug">
              Understand the Market You&apos;re About to Enter.
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6B82] leading-relaxed">
              Showcases relevant market research, TAM, SAM, SOM, and competitive intelligence capabilities
              built to satisfy institutional due diligence standards.
            </p>
            <ul className="space-y-1.5 text-xs text-[#1E2330] pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Top-down and bottom-up market sizing validation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Competitive quadrant positioning and differentiation vectors</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A73E8]" />
                <span>Addressable expansion opportunities across international markets</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Market & TAM Intelligence', 'market')}
                className="btn-sleek-primary text-xs inline-flex items-center gap-1.5"
              >
                <span>Explore Market Intelligence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 lg:order-1">
            <div className="google-mesh-card p-5 bg-white space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E8EDF5]">
                <span className="text-xs font-semibold text-[#1E2330]">Market Sizing Model</span>
                <span className="text-xs font-medium text-[#1A73E8]">TAM / SAM / SOM</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5]">
                  <div className="text-[0.65rem] font-medium text-[#5F6B82]">TAM</div>
                  <div className="text-xl font-bold text-[#1A73E8] mt-0.5">$14.2B</div>
                  <div className="text-[0.62rem] text-[#5F6B82] mt-0.5">Global Market</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5]">
                  <div className="text-[0.65rem] font-medium text-[#5F6B82]">SAM</div>
                  <div className="text-xl font-bold text-[#7E57C2] mt-0.5">$3.8B</div>
                  <div className="text-[0.62rem] text-[#5F6B82] mt-0.5">Serviceable</div>
                </div>
                <div className="p-3 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5]">
                  <div className="text-[0.65rem] font-medium text-[#5F6B82]">SOM</div>
                  <div className="text-xl font-bold text-[#137333] mt-0.5">$420M</div>
                  <div className="text-[0.62rem] text-[#5F6B82] mt-0.5">Target Capture</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE G: Legal Standards & SAFE Locker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#1A73E8]">
              07 • Institutional Legal Infrastructure
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#1E2330] tracking-tight leading-snug">
              Get Your Legal Fundamentals in Place.
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6B82] leading-relaxed">
              Standardized legal documents built on Y Combinator Post-Money SAFE templates, founder vesting agreements,
              and 10%–15% ESOP pool documentation with instant generation and exports.
            </p>
            <p className="text-[0.7rem] text-[#5F6B82] italic">
              Note: All generated legal documents require independent legal counsel review before formal execution.
            </p>
            <div className="pt-2">
              <button
                onClick={() => handleProductAccess('Legal Standards & SAFE Locker', 'legaldocs')}
                className="btn-sleek-primary text-xs inline-flex items-center gap-1.5"
              >
                <span>View Legal Standards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="google-mesh-card p-5 bg-white space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8EDF5]">
                <span className="text-xs font-semibold text-[#1E2330]">Standard Legal Templates</span>
                <span className="text-xs font-medium text-[#137333]">Institutional Formats</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#1A73E8]" />
                    <span className="font-medium text-[#1E2330] text-[0.72rem]">YC Post-Money SAFE (Valuation Cap)</span>
                  </div>
                  <span className="text-[0.65rem] font-medium text-[#1A73E8]">Available</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#7E57C2]" />
                    <span className="font-medium text-[#1E2330] text-[0.72rem]">Founder Vesting & Reverse Dilution</span>
                  </div>
                  <span className="text-[0.65rem] font-medium text-[#7E57C2]">Available</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8FAFD] border border-[#E8EDF5] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#137333]" />
                    <span className="font-medium text-[#1E2330] text-[0.72rem]">10%–15% ESOP Pool Manual</span>
                  </div>
                  <span className="text-[0.65rem] font-medium text-[#137333]">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5-VECTOR FUNDABILITY AUDIT SECTION */}
      <section className="py-20 sm:py-24 bg-white/70 border-y border-[#E8EDF5] backdrop-blur-xs">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="sleek-pill">Proprietary Underwriting Standard</div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1E2330] tracking-tight">
              The 5-Vector Fundability Audit
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B82]">
              Underwriting institutional venture deals requires quantitative rigor across five core dimensions.
              Profiles with insufficient data display missing parameter checklists rather than arbitrary numbers.
            </p>
          </div>

          {/* Interactive Vector Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
            {fundabilityVectors.map((v, i) => (
              <button
                key={i}
                onClick={() => setSelectedVector(i)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedVector === i
                    ? 'border-[#4285F4] bg-[#E8F0FE]/60 shadow-xs'
                    : 'border-[#E8EDF5] bg-white hover:bg-[#F8FAFD]'
                }`}
              >
                <div className="text-xs font-semibold text-[#1A73E8]">{v.weight}</div>
                <div className="text-xs font-medium text-[#1E2330] truncate mt-0.5">{v.title}</div>
                <div className="text-[0.68rem] text-[#5F6B82] mt-0.5">{v.score}</div>
              </button>
            ))}
          </div>

          {/* Detailed Selected Vector Panel */}
          <div className="google-mesh-card p-6 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E8EDF5]">
              <div>
                <span className="text-[0.68rem] font-semibold text-[#1A73E8] uppercase tracking-wider">
                  Weight: {fundabilityVectors[selectedVector].weight} of Overall Score
                </span>
                <h3 className="text-xl font-semibold text-[#1E2330] mt-0.5">
                  {fundabilityVectors[selectedVector].title}
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-2xl font-bold text-[#1A73E8]">
                  {fundabilityVectors[selectedVector].score}
                </span>
                <div className="text-xs font-medium text-[#137333] mt-0.5">
                  {fundabilityVectors[selectedVector].benchmarks}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5F6B82] leading-relaxed pt-4">
              {fundabilityVectors[selectedVector].description}
            </p>

            <div className="pt-5">
              <button
                onClick={() => handleProductAccess('Fundability Score Audit', 'dashboard')}
                className="btn-sleek-primary text-xs inline-flex items-center gap-1.5"
              >
                <span>Calculate Your Venture Score</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (4-STEP CONNECTED PROCESS) */}
      <section className="py-20 sm:py-24 max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <div className="sleek-pill">Clear Step-by-Step Path</div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#1E2330] tracking-tight">
            How WaoU Fund Works
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6B82]">
            A structured path from raw startup idea to closed institutional rounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="google-mesh-card p-5 bg-white space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-semibold text-sm text-[#1E2330]">Build Venture Profile</h3>
            <p className="text-xs text-[#5F6B82] leading-relaxed">
              Connect pitch materials, corporate charter details, financial models, and sector metrics in one secure repository.
            </p>
          </div>

          <div className="google-mesh-card p-5 bg-white space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-semibold text-sm text-[#1E2330]">Evaluate Fundability</h3>
            <p className="text-xs text-[#5F6B82] leading-relaxed">
              Benchmark your business against the 5-Vector Fundability Audit and 10,000+ funded seed presentations.
            </p>
          </div>

          <div className="google-mesh-card p-5 bg-white space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-semibold text-sm text-[#1E2330]">Strengthen Strategy</h3>
            <p className="text-xs text-[#5F6B82] leading-relaxed">
              Run partner voice simulations, stress-test 5-year financial models, and assemble a SHA-256 stamped data room.
            </p>
          </div>

          <div className="google-mesh-card p-5 bg-white space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h3 className="font-semibold text-sm text-[#1E2330]">Approach Investors</h3>
            <p className="text-xs text-[#5F6B82] leading-relaxed">
              Connect with aligned checkwriters across our 5,000+ institutional network with verified diligence clearance.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="py-20 sm:py-24 bg-white/70 border-y border-[#E8EDF5]">
        <div className="max-w-2xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-10 space-y-2">
            <div className="sleek-pill">Frequently Asked Questions</div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1E2330] tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6B82]">
              Clear answers regarding our underwriting standards, data security, and platform capabilities.
            </p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#E8EDF5] bg-[#F8FAFD] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-semibold text-xs sm:text-sm text-[#1E2330]">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#1A73E8] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#5F6B82] flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-[#5F6B82] leading-relaxed border-t border-[#E8EDF5]">
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
      <section className="py-20 sm:py-28 text-center relative">
        <div className="max-w-2xl mx-auto px-6 space-y-5">
          <div className="sleek-pill">Start Your Journey Today</div>
          <h2 className="text-2xl sm:text-4xl font-semibold text-[#1E2330] tracking-tight leading-tight">
            Your Next Funding Milestone Starts Here.
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6B82] max-w-lg mx-auto leading-relaxed">
            Build a stronger venture, understand your investor readiness and prepare for the conversations that move your business forward.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
            <button
              onClick={() => handleProductAccess('Final Conversion CTA', 'dashboard')}
              className="btn-sleek-primary flex items-center gap-2 py-3 px-6 text-xs sm:text-sm"
            >
              <span>Get Started With WaoU Fund</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[0.7rem] text-[#5F6B82]">
            Join founders building investor-ready businesses.
          </p>
        </div>
      </section>

      {/* 9. SLEEK EDITORIAL FOOTER */}
      <footer className="border-t border-[#E8EDF5] bg-white py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5F6B82]">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="WaoU Fund Logo"
              width={24}
              height={24}
              className="rounded-md border border-[#E8EDF5]"
            />
            <span className="font-semibold text-xs text-[#1E2330]">WaoU Fund</span>
            <span>• Empowering venture founders worldwide</span>
          </div>

          <div className="flex items-center gap-5 text-xs">
            <button
              onClick={() => alert('Privacy Notice: Submitted details are solely used to create requested venture profiles and process institutional registrations under bank-grade encryption.')}
              className="hover:text-[#1E2330] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => alert('Terms of Use: WaoU Fund provides AI fundraising intelligence and diagnostic tooling. Legal templates require formal independent counsel review.')}
              className="hover:text-[#1E2330] transition-colors"
            >
              Terms of Use
            </button>
            <a
              href="mailto:support@waoufund.com"
              className="text-[#1A73E8] font-medium hover:underline"
            >
              support@waoufund.com
            </a>
          </div>

          <div className="text-[0.72rem]">
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
