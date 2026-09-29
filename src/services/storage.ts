import { UserSettings, UserStats, ChatMessage, LessonProgress, VocabularyWord } from '../types';

export interface IUserDataStore {
  getSettings(): UserSettings;
  saveSettings(settings: UserSettings): void;
  getStats(): UserStats;
  saveStats(stats: UserStats): void;
  recordSpeakingActivity(minutes: number, sentences: number, scores?: { grammar: number; fluency: number; pronunciation: number }): UserStats;
  getChatHistory(sessionId: string): ChatMessage[];
  saveChatMessage(sessionId: string, message: ChatMessage): void;
  clearChatHistory(sessionId: string): void;
  getLessonProgress(lessonId: string): LessonProgress | null;
  saveLessonProgress(progress: LessonProgress): void;
  getAllLessonProgress(): Record<string, LessonProgress>;
  getLearnedWords(): VocabularyWord[];
  markWordMastered(word: VocabularyWord, mastered: boolean): void;
  resetAllData(): void;
}

const DEFAULT_SETTINGS: UserSettings = {
  interfaceLanguage: 'uz', // default to Uzbek as requested by prompt bilingual focus
  explanationLanguage: 'uz',
  targetLevel: 'B1',
  tutorVoice: 'Kore',
  speakingSpeed: 1.0,
  accentPreference: 'neutral',
  autoSendAfterSilence: true,
  theme: 'dark',
  dailyGoalMinutes: 15,
};

// Clean initial empty state without fake numbers
const INITIAL_STATS: UserStats = {
  speakingMinutes: 0,
  lessonsCompleted: 0,
  vocabularyLearned: 0,
  grammarAccuracy: 0,
  pronunciationScore: 0,
  fluencyScore: 0,
  currentLevel: 'B1',
  streakDays: 0,
  lastActiveDate: '',
  dailyHistory: [],
  weakAreas: [],
  strongAreas: [],
  aiRecommendations: [],
};

class LocalUserDataStore implements IUserDataStore {
  private SETTINGS_KEY = 'lingo_mentor_settings';
  private STATS_KEY = 'lingo_mentor_stats';
  private CHAT_PREFIX = 'lingo_mentor_chat_';
  private LESSONS_KEY = 'lingo_mentor_lessons';
  private VOCAB_KEY = 'lingo_mentor_vocab';

  getSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return DEFAULT_SETTINGS;
  }

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  getStats(): UserStats {
    try {
      const stored = localStorage.getItem(this.STATS_KEY);
      if (stored) {
        return { ...INITIAL_STATS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    return INITIAL_STATS;
  }

  saveStats(stats: UserStats): void {
    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  recordSpeakingActivity(
    minutes: number,
    sentences: number,
    scores?: { grammar: number; fluency: number; pronunciation: number }
  ): UserStats {
    const stats = this.getStats();
    const today = new Date().toISOString().split('T')[0];

    stats.speakingMinutes = Math.round((stats.speakingMinutes + minutes) * 10) / 10;

    // Daily history entry
    const existingDay = stats.dailyHistory.find((d) => d.date === today);
    if (existingDay) {
      existingDay.minutes = Math.round((existingDay.minutes + minutes) * 10) / 10;
      existingDay.sentencesSpoken += sentences;
    } else {
      stats.dailyHistory.push({
        date: today,
        minutes: Math.round(minutes * 10) / 10,
        sentencesSpoken: sentences,
      });
      // Keep last 14 days
      if (stats.dailyHistory.length > 14) {
        stats.dailyHistory = stats.dailyHistory.slice(-14);
      }
    }

    // Streak calculation
    if (!stats.lastActiveDate) {
      stats.streakDays = 1;
      stats.lastActiveDate = today;
    } else if (stats.lastActiveDate !== today) {
      const last = new Date(stats.lastActiveDate);
      const now = new Date(today);
      const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        stats.streakDays += 1;
      } else if (diffDays > 1) {
        stats.streakDays = 1;
      }
      stats.lastActiveDate = today;
    }

    // Rolling score averages if provided
    if (scores) {
      if (stats.grammarAccuracy === 0) {
        stats.grammarAccuracy = Math.round(scores.grammar);
        stats.fluencyScore = Math.round(scores.fluency);
        stats.pronunciationScore = Math.round(scores.pronunciation);
      } else {
        stats.grammarAccuracy = Math.round((stats.grammarAccuracy * 0.7) + (scores.grammar * 0.3));
        stats.fluencyScore = Math.round((stats.fluencyScore * 0.7) + (scores.fluency * 0.3));
        stats.pronunciationScore = Math.round((stats.pronunciationScore * 0.7) + (scores.pronunciation * 0.3));
      }
    }

    this.saveStats(stats);
    return stats;
  }

  getChatHistory(sessionId: string): ChatMessage[] {
    try {
      const stored = localStorage.getItem(this.CHAT_PREFIX + sessionId);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveChatMessage(sessionId: string, message: ChatMessage): void {
    try {
      const history = this.getChatHistory(sessionId);
      history.push(message);
      // Keep last 50 messages per session
      const trimmed = history.slice(-50);
      localStorage.setItem(this.CHAT_PREFIX + sessionId, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Failed to save chat message:', e);
    }
  }

  clearChatHistory(sessionId: string): void {
    try {
      localStorage.removeItem(this.CHAT_PREFIX + sessionId);
    } catch (e) {
      console.error('Failed to clear chat:', e);
    }
  }

  getLessonProgress(lessonId: string): LessonProgress | null {
    const all = this.getAllLessonProgress();
    return all[lessonId] || null;
  }

  saveLessonProgress(progress: LessonProgress): void {
    const all = this.getAllLessonProgress();
    all[progress.lessonId] = progress;
    try {
      localStorage.setItem(this.LESSONS_KEY, JSON.stringify(all));
      const stats = this.getStats();
      const completedCount = Object.values(all).filter((p) => p.completed).length;
      stats.lessonsCompleted = completedCount;
      this.saveStats(stats);
    } catch (e) {
      console.error('Failed to save lesson progress:', e);
    }
  }

  getAllLessonProgress(): Record<string, LessonProgress> {
    try {
      const stored = localStorage.getItem(this.LESSONS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  getLearnedWords(): VocabularyWord[] {
    try {
      const stored = localStorage.getItem(this.VOCAB_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  markWordMastered(word: VocabularyWord, mastered: boolean): void {
    try {
      let list = this.getLearnedWords();
      const idx = list.findIndex((w) => w.id === word.id || w.word.toLowerCase() === word.word.toLowerCase());
      if (idx >= 0) {
        list[idx].mastered = mastered;
      } else {
        list.push({ ...word, mastered });
      }
      localStorage.setItem(this.VOCAB_KEY, JSON.stringify(list));
      const stats = this.getStats();
      stats.vocabularyLearned = list.filter((w) => w.mastered).length;
      this.saveStats(stats);
    } catch (e) {
      console.error('Failed to mark word:', e);
    }
  }

  resetAllData(): void {
    try {
      localStorage.removeItem(this.STATS_KEY);
      localStorage.removeItem(this.LESSONS_KEY);
      localStorage.removeItem(this.VOCAB_KEY);
      // Remove all chat sessions
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.CHAT_PREFIX)) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.error('Error resetting data:', e);
    }
  }
}

export const dataStore: IUserDataStore = new LocalUserDataStore();
