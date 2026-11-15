import { Request, Response } from 'express';
import { prisma } from '../config/db';

export class LessonController {
  static async getAllCourses(req: Request, res: Response) {
    try {
      const courses = await prisma.course.findMany({
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: { questions: true },
          },
        },
      });
      return res.status(200).json(courses);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch courses' });
    }
  }

  static async getAllLessons(req: Request, res: Response) {
    try {
      const lessons = await prisma.lesson.findMany({
        orderBy: { order: 'asc' },
        include: {
          course: true,
          questions: true,
        },
      });
      return res.status(200).json(lessons);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch lessons' });
    }
  }

  static async getLessonById(req: Request, res: Response) {
    try {
      let lesson = await prisma.lesson.findUnique({
        where: { id: req.params.id },
        include: {
          course: true,
          questions: true,
        },
      });

      if (!lesson) {
        const orderMatch = req.params.id.match(/^lesson-(\d+)$/i);
        if (orderMatch) {
          const orderNum = parseInt(orderMatch[1], 10);
          lesson = await prisma.lesson.findFirst({
            where: { order: orderNum },
            include: {
              course: true,
              questions: true,
            },
          });
        }

        if (!lesson && (req.params.id === 'lesson-1' || req.params.id === 'default')) {
          lesson = await prisma.lesson.findFirst({
            orderBy: { order: 'asc' },
            include: {
              course: true,
              questions: true,
            },
          });
        }
      }

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      // Check if studentId or difficulty was requested for adaptive question filtering
      let targetDifficulty = (req.query.difficulty as string)?.toUpperCase();

      if (!targetDifficulty && req.query.studentId) {
        const studentProfile = await prisma.studentProfile.findFirst({
          where: {
            OR: [
              { id: req.query.studentId as string },
              { userId: req.query.studentId as string },
            ],
          },
          include: { learnerState: true },
        });

        if (studentProfile?.learnerState?.currentDifficulty) {
          targetDifficulty = studentProfile.learnerState.currentDifficulty.toUpperCase();
        }
      }

      // Adapt question ordering: questions matching the student's level come first
      let questionsList = lesson.questions;
      if (targetDifficulty) {
        const matched = lesson.questions.filter((q) => q.difficulty.toUpperCase() === targetDifficulty);
        const others = lesson.questions.filter((q) => q.difficulty.toUpperCase() !== targetDifficulty);
        questionsList = [...matched, ...others];
      }

      // Parse JSON string options for each question
      const formattedLesson = {
        ...lesson,
        targetDifficulty: targetDifficulty || lesson.difficulty,
        questions: questionsList.map((q) => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        })),
      };

      return res.status(200).json(formattedLesson);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch lesson' });
    }
  }

  static async createLesson(req: Request, res: Response) {
    try {
      const { courseId, title, summary, content, simplifiedContent, audioUrl, difficulty, order, questions } = req.body;

      const lesson = await prisma.lesson.create({
        data: {
          courseId,
          title,
          summary,
          content,
          simplifiedContent: simplifiedContent || content,
          audioUrl,
          difficulty: difficulty || 'MEDIUM',
          order: order || 1,
          questions: questions ? {
            create: questions.map((q: any) => ({
              questionText: q.questionText,
              options: JSON.stringify(q.options),
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              simplifiedExplanation: q.simplifiedExplanation || q.explanation,
              difficulty: q.difficulty || 'MEDIUM',
              concept: q.concept || 'Reading Comprehension',
            })),
          } : undefined,
        },
        include: { questions: true },
      });

      return res.status(201).json(lesson);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to create lesson' });
    }
  }
}
