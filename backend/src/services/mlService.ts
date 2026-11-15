import axios from 'axios';
import { ENV } from '../config/env';

const ML_URL = process.env.ML_SERVICE_URL || ENV.ML_SERVICE_URL || 'http://127.0.0.1:8000';

export const getMetrics = async () => {
  const { data } = await axios.get(`${ML_URL}/metrics`);
  return data;
};

export const getHealth = async () => {
  const { data } = await axios.get(`${ML_URL}/health`);
  return data;
};

export const trainModel = async (config?: {
  n_samples?: number;
  seed?: number;
  model_type?: string;
}) => {
  const { data } = await axios.post(`${ML_URL}/train`, config ?? {});
  return data;
};

export const retrainModel = async () => {
  const { data } = await axios.post(`${ML_URL}/retrain`);
  return data;
};

export const listVersions = async () => {
  const { data } = await axios.get(`${ML_URL}/versions`);
  return data;
};
