'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { XAICard } from '../../components/XAICard';
import {
  Users,
  TrendingUp,
  Brain,
  Search,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  BookOpen,
  BarChart3,
  Sliders,
  CheckCircle2,
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

export default function TeacherDashboard() {
  const [selectedStudent, setSelectedStudent] = useState<any>({
    id: 'student-1',
    name: 'Alex Morgan',
    age: 11,
    gradeLevel: 'Grade 5',
    readingAccuracy: 68,
    comprehensionScore: 74,
    audioPerformance: 86,
    textPerformance: 58,
    responseTimeMs: 6200,
    dyslexiaSeverity: 'MODERATE',
    trend: 'IMPROVING',
    lastActive: '10 mins ago',
  });

  const studentsList = [
    { id: 'student-1', name: 'Alex Morgan', grade: 'Grade 5', reading: 68, comp: 74, audio: 86, text: 58, trend: 'IMPROVING', severity: 'MODERATE' },
    { id: 'student-2', name: 'Maya Lin', grade: 'Grade 4', reading: 52, comp: 65, audio: 88, text: 44, trend: 'STABLE', severity: 'SEVERE' },
    { id: 'student-3', name: 'Jordan Hayes', grade: 'Grade 6', reading: 82, comp: 88, audio: 91, text: 79, trend: 'IMPROVING', severity: 'MILD' },
    { id: 'student-4', name: 'Chloe Bennett', grade: 'Grade 3', reading: 48, comp: 60, audio: 84, text: 41, trend: 'DECLINING', severity: 'SEVERE' },
    { id: 'student-5', name: 'Noah Miller', grade: 'Grade 7', reading: 56, comp: 68, audio: 86, text: 49, trend: 'STABLE', severity: 'SEVERE' },
  ];

  const trendData = [
    { week: 'Wk 1', accuracy: 56, comprehension: 62 },
    { week: 'Wk 2', accuracy: 60, comprehension: 65 },
    { week: 'Wk 3', accuracy: 64, comprehension: 70 },
    { week: 'Wk 4', accuracy: 68, comprehension: 74 },
  ];

  const modalityData = [
    { modality: 'Text-Only', accuracy: selectedStudent.textPerformance },
    { modality: 'Highlighted Text', accuracy: selectedStudent.textPerformance + 12 },
    { modality: 'Audio + Text', accuracy: selectedStudent.audioPerformance },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
              <BookOpen className="w-3.5 h-3.5" /> Educator Portal
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Teacher Analytics & XAI Panel
            </h1>
            <p className="text-xs text-slate-500">
              Monitor student progression, inspect dynamic learner models, and validate SHAP AI recommendations.
            </p>
          </div>

          <Link
            href="/research"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4" />
            Research Experiment Dashboard
          </Link>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="linguapath-card p-6 space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Total Students</span>
            <p className="text-3xl font-extrabold text-slate-900">10</p>
            <span className="text-[11px] text-slate-500 font-medium">100% active dynamic models</span>
          </div>

          <div className="linguapath-card p-6 space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Avg Learning Gain</span>
            <p className="text-3xl font-extrabold text-emerald-600">+18.4%</p>
            <span className="text-[11px] text-emerald-700 font-semibold">Across bimodal sessions</span>
          </div>

          <div className="linguapath-card p-6 space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Active Modality Boost</span>
            <p className="text-3xl font-extrabold text-brand-600">+26.5%</p>
            <span className="text-[11px] text-slate-500 font-medium">Audio vs Text accuracy delta</span>
          </div>

          <div className="linguapath-card p-6 space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Needing Attention</span>
            <p className="text-3xl font-extrabold text-amber-600">2</p>
            <span className="text-[11px] text-amber-700 font-semibold">High response latency flagged</span>
          </div>
        </div>

        {/* Two-Column Workspace: Student Selector + Detailed Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Student Roster */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              Student Roster ({studentsList.length})
            </h2>

            <div className="space-y-3">
              {studentsList.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStudent({ ...st, responseTimeMs: 6200, audioPerformance: st.audio, textPerformance: st.text, readingAccuracy: st.reading, comprehensionScore: st.comp })}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    selectedStudent.name === st.name
                      ? 'bg-white border-brand-500 shadow-md ring-2 ring-brand-500/20'
                      : 'bg-white/80 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{st.name}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        {st.grade}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Reading: <strong>{st.reading}%</strong></span>
                      <span>Comp: <strong>{st.comp}%</strong></span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[11px] font-bold block ${st.trend === 'IMPROVING' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {st.trend}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 ml-auto mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Student Deep-Dive Profile */}
          <div className="lg:col-span-7 space-y-6">
            <div className="linguapath-card p-6 bg-white space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-600 tracking-wider">
                    Dynamic Profile
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedStudent.grade} • Dyslexia Profile: {selectedStudent.severity}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  Model Status: Stable
                </span>
              </div>

              {/* Charts Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Reading Accuracy & Comprehension Trend over Time
                </h4>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={[40, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={3} name="Reading Accuracy %" />
                      <Line type="monotone" dataKey="comprehension" stroke="#0d9488" strokeWidth={3} name="Comprehension %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Modality Performance Comparison Bar Chart */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Modality Accuracy Comparison
                </h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modalityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="modality" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="accuracy" fill="#0d9488" radius={[6, 6, 0, 0]} name="Accuracy %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Explainable AI Box */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Active XAI Recommendation for {selectedStudent.name}
                </h4>
                <XAICard
                  modality="AUDIO_TEXT"
                  difficulty="MEDIUM"
                  confidence={0.87}
                  naturalLanguageReasoning={`${selectedStudent.name}'s audio-supported accuracy (${selectedStudent.audioPerformance}%) exceeds text-only performance (${selectedStudent.textPerformance}%) by +${selectedStudent.audioPerformance - selectedStudent.textPerformance}%. Bimodal learning is recommended.`}
                  observedData={{
                    readingAccuracy: selectedStudent.readingAccuracy,
                    audioPerformance: selectedStudent.audioPerformance,
                    textPerformance: selectedStudent.textPerformance,
                    responseTimeMs: selectedStudent.responseTimeMs,
                    comprehension: selectedStudent.comprehensionScore,
                  }}
                />
              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
