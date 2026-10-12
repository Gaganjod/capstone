import { prisma } from '../config/db';

export class LearnerService {
  static async getLearnerState(studentId: string) {
    let state = await prisma.learnerState.findUnique({
      where: { studentId },
    });
    if (!state) {
      state = await prisma.learnerState.create({
        data: {
          studentId,
          readingAccuracy: 68.0,
          comprehensionScore: 72.0,
          averageResponseTime: 6500.0,
          errorRate: 0.28,
          audioPerformance: 84.0,
          textPerformance: 62.0,
          currentDifficulty: 'MEDIUM',
          preferredModality: 'AUDIO_TEXT',
          pacingMode: 'STANDARD',
          feedbackStrategy: 'ENCOURAGING_ELABORATE',
          engagementScore: 85.0,
          recentPerformanceTrend: 'STABLE',
          attemptHistoryCount: 0,
        },
      });
    }
    return state;
  }

  static async recordAttemptAndUpdateState(data: {
    studentId: string;
    lessonId: string;
    questionId: string;
    chosenOption: number;
    isCorrect: boolean;
    responseTimeMs: number;
    modalityUsed: string;
    hintUsed: boolean;
    retryCount: number;
    engineType: string;
  }) {
    // 1. Create Attempt record
    const attempt = await prisma.attempt.create({
      data: {
        studentId: data.studentId,
        lessonId: data.lessonId,
        questionId: data.questionId,
        chosenOption: data.chosenOption,
        isCorrect: data.isCorrect,
        responseTimeMs: data.responseTimeMs,
        modalityUsed: data.modalityUsed,
        hintUsed: data.hintUsed,
        retryCount: data.retryCount,
        engineType: data.engineType,
      },
    });

    // 2. Fetch current learner state
    const currentState = await this.getLearnerState(data.studentId);

    // 3. Dynamic Learner Model Update (Exponential Moving Average)
    const alpha = 0.25; // smoothing factor for new observation
    const newCorrect = data.isCorrect ? 100 : 0;
    
    const updatedAccuracy = (1 - alpha) * currentState.readingAccuracy + alpha * newCorrect;
    const updatedComprehension = (1 - alpha) * currentState.comprehensionScore + alpha * (data.isCorrect ? 95 : 40);
    const updatedResponseTime = (1 - alpha) * currentState.averageResponseTime + alpha * data.responseTimeMs;
    const updatedErrorRate = (1 - alpha) * currentState.errorRate + alpha * (data.isCorrect ? 0.05 : 0.75);

    let updatedAudioPerf = currentState.audioPerformance;
    let updatedTextPerf = currentState.textPerformance;

    if (data.modalityUsed.includes('AUDIO')) {
      updatedAudioPerf = (1 - alpha) * currentState.audioPerformance + alpha * newCorrect;
    } else {
      updatedTextPerf = (1 - alpha) * currentState.textPerformance + alpha * newCorrect;
    }

    const attemptsCount = currentState.attemptHistoryCount + 1;
    const trend = updatedAccuracy > currentState.readingAccuracy ? 'IMPROVING' : 'DECLINING';

    // 4. Update Database LearnerState
    const updatedState = await prisma.learnerState.update({
      where: { studentId: data.studentId },
      data: {
        readingAccuracy: Math.round(updatedAccuracy * 10) / 10,
        comprehensionScore: Math.round(updatedComprehension * 10) / 10,
        averageResponseTime: Math.round(updatedResponseTime),
        errorRate: Math.round(updatedErrorRate * 100) / 100,
        audioPerformance: Math.round(updatedAudioPerf * 10) / 10,
        textPerformance: Math.round(updatedTextPerf * 10) / 10,
        recentPerformanceTrend: trend,
        attemptHistoryCount: attemptsCount,
      },
    });

    return { attempt, updatedState };
  }
}
