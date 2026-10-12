import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import lessonRoutes from './lesson.routes';
import attemptRoutes from './attempt.routes';
import recommendationRoutes from './recommendation.routes';
import analyticsRoutes from './analytics.routes';
import accessibilityRoutes from './accessibility.routes';
import genaiRoutes from './genai.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/lessons', lessonRoutes);
router.use('/attempts', attemptRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/accessibility', accessibilityRoutes);
router.use('/genai', genaiRoutes);

export default router;
