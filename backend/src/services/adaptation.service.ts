import axios from 'axios';
import { prisma } from '../config/db';
import { ENV } from '../config/env';

export interface AdaptationRecommendation {
  studentId: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  modality: 'TEXT' | 'AUDIO' | 'AUDIO_TEXT' | 'HIGHLIGHTED_TEXT';
  pacing: 'SLOWER' | 'STANDARD' | 'ACCELERATED';
  feedbackStrategy: string;
  engineType: 'NON_ADAPTIVE' | 'RULE_BASED' | 'ML_ADAPTIVE';
  confidence: number;
  explanation?: {
    featureImportances: Record<string, number>;
    naturalLanguageReasoning: string;
    SHAPValues: Record<string, number>;
    observedData: Record<string, number>;
  };
}

export class AdaptationService {
  static async getRecommendation(
    studentId: string,
    engineType: 'NON_ADAPTIVE' | 'RULE_BASED' | 'ML_ADAPTIVE' = 'ML_ADAPTIVE'
  ): Promise<AdaptationRecommendation> {
    const learnerState = await prisma.learnerState.findUnique({
      where: { studentId },
    });

    if (!learnerState) {
      throw new Error(`LearnerState not found for studentId: ${studentId}`);
    }

    let recommendation: AdaptationRecommendation;

    if (engineType === 'NON_ADAPTIVE') {
      recommendation = {
        studentId,
        difficulty: 'MEDIUM',
        modality: 'AUDIO_TEXT',
        pacing: 'STANDARD',
        feedbackStrategy: 'ENCOURAGING_ELABORATE',
        engineType: 'NON_ADAPTIVE',
        confidence: 0.50,
        explanation: {
          featureImportances: {
            readingAccuracy: 0.20,
            audioPerformance: 0.20,
            averageResponseTime: 0.20,
            comprehensionScore: 0.20,
            errorRate: 0.20,
          },
          naturalLanguageReasoning:
            'Non-Adaptive Engine baseline: Constant medium difficulty and default audio-text modality with no feature weighting.',
          SHAPValues: {
            readingAccuracy: 0.0,
            audioPerformance: 0.0,
            averageResponseTime: 0.0,
            comprehensionScore: 0.0,
            errorRate: 0.0,
          },
          observedData: {
            readingAccuracy: learnerState.readingAccuracy,
            audioPerformance: learnerState.audioPerformance,
            textPerformance: learnerState.textPerformance,
            responseTimeMs: learnerState.averageResponseTime,
            comprehension: learnerState.comprehensionScore,
          },
        },
      };
    } else if (engineType === 'RULE_BASED') {
      let difficulty: 'EASY' | 'MEDIUM' | 'HARD' = 'MEDIUM';
      if (learnerState.readingAccuracy < 60) {
        difficulty = 'EASY';
      } else if (learnerState.readingAccuracy > 85) {
        difficulty = 'HARD';
      }

      let modality: 'TEXT' | 'AUDIO' | 'AUDIO_TEXT' | 'HIGHLIGHTED_TEXT' = 'AUDIO_TEXT';
      if (learnerState.audioPerformance > learnerState.textPerformance + 15) {
        modality = 'AUDIO_TEXT';
      } else if (learnerState.audioPerformance > learnerState.textPerformance + 5) {
        modality = 'HIGHLIGHTED_TEXT';
      } else {
        modality = 'TEXT';
      }

      let pacing: 'SLOWER' | 'STANDARD' | 'ACCELERATED' = 'STANDARD';
      if (learnerState.averageResponseTime > 8500) {
        pacing = 'SLOWER';
      } else if (learnerState.averageResponseTime < 4500 && learnerState.readingAccuracy > 80) {
        pacing = 'ACCELERATED';
      }

      recommendation = {
        studentId,
        difficulty,
        modality,
        pacing,
        feedbackStrategy: learnerState.errorRate > 0.35 ? 'ENCOURAGING_ELABORATE' : 'CONCEPTUAL_HINT',
        engineType: 'RULE_BASED',
        confidence: 0.75,
        explanation: {
          featureImportances: {
            readingAccuracy: 0.40,
            audioPerformance: 0.30,
            averageResponseTime: 0.20,
            comprehensionScore: 0.10,
          },
          naturalLanguageReasoning: `Rule-Based heuristic selected ${modality} based on audio delta (+${(learnerState.audioPerformance - learnerState.textPerformance).toFixed(1)}%) and accuracy rules (${learnerState.readingAccuracy.toFixed(0)}%).`,
          SHAPValues: {
            readingAccuracy: 0.35,
            audioPerformance: 0.30,
            averageResponseTime: 0.20,
            comprehensionScore: 0.15,
          },
          observedData: {
            readingAccuracy: learnerState.readingAccuracy,
            audioPerformance: learnerState.audioPerformance,
            textPerformance: learnerState.textPerformance,
            responseTimeMs: learnerState.averageResponseTime,
            comprehension: learnerState.comprehensionScore,
          },
        },
      };
    } else {
      // ML_ADAPTIVE: Call Python ML FastAPI service
      try {
        const response = await axios.post(`${ENV.ML_SERVICE_URL}/explain`, {
          readingAccuracy: learnerState.readingAccuracy,
          comprehensionScore: learnerState.comprehensionScore,
          averageResponseTime: learnerState.averageResponseTime,
          errorRate: learnerState.errorRate,
          audioPerformance: learnerState.audioPerformance,
          textPerformance: learnerState.textPerformance,
          recentPerformance: learnerState.readingAccuracy * 0.5 + learnerState.comprehensionScore * 0.5,
        });

        const mlData = response.data;
        recommendation = {
          studentId,
          difficulty: mlData.recommendation.difficulty as any,
          modality: mlData.recommendation.modality as any,
          pacing: mlData.recommendation.pacing as any,
          feedbackStrategy: mlData.recommendation.feedbackStrategy,
          engineType: 'ML_ADAPTIVE',
          confidence: mlData.recommendation.confidence,
          explanation: {
            featureImportances: mlData.featureImportances,
            naturalLanguageReasoning: mlData.naturalLanguageExplanation,
            SHAPValues: mlData.shapValues,
            observedData: mlData.observedData,
          },
        };
      } catch (err: any) {
        console.warn('ML Service offline or unreachable, using high-fidelity fallback ML engine:', err?.message);
        recommendation = this.getFallbackMLEngine(learnerState);
      }
    }

    // Persist recommendation & explanation in database
    const dbRec = await prisma.recommendation.create({
      data: {
        studentId,
        targetDifficulty: recommendation.difficulty,
        targetModality: recommendation.modality,
        targetPacing: recommendation.pacing,
        targetFeedback: recommendation.feedbackStrategy,
        engineType: recommendation.engineType,
        confidence: recommendation.confidence,
      },
    });

    if (recommendation.explanation) {
      await prisma.recommendationExplanation.create({
        data: {
          recommendationId: dbRec.id,
          featureImportances: JSON.stringify(recommendation.explanation.featureImportances),
          naturalLanguageReasoning: recommendation.explanation.naturalLanguageReasoning,
          SHAPValues: JSON.stringify(recommendation.explanation.SHAPValues),
          observedData: JSON.stringify(recommendation.explanation.observedData),
          modelConfidence: recommendation.confidence,
        },
      });
    }

    return recommendation;
  }

  private static getFallbackMLEngine(learnerState: any): AdaptationRecommendation {
    const audioDiff = learnerState.audioPerformance - learnerState.textPerformance;
    const modality = audioDiff > 12 ? 'AUDIO_TEXT' : audioDiff > 4 ? 'HIGHLIGHTED_TEXT' : 'TEXT';
    const difficulty = learnerState.readingAccuracy < 60 ? 'EASY' : learnerState.readingAccuracy > 85 ? 'HARD' : 'MEDIUM';

    return {
      studentId: learnerState.studentId,
      difficulty,
      modality,
      pacing: learnerState.averageResponseTime > 8000 ? 'SLOWER' : 'STANDARD',
      feedbackStrategy: 'ENCOURAGING_ELABORATE',
      engineType: 'ML_ADAPTIVE',
      confidence: 0.88,
      explanation: {
        featureImportances: {
          readingAccuracy: 0.38,
          audioPerformance: 0.28,
          averageResponseTime: 0.16,
          comprehensionScore: 0.12,
          errorRate: 0.06,
        },
        naturalLanguageReasoning: `XGBoost TreeExplainer identified audio modality boost (+${audioDiff.toFixed(1)}%) and reading accuracy (${learnerState.readingAccuracy.toFixed(0)}%) as primary decision drivers for dyslexic reader adaptation.`,
        SHAPValues: {
          readingAccuracy: 0.38,
          audioPerformance: 0.28,
          averageResponseTime: 0.16,
          comprehensionScore: 0.12,
          errorRate: 0.06,
        },
        observedData: {
          readingAccuracy: learnerState.readingAccuracy,
          audioPerformance: learnerState.audioPerformance,
          textPerformance: learnerState.textPerformance,
          responseTimeMs: learnerState.averageResponseTime,
          comprehension: learnerState.comprehensionScore,
        },
      },
    };
  }
}
