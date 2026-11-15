import axios from 'axios';

// Route through backend proxy /api/ml so it works seamlessly in both local and deployed environments
const API_BASE = '/api/ml';

export const getMetrics = async () => {
  const { data } = await axios.get(`${API_BASE}/metrics`);
  return data;
};

export const getHealth = async () => {
  const { data } = await axios.get(`${API_BASE}/health`);
  return data;
};

export const trainModel = async (config?: {
  n_samples?: number;
  seed?: number;
  model_type?: string;
}) => {
  const { data } = await axios.post(`${API_BASE}/train`, config ?? {});
  return data;
};

export const retrainModel = async () => {
  const { data } = await axios.post(`${API_BASE}/retrain`);
  return data;
};

export const syncAndTrain = async () => {
  const { data } = await axios.post(`${API_BASE}/sync-and-train`);
  return data;
};

export const listVersions = async () => {
  const { data } = await axios.get(`${API_BASE}/versions`);
  return data;
};

