"use client";
import React, { useEffect, useState } from 'react';
import { getMetrics, trainModel, retrainModel, listVersions } from '../../services/mlService';
import MetricCard from '../../components/MetricCard';

export default function TrainingPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [versions, setVersions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ n_samples: 1200, seed: 42, model_type: 'auto' });

  const fetchMetrics = async () => {
    const data = await getMetrics();
    setMetrics(data);
  };

  const fetchVersions = async () => {
    const data = await listVersions();
    setVersions(data);
  };

  useEffect(() => {
    fetchMetrics();
    fetchVersions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await trainModel(form);
      setMetrics(result.metrics);
      await fetchVersions();
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setLoading(true);
    try {
      const result = await retrainModel();
      setMetrics(result.metrics);
      await fetchVersions();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 bg-gradient-to-br from-indigo-900 via-slate-800 to-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Model Training Dashboard</h1>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(metrics).map(([key, value]) => (
            <MetricCard key={key} title={key.replace(/_/g, ' ')} value={String(value)} />
          ))}
        </div>
      )}

      {/* Training Form */}
      <form className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-4">Trigger Custom Training</h2>
        <label className="block mb-2">
          Samples
          <input
            type="number"
            min={100}
            value={form.n_samples}
            onChange={e => setForm({ ...form, n_samples: +e.target.value })}
            className="mt-1 w-full rounded bg-gray-700 p-2"
          />
        </label>
        <label className="block mb-2">
          Seed
          <input
            type="number"
            min={0}
            value={form.seed}
            onChange={e => setForm({ ...form, seed: +e.target.value })}
            className="mt-1 w-full rounded bg-gray-700 p-2"
          />
        </label>
        <label className="block mb-4">
          Model Type
          <select
            value={form.model_type}
            onChange={e => setForm({ ...form, model_type: e.target.value })}
            className="mt-1 w-full rounded bg-gray-700 p-2"
          >
            <option value="auto">Auto (detect best)</option>
            <option value="xgboost">XGBoost</option>
            <option value="gbc">GradientBoosting</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-indigo-600 rounded hover:bg-indigo-500 transition-colors"
        >
          {loading ? 'Training…' : 'Start Training'}
        </button>
      </form>

      {/* Retrain Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleRetrain}
          disabled={loading}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors"
        >
          {loading ? 'Retraining…' : 'Quick Retrain (default)'}
        </button>
      </div>

      {/* Versions List */}
      {versions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl mb-2">Saved Model Versions</h2>
          <ul className="list-disc list-inside">
            {versions.map(v => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
