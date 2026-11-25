'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Calculator,
  FolderLock,
  HelpCircle,
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  LogOut,
  Download,
  Hash,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface UserProfile {
  id: string;
  role: 'startup' | 'investor';
  fullName: string;
  email: string;
  startupName?: string;
  startupDetails?: string;
}

interface DeckEvaluation {
  id: string;
  fileName: string;
  fileSizeBytes: number;
  estimatedSlides: number;
  overallScore: number;
  aiPowered: boolean;
  summary: string;
  presentSections: string[];
  missingInformation: string[];
  weakSlides: Array<{ slide: string; issue: string; fix: string }>;
  financialNarrativeGaps: string[];
  recommendations: string[];
  createdAt: string;
}

interface DueDiligenceItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  hash?: string;
  updatedAt: string;
}

const INVESTOR_FAQS = [
  {
    q: 'How does WaoU Fund evaluate my startup differently than generic AI tools?',
    a: 'Generic LLMs have no domain context on venture capital underwriting standards. WaoU Fund is structured on 10,000+ institutional seed and Series-A term sheets, financial models, and diligence checklists. Our engine enforces stage-aware rules: for Pre-Seed we inspect founder pedigree and TAM, while for Seed and Series-A we ruthlessly evaluate CAC payback, unit economics, and Net Revenue Retention.',
  },
  {
    q: 'Is my confidential pitch deck and financial data secure?',
    a: 'We operate 256-bit AES encryption standards at rest and in transit. Your materials are never used to train public foundational models. Only you and the advisors you explicitly authorize can access your due diligence files.',
  },
  {
    q: 'What is the 5-Vector Fundability Audit?',
    a: 'WaoU Fund evaluates ventures across Financial Health & Runway (30%), Market Opportunity & TAM (25%), Traction & Retention (20%), Team Pedigree & Moats (15%), and Due Diligence Readiness (10%). Incomplete profiles are flagged with missing parameter checklists rather than unearned vanity numbers.',
  },
  {
    q: 'Can I export the dynamic financial forecast to CSV / Excel?',
    a: 'Yes. The Financial Forecast module generates a deterministic 5-year projection across Base, Conservative, and Growth scenarios that exports cleanly to CSV for Excel and investor data rooms.',
  },
  {
    q: 'What documents do institutional investors expect in Due Diligence?',
    a: 'At Pre-Seed and Seed, investors typically inspect your Certificate of Incorporation, Fully Diluted Cap Table, Founder IP Assignment & Vesting agreements, 5-Year Financial Forecast, recent bank statements, and key customer contracts.',
  },
];

export default function StartupDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'deck' | 'forecast' | 'diligence' | 'faqs'>('deck');

  // Pitch Deck Evaluation state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [deckError, setDeckError] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<DeckEvaluation[]>([]);
  const [activeEval, setActiveEval] = useState<DeckEvaluation | null>(null);

  // Financial Forecast state
  const [startingMrr, setStartingMrr] = useState(12000);
  const [monthlyGrowthPct, setMonthlyGrowthPct] = useState(12);
  const [grossMarginPct, setGrossMarginPct] = useState(78);
  const [monthlyBurn, setMonthlyBurn] = useState(18000);
  const [cashOnHand, setCashOnHand] = useState(250000);
  const [scenario, setScenario] = useState<'Conservative' | 'Base' | 'Growth'>('Base');

  // Due Diligence state
  const [diligenceItems, setDiligenceItems] = useState<DueDiligenceItem[]>([]);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadSessionAndData() {
      try {
        const meRes = await fetch('/api/auth/me');
        if (!meRes.ok) {
          router.push('/auth/startup/login');
          return;
        }
        const meData = await meRes.json();
        if (!meData.user) {
          router.push('/auth/startup/login');
          return;
        }
        if (meData.user.role === 'investor') {
          router.push('/dashboard/investor');
          return;
        }
        setUser(meData.user);

        const [evalRes, dilRes] = await Promise.all([
          fetch('/api/deck/evaluate'),
          fetch('/api/diligence'),
        ]);
        if (evalRes.ok) {
          const evalData = await evalRes.json();
          const list = evalData.evaluations || [];
          setEvaluations(list);
          if (list.length > 0) setActiveEval(list[0]);
        }
        if (dilRes.ok) {
          const dilData = await dilRes.json();
          setDiligenceItems(dilData.items || []);
        }
      } catch {
        router.push('/auth/startup/login');
      } finally {
        setAuthLoading(false);
      }
    }
    loadSessionAndData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleDeckUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeckError(null);
    if (!selectedFile) {
      setDeckError('Please select a pitch deck PDF file to evaluate.');
      return;
    }

    setEvaluating(true);
    try {
      const formData = new FormData();
      formData.append('deck', selectedFile);

      const res = await fetch('/api/deck/evaluate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Evaluation failed.');
      }

      const newEval = data.evaluation as DeckEvaluation;
      setEvaluations((prev) => [newEval, ...prev]);
      setActiveEval(newEval);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: unknown) {
      setDeckError(err instanceof Error ? err.message : 'Unable to evaluate pitch deck.');
    } finally {
      setEvaluating(false);
    }
  };

  const toggleDiligence = async (itemId: string, currentCompleted: boolean) => {
    try {
      const res = await fetch('/api/diligence', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, completed: !currentCompleted }),
      });
      if (res.ok) {
        const data = await res.json();
        setDiligenceItems(data.items || []);
      }
    } catch {
      // Keep current state on network failure
    }
  };

  // Compute 5-year forecast rows
  const scenarioMultiplier = scenario === 'Conservative' ? 0.75 : scenario === 'Growth' ? 1.3 : 1;
  const effectiveMonthlyGrowth = (monthlyGrowthPct / 100) * scenarioMultiplier;
  const forecastYears = [1, 2, 3, 4, 5].map((year) => {
    let annualRev = 0;
    for (let m = (year - 1) * 12; m < year * 12; m++) {
      annualRev += startingMrr * Math.pow(1 + effectiveMonthlyGrowth * 0.65, m);
    }
    const grossProfit = annualRev * (grossMarginPct / 100);
    const annualOpex = monthlyBurn * 12 * Math.pow(1.22, year - 1);
    const netCashFlow = grossProfit - annualOpex;
    return {
      year: `Year ${year}`,
      revenue: Math.round(annualRev),
      grossProfit: Math.round(grossProfit),
      opex: Math.round(annualOpex),
      netCashFlow: Math.round(netCashFlow),
    };
  });

  const netMonthlyBurn = Math.max(0, monthlyBurn - startingMrr * (grossMarginPct / 100));
  const runwayMonths =
    netMonthlyBurn <= 0 ? 'Cash-Flow Positive' : `${Math.round(cashOnHand / netMonthlyBurn)} Months`;

  const exportForecastCsv = () => {
    const header = 'Year,Revenue (USD),Gross Profit (USD),Operating Expenses (USD),Net Cash Flow (USD)\n';
    const rows = forecastYears
      .map((r) => `${r.year},${r.revenue},${r.grossProfit},${r.opex},${r.netCashFlow}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(user?.startupName || 'startup').replace(/\s+/g, '_')}_5yr_forecast.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#5368EA]" />
      </div>
    );
  }

  const completedDiligenceCount = diligenceItems.filter((i) => i.completed).length;

  const navItems = [
    { id: 'deck' as const, label: 'Pitch Deck Evaluation', icon: FileText },
    { id: 'forecast' as const, label: 'Financial Forecast', icon: Calculator },
    { id: 'diligence' as const, label: 'Due Diligence', icon: FolderLock },
    { id: 'faqs' as const, label: 'Investor FAQs', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#171A2E] flex flex-col">
      {/* Compact Top Header */}
      <header className="bg-white border-b border-[#E9EAF2] px-6 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="WaoU Fund"
              width={30}
              height={30}
              className="rounded-lg border border-[#E9EAF2]"
            />
            <span className="font-semibold text-base tracking-tight text-[#171A2E]">
              WaoU Fund
            </span>
          </Link>
          <span className="hidden sm:inline-block text-[#E9EAF2]">|</span>
          <span className="hidden sm:inline-block text-xs font-medium text-[#68738A]">
            {user?.startupName || 'Startup Workspace'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs text-[#68738A]">{user?.fullName}</span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#68738A] hover:text-[#171A2E] px-3 py-1.5 rounded-full border border-[#E9EAF2] hover:bg-[#FAFBFF] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl w-full mx-auto px-6 sm:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Simple 4-Feature Sidebar */}
        <aside className="w-full md:w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E9EAF2] p-2 space-y-1">
            <div className="px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-wider text-[#68738A]">
              Startup Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#DDEBFF]/60 text-[#5368EA]'
                      : 'text-[#68738A] hover:bg-[#FAFBFF] hover:text-[#171A2E]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#5368EA]' : 'text-[#68738A]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Active Feature Area */}
        <main className="flex-1 min-w-0">
          {/* 1. PITCH DECK EVALUATION (MOST PROMINENT) */}
          {activeTab === 'deck' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8">
                <div className="mb-6">
                  <span className="text-xs font-semibold text-[#5368EA] uppercase tracking-wider">
                    Feature 01 • Primary Diagnostic
                  </span>
                  <h1 className="text-2xl font-semibold text-[#171A2E] mt-1">
                    Pitch Deck Evaluation
                  </h1>
                  <p className="text-sm text-[#68738A] mt-1">
                    Upload your pitch deck PDF to evaluate structure, identify missing information,
                    highlight weak slides, and uncover financial or business narrative gaps.
                  </p>
                </div>

                {/* Mandatory Upload Form */}
                <form onSubmit={handleDeckUpload} className="space-y-4">
                  {deckError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{deckError}</span>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-[#E9EAF2] hover:border-[#5368EA]/50 rounded-2xl p-6 sm:p-8 bg-[#FAFBFF] text-center transition-colors">
                    <div className="w-11 h-11 rounded-2xl bg-[#DDEBFF]/70 text-[#5368EA] flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-[#171A2E] mb-1">
                      {selectedFile ? selectedFile.name : 'Select your pitch deck PDF'}
                    </p>
                    <p className="text-xs text-[#68738A] mb-4">
                      PDF format up to 20 MB. Required for structured AI &amp; rubric evaluation.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="block mx-auto text-xs text-[#68738A] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border file:border-[#E9EAF2] file:text-xs file:font-medium file:bg-white file:text-[#171A2E] hover:file:bg-[#FAFBFF] cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={evaluating}
                    className="btn-waou-gradient py-3 px-7 text-sm inline-flex items-center gap-2 disabled:opacity-60"
                  >
                    {evaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing Pitch Deck...</span>
                      </>
                    ) : (
                      <span>Upload &amp; Evaluate Pitch Deck</span>
                    )}
                  </button>
                </form>
              </div>

              {/* Structured Evaluation Output */}
              {activeEval && (
                <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E9EAF2]">
                    <div>
                      <div className="text-xs text-[#68738A]">
                        Evaluated File: <strong className="text-[#171A2E]">{activeEval.fileName}</strong> • ~
                        {activeEval.estimatedSlides} slides
                      </div>
                      <h2 className="text-lg font-semibold text-[#171A2E] mt-1">
                        Structured Evaluation Report
                      </h2>
                      <p className="text-xs text-[#68738A] mt-1">{activeEval.summary}</p>
                    </div>
                    <div className="bg-[#FAFBFF] border border-[#E9EAF2] rounded-2xl px-5 py-3 text-center flex-shrink-0">
                      <div className="text-3xl font-bold text-[#5368EA]">
                        {activeEval.overallScore}
                        <span className="text-sm font-normal text-[#68738A]">/100</span>
                      </div>
                      <div className="text-[0.68rem] text-[#68738A] font-medium">Readiness Score</div>
                    </div>
                  </div>

                  {/* Missing Information */}
                  {activeEval.missingInformation.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171A2E]">
                        Missing Information
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {activeEval.missingInformation.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Weak Slides */}
                  {activeEval.weakSlides.length > 0 && (
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171A2E]">
                        Weak Slides &amp; Structural Issues
                      </h3>
                      <div className="space-y-2.5">
                        {activeEval.weakSlides.map((ws, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2] space-y-1"
                          >
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2E]">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>{ws.slide}</span>
                            </div>
                            <p className="text-xs text-[#68738A]">{ws.issue}</p>
                            <p className="text-xs text-[#5368EA] font-medium">Fix: {ws.fix}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Financial & Business Narrative Gaps */}
                  {activeEval.financialNarrativeGaps.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171A2E]">
                        Financial &amp; Business Narrative Gaps
                      </h3>
                      <ul className="space-y-1.5 text-xs text-[#68738A]">
                        {activeEval.financialNarrativeGaps.map((gap, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#8069EA] font-bold">•</span>
                            <span>{gap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actionable Recommendations */}
                  {activeEval.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171A2E]">
                        Actionable Recommendations
                      </h3>
                      <div className="space-y-1.5">
                        {activeEval.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-[#DDEBFF]/30 border border-[#DDEBFF] text-xs text-[#171A2E] flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#5368EA] mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Previous Evaluations History */}
              {evaluations.length > 1 && (
                <div className="bg-white rounded-2xl border border-[#E9EAF2] p-5 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#68738A]">
                    Previous Evaluations
                  </h3>
                  <div className="divide-y divide-[#E9EAF2]">
                    {evaluations.map((ev) => (
                      <button
                        key={ev.id}
                        onClick={() => setActiveEval(ev)}
                        className="w-full py-2.5 flex items-center justify-between text-left hover:bg-[#FAFBFF] px-2 rounded-lg transition-colors"
                      >
                        <span className="text-xs font-medium text-[#171A2E]">{ev.fileName}</span>
                        <span className="text-xs font-semibold text-[#5368EA]">
                          {ev.overallScore}/100
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. FINANCIAL FORECAST */}
          {activeTab === 'forecast' && (
            <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#5368EA] uppercase tracking-wider">
                    Feature 02 • 5-Year Model
                  </span>
                  <h1 className="text-2xl font-semibold text-[#171A2E] mt-1">Financial Forecast</h1>
                  <p className="text-sm text-[#68738A] mt-1">
                    Model your 5-year revenue, gross profit, operating burn, and runway.
                  </p>
                </div>
                <button
                  onClick={exportForecastCsv}
                  className="btn-waou-outline px-4 py-2 text-xs inline-flex items-center gap-1.5 self-start"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Scenario & Runway Summary */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2]">
                <div className="flex items-center gap-2">
                  {(['Conservative', 'Base', 'Growth'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setScenario(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        scenario === s
                          ? 'bg-[#5368EA] text-white'
                          : 'bg-white border border-[#E9EAF2] text-[#68738A] hover:text-[#171A2E]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="text-xs font-medium text-[#68738A]">
                  Estimated Runway:{' '}
                  <strong className="text-[#171A2E] font-semibold">{runwayMonths}</strong>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#171A2E] mb-1">
                    Starting MRR ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={startingMrr}
                    onChange={(e) => setStartingMrr(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#171A2E] mb-1">
                    Monthly Growth (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={monthlyGrowthPct}
                    onChange={(e) => setMonthlyGrowthPct(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#171A2E] mb-1">
                    Gross Margin (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={grossMarginPct}
                    onChange={(e) => setGrossMarginPct(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#171A2E] mb-1">
                    Monthly Operating Burn ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={monthlyBurn}
                    onChange={(e) => setMonthlyBurn(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#171A2E] mb-1">
                    Cash Balance ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cashOnHand}
                    onChange={(e) => setCashOnHand(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
                  />
                </div>
              </div>

              {/* 5-Year Table */}
              <div className="overflow-x-auto border border-[#E9EAF2] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFBFF] text-[#68738A] border-b border-[#E9EAF2]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Period</th>
                      <th className="py-3 px-4 font-semibold">Annual Revenue</th>
                      <th className="py-3 px-4 font-semibold">Gross Profit</th>
                      <th className="py-3 px-4 font-semibold">Operating Expenses</th>
                      <th className="py-3 px-4 font-semibold">Net Cash Flow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EAF2]">
                    {forecastYears.map((row) => (
                      <tr key={row.year} className="hover:bg-[#FAFBFF]">
                        <td className="py-3 px-4 font-medium text-[#171A2E]">{row.year}</td>
                        <td className="py-3 px-4">${row.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">${row.grossProfit.toLocaleString()}</td>
                        <td className="py-3 px-4">${row.opex.toLocaleString()}</td>
                        <td
                          className={`py-3 px-4 font-medium ${
                            row.netCashFlow >= 0 ? 'text-emerald-600' : 'text-amber-700'
                          }`}
                        >
                          {row.netCashFlow >= 0 ? '+' : '-'}$
                          {Math.abs(row.netCashFlow).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. DUE DILIGENCE */}
          {activeTab === 'diligence' && (
            <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#5368EA] uppercase tracking-wider">
                    Feature 03 • Readiness Checklist
                  </span>
                  <h1 className="text-2xl font-semibold text-[#171A2E] mt-1">Due Diligence</h1>
                  <p className="text-sm text-[#68738A] mt-1">
                    Organize and verify required diligence materials with SHA-256 hash stamping.
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-[#DDEBFF]/60 text-[#5368EA] text-xs font-semibold">
                  {completedDiligenceCount} / {diligenceItems.length} Ready
                </div>
              </div>

              <div className="divide-y divide-[#E9EAF2] border border-[#E9EAF2] rounded-2xl overflow-hidden">
                {diligenceItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-[#FAFBFF] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-[#171A2E]">{item.title}</div>
                      <div className="flex items-center gap-2 text-[0.7rem] text-[#68738A]">
                        <span className="px-2 py-0.5 rounded-full bg-[#E8DEFF]/60 text-[#8069EA] font-medium">
                          {item.category}
                        </span>
                        {item.hash && (
                          <span className="font-mono flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            SHA-256: {item.hash}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleDiligence(item.id, item.completed)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                        item.completed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-[#FAFBFF] text-[#68738A] border border-[#E9EAF2] hover:text-[#171A2E]'
                      }`}
                    >
                      {item.completed ? 'Verified' : 'Mark Ready'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. INVESTOR FAQs */}
          {activeTab === 'faqs' && (
            <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#5368EA] uppercase tracking-wider">
                  Feature 04 • Underwriting Reference
                </span>
                <h1 className="text-2xl font-semibold text-[#171A2E] mt-1">Investor FAQs</h1>
                <p className="text-sm text-[#68738A] mt-1">
                  Essential questions and institutional underwriting context for founders.
                </p>
              </div>

              <div className="space-y-2.5">
                {INVESTOR_FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4"
                      >
                        <span className="text-sm font-medium text-[#171A2E]">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-[#5368EA] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#68738A] flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#68738A] leading-relaxed border-t border-[#E9EAF2]">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
