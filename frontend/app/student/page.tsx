'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { XAICard } from '../../components/XAICard';
import { AccessibilityToolbar } from '../../components/AccessibilityToolbar';
import { useAuth } from '../../context/AuthContext';
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
  RefreshCw,
  Zap,
  Target,
} from 'lucide-react';

interface LearnerState {
  readingAccuracy: number;
  comprehensionScore: number;
  averageResponseTime: number;
  audioPerformance: number;
  textPerformance: number;
  currentDifficulty: string;
  preferredModality: string;
  recentPerformanceTrend: string;
  attemptHistoryCount: number;
  engagementScore: number;
}

interface Recommendation {
  difficulty: string;
  modality: string;
  pacing: string;
  feedbackStrategy: string;
  confidence: number;
  engineType: string;
  explanation?: {
    naturalLanguageReasoning: string;
    featureImportances: Record<string, number>;
    SHAPValues: Record<string, number>;
    observedData: Record<string, number>;
  };
}

// Default demo state so the page always shows something meaningful
const DEFAULT_LEARNER: LearnerState = {
  readingAccuracy: 68.0,
  comprehensionScore: 74.0,
  averageResponseTime: 6200,
  audioPerformance: 86.0,
  textPerformance: 58.0,
  currentDifficulty: 'MEDIUM',
  preferredModality: 'AUDIO_TEXT',
  recentPerformanceTrend: 'IMPROVING',
  attemptHistoryCount: 14,
  engagementScore: 88.0,
};

const DEFAULT_REC: Recommendation = {
  difficulty: 'MEDIUM',
  modality: 'AUDIO_TEXT',
  pacing: 'STANDARD',
  feedbackStrategy: 'ENCOURAGING_ELABORATE',
  confidence: 0.87,
  engineType: 'ML_ADAPTIVE',
  explanation: {
    naturalLanguageReasoning:
      "Audio + Text modality was recommended because Alex performed 28% higher during bimodal activities, and recent reading accuracy (68%) benefits from synchronized audio highlighting.",
    featureImportances: { readingAccuracy: 0.36, audioPerformance: 0.29, averageResponseTime: 0.18, comprehensionScore: 0.11, errorRate: 0.06 },
    SHAPValues: { readingAccuracy: 0.36, audioPerformance: 0.29, averageResponseTime: 0.18, comprehensionScore: 0.11, errorRate: 0.06 },
    observedData: { readingAccuracy: 68, audioPerformance: 86, textPerformance: 58, responseTimeMs: 6200, comprehension: 74 },
  },
};

const ENGINE_LABELS: Record<string, string> = {
  ML_ADAPTIVE:  'XGBoost ML Adaptive',
  RULE_BASED:   'Rule-Based Heuristic',
  NON_ADAPTIVE: 'Non-Adaptive Baseline',
};

export default function StudentDashboard() {
  const { user } = useAuth();

  const [learnerState, setLearnerState] = useState<LearnerState>(DEFAULT_LEARNER);
  const [recommendation, setRecommendation] = useState<Recommendation>(DEFAULT_REC);
  const [showXAI, setShowXAI] = useState(false);
  const [engine, setEngine] = useState<'ML_ADAPTIVE' | 'RULE_BASED' | 'NON_ADAPTIVE'>('ML_ADAPTIVE');
  const [loadingRec, setLoadingRec] = useState(false);
  const [apiStatus, setApiStatus] = useState<'live' | 'demo'>('demo');
  const [courses, setCourses] = useState<any[]>([]);

  const studentId = user?.studentId;
  const displayName = user?.name?.split(' ')[0] || 'Alex';
  const firstLessonId = courses.flatMap((c: any) => c.lessons || [])[0]?.id || 'lesson-1';

  // ── Fetch learner state ──────────────────────────────────────────────────
  useEffect(() => {
    if (!studentId) return;
    fetch(`/api/students/${studentId}/learner-state`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adaptlearn_token')}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.readingAccuracy !== undefined) {
          setLearnerState(data);
          setApiStatus('live');
        }
      })
      .catch(() => {}); // silently fall back to demo data
  }, [studentId]);

  // ── Fetch courses ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/lessons/courses')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCourses(data); })
      .catch(() => {});
  }, []);

  // ── Auto-fetch recommendation on load ────────────────────────────────────
  useEffect(() => {
    if (studentId) fetchRecommendation('ML_ADAPTIVE');
  }, [studentId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch AI recommendation ──────────────────────────────────────────────
  const fetchRecommendation = async (eng: string) => {
    if (!studentId) return;
    setLoadingRec(true);
    try {
      const url = `/api/recommendations/${studentId}?engine=${eng}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adaptlearn_token')}` },
      });
      const data = await res.json();
      if (data && data.modality) {
        setRecommendation(data);
        setApiStatus('live');
      }
    } catch { /* fall back to demo */ }
    finally { setLoadingRec(false); }
  };

  const handleEngineChange = (e: string) => {
    setEngine(e as any);
    fetchRecommendation(e);
  };

  const audioDelta = (learnerState.audioPerformance - learnerState.textPerformance).toFixed(0);

  const trendColor =
    learnerState.recentPerformanceTrend === 'IMPROVING'
      ? 'text-emerald-600'
      : learnerState.recentPerformanceTrend === 'DECLINING'
      ? 'text-rose-500'
      : 'text-slate-500';

  const modalityLabel =
    recommendation.modality === 'AUDIO_TEXT'
      ? 'Audio + Text (Bimodal)'
      : recommendation.modality === 'HIGHLIGHTED_TEXT'
      ? 'Highlighted Text'
      : 'Text Only';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* API Status Badge */}
        <div className="flex justify-end">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
            apiStatus === 'live'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {apiStatus === 'live' ? '🟢 Live Data' : '🟡 Demo Mode'}
          </span>
        </div>

        {/* ── Top Header Banner ── */}
        <div className="linguapath-card p-8 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Dynamic Learner Active
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Good morning, {displayName} 👋
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
              Retake Screening
            </Link>
            <Link
              href={`/student/learn/${firstLessonId}`}
              className="px-6 py-2.5 rounded-xl bg-tealAccent-500 hover:bg-tealAccent-600 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all"
            >
              Continue Learning
              <Play className="w-3.5 h-3.5 fill-current" />
            </Link>
          </div>
        </div>

        {/* ── Engine Selector + AI Recommendation ── */}
        <div className="linguapath-card p-6 border-brand-200 bg-brand-50/60 space-y-4">
          {/* Engine picker */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-brand-800 mr-1">Engine:</span>
            {(['ML_ADAPTIVE', 'RULE_BASED', 'NON_ADAPTIVE'] as const).map((eng) => (
              <button
                key={eng}
                onClick={() => handleEngineChange(eng)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                  engine === eng
                    ? 'bg-brand-700 text-white border-brand-700 shadow'
                    : 'bg-white text-brand-700 border-brand-300 hover:bg-brand-100'
                }`}
              >
                {ENGINE_LABELS[eng]}
              </button>
            ))}
            <button
              onClick={() => fetchRecommendation(engine)}
              disabled={loadingRec || !studentId}
              className="ml-auto px-3 py-1.5 rounded-lg bg-white border border-brand-300 text-brand-700 text-[11px] font-bold hover:bg-brand-100 flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${loadingRec ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase text-brand-700 tracking-wider">
                    AI Recommendation — {ENGINE_LABELS[engine]}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-brand-200 text-brand-900 text-[10px] font-bold">
                    {Math.round(recommendation.confidence * 100)}% Confidence
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    recommendation.difficulty === 'HARD'
                      ? 'bg-rose-100 text-rose-700'
                      : recommendation.difficulty === 'EASY'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {recommendation.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalityLabel} is recommended — Pacing: {recommendation.pacing}
                </h3>
                <p className="text-xs text-slate-600">
                  Feedback strategy: <strong>{recommendation.feedbackStrategy.replace(/_/g, ' ')}</strong>
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
        </div>

        {/* ── Expandable XAI Panel ── */}
        {showXAI && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <XAICard recommendation={recommendation} />
          </div>
        )}

        {/* ── Metrics Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="linguapath-card p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Reading Accuracy</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">{learnerState.readingAccuracy}%</p>
            <span className={`text-[11px] font-semibold block ${trendColor}`}>
              {learnerState.recentPerformanceTrend} ↗
            </span>
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
            <span className="text-[11px] text-teal-700 font-semibold">
              +{audioDelta}% vs text-only ({learnerState.textPerformance}%)
            </span>
          </div>

          <div className="linguapath-card p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold">Avg Response</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900">
              {(learnerState.averageResponseTime / 1000).toFixed(1)}s
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              {learnerState.attemptHistoryCount} attempts total
            </span>
          </div>
        </div>

        {/* ── Performance Bar (Engagement + Difficulty) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="linguapath-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-slate-800">Engagement Score</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700"
                style={{ width: `${learnerState.engagementScore}%` }}
              />
            </div>
            <span className="text-lg font-extrabold text-amber-600">{learnerState.engagementScore}%</span>
          </div>

          <div className="linguapath-card p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-bold text-slate-800">Current Level</span>
            </div>
            <div className="flex gap-2">
              {['EASY', 'MEDIUM', 'HARD'].map((lvl) => (
                <div
                  key={lvl}
                  className={`flex-1 py-2 rounded-lg text-center text-xs font-bold border transition-all ${
                    learnerState.currentDifficulty === lvl
                      ? 'bg-brand-600 text-white border-brand-600 shadow'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  {lvl}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">Based on recent performance trend</p>
          </div>
        </div>

        {/* ── Lesson Cards ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Recommended Bimodal Lessons
            </h2>
            <Link href="/student/progress" className="text-xs font-semibold text-brand-600 hover:underline">
              View Analytics →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.length > 0
              ? courses.flatMap((c: any) => c.lessons || []).slice(0, 4).map((lesson: any) => (
                  <div key={lesson.id} className="linguapath-card p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold">
                          {lesson.course?.category || 'Language Arts'}
                        </span>
                        <span className="text-slate-400 font-medium">
                          {lesson.difficulty} • Audio Available
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{lesson.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{lesson.summary}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs text-slate-400">{lesson.questions?.length || 0} questions</span>
                      <Link
                        href={`/student/learn/${lesson.id}`}
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        Start Lesson <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))
              : /* Fallback static cards */
                [
                  { id: 'lesson-1', title: 'The Whispering Forest Journey', cat: 'Language Arts', diff: 'EASY', sum: 'Follow Leo as he travels through the enchanted woods, discovering how animals communicate.', q: 2 },
                  { id: 'lesson-2', title: 'Ecosystems and Food Webs', cat: 'Science & Nature', diff: 'MEDIUM', sum: 'Understand how plants and animals interact to balance natural ecosystems.', q: 1 },
                ].map((lesson) => (
                  <div key={lesson.id} className="linguapath-card p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold">{lesson.cat}</span>
                        <span className="text-slate-400 font-medium">{lesson.diff} • Audio Available</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{lesson.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{lesson.sum}</p>
                    </div>
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-xs text-slate-400">{lesson.q} questions</span>
                      <Link
                        href={`/student/learn/${lesson.id}`}
                        className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        Start Lesson <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        </div>

      </main>

      <Footer />
      <AccessibilityToolbar />
    </div>
  );
}
