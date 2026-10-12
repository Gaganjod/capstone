'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { XAICard } from '../../components/XAICard';
import { AccessibilityToolbar } from '../../components/AccessibilityToolbar';
import {
  Brain,
  BookOpen,
  Volume2,
  Sparkles,
  TrendingUp,
  Award,
  ChevronRight,
  Clock,
  Play,
  HelpCircle,
  BarChart2,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export default function StudentDashboard() {
  const [showXAI, setShowXAI] = useState(false);
  const [learnerState, setLearnerState] = useState<any>({
    readingAccuracy: 68.0,
    comprehensionScore: 74.0,
    averageResponseTime: 6200,
    audioPerformance: 86.0,
    textPerformance: 58.0,
    currentDifficulty: 'MEDIUM',
    preferredModality: 'AUDIO_TEXT',
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header Banner */}
        <div className="linguapath-card p-8 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Dynamic Learner Active
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Good morning, Alex 👋
            </h1>
            <p className="text-sm text-slate-300">
              Welcome back to AdaptLearn AI. Your personalized reading journey is ready.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student/assessment"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              Retake Onboarding Screening
            </Link>
            <Link
              href="/student/learn/lesson-1"
              className="px-6 py-2.5 rounded-xl bg-tealAccent-500 hover:bg-tealAccent-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all"
            >
              Continue Learning
              <Play className="w-3.5 h-3.5 fill-current" />
            </Link>
          </div>
        </div>

        {/* AI Recommendation Alert Card */}
        <div className="linguapath-card p-6 border-brand-200 bg-brand-50/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase text-brand-700 tracking-wider">
                  AI Recommendation Engine
                </span>
                <span className="px-2 py-0.5 rounded bg-brand-200 text-brand-900 text-[10px] font-bold">
                  87% Confidence
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Audio + Text is recommended for your next activity.
              </h3>
              <p className="text-xs text-slate-600">
                Synchronized bimodal narration will optimize your reading accuracy and reduce decoding fatigue.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowXAI(!showXAI)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-brand-700 text-xs font-bold border border-brand-300 shadow-xs flex items-center gap-1.5 shrink-0 transition-all"
          >
            <HelpCircle className="w-4 h-4 text-brand-600" />
            {showXAI ? 'Hide Explanation' : 'Why this recommendation?'}
          </button>
        </div>

        {/* Expandable Explainable AI Panel */}
        {showXAI && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <XAICard />
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="linguapath-card p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Reading Accuracy</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{learnerState.readingAccuracy}%</p>
            <span className="text-[11px] text-emerald-600 font-semibold block">+4.2% from last week</span>
          </div>

          <div className="linguapath-card p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Comprehension</span>
              <Award className="w-4 h-4 text-brand-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{learnerState.comprehensionScore}%</p>
            <span className="text-[11px] text-slate-500 font-medium">Question accuracy rate</span>
          </div>

          <div className="linguapath-card p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Audio Boost</span>
              <Volume2 className="w-4 h-4 text-tealAccent-500" />
            </div>
            <p className="text-3xl font-extrabold text-teal-600">{learnerState.audioPerformance}%</p>
            <span className="text-[11px] text-teal-700 font-semibold">+28% vs text-only (58%)</span>
          </div>

          <div className="linguapath-card p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Average Response</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">
              {(learnerState.averageResponseTime / 1000).toFixed(1)}s
            </p>
            <span className="text-[11px] text-slate-500 font-medium">Comfortable response pace</span>
          </div>
        </div>

        {/* Continue Learning Course Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Recommended Bimodal Lessons
            </h2>
            <Link href="/student/progress" className="text-xs font-semibold text-brand-600 hover:underline">
              View Detailed Analytics →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Lesson 1 Card */}
            <div className="linguapath-card p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                    Language Arts
                  </span>
                  <span className="text-slate-400 font-medium">10 mins • Audio Available</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">The Whispering Forest Journey</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Follow Leo as he travels through the enchanted woods, discovering how animals communicate.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 80% Complete
                </span>
                <Link
                  href="/student/learn/lesson-1"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  Start Lesson
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Lesson 2 Card */}
            <div className="linguapath-card p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 font-bold">
                    Science & Nature
                  </span>
                  <span className="text-slate-400 font-medium">15 mins • Audio + Text</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Ecosystems and Food Webs</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Understand how plants and animals interact to balance natural ecosystems.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400">Not started yet</span>
                <Link
                  href="/student/learn/lesson-2"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  Start Lesson
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />
      <AccessibilityToolbar />
    </div>
  );
}
