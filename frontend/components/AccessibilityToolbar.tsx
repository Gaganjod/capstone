'use client';

import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Sliders, Volume2, Type, Eye, Sparkles, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

export const AccessibilityToolbar: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Controls Panel */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              Dyslexia Toolbar
            </h3>
            <button
              onClick={resetSettings}
              className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1"
              title="Reset defaults"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Font Family */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-brand-500" />
              Font Family
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => updateSettings({ fontFamily: 'OpenDyslexic' })}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all ${
                  settings.fontFamily === 'OpenDyslexic'
                    ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                OpenDyslexic
              </button>
              <button
                onClick={() => updateSettings({ fontFamily: 'Inter' })}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all ${
                  settings.fontFamily === 'Inter'
                    ? 'bg-brand-50 border-brand-500 text-brand-700 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Standard Inter
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Font Size Scaling
            </label>
            <div className="grid grid-cols-4 gap-1 text-center">
              {(['small', 'medium', 'large', 'extra-large'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateSettings({ fontSize: sz })}
                  className={`py-1 text-xs rounded-md border capitalize ${
                    settings.fontSize === sz
                      ? 'bg-brand-600 text-white font-bold border-brand-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {sz === 'extra-large' ? 'XL' : sz}
                </button>
              ))}
            </div>
          </div>

          {/* Letter Spacing */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Letter Spacing
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['normal', 'wide', 'extra-wide'] as const).map((sp) => (
                <button
                  key={sp}
                  onClick={() => updateSettings({ letterSpacing: sp })}
                  className={`py-1 text-xs rounded-md border capitalize ${
                    settings.letterSpacing === sp
                      ? 'bg-tealAccent-500 text-white font-bold border-tealAccent-500'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Line Spacing
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['normal', 'comfortable', 'large'] as const).map((lh) => (
                <button
                  key={lh}
                  onClick={() => updateSettings({ lineSpacing: lh })}
                  className={`py-1 text-xs rounded-md border capitalize ${
                    settings.lineSpacing === lh
                      ? 'bg-amberAccent-500 text-white font-bold border-amberAccent-500'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {lh}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Speed */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-brand-500" />
              Audio Speed ({settings.readingSpeed}x)
            </label>
            <div className="grid grid-cols-4 gap-1">
              {[0.75, 1.0, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => updateSettings({ readingSpeed: spd })}
                  className={`py-1 text-xs rounded-md border ${
                    settings.readingSpeed === spd
                      ? 'bg-brand-600 text-white font-bold border-brand-600'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Contrast & Highlighting Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500" /> High Contrast
              </span>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Audio Word Highlighting
              </span>
              <input
                type="checkbox"
                checked={settings.highlightReading}
                onChange={(e) => updateSettings({ highlightReading: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105 border border-white/20"
      >
        <Sliders className="w-4 h-4" />
        <span>Accessibility</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>
    </div>
  );
};
