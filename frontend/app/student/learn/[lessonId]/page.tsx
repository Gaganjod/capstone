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
  Brain,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  simplifiedExplanation?: string;
  difficulty: string;
  concept: string;
}

interface Lesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  simplifiedContent: string;
  difficulty: string;
  questions: Question[];
  course?: { title: string; category: string };
}

export default function StudentLearningStudio({ params }: { params: { lessonId: string } }) {
  const { settings, updateSettings } = useAccessibility();

  // Lesson data
  const [lesson, setLesson]           = useState<Lesson | null>(null);
  const [lessonLoading, setLessonLoading] = useState(true);
  const [lessonError, setLessonError] = useState('');

  // Reading state
  const [isPlaying, setIsPlaying]         = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [isSimplifying, setIsSimplifying] = useState(false);

  // Quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted]           = useState(false);
  const [isCorrect, setIsCorrect]           = useState<boolean | null>(null);
  const [hint, setHint]                     = useState<string | null>(null);
  const [feedback, setFeedback]             = useState<string | null>(null);
  const [startTime]                         = useState(Date.now());
  const [retryCount, setRetryCount]         = useState(0);
  const [score, setScore]                   = useState(0);
  const [quizDone, setQuizDone]             = useState(false);

  // ── Fetch lesson (adaptively filtered by student profile) ─────────────────
  useEffect(() => {
    setLessonLoading(true);
    const stored = typeof window !== 'undefined' ? localStorage.getItem('adaptlearn_user') : null;
    const user = stored ? JSON.parse(stored) : null;
    const studentId = user?.studentId || '';
    const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : '';

    fetch(`/api/lessons/${params.lessonId}${query}`)
      .then((r) => {
        if (!r.ok) throw new Error('Lesson not found');
        return r.json();
      })
      .then((data) => {
        // Parse options if they come as string
        const parsed = {
          ...data,
          questions: (data.questions || []).map((q: any) => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          })),
        };
        setLesson(parsed);
      })
      .catch((e) => setLessonError(e.message || 'Failed to load lesson'))
      .finally(() => setLessonLoading(false));
  }, [params.lessonId]);

  // ── Audio word highlight & Web Speech Synthesis ─────────────────────────
  const currentText = lesson
    ? simplifiedMode
      ? lesson.simplifiedContent
      : lesson.content
    : '';
  const words = React.useMemo(() => currentText.split(/\s+/).filter(Boolean), [currentText]);

  const currentWordRef = React.useRef(0);
  const isPlayingRef = React.useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Keep track of current word position
  useEffect(() => {
    if (activeWordIndex >= 0) {
      currentWordRef.current = activeWordIndex;
    }
  }, [activeWordIndex]);

  // Function to start speaking from a given word index
  const speakFromWord = React.useCallback(
    (startIdx: number, speedRate: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      const startIndex = Math.max(0, Math.min(startIdx, words.length - 1));
      const sliceWords = words.slice(startIndex);
      const textToSpeak = sliceWords.join(' ');
      if (!textToSpeak.trim()) {
        setIsPlaying(false);
        setActiveWordIndex(-1);
        currentWordRef.current = 0;
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      // Valid Web Speech API rate is 0.1 to 10.0 (typically 0.5 to 2.0)
      utterance.rate = Math.max(0.5, Math.min(2.0, speedRate || 1.0));
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Map character boundaries to slice word indices
      let searchPos = 0;
      const wordOffsets: { start: number; end: number }[] = sliceWords.map((w) => {
        const idx = textToSpeak.indexOf(w, searchPos);
        const start = idx !== -1 ? idx : searchPos;
        const end = start + w.length;
        searchPos = end;
        return { start, end };
      });

      let boundaryFired = false;
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          boundaryFired = true;
          const charIdx = event.charIndex;
          const foundInSlice = wordOffsets.findIndex(
            (o, i) => charIdx >= o.start && charIdx <= (wordOffsets[i + 1]?.start ?? o.end + 5)
          );
          if (foundInSlice !== -1) {
            const absoluteWordIdx = startIndex + foundInSlice;
            setActiveWordIndex(absoluteWordIdx);
            currentWordRef.current = absoluteWordIdx;
          }
        }
      };

      // Fallback timer if browser speech engine doesn't emit onboundary
      let fallbackTimer: NodeJS.Timeout | null = null;
      const intervalMs = Math.round(420 / (speedRate || 1.0));
      const fallbackTimeout = setTimeout(() => {
        if (!boundaryFired && isPlayingRef.current) {
          fallbackTimer = setInterval(() => {
            setActiveWordIndex((prev) => {
              const next = prev < startIndex ? startIndex : prev + 1;
              if (next >= words.length - 1) return words.length - 1;
              currentWordRef.current = next;
              return next;
            });
          }, intervalMs);
        }
      }, 400);

      utterance.onend = () => {
        setIsPlaying(false);
        setActiveWordIndex(-1);
        currentWordRef.current = 0;
        clearTimeout(fallbackTimeout);
        if (fallbackTimer) clearInterval(fallbackTimer);
      };

      utterance.onerror = (e) => {
        if ((e as any).error !== 'interrupted' && (e as any).error !== 'canceled') {
          console.warn('SpeechSynthesis error:', e);
        }
        clearTimeout(fallbackTimeout);
        if (fallbackTimer) clearInterval(fallbackTimer);
      };

      // Small delay prevents Chromium cancel-speak race condition
      const speakTimeout = setTimeout(() => {
        if (isPlayingRef.current) {
          window.speechSynthesis.speak(utterance);
        }
      }, 50);

      return () => {
        clearTimeout(speakTimeout);
        clearTimeout(fallbackTimeout);
        if (fallbackTimer) clearInterval(fallbackTimer);
      };
    },
    [words]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isPlaying || !currentText) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const cleanup = speakFromWord(currentWordRef.current, settings.readingSpeed);

    return () => {
      cleanup?.();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentText, settings.readingSpeed, speakFromWord]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleToggleSimplify = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveWordIndex(-1);
    currentWordRef.current = 0;
    setIsSimplifying(true);
    setTimeout(() => { setSimplifiedMode(!simplifiedMode); setIsSimplifying(false); }, 600);
  };

  const currentQuestion: Question | undefined = lesson?.questions[currentQuestionIdx];

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !currentQuestion || !lesson) return;
    const responseTimeMs = Date.now() - startTime;
    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) {
      setScore((s) => s + 1);
      setFeedback(currentQuestion.explanation);
    } else {
      setFeedback(currentQuestion.simplifiedExplanation || currentQuestion.explanation);
      setRetryCount((r) => r + 1);
    }

    // Submit attempt to backend
    try {
      const stored = localStorage.getItem('adaptlearn_user');
      const user   = stored ? JSON.parse(stored) : null;
      const studentId = user?.studentId;
      if (studentId) {
        await fetch('/api/attempts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('adaptlearn_token')}`,
          },
          body: JSON.stringify({
            studentId,
            lessonId:      lesson.id,
            questionId:    currentQuestion.id,
            chosenOption:  selectedOption,
            isCorrect:     correct,
            responseTimeMs,
            modalityUsed:  'AUDIO_TEXT',
            hintUsed:      hint !== null,
            retryCount,
            engineType:    'ML_ADAPTIVE',
          }),
        });
      }
    } catch { /* silent */ }
  };

  const handleNextQuestion = () => {
    if (!lesson) return;
    if (currentQuestionIdx < lesson.questions.length - 1) {
      setCurrentQuestionIdx((i) => i + 1);
      setSelectedOption(null);
      setSubmitted(false);
      setIsCorrect(null);
      setFeedback(null);
      setHint(null);
    } else {
      setQuizDone(true);
    }
  };

  // ── Loading / Error States ────────────────────────────────────────────────
  if (lessonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-sm font-semibold">Loading lesson…</p>
        </div>
      </div>
    );
  }

  if (lessonError || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <p className="font-bold text-slate-700">Lesson not found</p>
          <p className="text-xs text-slate-500">{lessonError}</p>
          <Link href="/student" className="text-brand-600 text-sm font-semibold hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ── Quiz Complete Screen ──────────────────────────────────────────────────
  if (quizDone) {
    const total = lesson.questions.length;
    const pct   = Math.round((score / total) * 100);
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="linguapath-card p-10 max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Lesson Complete! 🎉</h2>
            <p className="text-slate-600 text-sm">You scored <strong>{score}/{total}</strong> ({pct}%)</p>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-slate-500">
              {pct >= 80 ? 'Excellent work! The AI will now recommend harder content.' : pct >= 60 ? 'Good effort. Keep practising!' : 'Great try! The AI will adapt your next lesson.'}
            </p>
            <Link href="/student" className="block w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all">
              Return to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main Learning Studio ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Sticky progress bar */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/student" className="text-xs font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 font-semibold">
              Question {lesson.questions.length > 0 ? currentQuestionIdx + 1 : 0}/{lesson.questions.length}
            </span>
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full"
                style={{ width: lesson.questions.length > 0 ? `${((currentQuestionIdx) / lesson.questions.length) * 100}%` : '0%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Lesson Title */}
        <div className="linguapath-card p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
              {lesson.course?.category || 'Language Arts'} • {lesson.difficulty}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">{lesson.title}</h1>
            <p className="text-xs text-slate-500 mt-1">{lesson.summary}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateSettings({ fontSize: settings.fontSize === 'large' ? 'medium' : 'large' })}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Font: {settings.fontSize.toUpperCase()}
            </button>
            <button
              onClick={handleToggleSimplify}
              disabled={isSimplifying}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                simplifiedMode
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {simplifiedMode ? 'Simplified ON' : 'Simplify Text'}
            </button>
          </div>
        </div>

        {/* Reading Area */}
        <div className="linguapath-card p-8 bg-white space-y-8 shadow-xl border-brand-100">

          {/* Audio Controls */}
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
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsPlaying(false);
                  setActiveWordIndex(-1);
                  currentWordRef.current = 0;
                }}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white/60"
                title="Reset to beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div>
                <span className="text-xs font-bold text-brand-900 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-brand-600" /> Bimodal Audio Narration
                </span>
                <span className="text-[11px] text-slate-500">Synchronized word highlighting active</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold">Speed:</span>
              {[0.5, 0.75, 1.0, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => updateSettings({ readingSpeed: spd })}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                    settings.readingSpeed === spd
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Text Display */}
          <div
            className={`p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 leading-relaxed font-opendyslexic tracking-wide transition-all ${
              settings.fontSize === 'small' ? 'text-sm'
              : settings.fontSize === 'medium' ? 'text-base sm:text-lg'
              : settings.fontSize === 'large' ? 'text-xl'
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

          {/* Quiz Section */}
          {currentQuestion && (
            <div className="pt-6 border-t border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-brand-600" />
                  Q{currentQuestionIdx + 1}: {currentQuestion.questionText}
                </h3>
                <button
                  onClick={() => setHint(currentQuestion.simplifiedExplanation || 'Read the passage carefully to find the answer.')}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Hint?
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                    currentQuestion.difficulty === 'HARD'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : currentQuestion.difficulty === 'EASY'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}
                >
                  Level: {currentQuestion.difficulty}
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                  <Brain className="w-3 h-3" /> {currentQuestion.concept}
                </div>
              </div>

              {hint && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed animate-in fade-in">
                  <span className="font-bold block mb-1">💡 Hint:</span>
                  {hint}
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    disabled={submitted}
                    onClick={() => { setSelectedOption(idx); setSubmitted(false); }}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${
                      submitted
                        ? idx === currentQuestion.correctAnswer
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : idx === selectedOption
                          ? 'bg-rose-50 border-rose-300 text-rose-800'
                          : 'bg-white border-slate-200 text-slate-400'
                        : selectedOption === idx
                        ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{option}</span>
                    {submitted && idx === currentQuestion.correctAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {submitted && idx === selectedOption && idx !== currentQuestion.correctAnswer && <AlertCircle className="w-4 h-4 text-rose-500" />}
                    {!submitted && selectedOption === idx && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                  </button>
                ))}
              </div>

              {/* Submit / Next */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">Modality: AUDIO_TEXT · ML_ADAPTIVE</span>
                {!submitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                  >
                    Submit Answer <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                  >
                    {currentQuestionIdx < lesson.questions.length - 1 ? 'Next Question' : 'Finish Lesson'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Feedback */}
              {submitted && feedback && (
                <div className={`p-4 rounded-xl border text-xs leading-relaxed animate-in fade-in ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <div className="font-bold flex items-center gap-2 mb-1">
                    {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-amber-600" />}
                    {isCorrect ? 'Correct!' : 'Not quite — here\'s the explanation:'}
                  </div>
                  <p>{feedback}</p>
                </div>
              )}
            </div>
          )}

          {lesson.questions.length === 0 && (
            <div className="pt-6 border-t border-slate-200 text-center text-slate-500 text-sm">
              No quiz questions for this lesson yet.
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AccessibilityToolbar />
    </div>
  );
}
