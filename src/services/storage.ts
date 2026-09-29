import { UserSettings, UserStats, ChatMessage, LessonProgress, VocabularyWord, ConversationSession, SpeakingMode, CEFRLevel } from '../types';

export interface IUserDataStore {
  getSettings(): UserSettings;
  saveSettings(settings: UserSettings): void;
  getStats(): UserStats;
  saveStats(stats: UserStats): void;
  recordSpeakingActivity(minutes: number, sentences: number, scores?: { grammar: number; fluency: number; pronunciation: number }): UserStats;
  getChatHistory(sessionId: string): ChatMessage[];
  saveChatMessage(sessionId: string, message: ChatMessage, meta?: { title?: string; mode?: SpeakingMode; level?: CEFRLevel }): void;
  deleteChatMessage(sessionId: string, messageId: string): ChatMessage[];
  clearChatHistory(sessionId: string): void;
  getAllSessions(): ConversationSession[];
  saveSessionMeta(session: ConversationSession): void;
  deleteSession(sessionId: string): void;
  clearAllSessions(): void;
  getLessonProgress(lessonId: string): LessonProgress | null;
  saveLessonProgress(progress: LessonProgress): void;
  getAllLessonProgress(): Record<string, LessonProgress>;
  getLearnedWords(): VocabularyWord[];
  markWordMastered(word: VocabularyWord, mastered: boolean): void;
  getSearchHistory(): string[];
  addSearchHistory(term: string): string[];
  removeSearchHistoryItem(term: string): string[];
  clearSearchHistory(): void;
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
  private SEARCH_HISTORY_KEY = 'lingo_mentor_search_history';
  private SESSIONS_KEY = 'lingo_mentor_sessions_index';

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

  saveChatMessage(
    sessionId: string,
    message: ChatMessage,
    meta?: { title?: string; mode?: SpeakingMode; level?: CEFRLevel }
  ): void {
    try {
      const history = this.getChatHistory(sessionId);
      const idx = history.findIndex((m) => m.id === message.id);
      if (idx >= 0) {
        history[idx] = message;
      } else {
        history.push(message);
      }
      // Keep last 50 messages per session
      const trimmed = history.slice(-50);
      localStorage.setItem(this.CHAT_PREFIX + sessionId, JSON.stringify(trimmed));

      // Update session index
      const sessions = this.getAllSessions();
      const existingSession = sessions.find((s) => s.id === sessionId);
      const sessionTitle =
        meta?.title ||
        existingSession?.title ||
        (meta?.mode ? meta.mode.replace(/_/g, ' ') : 'English Conversation');

      const updatedSession: ConversationSession = {
        id: sessionId,
        title: sessionTitle,
        mode: meta?.mode || existingSession?.mode || 'free_conversation',
        userLevel: meta?.level || existingSession?.userLevel || 'B1',
        lastMessage: message.content.slice(0, 100),
        messageCount: trimmed.length,
        updatedAt: Date.now(),
        createdAt: existingSession?.createdAt || Date.now(),
      };
      this.saveSessionMeta(updatedSession);
    } catch (e) {
      console.error('Failed to save chat message:', e);
    }
  }

  deleteChatMessage(sessionId: string, messageId: string): ChatMessage[] {
    try {
      let history = this.getChatHistory(sessionId);
      history = history.filter((m) => m.id !== messageId);
      localStorage.setItem(this.CHAT_PREFIX + sessionId, JSON.stringify(history));

      const sessions = this.getAllSessions();
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        session.messageCount = history.length;
        session.lastMessage = history.length > 0 ? history[history.length - 1].content.slice(0, 100) : '';
        this.saveSessionMeta(session);
      }
      return history;
    } catch (e) {
      console.error('Failed to delete chat message:', e);
      return [];
    }
  }

  clearChatHistory(sessionId: string): void {
    try {
      localStorage.removeItem(this.CHAT_PREFIX + sessionId);
      this.deleteSession(sessionId);
    } catch (e) {
      console.error('Failed to clear chat:', e);
    }
  }

  getAllSessions(): ConversationSession[] {
    try {
      const stored = localStorage.getItem(this.SESSIONS_KEY);
      const list: ConversationSession[] = stored ? JSON.parse(stored) : [];
      return list.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (e) {
      return [];
    }
  }

  saveSessionMeta(session: ConversationSession): void {
    try {
      const sessions = this.getAllSessions();
      const idx = sessions.findIndex((s) => s.id === session.id);
      if (idx >= 0) {
        sessions[idx] = { ...sessions[idx], ...session };
      } else {
        sessions.unshift(session);
      }
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save session meta:', e);
    }
  }

  deleteSession(sessionId: string): void {
    try {
      let sessions = this.getAllSessions();
      sessions = sessions.filter((s) => s.id !== sessionId);
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
      localStorage.removeItem(this.CHAT_PREFIX + sessionId);
    } catch (e) {
      console.error('Failed to delete session:', e);
    }
  }

  clearAllSessions(): void {
    try {
      const sessions = this.getAllSessions();
      sessions.forEach((s) => {
        localStorage.removeItem(this.CHAT_PREFIX + s.id);
      });
      localStorage.removeItem(this.SESSIONS_KEY);
    } catch (e) {
      console.error('Failed to clear all sessions:', e);
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

  getSearchHistory(): string[] {
    try {
      const stored = localStorage.getItem(this.SEARCH_HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initial helpful search history items if none stored yet
      const initialHistory = ['Accomplish', 'Phrasal verbs', 'Daily conversation', 'Serendipity', 'Fluency'];
      localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(initialHistory));
      return initialHistory;
    } catch (e) {
      return ['Accomplish', 'Phrasal verbs', 'Daily conversation'];
    }
  }

  addSearchHistory(term: string): string[] {
    const trimmed = term.trim();
    if (!trimmed) return this.getSearchHistory();

    try {
      let history = this.getSearchHistory();
      // Remove existing occurrence to place it first
      history = history.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      history.unshift(trimmed);
      // Keep maximum 20 recent items
      if (history.length > 20) {
        history = history.slice(0, 20);
      }
      localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(history));
      return history;
    } catch (e) {
      console.error('Failed to add search history:', e);
      return [];
    }
  }

  removeSearchHistoryItem(term: string): string[] {
    try {
      let history = this.getSearchHistory();
      history = history.filter((item) => item.toLowerCase() !== term.toLowerCase().trim());
      localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(history));
      return history;
    } catch (e) {
      console.error('Failed to remove search history item:', e);
      return [];
    }
  }

  clearSearchHistory(): void {
    try {
      localStorage.removeItem(this.SEARCH_HISTORY_KEY);
    } catch (e) {
      console.error('Failed to clear search history:', e);
    }
  }

  resetAllData(): void {
    try {
      localStorage.removeItem(this.STATS_KEY);
      localStorage.removeItem(this.LESSONS_KEY);
      localStorage.removeItem(this.VOCAB_KEY);
      localStorage.removeItem(this.SEARCH_HISTORY_KEY);
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
