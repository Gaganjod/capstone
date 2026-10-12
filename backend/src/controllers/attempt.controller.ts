import { Request, Response } from 'express';
import { LearnerService } from '../services/learner.service';

export class AttemptController {
  static async createAttempt(req: Request, res: Response) {
    try {
      const {
        studentId,
        lessonId,
        questionId,
        chosenOption,
        isCorrect,
        responseTimeMs,
        modalityUsed,
        hintUsed,
        retryCount,
        engineType,
      } = req.body;

      if (!studentId || !lessonId || !questionId) {
        return res.status(400).json({ error: 'studentId, lessonId, and questionId are required' });
      }

      const result = await LearnerService.recordAttemptAndUpdateState({
        studentId,
        lessonId,
        questionId,
        chosenOption: chosenOption ?? 0,
        isCorrect: Boolean(isCorrect),
        responseTimeMs: responseTimeMs || 5000,
        modalityUsed: modalityUsed || 'AUDIO_TEXT',
        hintUsed: Boolean(hintUsed),
        retryCount: retryCount || 0,
        engineType: engineType || 'ML_ADAPTIVE',
      });

      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to submit attempt' });
    }
  }
}
