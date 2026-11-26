'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Building2, Briefcase, CheckCircle2, AlertCircle, Loader2, LogOut } from 'lucide-react';

interface InvestorUser {
  id: string;
  role: 'startup' | 'investor';
  fullName: string;
  email: string;
  firmName?: string;
  firmDetails?: string;
  portfolio?: string;
  createdAt: string;
}

export default function InvestorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<InvestorUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [firmName, setFirmName] = useState('');
  const [firmDetails, setFirmDetails] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInvestor() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/auth/investor/login');
          return;
        }
        const data = await res.json();
        if (!data.user) {
          router.push('/auth/investor/login');
          return;
        }
        if (data.user.role === 'startup') {
          router.push('/dashboard/startup');
          return;
        }
        setUser(data.user);
        setFirmName(data.user.firmName || '');
        setFirmDetails(data.user.firmDetails || '');
        setPortfolio(data.user.portfolio || '');
      } catch {
        router.push('/auth/investor/login');
      } finally {
        setLoading(false);
      }
    }
    loadInvestor();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(null);
    setSaveError(null);
    setSaving(true);

    try {
      const res = await fetch('/api/investor/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firmName, firmDetails, portfolio }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save changes.');
      }
      setUser(data.user);
      setSaveSuccess('Investor firm and portfolio profile updated.');
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Unable to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#5368EA]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#171A2E] flex flex-col">
      {/* Compact Header */}
      <header className="bg-white border-b border-[#E9EAF2] px-6 sm:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/waou-logo.png"
              alt="WaoU Fund"
              width={140}
              height={45}
              className="h-9 w-auto object-contain"
            />
          </Link>
          <span className="hidden sm:inline-block text-[#E9EAF2]">|</span>
          <span className="hidden sm:inline-block text-xs font-medium text-[#5368EA]">
            Investor Portal
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

      <main className="max-w-4xl w-full mx-auto px-6 sm:px-8 py-10 space-y-6">
        {/* Investor Summary Card */}
        <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#5368EA] uppercase tracking-wider">
              Investor Profile
            </span>
            <h1 className="text-2xl font-semibold text-[#171A2E] mt-1">
              {user?.firmName || 'Investment Firm'}
            </h1>
            <p className="text-sm text-[#68738A] mt-1">
              Partner: {user?.fullName} • {user?.email}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DEFF]/60 text-[#8069EA] text-xs font-medium self-start sm:self-center">
            <Building2 className="w-3.5 h-3.5" />
            <span>Verified Investor Account</span>
          </div>
        </div>

        {/* Manage Firm & Portfolio Form */}
        <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <Briefcase className="w-4 h-4 text-[#5368EA]" />
            <h2 className="text-lg font-semibold text-[#171A2E]">
              Firm Details &amp; Investment Portfolio
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {saveError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
                Investment Firm Name
              </label>
              <input
                type="text"
                required
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
                Firm Details &amp; Investment Mandate
              </label>
              <textarea
                rows={3}
                value={firmDetails}
                onChange={(e) => setFirmDetails(e.target.value)}
                placeholder="Stage focus, check size, and sector mandates"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#171A2E] mb-1.5">
                Investment Portfolio
              </label>
              <textarea
                rows={4}
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="List your active portfolio companies and investments"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm text-[#171A2E] focus:outline-none focus:border-[#5368EA]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-waou-gradient py-2.5 px-6 text-sm inline-flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Investor Profile</span>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
