import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { FALLBACK_LESSON_1, FALLBACK_LESSON_2 } from '../config/fallbackLessons';

export class LessonController {
  static async getAllCourses(req: Request, res: Response) {
    try {
      let courses = await prisma.course.findMany({
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            include: { questions: true },
          },
        },
      });

      if (!courses || courses.length === 0) {
        courses = [
          {
            ...FALLBACK_LESSON_1.course,
            description: 'Interactive multimodal stories designed for dyslexic readers to boost decoding and contextual vocabulary.',
            createdAt: new Date(),
            lessons: [FALLBACK_LESSON_1],
          } as any,
          {
            ...FALLBACK_LESSON_2.course,
            description: 'Visual and auditory science lessons breaking complex natural ecosystems into clear, manageable concepts.',
            createdAt: new Date(),
            lessons: [FALLBACK_LESSON_2],
          } as any,
        ];
      }

      return res.status(200).json(courses);
    } catch (err: any) {
      console.warn('Database error in getAllCourses, returning fallback courses:', err);
      return res.status(200).json([
        {
          ...FALLBACK_LESSON_1.course,
          description: 'Interactive multimodal stories designed for dyslexic readers to boost decoding and contextual vocabulary.',
          createdAt: new Date(),
          lessons: [FALLBACK_LESSON_1],
        },
        {
          ...FALLBACK_LESSON_2.course,
          description: 'Visual and auditory science lessons breaking complex natural ecosystems into clear, manageable concepts.',
          createdAt: new Date(),
          lessons: [FALLBACK_LESSON_2],
        },
      ]);
    }
  }

  static async getAllLessons(req: Request, res: Response) {
    try {
      let lessons = await prisma.lesson.findMany({
        orderBy: { order: 'asc' },
        include: {
          course: true,
          questions: true,
        },
      });

      if (!lessons || lessons.length === 0) {
        lessons = [FALLBACK_LESSON_1 as any, FALLBACK_LESSON_2 as any];
      }

      return res.status(200).json(lessons);
    } catch (err: any) {
      console.warn('Database error in getAllLessons, returning fallback lessons:', err);
      return res.status(200).json([FALLBACK_LESSON_1, FALLBACK_LESSON_2]);
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

      const isLesson2 =
        String(req.params.id).includes('2') ||
        req.params.id === 'e052e372-4b43-483e-b277-6d3b7513f3a6';
      const activeLesson: any = lesson || (isLesson2 ? FALLBACK_LESSON_2 : FALLBACK_LESSON_1);

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
      let questionsList = activeLesson.questions || [];
      if (targetDifficulty) {
        const matched = questionsList.filter((q: any) => q.difficulty?.toUpperCase() === targetDifficulty);
        const others = questionsList.filter((q: any) => q.difficulty?.toUpperCase() !== targetDifficulty);
        questionsList = [...matched, ...others];
      }

      // Parse JSON string options for each question
      const formattedLesson = {
        ...activeLesson,
        targetDifficulty: targetDifficulty || activeLesson.difficulty,
        questions: questionsList.map((q: any) => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        })),
      };

      return res.status(200).json(formattedLesson);
    } catch (err: any) {
      console.warn('Database error in getLessonById, returning fallback lesson:', err);
      const isLesson2 =
        String(req.params.id).includes('2') ||
        req.params.id === 'e052e372-4b43-483e-b277-6d3b7513f3a6';
      return res.status(200).json(isLesson2 ? FALLBACK_LESSON_2 : FALLBACK_LESSON_1);
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
