import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';

const router = Router();

router.get('/', StudentController.getAllStudents);
router.get('/:id', StudentController.getStudentById);
router.get('/:studentId/learner-state', StudentController.getLearnerState);

export default router;
