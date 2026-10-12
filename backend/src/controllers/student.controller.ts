import { Request, Response } from 'express';
import { prisma } from '../config/db';
import { LearnerService } from '../services/learner.service';

export class StudentController {
  static async getAllStudents(req: Request, res: Response) {
    try {
      const students = await prisma.studentProfile.findMany({
        include: {
          user: {
            select: { name: true, email: true, createdAt: true },
          },
          learnerState: true,
          accessibility: true,
        },
      });
      return res.status(200).json(students);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to list students' });
    }
  }

  static async getStudentById(req: Request, res: Response) {
    try {
      const student = await prisma.studentProfile.findUnique({
        where: { id: req.params.id },
        include: {
          user: {
            select: { name: true, email: true, createdAt: true },
          },
          learnerState: true,
          accessibility: true,
          attempts: {
            take: 10,
            orderBy: { timestamp: 'desc' },
            include: { lesson: true, question: true },
          },
          recommendations: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { explanation: true },
          },
        },
      });

      if (!student) {
        return res.status(404).json({ error: 'Student profile not found' });
      }

      return res.status(200).json(student);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch student' });
    }
  }

  static async getLearnerState(req: Request, res: Response) {
    try {
      const state = await LearnerService.getLearnerState(req.params.studentId);
      return res.status(200).json(state);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch learner state' });
    }
  }
}
