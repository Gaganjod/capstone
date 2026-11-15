"use client";
import React, { useEffect, useState } from 'react';
import { getMetrics, trainModel, retrainModel, listVersions, syncAndTrain } from '../../services/mlService';
import MetricCard from '../../components/MetricCard';

export default function TrainingPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [versions, setVersions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [form, setForm] = useState({ n_samples: 1200, seed: 42, model_type: 'auto' });

  const fetchMetrics = async () => {
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (e) {
      console.warn('Could not load ML metrics:', e);
    }
  };

  const fetchVersions = async () => {
    try {
      const data = await listVersions();
      setVersions(data);
    } catch (e) {
      console.warn('Could not load ML versions:', e);
    }
  };

  useEffect(() => {
    fetchMetrics();
    fetchVersions();
  }, []);

  const handleSyncAndTrain = async () => {
    setLoading(true);
    setSyncStatus('Aggregating real classroom attempts and training ML engine...');
    try {
      const result = await syncAndTrain();
      if (result.metrics) {
        setMetrics(result.metrics);
      }
      await fetchVersions();
      setSyncStatus(`Successfully synchronized ${result.studentsCount || 0} students (${result.datasetRecords || 0} telemetry points) and updated ML weights!`);
    } catch (err: any) {
      setSyncStatus(`Sync error: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Live Classroom Sync & Train Card */}
      <div className="max-w-xl mx-auto bg-slate-800/90 border border-indigo-500/30 rounded-xl p-6 shadow-xl mb-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-lg text-2xl">
            🧠
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-1">
              Live Classroom Telemetry & Model Retraining
            </h2>
            <p className="text-sm text-slate-300 mb-4">
              Pulls real student learning logs (response latencies, reading accuracy, error rate, modality efficacy) directly from the database and updates the active recommendation engine.
            </p>
            <button
              onClick={handleSyncAndTrain}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Retraining ML Models...' : 'Sync Live Telemetry & Retrain Model 🔄'}
            </button>
            {syncStatus && (
              <p className="mt-3 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-lg">
                {syncStatus}
              </p>
            )}
          </div>
        </div>
      </div>

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
        <div className="mt-8 max-w-xl mx-auto">
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
