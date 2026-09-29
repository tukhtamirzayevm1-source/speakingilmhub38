import React, { useState } from 'react';
import { CEFRLevel, Language, SpeakingMode } from '../types';
import { translations } from '../i18n/translations';
import { VoiceChat } from '../components/VoiceChat';
import { Sparkles, SlidersHorizontal, BookOpen } from 'lucide-react';

interface TutorPageProps {
  lang: Language;
  userLevel: CEFRLevel;
  explanationLanguage: Language;
  initialMode?: SpeakingMode;
  onUpdateStats?: () => void;
  onExploreLessons?: () => void;
}

export const TutorPage: React.FC<TutorPageProps> = ({
  lang,
  userLevel: initialLevel,
  explanationLanguage,
  initialMode = 'free_conversation',
  onUpdateStats,
  onExploreLessons,
}) => {
  const [mode, setMode] = useState<SpeakingMode>(initialMode);
  const [level, setLevel] = useState<CEFRLevel>(initialLevel);
  const t = translations[lang];

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const modeOptions: { id: SpeakingMode; label: string }[] = [
    { id: 'free_conversation', label: t.mode_free_conversation },
    { id: 'daily_conversation', label: t.mode_daily_conversation },
    { id: 'job_interview', label: t.mode_job_interview },
    { id: 'ielts_speaking', label: t.mode_ielts_speaking },
    { id: 'travel_english', label: t.mode_travel_english },
    { id: 'school_english', label: t.mode_school_english },
    { id: 'business_english', label: t.mode_business_english },
    { id: 'pronunciation_practice', label: t.mode_pronunciation_practice },
    { id: 'vocabulary_practice', label: t.mode_vocabulary_practice },
    { id: 'grammar_conversation', label: t.mode_grammar_conversation },
    { id: 'debate', label: t.mode_debate },
    { id: 'roleplay', label: t.mode_roleplay },
    { id: 'random_topic', label: t.mode_random_topic },
    { id: 'exam_simulation', label: t.mode_exam_simulation },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
      {/* Top Filter & Setting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {lang === 'uz' ? 'Rejim:' : 'Mode:'}
          </span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as SpeakingMode)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          >
            {modeOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* CEFR Level Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.currentLevel}:
          </span>
          <div className="flex items-center gap-1">
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-2 py-1 rounded text-xs font-bold transition-all ${
                  level === lvl
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Lessons Shortcut */}
        {onExploreLessons && (
          <button
            onClick={onExploreLessons}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.exploreLessons}</span>
          </button>
        )}
      </div>

      {/* Embedded Core VoiceChat */}
      <VoiceChat
        key={`${mode}-${level}`}
        mode={mode}
        userLevel={level}
        explanationLanguage={explanationLanguage}
        sessionId={`tutor-session-${mode}-${level}`}
        onUpdateStats={onUpdateStats}
      />
    </div>
  );
};
