export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type SpeakingMode =
  | 'free_conversation'
  | 'daily_conversation'
  | 'job_interview'
  | 'ielts_speaking'
  | 'travel_english'
  | 'school_english'
  | 'business_english'
  | 'pronunciation_practice'
  | 'vocabulary_practice'
  | 'grammar_conversation'
  | 'debate'
  | 'roleplay'
  | 'random_topic'
  | 'exam_simulation';

export type Language = 'en' | 'uz';

export interface CorrectionData {
  hadErrors: boolean;
  userSentence: string;
  correctedSentence: string;
  moreNatural: string;
  explanation: string; // Explained in Uzbek or English
  pronunciationTips: string;
  grammarPoints?: string[];
  suggestedVocabulary?: { word: string; translation: string }[];
  scores?: {
    grammar: number; // 0-100
    vocabulary: number;
    fluency: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  audioBase64?: string;
  correction?: CorrectionData;
  durationSeconds?: number;
}

export interface VocabularyWord {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  uzbekMeaning: string;
  englishDefinition: string;
  exampleSentence: string;
  uzbekExample: string;
  level: CEFRLevel;
  category:
    | 'common'
    | 'advanced'
    | 'phrasal_verbs'
    | 'idioms'
    | 'collocations'
    | 'academic'
    | 'business'
    | 'ielts'
    | 'daily'
    | 'synonyms_antonyms';
  relatedWords?: string[];
  synonyms?: string[];
  antonyms?: string[];
  mastered?: boolean;
}

export interface LessonStep {
  id: string;
  title: string;
  description: string;
  type: 'intro' | 'vocab' | 'warmup' | 'speaking' | 'conversation' | 'summary';
  prompt?: string;
  questions?: string[];
  vocabItems?: VocabularyWord[];
}

export interface Lesson {
  id: string;
  title: string;
  uzbekTitle: string;
  level: CEFRLevel;
  category: string;
  description: string;
  uzbekDescription: string;
  estimatedMinutes: number;
  iconName: string;
  vocabList: VocabularyWord[];
  warmUpQuestions: string[];
  speakingPrompts: string[];
  roleplayScenario?: {
    userRole: string;
    aiRole: string;
    setting: string;
    objective: string;
  };
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt: number;
  speakingSeconds: number;
  accuracy: number;
  feedbackSummary?: string;
}

export interface UserStats {
  speakingMinutes: number;
  lessonsCompleted: number;
  vocabularyLearned: number;
  grammarAccuracy: number;
  pronunciationScore: number;
  fluencyScore: number;
  currentLevel: CEFRLevel;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyHistory: { date: string; minutes: number; sentencesSpoken: number }[];
  weakAreas: string[];
  strongAreas: string[];
  aiRecommendations: string[];
}

export interface UserSettings {
  interfaceLanguage: Language;
  explanationLanguage: Language;
  targetLevel: CEFRLevel;
  tutorVoice: 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon';
  speakingSpeed: number; // 0.75, 1.0, 1.25
  accentPreference: 'american' | 'british' | 'neutral';
  autoSendAfterSilence: boolean;
  theme: 'light' | 'dark';
  dailyGoalMinutes: number;
}

export interface LevelTestResult {
  cefrLevel: CEFRLevel;
  overallScore: number; // 0 - 100
  grammarScore: number;
  vocabularyScore: number;
  readingScore: number;
  listeningScore: number;
  speakingScore: number;
  breakdown: string;
  strengths: string[];
  improvements: string[];
  recommendedLessons: string[];
}
