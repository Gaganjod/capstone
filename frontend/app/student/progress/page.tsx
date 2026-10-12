'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { XAICard } from '../../../components/XAICard';
import { AccessibilityToolbar } from '../../../components/AccessibilityToolbar';
import {
  TrendingUp,
  Brain,
  Volume2,
  BookOpen,
  Award,
  Clock,
  ChevronLeft,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function StudentProgressPage() {
  const historyData = [
    { attempt: 'Session 1', accuracy: 54, comprehension: 60, mode: 'Text-Only' },
    { attempt: 'Session 2', accuracy: 62, comprehension: 68, mode: 'Audio + Text' },
    { attempt: 'Session 3', accuracy: 65, comprehension: 72, mode: 'Audio + Text' },
    { attempt: 'Session 4', accuracy: 68, comprehension: 74, mode: 'Audio + Text' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="flex items-center justify-between">
          <Link
            href="/student"
            className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <span className="text-xs font-bold text-slate-400">Alex Morgan's Learning History</span>
        </div>

        {/* Page Title */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Learning Progress & AI Explainability Log
          </h1>
          <p className="text-xs text-slate-500">
            Track your reading growth, accuracy trends, and AI recommendation history.
          </p>
        </div>

        {/* Chart Card */}
        <div className="linguapath-card p-6 bg-white space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-600" />
            Accuracy & Comprehension Progression Across Sessions
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="attempt" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[40, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={3} name="Reading Accuracy %" />
                <Line type="monotone" dataKey="comprehension" stroke="#0d9488" strokeWidth={3} name="Comprehension %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active AI Recommendation Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-brand-600" />
            Active SHAP Explainable AI Recommendation
          </h2>
          <XAICard />
        </div>

      </main>

      <Footer />
      <AccessibilityToolbar />
    </div>
  );
}
