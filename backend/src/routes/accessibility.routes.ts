import { Router } from 'express';
import { AccessibilityController } from '../controllers/accessibility.controller';

const router = Router();

router.get('/:studentId', AccessibilityController.getSettings);
router.put('/', AccessibilityController.updateSettings);

export default router;
