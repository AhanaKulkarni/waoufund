'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header ref={navRef} className="w-full bg-transparent relative z-50">
      <div className="w-full pl-3 pr-4 sm:pl-6 sm:pr-8 py-3 flex items-center justify-between gap-4">
        {/* LEFT: WaoU Fund logo + small text directly below */}
        <Link href="/" className="flex flex-col items-start flex-shrink-0">
          <Image
            src="/waou-logo.png"
            alt="WaoU Fund"
            width={150}
            height={48}
            className="h-9 sm:h-10 w-auto object-contain"
            priority
          />
          <span className="text-[11px] font-medium text-[#68738A] leading-tight mt-0.5 pl-0.5">
            AI Fundraising Intelligence
          </span>
        </Link>

        {/* CENTRE TOP: Clearly visible and larger than the small text below the logo */}
        <div className="hidden md:block text-center">
          <span className="text-base lg:text-lg font-semibold text-[#171A2E] tracking-tight">
            AI Powered Fundraising Platform
          </span>
        </div>

        {/* RIGHT: ONE button labelled "Login" with exact 2-option dropdown */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2 rounded-full bg-white border border-[#E9EAF2] text-[#171A2E] hover:text-[#5368EA] hover:border-[#5368EA]/40 shadow-xs transition-all"
            aria-expanded={open}
          >
            <span>Login</span>
            <ChevronDown
              className={`w-4 h-4 text-[#68738A] transition-transform duration-150 ${
                open ? 'rotate-180 text-[#5368EA]' : ''
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-white rounded-2xl border border-[#E9EAF2] shadow-xl shadow-[#171A2E]/8 p-1.5">
              <Link
                href="/auth/startup/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[#171A2E] hover:bg-[#FAFBFF] hover:text-[#5368EA] transition-colors"
              >
                Startups/MSMEs
              </Link>
              <Link
                href="/auth/investor/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[#171A2E] hover:bg-[#FAFBFF] hover:text-[#5368EA] transition-colors"
              >
                Investors/Lenders
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile centre-top title */}
      <div className="md:hidden text-center px-4 pb-1">
        <span className="text-sm font-semibold text-[#171A2E]">
          AI Powered Fundraising Platform
        </span>
      </div>
    </header>
  );
}
