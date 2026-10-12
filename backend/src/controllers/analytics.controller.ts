import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AssessmentService } from '../services/assessment.service';

export class AnalyticsController {
  static async getStudentAnalytics(req: Request, res: Response) {
    try {
      const data = await AnalyticsService.getStudentAnalytics(req.params.studentId);
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch student analytics' });
    }
  }

  static async getExperimentComparison(req: Request, res: Response) {
    try {
      const data = await AnalyticsService.getResearchExperimentComparison();
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch research comparison' });
    }
  }

  static async submitAssessment(req: Request, res: Response) {
    try {
      const { studentId, readingScore, comprehensionScore, averageResponseTimeMs, errorCount } = req.body;
      const result = await AssessmentService.submitAssessment({
        studentId,
        readingScore,
        comprehensionScore,
        averageResponseTimeMs,
        errorCount,
      });
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Assessment submission failed' });
    }
  }
}
