import { Router } from 'express';
import {
  getHealth,
  getMetrics,
  trainModel,
  retrainModel,
  listVersions,
} from '../services/mlService';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    const data = await getHealth();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'ML health check failed' });
  }
});

router.get('/metrics', async (req, res) => {
  try {
    const data = await getMetrics();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'ML metrics fetch failed' });
  }
});

router.post('/train', async (req, res) => {
  try {
    const data = await trainModel(req.body);
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'ML train request failed' });
  }
});

router.post('/retrain', async (req, res) => {
  try {
    const data = await retrainModel();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'ML retrain request failed' });
  }
});

router.get('/versions', async (req, res) => {
  try {
    const data = await listVersions();
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'ML versions fetch failed' });
  }
});

export default router;
