import React from 'react';
import {
  User,
  Award,
  Clock,
  Flame,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { CEFRLevel, Language, UserSettings, UserStats } from '../types';
import { translations } from '../i18n/translations';
import { dataStore } from '../services/storage';

interface ProfilePageProps {
  stats: UserStats;
  settings: UserSettings;
  lang: Language;
  onOpenLevelTest: () => void;
  onResetData: () => void;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  stats,
  settings,
  lang,
  onOpenLevelTest,
  onResetData,
  onUpdateSettings,
}) => {
  const t = translations[lang];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t.profileTitle}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {lang === 'uz' ? "Shaxsiy o'rganish rejasi va ko'rsatkichlaringiz" : "Your learning milestones and target goals"}
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-500/25 shrink-0">
          <User className="w-8 h-8" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            English Learner
          </h2>
          <p className="text-xs text-slate-500">
            {lang === 'uz' ? "Til o'rganuvchi" : 'Active Member'}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Current Level: {stats.currentLevel}</span>
            </span>

            <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{stats.streakDays} Day Streak</span>
            </span>
          </div>
        </div>

        <button
          onClick={onOpenLevelTest}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
        >
          {t.takeLevelTest}
        </button>
      </div>

      {/* Target Goal Setting */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>{t.dailyTarget}</span>
        </h3>

        <div className="flex items-center gap-3">
          {[10, 15, 20, 30].map((mins) => (
            <button
              key={mins}
              onClick={() => onUpdateSettings({ dailyGoalMinutes: mins })}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                settings.dailyGoalMinutes === mins
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {mins} {t.lessonDuration}
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="p-6 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/20 dark:bg-red-950/10 space-y-3">
        <h3 className="font-bold text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span>{t.resetData}</span>
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {lang === 'uz'
            ? "Barcha mashg'ulotlar, yodlangan so'zlar va suhbatlar tarixini tozalab ilovani boshlang'ich toza holatga qaytaradi."
            : "Wipes local speaking history, vocabulary masteries, and progress meters back to initial clean state."}
        </p>
        <button
          onClick={onResetData}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors"
        >
          {t.resetData}
        </button>
      </div>
    </div>
  );
};
