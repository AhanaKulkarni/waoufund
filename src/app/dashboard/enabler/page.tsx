'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Users, Loader2, LogOut, CheckCircle2 } from 'lucide-react';

interface EnablerUser {
  id: string;
  role: 'consultant' | 'mentor' | 'incubator';
  fullName: string;
  email: string;
  organizationName?: string;
  linkedinProfile?: string;
  expertiseDetails?: string;
}

const ROLE_TITLES: Record<string, string> = {
  consultant: 'Consultant',
  mentor: 'Mentor',
  incubator: 'Incubator',
};

export default function EnablerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<EnablerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/');
          return;
        }
        const data = await res.json();
        if (!data.user) {
          router.push('/');
          return;
        }
        if (data.user.role === 'startup') {
          router.push('/dashboard/startup');
          return;
        }
        if (data.user.role === 'investor') {
          router.push('/dashboard/investor');
          return;
        }
        setUser(data.user);
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
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
      <header className="bg-white border-b border-[#E9EAF2] px-6 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/waou-logo.png"
            alt="WaoU Fund"
            width={140}
            height={45}
            className="h-9 w-auto object-contain"
          />
        </Link>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#68738A] hover:text-[#171A2E] px-3 py-1.5 rounded-full border border-[#E9EAF2]"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </header>

      <main className="max-w-3xl w-full mx-auto px-6 sm:px-8 py-10">
        <div className="bg-white rounded-2xl border border-[#E9EAF2] p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5368EA]">
                Ecosystem Enabler • {ROLE_TITLES[user?.role || ''] || 'Partner'}
              </span>
              <h1 className="text-2xl font-semibold text-[#171A2E] mt-1">{user?.fullName}</h1>
              <p className="text-sm text-[#68738A]">{user?.email}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#DDEBFF]/60 text-[#5368EA] text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active Profile</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E9EAF2] text-xs">
            <div className="p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2]">
              <div className="text-[#68738A] mb-1">Organization / Practice</div>
              <div className="font-semibold text-[#171A2E]">
                {user?.organizationName || 'Independent'}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2]">
              <div className="text-[#68738A] mb-1">Focus &amp; Expertise</div>
              <div className="font-semibold text-[#171A2E]">
                {user?.expertiseDetails || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-[#68738A]">
            <Users className="w-4 h-4 text-[#5368EA]" />
            <span>
              Your ecosystem enabler account is registered on WaoU Fund. Startup collaboration
              invitations sent to your email will appear here.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
