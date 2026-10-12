import { Request, Response } from 'express';
import { AdaptationService } from '../services/adaptation.service';
import { prisma } from '../config/db';

export class RecommendationController {
  static async getRecommendationForStudent(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const engineType = (req.query.engine as any) || 'ML_ADAPTIVE';

      const recommendation = await AdaptationService.getRecommendation(studentId, engineType);
      return res.status(200).json(recommendation);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch recommendation' });
    }
  }

  static async getExplanationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const explanation = await prisma.recommendationExplanation.findFirst({
        where: {
          OR: [{ id }, { recommendationId: id }],
        },
        include: {
          recommendation: true,
        },
      });

      if (!explanation) {
        return res.status(404).json({ error: 'Explanation not found' });
      }

      return res.status(200).json({
        ...explanation,
        featureImportances: JSON.parse(explanation.featureImportances),
        SHAPValues: JSON.parse(explanation.SHAPValues),
        observedData: JSON.parse(explanation.observedData),
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch explanation' });
    }
  }
}
