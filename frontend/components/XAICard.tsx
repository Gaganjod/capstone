'use client';

import React, { useState } from 'react';
import { Sparkles, Brain, Info, CheckCircle2, ChevronRight } from 'lucide-react';

interface XAICardProps {
  modality?: string;
  difficulty?: string;
  confidence?: number;
  featureImportances?: Record<string, number>;
  naturalLanguageReasoning?: string;
  observedData?: Record<string, number>;
  engineType?: string;
}

export const XAICard: React.FC<XAICardProps> = ({
  modality = 'AUDIO_TEXT',
  difficulty = 'MEDIUM',
  confidence = 0.87,
  featureImportances = {
    readingAccuracy: 0.36,
    audioPerformance: 0.29,
    averageResponseTime: 0.18,
    comprehensionScore: 0.11,
    errorRate: 0.06,
  },
  naturalLanguageReasoning = 'The recommendation was influenced mainly by recent reading accuracy and stronger performance during audio-supported activities.',
  observedData = {
    readingAccuracy: 68,
    audioPerformance: 86,
    textPerformance: 58,
    responseTimeMs: 6200,
    comprehension: 74,
  },
  engineType = 'ML_ADAPTIVE',
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'observed'>('explanation');

  const featureLabels: Record<string, string> = {
    readingAccuracy: 'Reading Accuracy',
    audioPerformance: 'Audio Modality Gains',
    averageResponseTime: 'Response Speed Pace',
    comprehensionScore: 'Comprehension Score',
    errorRate: 'Error Rate Trend',
    textPerformance: 'Text-only Score',
  };

  const confidencePct = Math.round(confidence * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Brain className="w-5 h-5 text-brand-300" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-brand-200 font-bold block">
                Explainable AI Engine ({engineType.replace('_', ' ')})
              </span>
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                Recommended Modality: <span className="text-teal-300">{modality.replace('_', ' + ')}</span>
              </h3>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              {confidencePct}% Confidence
            </div>
            <p className="text-[11px] text-slate-300 mt-1">Difficulty Target: {difficulty}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('explanation')}
          className={`flex-1 py-3 px-4 text-center border-b-2 transition-all ${
            activeTab === 'explanation'
              ? 'border-brand-600 text-brand-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Model Prediction & XAI
        </button>
        <button
          onClick={() => setActiveTab('observed')}
          className={`flex-1 py-3 px-4 text-center border-b-2 transition-all ${
            activeTab === 'observed'
              ? 'border-brand-600 text-brand-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Observed Learner Data
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 space-y-6">
        {activeTab === 'explanation' ? (
          <>
            {/* Feature Importance Bars */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>SHAP Feature Attribution Matrix</span>
                <span className="text-[10px] text-slate-400 font-normal">Relative Weight %</span>
              </h4>

              {Object.entries(featureImportances).map(([feat, val]) => {
                const percentage = Math.round((val || 0) * 100);
                return (
                  <div key={feat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{featureLabels[feat] || feat}</span>
                      <span className="font-bold text-brand-600">{percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-tealAccent-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Natural Language Explanation Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Info className="w-4 h-4 text-brand-600" />
                Natural Language Reasoning
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                "{naturalLanguageReasoning}"
              </p>
            </div>
          </>
        ) : (
          /* Observed Data Tab */
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-1">
              <span className="text-slate-500 font-semibold">Reading Accuracy</span>
              <p className="text-xl font-bold text-indigo-900">{observedData.readingAccuracy}%</p>
              <p className="text-[10px] text-slate-500">Based on recent decoded passages</p>
            </div>
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-100 space-y-1">
              <span className="text-slate-500 font-semibold">Audio Modality Score</span>
              <p className="text-xl font-bold text-teal-900">{observedData.audioPerformance}%</p>
              <p className="text-[10px] text-teal-700 font-medium">
                +{observedData.audioPerformance - (observedData.textPerformance || 58)}% over text-only
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-semibold">Comprehension Score</span>
              <p className="text-xl font-bold text-slate-800">{observedData.comprehension}%</p>
              <p className="text-[10px] text-slate-500">Question answering accuracy</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1">
              <span className="text-slate-500 font-semibold">Avg Response Pace</span>
              <p className="text-xl font-bold text-amber-900">
                {((observedData.responseTimeMs || 6200) / 1000).toFixed(1)}s
              </p>
              <p className="text-[10px] text-slate-500">Per reading question</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
