import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

const router = Router();

router.get('/student/:studentId', AnalyticsController.getStudentAnalytics);
router.get('/experiment', AnalyticsController.getExperimentComparison);
router.post('/assessment', AnalyticsController.submitAssessment);

export default router;
