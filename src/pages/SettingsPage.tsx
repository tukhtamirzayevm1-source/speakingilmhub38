import React from 'react';
import {
  Sun,
  Moon,
  Volume2,
  Languages,
  Gauge,
  Sliders,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Language, UserSettings } from '../types';
import { translations } from '../i18n/translations';

interface SettingsPageProps {
  settings: UserSettings;
  lang: Language;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  lang,
  onUpdateSettings,
}) => {
  const t = translations[lang];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t.settingsTitle}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {lang === 'uz' ? "Ovoz, til va interfeys sozlamalarini boshqaring" : "Configure voices, languages, and app behavior"}
        </p>
      </div>

      <div className="space-y-4">
        {/* Interface Language */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-500" />
              <span>Interfeys Tili / Interface Language</span>
            </span>
            <p className="text-xs text-slate-500">
              {lang === 'uz' ? "Ilova menyulari va tugmalari tili" : "Language for UI labels and navigation"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onUpdateSettings({ interfaceLanguage: 'uz' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.interfaceLanguage === 'uz'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇺🇿 O'zbekcha
            </button>
            <button
              onClick={() => onUpdateSettings({ interfaceLanguage: 'en' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.interfaceLanguage === 'en'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Explanation Language */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>{t.explanationLangSelect}</span>
            </span>
            <p className="text-xs text-slate-500">
              {lang === 'uz' ? "Xatolar tushuntiriladigan til" : "Language for grammar feedback explanations"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onUpdateSettings({ explanationLanguage: 'uz' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.explanationLanguage === 'uz'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              O'zbekcha
            </button>
            <button
              onClick={() => onUpdateSettings({ explanationLanguage: 'en' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.explanationLanguage === 'en'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Tutor Voice */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-500" />
              <span>{t.tutorVoiceSelect}</span>
            </span>
            <p className="text-xs text-slate-500">
              High-definition voice generated via Gemini TTS
            </p>
          </div>

          <select
            value={settings.tutorVoice}
            onChange={(e) => onUpdateSettings({ tutorVoice: e.target.value as any })}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
          >
            <option value="Kore">Kore (Clear & Friendly Female)</option>
            <option value="Puck">Puck (Natural Dynamic Male)</option>
            <option value="Fenrir">Fenrir (Authoritative Deep Male)</option>
            <option value="Zephyr">Zephyr (Gentle Articulate Female)</option>
            <option value="Charon">Charon (Academic Calm Male)</option>
          </select>
        </div>

        {/* Speech Speed */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-500" />
              <span>{t.voiceSpeed}</span>
            </span>
            <p className="text-xs text-slate-500">
              Adjust how fast the AI teacher enunciates
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {[0.75, 1.0, 1.25].map((spd) => (
              <button
                key={spd}
                onClick={() => onUpdateSettings({ speakingSpeed: spd })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  settings.speakingSpeed === spd
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Theme Mode */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-slate-600" />}
              <span>{t.themeToggle}</span>
            </span>
            <p className="text-xs text-slate-500">
              Dark and Light appearance
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.theme === 'light'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                settings.theme === 'dark'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
