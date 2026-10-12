'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { XAICard } from '../components/XAICard';
import { AccessibilityToolbar } from '../components/AccessibilityToolbar';
import {
  Brain,
  Sparkles,
  BookOpen,
  Volume2,
  Sliders,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Layers,
  BarChart3,
  Shield,
  Zap,
  Activity,
  Award,
  Users,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden hero-gradient-glow border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Explainable AI Capstone Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Learning that <span className="text-brand-600 bg-gradient-to-r from-brand-600 via-brand-500 to-tealAccent-500 bg-clip-text text-transparent">adapts to you.</span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                An adaptive learning platform that continuously learns from student interactions to personalize difficulty, modality, pacing, and feedback.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/student"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-lg shadow-brand-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                >
                  Start Learning
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#how-it-works"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-base border border-slate-300 shadow-sm transition-all flex items-center justify-center"
                >
                  Explore the Platform
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-500" /> Bimodal Audio + Text
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-tealAccent-500" /> SHAP XAI Explanations
                </span>
              </div>
            </div>

            {/* Right Product Hero Mockup (Original Design) */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="linguapath-card p-6 border-slate-200/80 shadow-2xl relative z-10 bg-white">
                  
                  {/* Mock Navbar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-500 ml-2">AdaptLearn Student Portal</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-[11px] font-bold border border-teal-200">
                      Live Dynamic Model
                    </span>
                  </div>

                  {/* Mock Content */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-brand-50/80 border border-brand-100">
                      <div>
                        <span className="text-[11px] text-brand-600 font-bold uppercase tracking-wider block">
                          AI Recommendation
                        </span>
                        <p className="text-sm font-bold text-slate-900">
                          Audio + Text Modality Recommended
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-brand-600 text-white text-xs font-bold rounded-lg">
                        87% Confidence
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Lesson: The Whispering Forest</span>
                        <span>Level: Intermediate</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-opendyslexic tracking-wide">
                        "Leo stopped near an ancient oak tree and noticed a small silver key nestled in the moss."
                      </p>
                    </div>

                    {/* Progress Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block">Accuracy</span>
                        <span className="text-sm font-extrabold text-slate-800">68%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block">Audio Boost</span>
                        <span className="text-sm font-extrabold text-teal-600">+28%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block">Response</span>
                        <span className="text-sm font-extrabold text-indigo-600">6.2s</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 1: Learning Built Around the Learner */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Learning built around the learner.
            </h2>
            <p className="text-base text-slate-600">
              Every student learns differently. AdaptLearn AI continuously tailors the learning experience to match individual dyslexic cognitive profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="linguapath-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-bold">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Adaptive Difficulty</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dynamically adjusts text complexity, vocabulary density, and question depth based on real-time performance.
              </p>
            </div>

            <div className="linguapath-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center font-bold">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Multimodal Learning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Seamlessly blends synchronized audio narration, visual highlighting, text-only, and bimodal reading modes.
              </p>
            </div>

            <div className="linguapath-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Personalized Feedback</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generates constructive, non-discouraging hints and GenAI text simplifications tailored to error patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: How AdaptLearn Works (Visual Flow) */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How AdaptLearn works
            </h2>
            <p className="text-base text-slate-600">
              The continuous research loop transforming interaction data into personalized mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: 'Assess', desc: 'Screen reading accuracy & speed' },
              { step: '02', title: 'Understand', desc: 'Build dynamic learner profile' },
              { step: '03', title: 'Adapt', desc: 'Predict optimal difficulty & modality' },
              { step: '04', title: 'Learn', desc: 'Deliver accessible bimodal lessons' },
              { step: '05', title: 'Improve', desc: 'Update learner state & repeat loop' },
            ].map((item, idx) => (
              <div key={item.step} className="linguapath-card p-6 text-center space-y-3 relative">
                <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                  Step {item.step}
                </span>
                <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: One Learner. One Evolving Model */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-extrabold uppercase text-brand-600 tracking-wider">
                Dynamic Learner Modeling
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                One learner. One evolving model.
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Rather than treating dyslexia as a static label, AdaptLearn AI tracks accuracy, comprehension, response time, error rate, and modality performance in real-time using exponential moving averages.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-teal-100 text-teal-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Real-Time State Tracking</h4>
                    <p className="text-xs text-slate-500">Updates profile after every attempt</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-teal-100 text-teal-700 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Modality Comparative Score</h4>
                    <p className="text-xs text-slate-500">Compares audio performance against text-only baseline</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="linguapath-card p-6 bg-slate-900 text-white space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
                      AM
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Alex Morgan</h4>
                      <p className="text-xs text-slate-400">Grade 5 • Moderate Dyslexia Profile</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Active Learner Model
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                    <span className="text-slate-400">Reading Accuracy</span>
                    <p className="text-xl font-bold text-white">68.0%</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                    <span className="text-slate-400">Comprehension Score</span>
                    <p className="text-xl font-bold text-white">74.0%</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                    <span className="text-slate-400">Audio Performance</span>
                    <p className="text-xl font-bold text-teal-400">86.0%</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-1">
                    <span className="text-slate-400">Text-Only Score</span>
                    <p className="text-xl font-bold text-amber-400">58.0%</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: Explainable AI Preview */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              AI recommendations you can understand.
            </h2>
            <p className="text-base text-slate-600">
              No black-box decisions. Teachers and parents see exact SHAP feature attributions and transparent natural language reasoning.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <XAICard />
          </div>
        </div>
      </section>

      {/* SECTION 8: Research Architecture */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Research-driven architecture
            </h2>
            <p className="text-base text-slate-600">
              Built to compare Non-Adaptive baselines, Rule-Based heuristics, and XGBoost+SHAP ML-Adaptive models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 text-xs font-bold">
                Engine Mode 1
              </span>
              <h3 className="text-lg font-bold text-slate-900">Non-Adaptive Baseline</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Fixed difficulty, default pacing, and static text presentation for control group research benchmarking.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-brand-200 bg-brand-50/50 space-y-3">
              <span className="px-2.5 py-1 rounded-md bg-brand-100 text-brand-700 text-xs font-bold">
                Engine Mode 2
              </span>
              <h3 className="text-lg font-bold text-slate-900">Rule-Based Adaptive</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Deterministic IF-THEN rules adjusting difficulty based on accuracy thresholds and audio modality gains.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-teal-200 bg-teal-50/50 space-y-3">
              <span className="px-2.5 py-1 rounded-md bg-teal-100 text-teal-700 text-xs font-bold">
                Engine Mode 3
              </span>
              <h3 className="text-lg font-bold text-slate-900">XGBoost ML + SHAP</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                FastAPI Python machine learning service generating probability distributions and feature importance vectors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: CTA */}
      <section className="py-24 bg-gradient-to-tr from-brand-900 via-slate-900 to-brand-800 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience adaptive learning?
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Explore the complete student learning studio, teacher analytics dashboard, and Explainable AI research platform.
          </p>
          <div className="pt-4">
            <Link
              href="/student"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-tealAccent-500 hover:bg-tealAccent-600 text-white font-bold text-base shadow-xl transition-all"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <AccessibilityToolbar />
    </div>
  );
}
