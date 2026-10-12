import { Request, Response } from 'express';
import { AIService } from '../services/ai.service';

export class GenAIController {
  static async simplifyText(req: Request, res: Response) {
    try {
      const { text, readingLevel, studentId } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text parameter is required' });
      }
      const result = await AIService.simplifyText(text, readingLevel);

      if (studentId) {
        await AIService.logAIInteraction(studentId, 'SIMPLIFY_TEXT', text, result.simplifiedText);
      }

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Text simplification failed' });
    }
  }

  static async generateHint(req: Request, res: Response) {
    try {
      const { questionText, concept, errorCount, studentId } = req.body;
      const result = await AIService.generateHint(questionText, concept, errorCount || 1);

      if (studentId) {
        await AIService.logAIInteraction(studentId, 'GENERATE_HINT', questionText || concept, result.hintText);
      }

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Hint generation failed' });
    }
  }

  static async generateExplanation(req: Request, res: Response) {
    try {
      const { concept, studentAnswer, correctAnswer, studentId } = req.body;
      const result = await AIService.generateExplanation(concept, studentAnswer, correctAnswer);

      if (studentId) {
        await AIService.logAIInteraction(
          studentId,
          'EXPLAIN_CONCEPT',
          `Concept: ${concept}, Student: ${studentAnswer}`,
          result.explanationText
        );
      }

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Explanation generation failed' });
    }
  }
}
