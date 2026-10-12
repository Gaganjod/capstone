'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Brain, BookOpen, Layers, User, ChevronRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-500 to-tealAccent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                AdaptLearn <span className="text-brand-600 font-extrabold">AI</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 block uppercase tracking-wider -mt-1">
                Multimodal Dyslexia Learning
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <Link href="/#how-it-works" className="hover:text-brand-600 transition-colors">
              How it Works
            </Link>
            <Link href="/student" className="hover:text-brand-600 transition-colors flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-brand-500" />
              For Students
            </Link>
            <Link href="/teacher" className="hover:text-brand-600 transition-colors flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-tealAccent-500" />
              For Teachers
            </Link>
            <Link href="/research" className="hover:text-brand-600 transition-colors flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amberAccent-500" />
              Research XAI
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/student"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-600/20 hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              Get Started
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link href="/" className="block py-2 text-slate-700 font-medium hover:text-brand-600">
            Home
          </Link>
          <Link href="/#how-it-works" className="block py-2 text-slate-700 font-medium hover:text-brand-600">
            How it Works
          </Link>
          <Link href="/student" className="block py-2 text-slate-700 font-medium hover:text-brand-600">
            For Students
          </Link>
          <Link href="/teacher" className="block py-2 text-slate-700 font-medium hover:text-brand-600">
            For Teachers
          </Link>
          <Link href="/research" className="block py-2 text-slate-700 font-medium hover:text-brand-600">
            Research XAI
          </Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/login" className="w-full text-center py-2 text-slate-700 font-semibold">
              Sign In
            </Link>
            <Link
              href="/student"
              className="w-full text-center py-2.5 bg-brand-600 text-white rounded-xl font-semibold shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
