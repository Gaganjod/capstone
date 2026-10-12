import { prisma } from '../config/db';

export class AssessmentService {
  static async submitAssessment(data: {
    studentId: string;
    readingScore: number; // 0 - 100
    comprehensionScore: number; // 0 - 100
    averageResponseTimeMs: number;
    errorCount: number;
  }) {
    // Determine baseline recommendation
    let recommendedDifficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM';
    if (data.readingScore < 60) {
      recommendedDifficulty = 'EASY';
    } else if (data.readingScore > 85) {
      recommendedDifficulty = 'HARD';
    }

    const recommendedModality = data.readingScore < 75 ? 'AUDIO_TEXT' : 'HIGHLIGHTED_TEXT';
    const recommendedPacing = data.averageResponseTimeMs > 8000 ? 'SLOWER' : 'STANDARD';

    // Update Learner State with baseline
    const learnerState = await prisma.learnerState.update({
      where: { studentId: data.studentId },
      data: {
        readingAccuracy: data.readingScore,
        comprehensionScore: data.comprehensionScore,
        averageResponseTime: data.averageResponseTimeMs,
        errorRate: Math.min(1.0, data.errorCount / 10.0),
        audioPerformance: data.readingScore + 18.0, // Initial estimate
        textPerformance: Math.max(30.0, data.readingScore - 8.0),
        currentDifficulty: recommendedDifficulty,
        preferredModality: recommendedModality,
        pacingMode: recommendedPacing,
      },
    });

    return {
      studentId: data.studentId,
      readingAccuracy: data.readingScore,
      comprehensionScore: data.comprehensionScore,
      averageResponseTime: data.averageResponseTimeMs,
      recommendedDifficulty,
      recommendedModality,
      recommendedPacing,
      disclaimer: 'These metrics are learning-system estimates for adaptive personalization, not a clinical medical diagnosis.',
      learnerState,
    };
  }
}
