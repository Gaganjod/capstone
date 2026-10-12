export type UserRole = 'STUDENT' | 'TEACHER' | 'RESEARCHER' | 'ADMIN';

export type Modality = 'TEXT' | 'AUDIO' | 'AUDIO_TEXT' | 'HIGHLIGHTED_TEXT';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type PacingMode = 'SLOWER' | 'STANDARD' | 'ACCELERATED';

export type FeedbackStrategy = 
  | 'ENCOURAGING_ELABORATE' 
  | 'DIRECT_CORRECTIVE' 
  | 'CONCEPTUAL_HINT' 
  | 'MINIMAL_PROMPT';

export type EngineType = 'NON_ADAPTIVE' | 'RULE_BASED' | 'ML_ADAPTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  age: number;
  gradeLevel: string;
  readingLevel: string;
  dyslexiaSeverity: 'MILD' | 'MODERATE' | 'SEVERE';
  user?: User;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  school: string;
  department: string;
  user?: User;
}

export interface LearnerState {
  id: string;
  studentId: string;
  readingAccuracy: number; // 0 - 100%
  comprehensionScore: number; // 0 - 100%
  averageResponseTime: number; // ms
  errorRate: number; // 0 - 1.0
  audioPerformance: number; // 0 - 100%
  textPerformance: number; // 0 - 100%
  currentDifficulty: DifficultyLevel;
  preferredModality: Modality;
  pacingMode: PacingMode;
  feedbackStrategy: FeedbackStrategy;
  engagementScore: number; // 0 - 100
  recentPerformanceTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  attemptHistoryCount: number;
  updatedAt: string;
}

export interface AccessibilitySettings {
  id?: string;
  studentId: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily: 'OpenDyslexic' | 'Inter' | 'Comic Sans MS' | 'System';
  letterSpacing: 'normal' | 'wide' | 'extra-wide';
  lineSpacing: 'normal' | 'comfortable' | 'large';
  readingSpeed: number; // 0.75, 1.0, 1.25, 1.5
  audioAutoPlay: boolean;
  highlightReading: boolean;
  highContrast: boolean;
  focusOverlay: boolean;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  summary: string;
  content: string;
  simplifiedContent: string;
  audioUrl?: string;
  difficulty: DifficultyLevel;
  order: number;
  questions?: Question[];
}

export interface Question {
  id: string;
  lessonId: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  simplifiedExplanation?: string;
  difficulty: DifficultyLevel;
  concept: string;
  audioUrl?: string;
}

export interface AttemptSubmission {
  studentId: string;
  lessonId: string;
  questionId: string;
  chosenOption: number;
  isCorrect: boolean;
  responseTimeMs: number;
  modalityUsed: Modality;
  hintUsed: boolean;
  retryCount: number;
  engineType: EngineType;
}

export interface RecommendationExplanation {
  featureImportances: Record<string, number>;
  naturalLanguageReasoning: string;
  SHAPValues: Record<string, number>;
  observedData: {
    readingAccuracy: number;
    audioPerformance: number;
    textPerformance: number;
    responseTimeMs: number;
    comprehension: number;
  };
  modelConfidence: number;
}

export interface Recommendation {
  id: string;
  studentId: string;
  targetDifficulty: DifficultyLevel;
  targetModality: Modality;
  targetPacing: PacingMode;
  targetFeedback: FeedbackStrategy;
  engineType: EngineType;
  confidence: number;
  explanation?: RecommendationExplanation;
  createdAt: string;
}

export interface AssessmentResult {
  studentId: string;
  readingAccuracy: number;
  comprehensionScore: number;
  averageResponseTime: number;
  recommendedDifficulty: DifficultyLevel;
  recommendedModality: Modality;
  recommendedPacing: PacingMode;
  disclaimer: string;
}

export interface ExperimentMetrics {
  engineType: EngineType;
  totalStudents: number;
  avgLearningGain: number;
  avgReadingAccuracy: number;
  avgComprehension: number;
  avgResponseTimeMs: number;
  avgEngagementScore: number;
  completionRate: number;
}

export interface GenAIRequest {
  action: 'SIMPLIFY_TEXT' | 'GENERATE_HINT' | 'EXPLAIN_CONCEPT' | 'GENERATE_QUESTION';
  text?: string;
  context?: string;
  difficulty?: DifficultyLevel;
  readingLevel?: string;
}

export interface GenAIResponse {
  resultText: string;
  originalText?: string;
  action: string;
  metadata: {
    readingEaseScore?: number;
    wordCount?: number;
    model: string;
  };
}
