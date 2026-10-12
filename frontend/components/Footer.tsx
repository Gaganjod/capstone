'use client';

import React from 'react';
import Link from 'next/link';
import { Brain, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                AdaptLearn <span className="text-brand-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamic learner modeling for multimodal adaptive learning of dyslexic students using Explainable AI.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-medium">
              <Sparkles className="w-4 h-4" />
              Final-Year Capstone Project Architecture
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/student" className="hover:text-white transition-colors">Student Experience</Link></li>
              <li><Link href="/student/assessment" className="hover:text-white transition-colors">Onboarding Assessment</Link></li>
              <li><Link href="/teacher" className="hover:text-white transition-colors">Teacher Analytics Dashboard</Link></li>
              <li><Link href="/research" className="hover:text-white transition-colors">XAI & Research Experiments</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Core Research Loop</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-slate-400">Dynamic Learner Modeling</span></li>
              <li><span className="text-slate-400">XGBoost & Random Forest Engine</span></li>
              <li><span className="text-slate-400">SHAP Explainability Matrix</span></li>
              <li><span className="text-slate-400">Generative AI Text Simplification</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Dyslexia Accessibility</h4>
            <ul className="space-y-2.5 text-xs">
              <li><span className="text-slate-400">OpenDyslexic & Lexend Fonts</span></li>
              <li><span className="text-slate-400">Bimodal Audio + Text Highlight</span></li>
              <li><span className="text-slate-400">Adjustable Pacing & Line Spacing</span></li>
              <li><span className="text-slate-400">WCAG 2.1 AAA Contrast Support</span></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AdaptLearn AI. Learning that adapts to you. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Research-Driven Model</span>
            <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-400" /> Accessibility-First Design</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
