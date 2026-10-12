import { Router } from 'express';
import { AttemptController } from '../controllers/attempt.controller';

const router = Router();

router.post('/', AttemptController.createAttempt);

export default router;
