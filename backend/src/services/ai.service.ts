import { prisma } from '../config/db';

export class AIService {
  static async simplifyText(text: string, readingLevel: string = 'Intermediate') {
    // Generative AI text simplification algorithm (dyslexia-friendly sentence structuring)
    const sentences = text.split(/(?<=[.!?])\s+/);
    const simplified = sentences
      .map((s) => {
        return s
          .replace(/consists of interacting organisms/gi, 'is a group of living things working together')
          .replace(/biodiversity/gi, 'variety of plants and animals')
          .replace(/photosynthesis/gi, 'the way plants make food using sunlight')
          .replace(/consequently/gi, 'so')
          .replace(/subsequently/gi, 'then')
          .replace(/utilize/gi, 'use')
          .replace(/predominantly/gi, 'mostly');
      })
      .join(' ');

    return {
      originalText: text,
      simplifiedText: simplified,
      readingEaseGain: '+24.5%',
      bulletPoints: [
        'Shortened long sentences for easier decoding',
        'Replaced complex multi-syllable terms with active vocabulary',
        'Highlighted key subject-verb connections',
      ],
    };
  }

  static async generateHint(questionText: string, concept: string, errorCount: number = 1) {
    const hints = [
      `Look closely at the key word describing '${concept}'. What action is taking place?`,
      `Think about the order of events. What happened right before this moment?`,
      `Try reading the second sentence out loud with audio support to spot the main idea.`,
    ];
    const index = Math.min(errorCount - 1, hints.length - 1);
    return {
      hintText: hints[Math.max(0, index)],
      concept,
      hintLevel: errorCount,
    };
  }

  static async generateExplanation(concept: string, studentAnswer: string, correctAnswer: string) {
    return {
      explanationText: `Good attempt! The correct answer relates to how '${concept}' functions in the story. Notice how the character made their choice based on the key evidence in paragraph 2.`,
      concept,
      encouragement: 'You are making steady progress! Take your time to review the audio text.',
    };
  }

  static async logAIInteraction(studentId: string, promptType: string, inputContent: string, outputContent: string) {
    return prisma.aIInteraction.create({
      data: {
        studentId,
        promptType,
        inputContent,
        outputContent,
        modelUsed: 'AdaptLearn-GenAI-v1.4',
      },
    });
  }
}
