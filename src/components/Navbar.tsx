'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 240);
  };

  return (
    <header ref={navRef} className="w-full bg-transparent relative z-50">
      <div className="w-full pl-3 pr-5 sm:pl-5 sm:pr-8 h-20 flex items-center justify-between">
        {/* EXTREME LEFT: Transparent WaoU Fund Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/waou-logo.png"
            alt="WaoU Fund — AI Fundraising Intelligence"
            width={180}
            height={57}
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* RIGHT: Login / Register Dropdown */}
        <nav className="hidden md:flex items-center gap-4">
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all ${
                open
                  ? 'bg-white text-[#5368EA] shadow-sm border border-[#E9EAF2]'
                  : 'bg-white/85 text-[#171A2E] hover:text-[#5368EA] border border-[#E9EAF2]'
              }`}
              aria-expanded={open}
            >
              <span>Login / Register</span>
              <ChevronDown
                className={`w-4 h-4 text-[#68738A] transition-transform duration-200 ${
                  open ? 'rotate-180 text-[#5368EA]' : ''
                }`}
              />
            </button>

            {open && (
              <div className="absolute right-0 top-full pt-2 w-72 z-50">
                <div className="bg-white rounded-2xl border border-[#E9EAF2] shadow-xl shadow-[#171A2E]/8 p-2 space-y-2">
                  {/* Startups / MSMEs */}
                  <div className="p-1.5 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2]/70">
                    <div className="px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-[#68738A]">
                      Startups / MSMEs
                    </div>
                    <Link
                      href="/auth/startup/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-[#171A2E] hover:bg-white hover:text-[#5368EA] transition-colors"
                    >
                      <span>Register as Startup / MSME</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                    </Link>
                    <Link
                      href="/auth/startup/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-[#68738A] hover:bg-white hover:text-[#171A2E] transition-colors"
                    >
                      <span>Login as Startup / MSME</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                    </Link>
                  </div>

                  {/* Investors / Lenders */}
                  <div className="p-1.5 rounded-xl bg-[#FAFBFF] border border-[#E9EAF2]/70">
                    <div className="px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wider text-[#68738A]">
                      Investors / Lenders
                    </div>
                    <Link
                      href="/auth/investor/register"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-[#171A2E] hover:bg-white hover:text-[#5368EA] transition-colors"
                    >
                      <span>Register as Investor / Lender</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                    </Link>
                    <Link
                      href="/auth/investor/login"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-2.5 py-2 rounded-lg text-sm font-medium text-[#68738A] hover:bg-white hover:text-[#171A2E] transition-colors"
                    >
                      <span>Login as Investor / Lender</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Compact Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl border border-[#E9EAF2] bg-white text-[#171A2E]"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#E9EAF2] px-6 py-5 space-y-5 shadow-lg">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#68738A] mb-2">
              Startups / MSMEs
            </div>
            <div className="space-y-1">
              <Link
                href="/auth/startup/register"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#171A2E] hover:text-[#5368EA]"
              >
                Register as Startup / MSME
              </Link>
              <Link
                href="/auth/startup/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#68738A] hover:text-[#171A2E]"
              >
                Login as Startup / MSME
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E9EAF2]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#68738A] mb-2">
              Investors / Lenders
            </div>
            <div className="space-y-1">
              <Link
                href="/auth/investor/register"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#171A2E] hover:text-[#5368EA]"
              >
                Register as Investor / Lender
              </Link>
              <Link
                href="/auth/investor/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#68738A] hover:text-[#171A2E]"
              >
                Login as Investor / Lender
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
