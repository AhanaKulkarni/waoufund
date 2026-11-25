'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface AuthCardShellProps {
  heading: string;
  subheading: string;
  children: React.ReactNode;
}

export default function AuthCardShell({ heading, subheading, children }: AuthCardShellProps) {
  return (
    <div className="min-h-screen bg-[#FAFBFF] flex flex-col justify-between px-4 py-10 sm:py-14">
      <div className="w-full max-w-md mx-auto my-auto">
        <div className="bg-white rounded-3xl border border-[#E9EAF2] p-7 sm:p-10 shadow-sm">
          {/* Small WaoU logo at the top */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="WaoU Fund Logo"
                width={38}
                height={38}
                className="rounded-xl border border-[#E9EAF2]"
                priority
              />
            </Link>
            <h1 className="text-2xl font-semibold text-[#171A2E] tracking-tight">{heading}</h1>
            <p className="text-sm text-[#68738A] mt-1.5 leading-relaxed">{subheading}</p>
          </div>

          {children}
        </div>
      </div>

      {/* Minimal Footer */}
      <footer className="text-center pt-8 text-xs text-[#68738A] space-x-4">
        <Link href="/" className="hover:text-[#171A2E] transition-colors">
          Home
        </Link>
        <span>•</span>
        <a href="mailto:support@waoufund.com" className="hover:text-[#171A2E] transition-colors">
          support@waoufund.com
        </a>
        <span>•</span>
        <span>&copy; {new Date().getFullYear()} WaoU Fund</span>
      </footer>
    </div>
  );
}
