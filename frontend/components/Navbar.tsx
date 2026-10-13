'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/screening', label: 'Screening Tool' },
    { href: '/clinical-reference', label: 'Clinical Reference' },
    { href: '/for-clinicians', label: 'For Clinicians' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Heart className="w-5 h-5 fill-white stroke-blue-800" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">CardioAI</span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-800 rounded-full border border-blue-200">
            Clinical Decision Support
          </span>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition hover:text-blue-800 ${
                  isActive ? 'text-blue-800 font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/screening"
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-semibold transition shadow-sm flex items-center gap-1.5"
          >
            Start Assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm font-medium border-b border-slate-100 ${
                pathname === item.href ? 'text-blue-800 font-bold' : 'text-slate-600'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/screening"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-center bg-blue-800 text-white py-2.5 rounded-md text-sm font-semibold mt-2"
          >
            Start Assessment →
          </Link>
        </div>
      )}
    </header>
  );
}
