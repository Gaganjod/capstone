import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';

const router = Router();

router.get('/courses', LessonController.getAllCourses);
router.get('/', LessonController.getAllLessons);
router.get('/:id', LessonController.getLessonById);
router.post('/create', LessonController.createLesson);

export default router;
