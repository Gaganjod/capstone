'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../../../components/Navbar';
import { Footer } from '../../../../components/Footer';
import { AccessibilityToolbar } from '../../../../components/AccessibilityToolbar';
import { useAccessibility } from '../../../../context/AccessibilityContext';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ChevronLeft,
  BookOpen,
  Brain,
  Sliders,
  AlertCircle,
} from 'lucide-react';

export default function StudentLearningStudio({ params }: { params: { lessonId: string } }) {
  const { settings, updateSettings } = useAccessibility();

  // Lesson State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [simplifiedMode, setSimplifiedMode] = useState<boolean>(false);
  const [isSimplifying, setIsSimplifying] = useState<boolean>(false);

  // Question & Attempt State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [retryCount, setRetryCount] = useState<number>(0);

  const rawText =
    "The little boy walked quietly to the market through the dense green forest. High above, colorful birds sang soft melodies. Leo stopped near an ancient oak tree and noticed a small silver key nestled in the moss.";

  const simplifiedText =
    "Leo walked to the market through the green woods. Birds sang above him. He stopped at a big oak tree and found a silver key in the soft moss.";

  const currentText = simplifiedMode ? simplifiedText : rawText;
  const words = currentText.split(' ');

  // Audio Synchronization Simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      const intervalMs = Math.round(450 / settings.readingSpeed);
      timer = setInterval(() => {
        setActiveWordIndex((prev) => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            return -1;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      setActiveWordIndex(-1);
    }
    return () => clearInterval(timer);
  }, [isPlaying, words.length, settings.readingSpeed]);

  const handleToggleSimplify = () => {
    setIsSimplifying(true);
    setTimeout(() => {
      setSimplifiedMode(!simplifiedMode);
      setIsSimplifying(false);
    }, 600);
  };

  const handleGetHint = () => {
    setHint(
      "Look closely at the second sentence describing Leo's journey through the forest."
    );
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null) return;

    const responseTimeMs = Date.now() - startTime;
    const correct = selectedOption === 1; // Option index 1 is correct answer
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      setFeedback("You're correct. Leo was walking to the market through the dense green forest!");
    } else {
      setFeedback("Good attempt. Look at the second sentence again to find the market.");
      setRetryCount((prev) => prev + 1);
    }

    // Submit attempt data to API (or graceful fallback)
    try {
      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: 'demo-student-id',
          lessonId: params.lessonId || 'lesson-1',
          questionId: 'q-1',
          chosenOption: selectedOption,
          isCorrect: correct,
          responseTimeMs,
          modalityUsed: 'AUDIO_TEXT',
          hintUsed: hint !== null,
          retryCount,
          engineType: 'ML_ADAPTIVE',
        }),
      });
    } catch (err) {
      console.log('Attempt logged locally');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href="/student"
            className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-semibold">Lesson Progress</span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full w-2/3" />
            </div>
            <span className="font-bold text-brand-600">65%</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Lesson Title Card */}
        <div className="linguapath-card p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
              Language Arts • Lesson 1
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              The Whispering Forest Journey
            </h1>
          </div>

          {/* Quick Toolbar Shortcuts */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateSettings({
                  fontSize: settings.fontSize === 'large' ? 'medium' : 'large',
                })
              }
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Font: {settings.fontSize.toUpperCase()}
            </button>

            <button
              onClick={handleToggleSimplify}
              disabled={isSimplifying}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                simplifiedMode
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {simplifiedMode ? 'Simplified Text Active' : 'Simplify Text (GenAI)'}
            </button>
          </div>
        </div>

        {/* MAIN READING AREA */}
        <div className="linguapath-card p-8 sm:p-10 bg-white space-y-8 shadow-xl border-brand-100 relative">
          
          {/* Audio Player Controls */}
          <div className="p-4 rounded-2xl bg-brand-50/80 border border-brand-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-105"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setActiveWordIndex(-1);
                }}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/60"
                title="Replay Audio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div>
                <span className="text-xs font-bold text-brand-900 block flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-brand-600" /> Bimodal Audio Narration
                </span>
                <span className="text-[11px] text-slate-500">Synchronized word highlighting active</span>
              </div>
            </div>

            {/* Reading Speed Picker */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold">Speed:</span>
              {[0.75, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => updateSettings({ readingSpeed: spd })}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                    settings.readingSpeed === spd
                      ? 'bg-brand-600 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Reading Text Container */}
          <div
            className={`p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 leading-relaxed font-opendyslexic tracking-wide transition-all ${
              settings.fontSize === 'small'
                ? 'text-sm'
                : settings.fontSize === 'medium'
                ? 'text-base sm:text-lg'
                : settings.fontSize === 'large'
                ? 'text-xl'
                : 'text-2xl'
            }`}
          >
            {words.map((word, idx) => (
              <span
                key={idx}
                className={`inline-block px-1 py-0.5 rounded transition-all duration-150 ${
                  activeWordIndex === idx
                    ? 'bg-amber-300 text-slate-900 font-extrabold scale-110 shadow-xs'
                    : 'text-slate-800'
                }`}
              >
                {word}{' '}
              </span>
            ))}
          </div>

          {/* QUESTION SECTION */}
          <div className="pt-6 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-600" />
                Question 1: What did Leo do?
              </h3>
              <button
                onClick={handleGetHint}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Need a Hint?
              </button>
            </div>

            {/* Hint Box */}
            {hint && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed animate-in fade-in">
                <span className="font-bold block mb-1">💡 Personalized Hint:</span>
                {hint}
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {[
                'He ran home to get his backpack.',
                'He walked to the market through the forest.',
                'He climbed the ancient oak tree.',
                'He fell asleep in the soft green moss.',
              ].map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedOption(idx);
                    setSubmitted(false);
                  }}
                  className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                    selectedOption === idx
                      ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{option}</span>
                  {selectedOption === idx && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                </button>
              ))}
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Pacing mode: Standard
              </span>
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                Submit Answer
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Feedback Banner */}
            {submitted && feedback && (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed animate-in fade-in ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="font-bold flex items-center gap-2 mb-1">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                  {isCorrect ? 'Correct Answer!' : 'Feedback Strategy: Encouraging Elaborate'}
                </div>
                <p>{feedback}</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
      <AccessibilityToolbar />
    </div>
  );
}
