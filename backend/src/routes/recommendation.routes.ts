import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';

const router = Router();

router.get('/explanation/:id', RecommendationController.getExplanationById);
router.get('/:studentId', RecommendationController.getRecommendationForStudent);

export default router;
