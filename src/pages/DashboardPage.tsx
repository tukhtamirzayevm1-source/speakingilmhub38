import React from 'react';
import {
  Clock,
  BookOpen,
  BookmarkCheck,
  CheckCircle2,
  Volume2,
  TrendingUp,
  Flame,
  Award,
  Sparkles,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { CEFRLevel, Language, UserStats } from '../types';
import { translations } from '../i18n/translations';

interface DashboardPageProps {
  stats: UserStats;
  lang: Language;
  onOpenLevelTest: () => void;
  onStartSpeaking: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  lang,
  onOpenLevelTest,
  onStartSpeaking,
}) => {
  const t = translations[lang];

  // Last 7 days chart data
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const maxMins = Math.max(15, ...stats.dailyHistory.map((d) => d.minutes));

  const hasActivity = stats.speakingMinutes > 0 || stats.lessonsCompleted > 0 || stats.vocabularyLearned > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Title & Level Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.dashboardTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.dashboardSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{stats.streakDays} {t.streak}</span>
          </div>

          <button
            onClick={onOpenLevelTest}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-colors"
          >
            <Award className="w-4 h-4" />
            <span>CEFR {stats.currentLevel}</span>
          </button>
        </div>
      </div>

      {/* Main KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Speaking Minutes */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.speakingMinutes}
            </div>
            <div className="text-[11px] font-medium text-slate-500 truncate">
              {t.speakingMinutes}
            </div>
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.lessonsCompleted}
            </div>
            <div className="text-[11px] font-medium text-slate-500 truncate">
              {t.completedLessons}
            </div>
          </div>
        </div>

        {/* Vocabulary Learned */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <BookmarkCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.vocabularyLearned}
            </div>
            <div className="text-[11px] font-medium text-slate-500 truncate">
              {t.wordsLearned}
            </div>
          </div>
        </div>

        {/* Grammar Accuracy */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.grammarAccuracy ? `${stats.grammarAccuracy}%` : '—'}
            </div>
            <div className="text-[11px] font-medium text-slate-500 truncate">
              {t.grammarAccuracy}
            </div>
          </div>
        </div>

        {/* Pronunciation Score */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Volume2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.pronunciationScore ? `${stats.pronunciationScore}%` : '—'}
            </div>
            <div className="text-[11px] font-medium text-slate-500 truncate">
              {t.pronunciationScore}
            </div>
          </div>
        </div>

        {/* Fluency Score */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {stats.fluencyScore ? `${stats.fluencyScore}%` : '—'}
            </div>
            <div className="text-[11px] font-medium text-slate-500 truncate">
              {t.fluencyScore}
            </div>
          </div>
        </div>
      </div>

      {/* Clean Empty State or Charts */}
      {!hasActivity ? (
        <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {lang === 'uz' ? "Siz hali gapirishni boshlamadingiz" : "Your speaking journey begins here"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
              {lang === 'uz'
                ? "AI o'qituvchi bilan birinchi suhbatingizni o'tkazing yoki darajangizni aniqlash testini topshiring. Natijalar avtomatik ravishda bu yerda aks etadi."
                : "Complete your first speaking session with the AI tutor or take a level test. Your real progress metrics will be plotted here."}
            </p>
          </div>
          <button
            onClick={onStartSpeaking}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors"
          >
            {t.startSpeaking}
          </button>
        </div>
      ) : (
        /* Progress Visualizations */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Activity Bar Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t.weeklyActivity}
              </h3>
              <span className="text-xs text-slate-400">Past 7 days</span>
            </div>

            <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
              {daysOfWeek.map((day, idx) => {
                const dayData = stats.dailyHistory[idx];
                const minutes = dayData ? dayData.minutes : 0;
                const heightPercent = Math.min(100, Math.max(8, (minutes / maxMins) * 100));

                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      {minutes > 0 ? `${minutes}m` : '0'}
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-32 rounded-lg flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-lg transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Tutor Advice Box */}
          <div className="p-6 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-slate-900 dark:to-blue-950/20 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Lightbulb className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {t.aiCoachAdvice}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'uz'
                  ? "Sizda so'zlarni tanlash va asosiy fikrni yetkazish juda yaxshi. Endi 'although', 'whereas', 'furthermore' kabi bog'lovchilarni faol ishlatib murakkab gaplar tuzishga e'tibor qarating."
                  : "Your message delivery is straightforward and clear. To advance to higher CEFR bands, integrate complex conjunctions like 'not only... but also' and 'in spite of'."}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-blue-100 dark:border-blue-900/40 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Current Target:</span>
                <span className="font-bold text-slate-900 dark:text-white">15 min/day</span>
              </div>
              <div className="w-full h-2 rounded-full bg-blue-100 dark:bg-blue-950 overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${Math.min(100, (stats.speakingMinutes / 15) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strong & Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Areas */}
        <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.strengths}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Basic and intermediate conversation responsiveness</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Everyday situational vocabulary mastery</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>General sentence pronunciation clarity</span>
            </li>
          </ul>
        </div>

        {/* Weak Areas */}
        <div className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/30 dark:bg-amber-950/10 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>{t.weaknesses}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Third conditional sentences ("If I had known, I would have...")</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Prepositions of time and place ("at", "in", "on")</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Tricky phonemes (/θ/ voiceless TH sound)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
