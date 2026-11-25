'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<'startups' | 'investors' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (menu: 'startups' | 'investors') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenMenu(menu);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 240);
  };

  return (
    <header ref={navRef} className="w-full bg-transparent relative z-50">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* LEFT: WaoU Fund Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="WaoU Fund Logo"
            width={34}
            height={34}
            className="rounded-xl border border-[#E9EAF2] bg-white shadow-xs transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-lg font-semibold tracking-tight text-[#171A2E]">
            WaoU Fund
          </span>
        </Link>

        {/* RIGHT/CENTRE: Two Dropdown Menus Only (Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          {/* For Startups Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('startups')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'startups' ? null : 'startups')}
              className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-full transition-all ${
                openMenu === 'startups'
                  ? 'bg-white/90 text-[#5368EA] shadow-xs border border-[#E9EAF2]'
                  : 'text-[#171A2E] hover:text-[#5368EA] hover:bg-white/60 border border-transparent'
              }`}
              aria-expanded={openMenu === 'startups'}
            >
              <span>For Startups</span>
              <ChevronDown
                className={`w-4 h-4 text-[#68738A] transition-transform duration-200 ${
                  openMenu === 'startups' ? 'rotate-180 text-[#5368EA]' : ''
                }`}
              />
            </button>

            {openMenu === 'startups' && (
              <div className="absolute right-0 top-full pt-2 w-60 z-50">
                <div className="bg-white rounded-2xl border border-[#E9EAF2] shadow-xl shadow-[#171A2E]/8 p-1.5">
                  <Link
                    href="/auth/startup/register"
                    onClick={() => setOpenMenu(null)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[#171A2E] hover:bg-[#FAFBFF] hover:text-[#5368EA] transition-colors"
                  >
                    <span>Register as a Startup</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                  <Link
                    href="/auth/startup/login"
                    onClick={() => setOpenMenu(null)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[#68738A] hover:bg-[#FAFBFF] hover:text-[#171A2E] transition-colors"
                  >
                    <span>Login as a Startup</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* For Investors Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('investors')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setOpenMenu(openMenu === 'investors' ? null : 'investors')}
              className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-full transition-all ${
                openMenu === 'investors'
                  ? 'bg-white/90 text-[#5368EA] shadow-xs border border-[#E9EAF2]'
                  : 'text-[#171A2E] hover:text-[#5368EA] hover:bg-white/60 border border-transparent'
              }`}
              aria-expanded={openMenu === 'investors'}
            >
              <span>For Investors</span>
              <ChevronDown
                className={`w-4 h-4 text-[#68738A] transition-transform duration-200 ${
                  openMenu === 'investors' ? 'rotate-180 text-[#5368EA]' : ''
                }`}
              />
            </button>

            {openMenu === 'investors' && (
              <div className="absolute right-0 top-full pt-2 w-60 z-50">
                <div className="bg-white rounded-2xl border border-[#E9EAF2] shadow-xl shadow-[#171A2E]/8 p-1.5">
                  <Link
                    href="/auth/investor/register"
                    onClick={() => setOpenMenu(null)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[#171A2E] hover:bg-[#FAFBFF] hover:text-[#5368EA] transition-colors"
                  >
                    <span>Register as an Investor</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                  <Link
                    href="/auth/investor/login"
                    onClick={() => setOpenMenu(null)}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-[#68738A] hover:bg-[#FAFBFF] hover:text-[#171A2E] transition-colors"
                  >
                    <span>Login as an Investor</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-40" />
                  </Link>
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
              For Startups
            </div>
            <div className="space-y-1">
              <Link
                href="/auth/startup/register"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#171A2E] hover:text-[#5368EA]"
              >
                Register as a Startup
              </Link>
              <Link
                href="/auth/startup/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#68738A] hover:text-[#171A2E]"
              >
                Login as a Startup
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E9EAF2]">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#68738A] mb-2">
              For Investors
            </div>
            <div className="space-y-1">
              <Link
                href="/auth/investor/register"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#171A2E] hover:text-[#5368EA]"
              >
                Register as an Investor
              </Link>
              <Link
                href="/auth/investor/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-medium text-[#68738A] hover:text-[#171A2E]"
              >
                Login as an Investor
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
