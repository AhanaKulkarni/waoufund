'use client';

import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (destination: string) => void;
  destination: string;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onSuccess,
  destination,
}: LeadCaptureModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Founder');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setError('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please provide a valid work or personal email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          role,
          companyName: companyName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      // Persist authenticated lead state in localStorage so the user is never repeatedly gated
      localStorage.setItem('waou_lead_registered', 'true');
      localStorage.setItem(
        'waou_lead_profile',
        JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          role,
          companyName: companyName.trim(),
        })
      );

      setIsSuccess(true);

      setTimeout(() => {
        setIsLoading(false);
        onSuccess(destination);
      }, 900);
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'An error occurred during submission.';
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Soft blurred lavender/blue overlay */}
      <div
        className="fixed inset-0 bg-[#171C2F]/25 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E6EAF2] z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#69748A] hover:text-[#171C2F] p-2 rounded-full hover:bg-[#F8FAFF] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-[#E0EDFF] text-[#5268E8] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-[#171C2F]">Welcome to WaoU Fund</h3>
            <p className="text-sm text-[#69748A] max-w-sm mx-auto">
              Your founder profile has been verified. Launching {destination || 'Founder Studio'}...
            </p>
            <div className="pt-2 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#5268E8]" />
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAE5FF] text-[#5268E8] mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                Venture Intelligence Access
              </div>
              <h2 className="text-2xl sm:text-[1.75rem] font-bold text-[#171C2F] tracking-tight leading-snug">
                Let&apos;s Get Your Fundraising Journey Started.
              </h2>
              <p className="text-sm text-[#69748A] mt-2 leading-relaxed">
                Create your WaoU Fund profile to explore intelligent fundraising tools built for ambitious founders.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#171C2F] uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Harrison"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6EAF2] bg-[#F8FAFF] text-sm text-[#171C2F] placeholder:text-[#69748A]/60 focus:outline-none focus:ring-2 focus:ring-[#5268E8]/20 focus:border-[#5268E8] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171C2F] uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@venture.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6EAF2] bg-[#F8FAFF] text-sm text-[#171C2F] placeholder:text-[#69748A]/60 focus:outline-none focus:ring-2 focus:ring-[#5268E8]/20 focus:border-[#5268E8] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#171C2F] uppercase tracking-wider mb-1.5">
                    I am a...
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E6EAF2] bg-[#F8FAFF] text-sm text-[#171C2F] focus:outline-none focus:ring-2 focus:ring-[#5268E8]/20 focus:border-[#5268E8] transition-all"
                  >
                    <option value="Founder">Founder</option>
                    <option value="Investor">Investor</option>
                    <option value="Advisor">Advisor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171C2F] uppercase tracking-wider mb-1.5">
                    Startup Name <span className="text-xs text-[#69748A] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. AetherX AI"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E6EAF2] bg-[#F8FAFF] text-sm text-[#171C2F] placeholder:text-[#69748A]/60 focus:outline-none focus:ring-2 focus:ring-[#5268E8]/20 focus:border-[#5268E8] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#5268E8] hover:bg-[#4358d6] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5268E8]/20 hover:shadow-xl hover:shadow-[#5268E8]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to WaoU Fund</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[0.72rem] text-[#69748A] text-center pt-2 leading-relaxed">
                By submitting, your details will be securely stored to process your registration and unlock
                institutional tools. Confidential and encrypted under institutional standards.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
