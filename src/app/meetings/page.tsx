'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import AuthCardShell from '@/components/AuthCardShell';

export default function PartnerInvestorMeetingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleType, setRoleType] = useState('Startup / MSME');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, roleType, preferredDate, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule meeting.');
      setSuccess(data.message || 'Partner Investor Meeting request submitted.');
      setName('');
      setEmail('');
      setPreferredDate('');
      setNotes('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCardShell
      heading="Partner Investor Meetings"
      subheading="Schedule a structured partner session with WaoU Fund."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#171A2E] mb-1">Category</label>
            <select
              value={roleType}
              onChange={(e) => setRoleType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
            >
              <option value="Startup / MSME">Startup / MSME</option>
              <option value="Investor / Lender">Investor / Lender</option>
              <option value="Ecosystem Enabler">Ecosystem Enabler</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#171A2E] mb-1">Preferred Date</label>
            <input
              type="date"
              required
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#171A2E] mb-1">
            Meeting Agenda <span className="text-[#68738A] font-normal">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Briefly describe your fundraising stage or inquiry"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9EAF2] bg-[#FAFBFF] text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-waou-gradient py-3 px-6 text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              <span>Request Partner Meeting</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#68738A] pt-2">
          <Link href="/" className="text-[#5368EA] hover:underline">
            ← Back to WaoU Fund
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
