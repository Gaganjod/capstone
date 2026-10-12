'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { AccessibilityToolbar } from '../../../components/AccessibilityToolbar';
import {
  Brain,
  CheckCircle2,
  ArrowRight,
  Volume2,
  Clock,
  AlertCircle,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function OnboardingAssessment() {
  const [step, setStep] = useState<number>(1);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [readingAccuracy, setReadingAccuracy] = useState<number>(70);
  const [chosenOption, setChosenOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Calculate final results
      setIsSubmitting(true);
      setTimeout(() => {
        setResults({
          readingAccuracy: 68,
          comprehensionScore: 74,
          averageResponseTimeMs: 6200,
          recommendedDifficulty: 'MEDIUM',
          recommendedModality: 'AUDIO_TEXT',
          disclaimer:
            'These metrics are learning-system estimates for adaptive personalization, not a clinical medical diagnosis.',
        });
        setIsSubmitting(false);
        setStep(4);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Progress Step Header */}
        <div className="mb-8 space-y-4 text-center">
          <span className="px-3.5 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
            Initial Dyslexia Adaptive Assessment
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {step === 1 && 'Step 1: Reading Decoding Passage'}
            {step === 2 && 'Step 2: Comprehension Evaluation'}
            {step === 3 && 'Step 3: Interaction & Response Pace'}
            {step === 4 && 'Assessment Results & Learner Profile'}
          </h1>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-center gap-2 max-w-xs mx-auto pt-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step ? 'bg-brand-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: READING PASSAGE */}
        {step === 1 && (
          <div className="linguapath-card p-8 space-y-6 bg-white animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-slate-500">Read the sample story below</span>
              <span className="text-xs text-brand-600 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Pacing tracked
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 font-opendyslexic tracking-wide leading-relaxed text-base text-slate-800">
              <p>
                "Leo walked quietly to the market through the dense green forest. High above, colorful birds sang soft melodies. Leo stopped near an ancient oak tree and noticed a small silver key nestled in the moss."
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                How easy was it to decode the words in this passage?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Challenging', val: 55 },
                  { label: 'Comfortable', val: 75 },
                  { label: 'Very Easy', val: 90 },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setReadingAccuracy(item.val)}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      readingAccuracy === item.val
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNextStep}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                Continue to Comprehension
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: COMPREHENSION */}
        {step === 2 && (
          <div className="linguapath-card p-8 space-y-6 bg-white animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold text-slate-500">Question 1 of 1</span>
              <span className="text-xs text-brand-600 font-bold">Comprehension Check</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Where was Leo walking when he found the silver key?
            </h3>

            <div className="space-y-3">
              {[
                'To his friend\'s house in town',
                'To the market through the forest',
                'To the school library',
                'To the riverbank',
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setChosenOption(idx)}
                  className={`w-full p-4 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                    chosenOption === idx
                      ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{opt}</span>
                  {chosenOption === idx && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleNextStep}
                disabled={chosenOption === null}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md"
              >
                Continue to Interaction Speed
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: INTERACTION SPEED */}
        {step === 3 && (
          <div className="linguapath-card p-8 space-y-6 bg-white animate-in fade-in duration-300 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Analyzing Response & Audio Preferences
            </h3>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              We are computing your interaction latency, error retry frequency, and modality preferences to build your dynamic learner state profile.
            </p>

            <div className="pt-4">
              <button
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-lg"
              >
                {isSubmitting ? 'Generating Learner State...' : 'View Assessment Results'}
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: RESULTS */}
        {step === 4 && results && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="linguapath-card p-8 bg-white space-y-6 border-brand-200">
              <div className="flex items-center gap-3 text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Onboarding Profile Complete!
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your baseline dynamic learner state has been initialized.
                  </p>
                </div>
              </div>

              {/* Grid of Results */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Reading Accuracy</span>
                  <p className="text-2xl font-extrabold text-slate-900">{results.readingAccuracy}%</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                  <span className="text-xs text-slate-500 font-medium">Comprehension</span>
                  <p className="text-2xl font-extrabold text-slate-900">{results.comprehensionScore}%</p>
                </div>
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-center space-y-1">
                  <span className="text-xs text-teal-700 font-semibold">Recommended Target</span>
                  <p className="text-lg font-extrabold text-teal-900">{results.recommendedModality.replace('_', ' + ')}</p>
                </div>
                <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-center space-y-1">
                  <span className="text-xs text-indigo-700 font-semibold">Initial Difficulty</span>
                  <p className="text-lg font-extrabold text-indigo-900">{results.recommendedDifficulty}</p>
                </div>
              </div>

              {/* Clear Mandatory Disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs leading-relaxed">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Medical & Clinical Disclaimer</span>
                  {results.disclaimer}
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <Link
                  href="/student/learn/lesson-1"
                  className="px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg"
                >
                  Start Your First Adaptive Lesson
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
      <AccessibilityToolbar />
    </div>
  );
}
