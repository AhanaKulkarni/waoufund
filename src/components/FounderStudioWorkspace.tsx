'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Sliders,
  FileText,
  Mic,
  Calculator,
  FolderLock,
  PieChart,
  Scale,
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Shield,
  Hash,
  Activity,
  FileCheck,
} from 'lucide-react';

interface FounderStudioWorkspaceProps {
  initialTab?: string;
  onBackToHome: () => void;
}

export default function FounderStudioWorkspace({
  initialTab = 'dashboard',
  onBackToHome,
}: FounderStudioWorkspaceProps) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Fundability Vector Interactive state
  const [finScore, setFinScore] = useState(85);
  const [tamScore, setTamScore] = useState(90);
  const [tractionScore, setTractionScore] = useState(78);
  const [moatScore, setMoatScore] = useState(82);
  const [diligenceScore, setDiligenceScore] = useState(88);

  const weightedFundability = Math.round(
    finScore * 0.3 +
      tamScore * 0.25 +
      tractionScore * 0.2 +
      moatScore * 0.15 +
      diligenceScore * 0.1
  );

  // Deck Diagnostic State
  const [deckName, setDeckName] = useState('Seed_Pitch_Deck_v4.2.pdf');
  const [deckScore, setDeckScore] = useState(86);
  const [analyzingDeck, setAnalyzingDeck] = useState(false);

  // Investor Grill State
  const [isGrilling, setIsGrilling] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const grillQuestions = [
    {
      partner: 'Devang Raja (Institutional VC Partner)',
      question:
        'Walk me through your CAC payback period. Why is your blended CAC 35% lower than current industry benchmarks?',
      context: 'Unit Economics & Customer Acquisition',
    },
    {
      partner: 'Elena Vance (DeepTech Syndicate Lead)',
      question:
        'What prevents Microsoft or OpenAI from rolling this feature into their standard subscription within 6 months?',
      context: 'Defensibility & Moats',
    },
    {
      partner: 'Marcus Sterling (Series-A Lead Partner)',
      question:
        'Your Net Revenue Retention is projected at 135%. What customer cohorts justify that expansion rate without heavy services?',
      context: 'Retention & Revenue Quality',
    },
  ];

  // Financial Model State
  const [mrr, setMrr] = useState(45000);
  const [burn, setBurn] = useState(22000);
  const [cashBalance, setCashBalance] = useState(380000);
  const runwayMonths = Math.max(1, Math.round(cashBalance / Math.max(1000, burn - mrr * 0.75)));

  // Data Room documents checklist
  const [dataRoomDocs, setDataRoomDocs] = useState([
    { name: 'Certificate of Incorporation.pdf', category: 'Corporate', verified: true, sha: 'e3b0c44298fc1c149afb' },
    { name: 'Cap_Table_Fully_Diluted_2026.xlsx', category: 'Finance', verified: true, sha: '9f86d081884c7d659a2f' },
    { name: 'YC_Post_Money_SAFE_Signed.pdf', category: 'Legal', verified: true, sha: '5e884898da28047151d0' },
    { name: 'Customer_Cohort_Retention_Audit.csv', category: 'Traction', verified: true, sha: '4b227777d4dd1fc61c6f' },
    { name: 'Core_Patent_IP_Assignment_Deed.pdf', category: 'IP', verified: false, sha: '7d793037a0760186574b' },
  ]);

  const toggleDocVerification = (idx: number) => {
    const updated = [...dataRoomDocs];
    updated[idx].verified = !updated[idx].verified;
    setDataRoomDocs(updated);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Fundability Audit', icon: Sliders },
    { id: 'blueprint', label: 'Idea Blueprint', icon: Sparkles },
    { id: 'diagnostic', label: 'Deck Diagnostic', icon: FileText },
    { id: 'grill', label: 'AI Investor Grill', icon: Mic },
    { id: 'finance', label: 'Financial Command', icon: Calculator },
    { id: 'dataroom', label: 'Virtual Data Room', icon: FolderLock },
    { id: 'market', label: 'Market & TAM', icon: PieChart },
    { id: 'legaldocs', label: 'Legal Standards', icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF] flex flex-col text-[#171C2F]">
      {/* Top Workspace Bar */}
      <header className="border-b border-[#E6EAF2] bg-white sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-semibold text-[#69748A] hover:text-[#171C2F] px-3 py-1.5 rounded-full hover:bg-[#F8FAFF] border border-[#E6EAF2] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </button>
          <div className="h-4 w-[1px] bg-[#E6EAF2]" />
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="WaoU Fund Logo" width={28} height={28} className="rounded-lg border border-[#E6EAF2]" />
            <span className="font-bold text-sm tracking-tight">Founder Studio</span>
            <span className="px-2 py-0.5 rounded-full bg-[#EAE5FF] text-[#5268E8] text-[0.68rem] font-bold tracking-wide uppercase">
              Pro Workspace
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#69748A] bg-[#F8FAFF] px-3 py-1.5 rounded-full border border-[#E6EAF2]">
            <Activity className="w-3.5 h-3.5 text-[#5268E8]" />
            <span>Fundability: <strong className="text-[#171C2F]">{weightedFundability}/100</strong></span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5268E8] to-[#8271ED] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            WF
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 gap-6">
        {/* Left Workspace Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E6EAF2] p-2 space-y-1 shadow-sm sticky top-24">
            <div className="px-3 py-2 text-[0.7rem] font-bold text-[#69748A] uppercase tracking-wider">
              Venture Intelligence
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-[#E0EDFF] text-[#5268E8] shadow-xs'
                      : 'text-[#69748A] hover:bg-[#F8FAFF] hover:text-[#171C2F]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#5268E8]' : 'text-[#69748A]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Workspace Active View Panel */}
        <main className="flex-1">
          {/* TAB 1: FUNDABILITY AUDIT */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6EAF2]">
                  <div>
                    <span className="text-xs font-semibold text-[#5268E8] uppercase tracking-wider">
                      5-Vector Institutional Audit
                    </span>
                    <h2 className="text-2xl font-bold text-[#171C2F] mt-1">
                      Startup Fundability Scorecard
                    </h2>
                    <p className="text-sm text-[#69748A] mt-1">
                      Benchmarked against 10,000+ institutional seed and Series-A underwriting precedents.
                    </p>
                  </div>
                  <div className="text-center sm:text-right bg-[#F8FAFF] sm:bg-transparent p-4 sm:p-0 rounded-2xl border sm:border-0 border-[#E6EAF2]">
                    <div className="text-4xl sm:text-5xl font-black text-[#5268E8] tracking-tight">
                      {weightedFundability}
                      <span className="text-xl font-normal text-[#69748A]">/100</span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center justify-center sm:justify-end gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Top 8% in Seed Round Batch
                    </div>
                  </div>
                </div>

                {/* 5 Vectors Sliders */}
                <div className="pt-6 space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-[#171C2F]">1. Financial Health & Runway (Weight: 30%)</span>
                      <span className="text-[#5268E8]">{finScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={finScore}
                      onChange={(e) => setFinScore(Number(e.target.value))}
                      className="w-full accent-[#5268E8]"
                    />
                    <div className="text-[0.72rem] text-[#69748A]">
                      Evaluating 14+ mos default runway, gross margins &gt;75%, deterministic burn containment.
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-[#171C2F]">2. Market Opportunity & TAM (Weight: 25%)</span>
                      <span className="text-[#5268E8]">{tamScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={tamScore}
                      onChange={(e) => setTamScore(Number(e.target.value))}
                      className="w-full accent-[#5268E8]"
                    />
                    <div className="text-[0.72rem] text-[#69748A]">
                      Serviceable Obtainable Market &gt;$500M with top-down and bottom-up validation.
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-[#171C2F]">3. Traction & Retention (Weight: 20%)</span>
                      <span className="text-[#5268E8]">{tractionScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={tractionScore}
                      onChange={(e) => setTractionScore(Number(e.target.value))}
                      className="w-full accent-[#5268E8]"
                    />
                    <div className="text-[0.72rem] text-[#69748A]">
                      MoM revenue velocity, cohort retention curves, and validated pilot renewals.
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-[#171C2F]">4. Team Pedigree & Moats (Weight: 15%)</span>
                      <span className="text-[#5268E8]">{moatScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={moatScore}
                      onChange={(e) => setMoatScore(Number(e.target.value))}
                      className="w-full accent-[#5268E8]"
                    />
                    <div className="text-[0.72rem] text-[#69748A]">
                      Domain authority, founder-market fit, proprietary IP, and high switching friction.
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-[#171C2F]">5. Due Diligence Readiness (Weight: 10%)</span>
                      <span className="text-[#5268E8]">{diligenceScore}/100</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={diligenceScore}
                      onChange={(e) => setDiligenceScore(Number(e.target.value))}
                      className="w-full accent-[#5268E8]"
                    />
                    <div className="text-[0.72rem] text-[#69748A]">
                      Clean corporate charter, SHA-256 stamped data room, standard SAFE legal contracts.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDEA BLUEPRINT */}
          {activeTab === 'blueprint' && (
            <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#5268E8] uppercase tracking-wider">
                  Venture Roadmap Engine
                </span>
                <h2 className="text-2xl font-bold text-[#171C2F] mt-1">Idea & Execution Blueprint</h2>
                <p className="text-sm text-[#69748A]">
                  Strategic execution milestones designed to systematically derisk key venture vectors.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-[#E6EAF2] bg-[#F8FAFF]">
                  <div className="text-xs font-bold text-[#5268E8] uppercase tracking-wider mb-2">Phase 1: Months 1–3</div>
                  <h3 className="font-bold text-sm text-[#171C2F] mb-1">Architecture & Alpha Cohort</h3>
                  <ul className="text-xs text-[#69748A] space-y-1.5 mt-2">
                    <li>• Deploy core microservices & telemetry</li>
                    <li>• Secure 5 design partner LOIs</li>
                    <li>• Implement deterministic usage logs</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl border border-[#E6EAF2] bg-[#F8FAFF]">
                  <div className="text-xs font-bold text-[#8271ED] uppercase tracking-wider mb-2">Phase 2: Months 4–6</div>
                  <h3 className="font-bold text-sm text-[#171C2F] mb-1">Monetization & Pilot Conversions</h3>
                  <ul className="text-xs text-[#69748A] space-y-1.5 mt-2">
                    <li>• Convert 4 LOIs to paid contracts</li>
                    <li>• Establish CAC &lt; $450 channel</li>
                    <li>• Finalize SOC2 Type 1 preparation</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl border border-[#E6EAF2] bg-[#F8FAFF]">
                  <div className="text-xs font-bold text-[#5268E8] uppercase tracking-wider mb-2">Phase 3: Months 7–12</div>
                  <h3 className="font-bold text-sm text-[#171C2F] mb-1">Institutional Seed Acceleration</h3>
                  <ul className="text-xs text-[#69748A] space-y-1.5 mt-2">
                    <li>• Achieve $50k MRR at &gt;80% margin</li>
                    <li>• Open Virtual Data Room to leads</li>
                    <li>• Execute YC Post-Money SAFE round</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DECK DIAGNOSTIC */}
          {activeTab === 'diagnostic' && (
            <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#5268E8] uppercase tracking-wider">
                    Multimodal Presentation Parser
                  </span>
                  <h2 className="text-2xl font-bold text-[#171C2F] mt-1">AI Pitch Deck Diagnostic</h2>
                  <p className="text-sm text-[#69748A]">
                    Benchmarked slide-by-slide against 10,000+ funded seed and Series-A presentations.
                  </p>
                </div>
                <div className="bg-[#E0EDFF] text-[#5268E8] px-4 py-2 rounded-2xl font-bold text-xl">
                  {deckScore}/100 Score
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-dashed border-[#5268E8]/40 bg-[#F8FAFF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E0EDFF] text-[#5268E8] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#171C2F]">{deckName}</div>
                    <div className="text-xs text-[#69748A]">12 slides • 8.4 MB • Vector Geometry Verified</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAnalyzingDeck(true);
                    setTimeout(() => {
                      setAnalyzingDeck(false);
                      setDeckScore(89);
                    }, 1200);
                  }}
                  className="px-4 py-2 rounded-full bg-[#5268E8] text-white text-xs font-semibold hover:bg-[#4358d6] transition-colors"
                >
                  {analyzingDeck ? 'Analyzing Slides...' : 'Re-Diagnose Deck'}
                </button>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#171C2F] uppercase tracking-wider">
                  Automated Slide Vector Diagnostics
                </h4>
                <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-emerald-900">
                    <strong>Slide 3 (TAM):</strong> Clean top-down & bottom-up split. Passes institutional venture sanity checks.
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-amber-900">
                    <strong>Slide 7 (Unit Economics):</strong> CAC calculation omits SDR payroll allocations. Recommend adjusting blended CAC formula.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INVESTOR GRILL */}
          {activeTab === 'grill' && (
            <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-[#5268E8] uppercase tracking-wider">
                    Voice-Interactive Partner Interrogation
                  </span>
                  <h2 className="text-2xl font-bold text-[#171C2F] mt-1">AI Investor Grill</h2>
                  <p className="text-sm text-[#69748A]">
                    Simulate partner-level Call 1 interrogations. Stress-test unit economics and defend your moats.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  Simulation Active
                </span>
              </div>

              {/* Question Card */}
              <div className="p-5 rounded-2xl border border-[#E6EAF2] bg-[#F8FAFF] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#5268E8] uppercase tracking-wider">
                    {grillQuestions[currentQuestionIndex].context}
                  </span>
                  <span className="text-[#69748A]">
                    Question {currentQuestionIndex + 1} of {grillQuestions.length}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#69748A]">
                  Interrogator: {grillQuestions[currentQuestionIndex].partner}
                </div>
                <p className="text-base font-semibold text-[#171C2F] leading-snug">
                  &ldquo;{grillQuestions[currentQuestionIndex].question}&rdquo;
                </p>

                {/* Animated Waveform Visual */}
                <div className="flex items-center gap-1.5 h-8 pt-2">
                  {[12, 24, 16, 28, 20, 10, 22, 14, 26, 18, 12, 20, 16].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#5268E8] rounded-full"
                      style={{
                        height: `${h}px`,
                        animation: isGrilling ? `pulseWave 1s infinite ${i * 0.1}s` : 'none',
                      }}
                    />
                  ))}
                  <span className="text-[0.72rem] text-[#69748A] ml-2">Voice stream active</span>
                </div>
              </div>

              {/* Founder Response Input */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#171C2F] uppercase tracking-wider">
                  Your Defense / Response
                </label>
                <textarea
                  rows={3}
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type or speak your answer: e.g. Our inbound organic pipeline accounts for 62% of lead volume through proprietary developer tooling, reducing paid acquisition load..."
                  className="w-full p-4 rounded-xl border border-[#E6EAF2] bg-[#F8FAFF] text-xs text-[#171C2F] focus:outline-none focus:ring-2 focus:ring-[#5268E8]/20 focus:border-[#5268E8]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsGrilling(!isGrilling);
                    }}
                    className={`px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all ${
                      isGrilling
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-white text-[#171C2F] border-[#E6EAF2] hover:bg-[#F8FAFF]'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isGrilling ? 'Mute Interrogator' : 'Start Voice Simulation'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setFeedbackGiven(true);
                    }}
                    className="px-5 py-2.5 rounded-full bg-[#5268E8] text-white text-xs font-semibold hover:bg-[#4358d6] transition-colors"
                  >
                    Evaluate Defense
                  </button>
                  <button
                    onClick={() => {
                      setCurrentQuestionIndex((prev) => (prev + 1) % grillQuestions.length);
                      setUserResponse('');
                      setFeedbackGiven(false);
                    }}
                    className="px-4 py-2.5 rounded-full bg-white text-[#69748A] border border-[#E6EAF2] text-xs font-semibold hover:text-[#171C2F]"
                  >
                    Next Question →
                  </button>
                </div>

                {feedbackGiven && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Clarity Score: 92% • Strong Defensibility
                    </div>
                    <p className="text-emerald-800">
                      Clear quantitative defense of organic channel efficiency. Recommended follow-up: state exact cohort retention at month 6.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: FINANCIAL COMMAND */}
          {activeTab === 'finance' && (
            <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#5268E8] uppercase tracking-wider">
                    5-Year Deterministic Engine
                  </span>
                  <h2 className="text-2xl font-bold text-[#171C2F] mt-1">Financial Command Center</h2>
                  <p className="text-sm text-[#69748A]">
                    Interconnected P&L, Cash Flow, and sensitivity scenario runway modeling.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#69748A]">Runway:</span>
                  <span className="text-xl font-black text-[#5268E8]">{runwayMonths} Months</span>
                </div>
              </div>

              {/* Interactive Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F8FAFF] border border-[#E6EAF2]">
                <div>
                  <label className="text-xs font-bold text-[#171C2F] block mb-1">
                    Current MRR: ${mrr.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="150000"
                    step="5000"
                    value={mrr}
                    onChange={(e) => setMrr(Number(e.target.value))}
                    className="w-full accent-[#5268E8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171C2F] block mb-1">
                    Monthly Gross Burn: ${burn.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="100000"
                    step="2000"
                    value={burn}
                    onChange={(e) => setBurn(Number(e.target.value))}
                    className="w-full accent-[#5268E8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#171C2F] block mb-1">
                    Cash in Bank: ${cashBalance.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="25000"
                    value={cashBalance}
                    onChange={(e) => setCashBalance(Number(e.target.value))}
                    className="w-full accent-[#5268E8]"
                  />
                </div>
              </div>

              {/* Financial Summary Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFF] border-b border-[#E6EAF2] text-[#69748A]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Financial Vector</th>
                      <th className="py-2.5 px-3 font-semibold">Month 1</th>
                      <th className="py-2.5 px-3 font-semibold">Month 6</th>
                      <th className="py-2.5 px-3 font-semibold">Month 12</th>
                      <th className="py-2.5 px-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6EAF2]">
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-[#171C2F]">Recognized Revenue</td>
                      <td className="py-2.5 px-3">${mrr.toLocaleString()}</td>
                      <td className="py-2.5 px-3">${Math.round(mrr * 1.6).toLocaleString()}</td>
                      <td className="py-2.5 px-3">${Math.round(mrr * 2.8).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-bold">Healthy</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-[#171C2F]">Total Operating Expenses</td>
                      <td className="py-2.5 px-3">${burn.toLocaleString()}</td>
                      <td className="py-2.5 px-3">${Math.round(burn * 1.3).toLocaleString()}</td>
                      <td className="py-2.5 px-3">${Math.round(burn * 1.8).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-[#5268E8] font-bold">Controlled</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-medium text-[#171C2F]">Net Cash Flow</td>
                      <td className="py-2.5 px-3 text-amber-600">-${Math.max(0, burn - mrr).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-amber-600">-${Math.max(0, Math.round(burn * 1.3 - mrr * 1.6)).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-emerald-600">+${Math.max(0, Math.round(mrr * 2.8 - burn * 1.8)).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-bold">Inflection M11</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: VIRTUAL DATA ROOM */}
          {activeTab === 'dataroom' && (
            <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#5268E8] uppercase tracking-wider">
                    Institutional Vault
                  </span>
                  <h2 className="text-2xl font-bold text-[#171C2F] mt-1">Virtual Data Room</h2>
                  <p className="text-sm text-[#69748A]">
                    Stage-aware due diligence repository with cryptographic SHA-256 hash stamping.
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <Shield className="w-3.5 h-3.5" />
                  Diligence Clearance: 80%
                </div>
              </div>

              <div className="divide-y divide-[#E6EAF2] border border-[#E6EAF2] rounded-2xl overflow-hidden">
                {dataRoomDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 flex items-center justify-between bg-white hover:bg-[#F8FAFF] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileCheck
                        className={`w-5 h-5 ${doc.verified ? 'text-emerald-600' : 'text-[#69748A]'}`}
                      />
                      <div>
                        <div className="text-xs font-bold text-[#171C2F]">{doc.name}</div>
                        <div className="text-[0.7rem] text-[#69748A] flex items-center gap-2 mt-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-[#EAE5FF] text-[#5268E8] font-semibold">
                            {doc.category}
                          </span>
                          <span className="font-mono flex items-center gap-1">
                            <Hash className="w-3 h-3 text-[#69748A]" />
                            SHA-256: {doc.sha}...
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDocVerification(idx)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        doc.verified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#E6EAF2] text-[#69748A] hover:bg-[#D3DBEE]'
                      }`}
                    >
                      {doc.verified ? 'Verified' : 'Pending Review'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MARKET & TAM */}
          {activeTab === 'market' && (
            <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#5268E8] uppercase tracking-wider">
                  Opportunity Sizing
                </span>
                <h2 className="text-2xl font-bold text-[#171C2F] mt-1">Market & TAM Intelligence</h2>
                <p className="text-sm text-[#69748A]">
                  Top-down and bottom-up market sizing models formatted for institutional pitch decks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#F8FAFF] border border-[#E6EAF2] text-center">
                  <div className="text-xs font-bold text-[#69748A] uppercase tracking-wider">Total Addressable (TAM)</div>
                  <div className="text-3xl font-black text-[#5268E8] mt-2">$14.2B</div>
                  <div className="text-[0.72rem] text-[#69748A] mt-1">Global SaaS & Venture Intelligence</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#F8FAFF] border border-[#E6EAF2] text-center">
                  <div className="text-xs font-bold text-[#69748A] uppercase tracking-wider">Serviceable Available (SAM)</div>
                  <div className="text-3xl font-black text-[#8271ED] mt-2">$3.8B</div>
                  <div className="text-[0.72rem] text-[#69748A] mt-1">Early-Stage Venture Ecosystems</div>
                </div>
                <div className="p-5 rounded-2xl bg-[#F8FAFF] border border-[#E6EAF2] text-center">
                  <div className="text-xs font-bold text-[#69748A] uppercase tracking-wider">Serviceable Obtainable (SOM)</div>
                  <div className="text-3xl font-black text-emerald-600 mt-2">$420M</div>
                  <div className="text-[0.72rem] text-[#69748A] mt-1">Target 3-Year Capture</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: LEGAL STANDARDS */}
          {activeTab === 'legaldocs' && (
            <div className="bg-white rounded-3xl border border-[#E6EAF2] p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#5268E8] uppercase tracking-wider">
                  Contract Templates
                </span>
                <h2 className="text-2xl font-bold text-[#171C2F] mt-1">Legal Standards & SAFE Locker</h2>
                <p className="text-sm text-[#69748A]">
                  Industry-standard fundraising agreements. (Notice: templates require formal legal review prior to signature).
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-[#E6EAF2] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#171C2F]">YC Post-Money SAFE (Valuation Cap)</h4>
                    <p className="text-[0.72rem] text-[#69748A]">Standard Y Combinator Post-Money Safe with Valuation Cap parameter.</p>
                  </div>
                  <button
                    onClick={() => alert('Downloading YC Post-Money SAFE Template...')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E0EDFF] text-[#5268E8] text-xs font-semibold hover:bg-[#d0e3ff] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-[#E6EAF2] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#171C2F]">Founder Vesting & Reverse Dilution Agreement</h4>
                    <p className="text-[0.72rem] text-[#69748A]">4-year vesting schedule with 1-year standard cliff and single-trigger acceleration.</p>
                  </div>
                  <button
                    onClick={() => alert('Downloading Founder Vesting Agreement...')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E0EDFF] text-[#5268E8] text-xs font-semibold hover:bg-[#d0e3ff] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-[#E6EAF2] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#171C2F]">10%–15% ESOP Pool Scheme Manual</h4>
                    <p className="text-[0.72rem] text-[#69748A]">Employee Stock Option Plan policy document configured for early talent retention.</p>
                  </div>
                  <button
                    onClick={() => alert('Downloading ESOP Pool Manual...')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E0EDFF] text-[#5268E8] text-xs font-semibold hover:bg-[#d0e3ff] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
