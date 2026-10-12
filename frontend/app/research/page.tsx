'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import {
  BarChart3,
  Layers,
  Brain,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FlaskConical,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ResearchDashboard() {
  const [dataMode, setDataMode] = useState<'demo' | 'live'>('demo');

  const comparisonData = [
    {
      engine: 'Non-Adaptive',
      learningGain: 5.2,
      readingAccuracy: 58.4,
      comprehension: 61.2,
      engagement: 62.1,
      completionTimeSec: 450,
    },
    {
      engine: 'Rule-Based Adaptive',
      learningGain: 12.8,
      readingAccuracy: 71.6,
      comprehension: 74.0,
      engagement: 76.2,
      completionTimeSec: 380,
    },
    {
      engine: 'ML-Adaptive (XGBoost)',
      learningGain: 21.4,
      readingAccuracy: 84.8,
      comprehension: 86.5,
      engagement: 88.4,
      completionTimeSec: 290,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              <FlaskConical className="w-3.5 h-3.5" /> Research Analytics & Engine Benchmarking
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Experimental Adaptive Engine Comparison
            </h1>
            <p className="text-xs text-slate-500">
              Comparative analysis across Non-Adaptive baselines, Rule-Based heuristics, and Machine Learning Adaptive models.
            </p>
          </div>

          {/* Demo/Live Data Watermark Toggle */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setDataMode('demo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dataMode === 'demo'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              DEMO DATA
            </button>
            <button
              onClick={() => setDataMode('live')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dataMode === 'live'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              LIVE DATA (0 SESSIONS)
            </button>
          </div>
        </div>

        {/* Demo Watermark Banner */}
        {dataMode === 'demo' ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              DEMO DATASET ACTIVE: Benchmarked on 30 simulated experimental sessions across 10 dyslexic learner profiles.
            </div>
            <span className="px-2.5 py-0.5 rounded bg-amber-200 font-extrabold uppercase text-[10px]">
              Capstone Benchmark
            </span>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-slate-500" />
            Awaiting experimental data from live student trials. Select "DEMO DATA" above to view baseline research metrics.
          </div>
        )}

        {/* Research Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="linguapath-card p-6 space-y-4 border-slate-200">
            <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold">
              Baseline Engine 1
            </span>
            <h3 className="text-xl font-bold text-slate-900">Non-Adaptive Mode</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Learning Gain:</span>
                <span className="font-bold text-slate-900">+5.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reading Accuracy:</span>
                <span className="font-bold text-slate-900">58.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comprehension:</span>
                <span className="font-bold text-slate-900">61.2%</span>
              </div>
            </div>
          </div>

          <div className="linguapath-card p-6 space-y-4 border-brand-200">
            <span className="px-2.5 py-1 rounded bg-brand-100 text-brand-700 text-xs font-bold">
              Baseline Engine 2
            </span>
            <h3 className="text-xl font-bold text-slate-900">Rule-Based Adaptive</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Learning Gain:</span>
                <span className="font-bold text-slate-900">+12.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reading Accuracy:</span>
                <span className="font-bold text-slate-900">71.6%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comprehension:</span>
                <span className="font-bold text-slate-900">74.0%</span>
              </div>
            </div>
          </div>

          <div className="linguapath-card p-6 space-y-4 border-teal-200 bg-teal-50/40">
            <span className="px-2.5 py-1 rounded bg-teal-100 text-teal-800 text-xs font-bold">
              Proposed Model 3
            </span>
            <h3 className="text-xl font-bold text-slate-900">ML-Adaptive (XGBoost + SHAP)</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Learning Gain:</span>
                <span className="font-bold text-teal-700">+21.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reading Accuracy:</span>
                <span className="font-bold text-teal-700">84.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comprehension:</span>
                <span className="font-bold text-teal-700">86.5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Gain Bar Chart */}
        <div className="linguapath-card p-6 bg-white space-y-4">
          <h3 className="text-lg font-bold text-slate-900">
            Learning Gain & Accuracy Comparison Across Adaptation Engines (%)
          </h3>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="engine" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="learningGain" fill="#f59e0b" name="Learning Gain (+%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="readingAccuracy" fill="#6366f1" name="Reading Accuracy (%)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="comprehension" fill="#0d9488" name="Comprehension (%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
