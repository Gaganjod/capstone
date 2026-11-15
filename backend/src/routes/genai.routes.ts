import { Router } from 'express';
import { GenAIController } from '../controllers/genai.controller';

const router = Router();

router.post('/simplify', GenAIController.simplifyText);
router.post('/hint', GenAIController.generateHint);
router.post('/explanation', GenAIController.generateExplanation);
router.post('/questions', GenAIController.generateQuestions);

export default router;
