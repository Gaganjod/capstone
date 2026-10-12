import { Router } from 'express';
import { GenAIController } from '../controllers/genai.controller';

const router = Router();

router.post('/simplify', GenAIController.simplifyText);
router.post('/hint', GenAIController.generateHint);
router.post('/explanation', GenAIController.generateExplanation);

export default router;
