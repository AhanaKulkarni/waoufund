'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  Sparkles,
  Users,
  Search,
  Layers,
  Plus,
  Trash2,
  Mail,
  Wand2,
} from 'lucide-react';

interface StartupUser {
  id: string;
  role: string;
  fullName: string;
  email: string;
  companyName?: string;
  companyLogoUrl?: string;
  companyDetails?: string;
  websiteUrl?: string;
  stage?: string;
}

interface FrsArea {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'complete' | 'issue';
  missingInfo: string;
  suggestedImprovement: string;
  generatedContent: string;
  approvedContent?: string;
}

interface FrsState {
  fileName?: string;
  extractedCompanyName?: string;
  overallScore: number;
  errorCount: number;
  areas: FrsArea[];
  updatedAt: string;
}

interface TeamAdvisorMember {
  id: string;
  name: string;
  linkedinProfile: string;
  role: string;
  email: string;
  invited: boolean;
  inviteStatus?: string;
}

interface CompetitorItem {
  name: string;
  url: string;
  offeringSummary: string;
  positioning: string;
}

interface StrategyState {
  gtmStrategy: string;
  revenueModel: string;
  stageSlides: string;
  teamAdvisors: TeamAdvisorMember[];
  hasLogo: boolean | null;
  closingLogoUrl?: string;
  competitors: CompetitorItem[];
  improvedSolutionSlide?: string;
  changeUspMoat: boolean | null;
  uspMoatContent?: string;
  generatedSlides: {
    competitorAnalysis?: string;
    tamSamSom?: string;
    businessModelUnitEconomics?: string;
  };
}

export default function StartupDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<StartupUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'frs' | 'strategy' | 'competitors'>('frs');

  // Pitch Deck Upload & FRS
  const [frs, setFrs] = useState<FrsState | null>(null);
  const [uploadingDeck, setUploadingDeck] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [editableFix, setEditableFix] = useState('');
  const [applyingFix, setApplyingFix] = useState(false);

  // Strategy Workflow (5-step sequence ONLY: GTM, Revenue Model, Stage Slides, Team & Advisors, Closing Slide)
  const [strategy, setStrategy] = useState<StrategyState>({
    gtmStrategy: '',
    revenueModel: '',
    stageSlides: '',
    teamAdvisors: [],
    hasLogo: null,
    competitors: [],
    changeUspMoat: null,
    generatedSlides: {},
  });
  const [strategyStep, setStrategyStep] = useState<number>(1);
  const [stage, setStage] = useState('Seed');
  const [savingStrategy, setSavingStrategy] = useState(false);
  const [strategySavedMsg, setStrategySavedMsg] = useState<string | null>(null);

  // Team & Advisors invite form
  const [memberName, setMemberName] = useState('');
  const [memberLinkedin, setMemberLinkedin] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [sendInvite, setSendInvite] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [inviteMsg, setInviteMsg] = useState<string | null>(null);

  // Closing Slide Logo generation
  const [generatingLogo, setGeneratingLogo] = useState(false);

  // Competitor Analysis (3 to 15 competitors)
  const [competitorInputs, setCompetitorInputs] = useState<Array<{ name: string; url: string }>>([
    { name: '', url: '' },
    { name: '', url: '' },
    { name: '', url: '' },
  ]);
  const [analyzingCompetitors, setAnalyzingCompetitors] = useState(false);
  const [competitorError, setCompetitorError] = useState<string | null>(null);
  const [proposedUsp, setProposedUsp] = useState('');
  const [uspSavedMsg, setUspSavedMsg] = useState<string | null>(null);
  const [showTractionHidden, setShowTractionHidden] = useState(false); // Hidden by default

  useEffect(() => {
    async function loadWorkspace() {
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
        if (meData.user.role !== 'startup') {
          router.push(meData.user.role === 'investor' ? '/dashboard/investor' : '/dashboard/enabler');
          return;
        }
        setUser(meData.user);
        if (meData.user.stage) setStage(meData.user.stage);

        const [frsRes, stratRes] = await Promise.all([
          fetch('/api/deck/evaluate'),
          fetch('/api/strategy'),
        ]);

        if (frsRes.ok) {
          const frsData = await frsRes.json();
          if (frsData.frs) {
            setFrs(frsData.frs);
            const firstIssue = (frsData.frs.areas as FrsArea[]).find((a) => a.status === 'issue');
            if (firstIssue) {
              setSelectedIssueId(firstIssue.id);
              setEditableFix(firstIssue.generatedContent);
            }
          }
        }

        if (stratRes.ok) {
          const stratData = await stratRes.json();
          if (stratData.strategy) {
            setStrategy(stratData.strategy);
            if (stratData.strategy.uspMoatContent) {
              setProposedUsp(stratData.strategy.uspMoatContent);
            }
          }
        }
      } catch {
        router.push('/auth/startup/login');
      } finally {
        setLoading(false);
      }
    }
    loadWorkspace();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  // Automatic file upload handler (triggers immediately on file selection)
  const uploadDeckFile = async (file: File) => {
    setUploadError(null);
    setUploadingDeck(true);
    try {
      const formData = new FormData();
      formData.append('deck', file);
      const res = await fetch('/api/deck/evaluate', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed.');

      setFrs(data.frs);
      if (data.extractedProfile) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                companyName: data.extractedProfile.companyName,
                companyLogoUrl: data.extractedProfile.companyLogoUrl,
              }
            : prev
        );
      }
      const firstIssue = (data.frs.areas as FrsArea[]).find((a) => a.status === 'issue');
      if (firstIssue) {
        setSelectedIssueId(firstIssue.id);
        setEditableFix(firstIssue.generatedContent);
      } else {
        setSelectedIssueId(null);
      }
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Unable to evaluate pitch deck.');
    } finally {
      setUploadingDeck(false);
    }
  };

  const handleSelectIssue = (area: FrsArea) => {
    setSelectedIssueId(area.id);
    setEditableFix(area.approvedContent || area.generatedContent);
  };

  const handleApproveFix = async () => {
    if (!selectedIssueId) return;
    setApplyingFix(true);
    try {
      const res = await fetch('/api/deck/evaluate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ areaId: selectedIssueId, approvedContent: editableFix }),
      });
      const data = await res.json();
      if (res.ok && data.frs) {
        setFrs(data.frs);
        // Automatically advance to the next remaining issue (one by one)
        const nextIssue = (data.frs.areas as FrsArea[]).find((a) => a.status === 'issue');
        if (nextIssue) {
          setSelectedIssueId(nextIssue.id);
          setEditableFix(nextIssue.generatedContent);
        } else {
          setSelectedIssueId(null);
        }
      }
    } finally {
      setApplyingFix(false);
    }
  };

  const handleSaveStrategyStep = async () => {
    setSavingStrategy(true);
    setStrategySavedMsg(null);
    try {
      const res = await fetch('/api/strategy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gtmStrategy: strategy.gtmStrategy,
          revenueModel: strategy.revenueModel,
          stageSlides: strategy.stageSlides,
          stage,
          hasLogo: strategy.hasLogo,
        }),
      });
      const data = await res.json();
      if (res.ok && data.strategy) {
        setStrategy(data.strategy);
        setStrategySavedMsg('Saved.');
      }
    } finally {
      setSavingStrategy(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setInviteMsg(null);
    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: memberName,
          linkedinProfile: memberLinkedin,
          role: memberRole,
          email: memberEmail,
          sendInvite,
        }),
      });
      const data = await res.json();
      if (res.ok && data.strategy) {
        setStrategy(data.strategy);
        setInviteMsg(data.member?.inviteStatus || 'Team member added.');
        setMemberName('');
        setMemberLinkedin('');
        setMemberRole('');
        setMemberEmail('');
      }
    } finally {
      setInviting(false);
    }
  };

  const handleLogoChoice = async (hasExistingLogo: boolean) => {
    setStrategy((prev) => ({ ...prev, hasLogo: hasExistingLogo }));
    await fetch('/api/strategy', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hasLogo: hasExistingLogo }),
    });
  };

  const handleGenerateAiLogo = async () => {
    setGeneratingLogo(true);
    try {
      const res = await fetch('/api/logo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName: user?.companyName || 'WaoU Venture' }),
      });
      const data = await res.json();
      if (res.ok && data.logoUrl) {
        setUser((prev) => (prev ? { ...prev, companyLogoUrl: data.logoUrl } : prev));
        if (data.strategy) setStrategy(data.strategy);
      }
    } finally {
      setGeneratingLogo(false);
    }
  };

  const handleAnalyzeCompetitors = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompetitorError(null);
    setAnalyzingCompetitors(true);
    try {
      const res = await fetch('/api/competitors/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitors: competitorInputs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed.');
      if (data.strategy) setStrategy(data.strategy);
      if (data.proposedUspMoat) setProposedUsp(data.proposedUspMoat);
    } catch (err: unknown) {
      setCompetitorError(err instanceof Error ? err.message : 'Unable to analyze competitors.');
    } finally {
      setAnalyzingCompetitors(false);
    }
  };

  const handleUspMoatDecision = async (shouldChange: boolean) => {
    setUspSavedMsg(null);
    const res = await fetch('/api/competitors/analyze', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        changeUspMoat: shouldChange,
        uspMoatContent: proposedUsp,
      }),
    });
    const data = await res.json();
    if (res.ok && data.strategy) {
      setStrategy(data.strategy);
      setUspSavedMsg(
        shouldChange
          ? 'Updated USP & Moat applied to your solution profile.'
          : 'Existing USP & Moat retained.'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#5368EA]" />
      </div>
    );
  }

  const activeIssue = frs?.areas.find((a) => a.id === selectedIssueId) || null;

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#171A2E] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E9EAF2] px-6 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={user?.companyLogoUrl || '/logo.png'}
              alt={user?.companyName || 'WaoU Fund'}
              width={32}
              height={32}
              className="rounded-lg border border-[#E9EAF2]"
            />
            <span className="font-semibold text-base tracking-tight text-[#171A2E]">
              {user?.companyName || 'WaoU Fund'}
            </span>
          </Link>
          {user?.companyName && (
            <span className="hidden sm:inline-block text-xs text-[#68738A] bg-[#FAFBFF] px-2.5 py-0.5 rounded-full border border-[#E9EAF2]">
              Extracted from Deck
            </span>
          )}
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

      <div className="max-w-6xl w-full mx-auto px-6 sm:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Workspace Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E9EAF2] p-2 space-y-1">
            <button
              onClick={() => setActiveSection('frs')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                activeSection === 'frs'
                  ? 'bg-[#DDEBFF]/60 text-[#5368EA]'
                  : 'text-[#68738A] hover:bg-[#FAFBFF] hover:text-[#171A2E]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Pitch Deck &amp; FRS</span>
            </button>
            <button
              onClick={() => setActiveSection('strategy')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                activeSection === 'strategy'
                  ? 'bg-[#DDEBFF]/60 text-[#5368EA]'
                  : 'text-[#68738A] hover:bg-[#FAFBFF] hover:text-[#171A2E]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Deck Creation &amp; Strategy</span>
            </button>
            <button
              onClick={() => setActiveSection('competitors')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                activeSection === 'competitors'
                  ? 'bg-[#DDEBFF]/60 text-[#5368EA]'
                  : 'text-[#68738A] hover:bg-[#FAFBFF] hover:text-[#171A2E]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Competitors &amp; Solution AI</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace Panel */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* SECTION 1: PITCH DECK UPLOAD & FUNDABILITY READINESS SCORE (FRS) */}
          {activeSection === 'frs' && (
            <div className="space-y-6">
              {/* Automatic Pitch Deck Upload */}
              <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8">
                <h1 className="text-xl font-semibold text-[#171A2E]">
                  {frs ? 'Pitch Deck Uploaded' : 'Upload Your Pitch Deck'}
                </h1>
                <p className="text-sm text-[#68738A] mt-1 mb-5">
                  Upload your PDF pitch deck. WaoU AI automatically extracts your Company Name and
                  Company Logo and computes your Fundability Readiness Score (FRS).
                </p>

                {uploadError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <label className="block border-2 border-dashed border-[#E9EAF2] hover:border-[#5368EA]/50 rounded-2xl p-6 bg-[#FAFBFF] text-center cursor-pointer transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadDeckFile(f);
                    }}
                  />
                  {uploadingDeck ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#5368EA]" />
                      <span className="text-xs font-medium text-[#5368EA]">
                        Extracting Company Name, Logo &amp; calculating FRS...
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Upload className="w-5 h-5 text-[#5368EA]" />
                      <span className="text-sm font-medium text-[#171A2E]">
                        {frs?.fileName
                          ? `Current deck: ${frs.fileName} (Click to replace)`
                          : 'Click to select Pitch Deck PDF'}
                      </span>
                      <span className="text-xs text-[#68738A]">PDF up to 20 MB</span>
                    </div>
                  )}
                </label>
              </div>

              {/* FRS Display */}
              {frs && (
                <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E9EAF2]">
                    <div>
                      <h2 className="text-lg font-semibold text-[#171A2E]">
                        Fundability Readiness Score (FRS)
                      </h2>
                      <p className="text-xs text-[#68738A] mt-1">
                        {frs.errorCount} error(s) / areas of improvement detected. Click any issue
                        below to review and apply AI improvements one by one.
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="px-4 py-2 rounded-2xl bg-[#FAFBFF] border border-[#E9EAF2] text-center">
                        <div className="text-2xl font-bold text-[#5368EA]">
                          {frs.overallScore}
                          <span className="text-xs font-normal text-[#68738A]">/100</span>
                        </div>
                        <div className="text-[0.65rem] text-[#68738A]">FRS Score</div>
                      </div>
                      <div className="px-4 py-2 rounded-2xl bg-[#FAFBFF] border border-[#E9EAF2] text-center">
                        <div className="text-2xl font-bold text-amber-600">{frs.errorCount}</div>
                        <div className="text-[0.65rem] text-[#68738A]">Errors Detected</div>
                      </div>
                    </div>
                  </div>

                  {/* Clickable 7 Evaluation Areas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {frs.areas.map((area) => {
                      const isSelected = selectedIssueId === area.id;
                      const isIssue = area.status === 'issue';
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => handleSelectIssue(area)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#5368EA] bg-[#DDEBFF]/30'
                              : 'border-[#E9EAF2] bg-[#FAFBFF] hover:bg-white'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold text-[#171A2E]">{area.name}</div>
                            <div className="text-[0.68rem] text-[#68738A] mt-0.5">
                              {isIssue ? 'Click to fix issue' : 'Complete'}
                            </div>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              isIssue
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {area.score}/{area.maxScore}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* ONE-BY-ONE Improvement Panel */}
                  {activeIssue && (
                    <div className="p-5 rounded-2xl border border-[#5368EA]/30 bg-[#FAFBFF] space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#171A2E]">
                          {activeIssue.name}
                        </h3>
                        <span className="text-xs font-medium text-[#5368EA]">
                          {activeIssue.score}/{activeIssue.maxScore} pts
                        </span>
                      </div>

                      <div className="text-xs text-[#68738A] space-y-1.5">
                        <p>
                          <strong className="text-[#171A2E]">Missing Information:</strong>{' '}
                          {activeIssue.missingInfo}
                        </p>
                        <p>
                          <strong className="text-[#171A2E]">Suggested Improvement:</strong>{' '}
                          {activeIssue.suggestedImprovement}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
                          AI-Generated Content (Review &amp; Edit Before Approval)
                        </label>
                        <textarea
                          rows={3}
                          value={editableFix}
                          onChange={(e) => setEditableFix(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-white text-xs text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleApproveFix}
                          disabled={applyingFix}
                          className="btn-waou-gradient px-5 py-2 text-xs inline-flex items-center gap-1.5"
                        >
                          {applyingFix ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>Approve &amp; Recalculate Score</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: PITCH DECK CREATION & STRATEGY WORKFLOW (5 STEPS ONLY — NO FINANCIAL FORECAST/RUNWAY) */}
          {activeSection === 'strategy' && (
            <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 space-y-6">
              <div>
                <h1 className="text-xl font-semibold text-[#171A2E]">
                  Pitch Deck Creation &amp; Strategy Workflow
                </h1>
                <p className="text-xs text-[#68738A] mt-1">
                  Complete the 5-step sequence: GTM Strategy, Revenue Model, Stage Slides, Team
                  &amp; Advisors, and Final / Closing Slide.
                </p>
              </div>

              {/* 5-Step Selector */}
              <div className="flex flex-wrap gap-2">
                {[
                  { num: 1, label: '1. GTM Strategy' },
                  { num: 2, label: '2. Revenue Model' },
                  { num: 3, label: '3. Stage Slides' },
                  { num: 4, label: '4. Team & Advisors' },
                  { num: 5, label: '5. Final / Closing Slide' },
                ].map((s) => (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      setStrategyStep(s.num);
                      setStrategySavedMsg(null);
                    }}
                    className={`px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                      strategyStep === s.num
                        ? 'bg-[#5368EA] text-white'
                        : 'bg-[#FAFBFF] border border-[#E9EAF2] text-[#68738A] hover:text-[#171A2E]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Step 1: GTM Strategy */}
              {strategyStep === 1 && (
                <div className="space-y-4">
                  <label className="block text-xs font-medium text-[#171A2E]">
                    Go-To-Market (GTM) Strategy
                  </label>
                  <textarea
                    rows={5}
                    value={strategy.gtmStrategy}
                    onChange={(e) =>
                      setStrategy((prev) => ({ ...prev, gtmStrategy: e.target.value }))
                    }
                    placeholder="Outline your primary acquisition channels, target customer segments, and initial distribution rollout..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveStrategyStep}
                      disabled={savingStrategy}
                      className="btn-waou-gradient px-5 py-2.5 text-xs"
                    >
                      {savingStrategy ? 'Saving...' : 'Save GTM Strategy'}
                    </button>
                    {strategySavedMsg && (
                      <span className="text-xs text-emerald-600 font-medium">{strategySavedMsg}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Revenue Model */}
              {strategyStep === 2 && (
                <div className="space-y-4">
                  <label className="block text-xs font-medium text-[#171A2E]">
                    Revenue Model
                  </label>
                  <textarea
                    rows={5}
                    value={strategy.revenueModel}
                    onChange={(e) =>
                      setStrategy((prev) => ({ ...prev, revenueModel: e.target.value }))
                    }
                    placeholder="Describe your pricing tiers, transaction fees, or subscription structure..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
                  />
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveStrategyStep}
                      disabled={savingStrategy}
                      className="btn-waou-gradient px-5 py-2.5 text-xs"
                    >
                      {savingStrategy ? 'Saving...' : 'Save Revenue Model'}
                    </button>
                    {strategySavedMsg && (
                      <span className="text-xs text-emerald-600 font-medium">{strategySavedMsg}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Additional slides based on startup's stage */}
              {strategyStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
                      Startup Stage
                    </label>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
                    >
                      <option value="Idea / Solopreneur">Idea / Solopreneur</option>
                      <option value="Pre-Seed">Pre-Seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
                      Stage-Specific Additional Slides
                    </label>
                    <textarea
                      rows={5}
                      value={strategy.stageSlides}
                      onChange={(e) =>
                        setStrategy((prev) => ({ ...prev, stageSlides: e.target.value }))
                      }
                      placeholder={`Add ${stage}-appropriate slides (e.g., Product Roadmap, Regulatory Readiness, Key Partnerships)...`}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSaveStrategyStep}
                      disabled={savingStrategy}
                      className="btn-waou-gradient px-5 py-2.5 text-xs"
                    >
                      {savingStrategy ? 'Saving...' : 'Save Stage Slides'}
                    </button>
                    {strategySavedMsg && (
                      <span className="text-xs text-emerald-600 font-medium">{strategySavedMsg}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Team & Advisors + Automated Email Collaboration Invite */}
              {strategyStep === 4 && (
                <div className="space-y-6">
                  <form onSubmit={handleInviteMember} className="space-y-3 p-4 rounded-2xl bg-[#FAFBFF] border border-[#E9EAF2]">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#171A2E]">
                      <Users className="w-4 h-4 text-[#5368EA]" />
                      <span>Add Team Member or Advisor</span>
                    </div>

                    {inviteMsg && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                        {inviteMsg}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="Name"
                        className="px-3 py-2 rounded-xl border border-[#E9EAF2] bg-white text-xs"
                      />
                      <input
                        type="url"
                        value={memberLinkedin}
                        onChange={(e) => setMemberLinkedin(e.target.value)}
                        placeholder="LinkedIn Profile URL"
                        className="px-3 py-2 rounded-xl border border-[#E9EAF2] bg-white text-xs"
                      />
                      <input
                        type="text"
                        required
                        value={memberRole}
                        onChange={(e) => setMemberRole(e.target.value)}
                        placeholder="Role (e.g. Co-Founder, Advisor)"
                        className="px-3 py-2 rounded-xl border border-[#E9EAF2] bg-white text-xs"
                      />
                      <input
                        type="email"
                        required
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="Email ID"
                        className="px-3 py-2 rounded-xl border border-[#E9EAF2] bg-white text-xs"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-xs text-[#68738A] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendInvite}
                        onChange={(e) => setSendInvite(e.target.checked)}
                        className="accent-[#5368EA]"
                      />
                      <span>Send automated collaboration invitation email</span>
                    </label>

                    <button
                      type="submit"
                      disabled={inviting}
                      className="btn-waou-gradient px-5 py-2 text-xs inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{inviting ? 'Sending...' : 'Add & Invite'}</span>
                    </button>
                  </form>

                  {strategy.teamAdvisors.length > 0 && (
                    <div className="divide-y divide-[#E9EAF2] border border-[#E9EAF2] rounded-2xl overflow-hidden">
                      {strategy.teamAdvisors.map((m) => (
                        <div key={m.id} className="p-3.5 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold text-[#171A2E]">
                              {m.name} — <span className="text-[#5368EA]">{m.role}</span>
                            </div>
                            <div className="text-[#68738A] mt-0.5">{m.email}</div>
                          </div>
                          <span className="text-[0.68rem] px-2.5 py-0.5 rounded-full bg-[#DDEBFF]/60 text-[#5368EA]">
                            {m.invited ? 'Invited' : 'Added'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Final / Closing Slide */}
              {strategyStep === 5 && (
                <div className="space-y-5 p-5 rounded-2xl bg-[#FAFBFF] border border-[#E9EAF2]">
                  <div>
                    <div className="text-xs font-semibold text-[#171A2E] mb-2">
                      Does your company have a logo?
                    </div>
                    <div className="flex gap-3 max-w-xs">
                      <button
                        type="button"
                        onClick={() => handleLogoChoice(true)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-medium ${
                          strategy.hasLogo === true
                            ? 'border-[#5368EA] bg-[#DDEBFF]/50 text-[#5368EA]'
                            : 'border-[#E9EAF2] bg-white text-[#68738A]'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLogoChoice(false)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-medium ${
                          strategy.hasLogo === false
                            ? 'border-[#5368EA] bg-[#DDEBFF]/50 text-[#5368EA]'
                            : 'border-[#E9EAF2] bg-white text-[#68738A]'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {strategy.hasLogo === false && (
                    <div>
                      <button
                        type="button"
                        onClick={handleGenerateAiLogo}
                        disabled={generatingLogo}
                        className="btn-waou-gradient px-5 py-2.5 text-xs inline-flex items-center gap-2"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>{generatingLogo ? 'Generating Logo...' : 'Generate AI Logo'}</span>
                      </button>
                    </div>
                  )}

                  {(user?.companyLogoUrl || strategy.closingLogoUrl) && (
                    <div className="p-6 rounded-2xl bg-white border border-[#E9EAF2] text-center space-y-3">
                      <Image
                        src={strategy.closingLogoUrl || user?.companyLogoUrl || '/logo.png'}
                        alt="Company Logo"
                        width={64}
                        height={64}
                        className="mx-auto rounded-2xl border border-[#E9EAF2]"
                      />
                      <div className="text-base font-semibold text-[#171A2E]">
                        {user?.companyName || 'Your Venture'}
                      </div>
                      <div className="text-xs text-[#68738A]">
                        Thank You • Contact: {user?.email}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: COMPETITOR ANALYSIS & AI SOLUTION IMPROVEMENT */}
          {activeSection === 'competitors' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 space-y-5">
                <div>
                  <h1 className="text-xl font-semibold text-[#171A2E]">
                    Competitor Analysis &amp; AI Solution Improvement
                  </h1>
                  <p className="text-xs text-[#68738A] mt-1">
                    Identify 3 to 15 nearby or relevant competitors with their website URLs. WaoU AI
                    researches their offerings, suggests an improved Solution Slide, and generates
                    your Competitor Analysis, TAM / SAM / SOM, and Business Model &amp; Unit
                    Economics slides.
                  </p>
                </div>

                {competitorError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{competitorError}</span>
                  </div>
                )}

                <form onSubmit={handleAnalyzeCompetitors} className="space-y-3">
                  {competitorInputs.map((comp, idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                      <input
                        type="text"
                        required
                        value={comp.name}
                        onChange={(e) => {
                          const next = [...competitorInputs];
                          next[idx].name = e.target.value;
                          setCompetitorInputs(next);
                        }}
                        placeholder={`Competitor ${idx + 1} Name`}
                        className="sm:col-span-5 px-3 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-xs"
                      />
                      <input
                        type="text"
                        required
                        value={comp.url}
                        onChange={(e) => {
                          const next = [...competitorInputs];
                          next[idx].url = e.target.value;
                          setCompetitorInputs(next);
                        }}
                        placeholder="https://competitor.com"
                        className="sm:col-span-6 px-3 py-2 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-xs"
                      />
                      {competitorInputs.length > 3 && (
                        <button
                          type="button"
                          onClick={() =>
                            setCompetitorInputs(competitorInputs.filter((_, i) => i !== idx))
                          }
                          className="sm:col-span-1 p-2 text-[#68738A] hover:text-red-600"
                          aria-label="Remove competitor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {competitorInputs.length < 15 && (
                      <button
                        type="button"
                        onClick={() =>
                          setCompetitorInputs([...competitorInputs, { name: '', url: '' }])
                        }
                        className="btn-waou-outline px-4 py-2 text-xs inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Competitor ({competitorInputs.length}/15)</span>
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={analyzingCompetitors}
                      className="btn-waou-gradient px-6 py-2.5 text-xs inline-flex items-center gap-2"
                    >
                      {analyzingCompetitors ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Researching Competitors...</span>
                        </>
                      ) : (
                        <span>Research &amp; Generate Slides</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Generated Solution Slide & USP/Moat Approval */}
              {strategy.improvedSolutionSlide && (
                <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 space-y-5">
                  <div>
                    <h2 className="text-base font-semibold text-[#171A2E]">
                      Improved Solution Slide
                    </h2>
                    <pre className="mt-2 p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2] text-xs text-[#171A2E] whitespace-pre-wrap font-sans leading-relaxed">
                      {strategy.improvedSolutionSlide}
                    </pre>
                  </div>

                  {/* Ask whether founder wants to change USP and Moat (Yes / No) */}
                  <div className="p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2] space-y-3">
                    <div className="text-xs font-semibold text-[#171A2E]">
                      Do you want to change your USP and Moat based on this competitor analysis?
                    </div>
                    <textarea
                      rows={2}
                      value={proposedUsp}
                      onChange={(e) => setProposedUsp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E9EAF2] bg-white text-xs text-[#171A2E]"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleUspMoatDecision(true)}
                        className="btn-waou-gradient px-4 py-2 text-xs"
                      >
                        Yes — Approve &amp; Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUspMoatDecision(false)}
                        className="btn-waou-outline px-4 py-2 text-xs"
                      >
                        No — Keep Current
                      </button>
                    </div>
                    {uspSavedMsg && (
                      <p className="text-xs text-emerald-600 font-medium">{uspSavedMsg}</p>
                    )}
                  </div>

                  {/* Generated Slides: Competitor Analysis, TAM/SAM/SOM, Business Model & Unit Economics */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5368EA] mb-1.5">
                        Slide: Competitor Analysis
                      </h3>
                      <pre className="p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2] text-xs text-[#171A2E] whitespace-pre-wrap font-sans leading-relaxed">
                        {strategy.generatedSlides.competitorAnalysis}
                      </pre>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5368EA] mb-1.5">
                        Slide: TAM / SAM / SOM
                      </h3>
                      <pre className="p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2] text-xs text-[#171A2E] whitespace-pre-wrap font-sans leading-relaxed">
                        {strategy.generatedSlides.tamSamSom}
                      </pre>
                    </div>

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#5368EA] mb-1.5">
                        Slide: Business Model &amp; Unit Economics
                      </h3>
                      <pre className="p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2] text-xs text-[#171A2E] whitespace-pre-wrap font-sans leading-relaxed">
                        {strategy.generatedSlides.businessModelUnitEconomics}
                      </pre>
                    </div>

                    {/* Traction / Retention remains HIDDEN by default */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowTractionHidden((prev) => !prev)}
                        className="text-xs text-[#68738A] hover:text-[#171A2E] underline"
                      >
                        {showTractionHidden
                          ? 'Hide Traction / Retention'
                          : 'Traction / Retention (Hidden by default)'}
                      </button>
                      {showTractionHidden && (
                        <div className="mt-2 p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2] text-xs text-[#68738A]">
                          Traction / Retention slide is hidden by default until explicitly enabled
                          by the founder.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
