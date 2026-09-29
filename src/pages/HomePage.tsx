import React from 'react';
import {
  Mic,
  Award,
  Sparkles,
  BookOpen,
  Volume2,
  Headphones,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { CEFRLevel, Language, SpeakingMode } from '../types';
import { translations } from '../i18n/translations';

interface HomePageProps {
  lang: Language;
  onStartSpeaking: (mode?: SpeakingMode) => void;
  onOpenLevelTest: () => void;
  onExploreLessons: () => void;
  onOpenVocabulary: () => void;
  userLevel: CEFRLevel;
}

export const HomePage: React.FC<HomePageProps> = ({
  lang,
  onStartSpeaking,
  onOpenLevelTest,
  onExploreLessons,
  onOpenVocabulary,
  userLevel,
}) => {
  const t = translations[lang];

  const featuredModes: { mode: SpeakingMode; title: string; desc: string; icon: string }[] = [
    {
      mode: 'free_conversation',
      title: t.mode_free_conversation,
      desc: t.mode_free_conversation_desc,
      icon: '💬',
    },
    {
      mode: 'daily_conversation',
      title: t.mode_daily_conversation,
      desc: t.mode_daily_conversation_desc,
      icon: '☕',
    },
    {
      mode: 'job_interview',
      title: t.mode_job_interview,
      desc: t.mode_job_interview_desc,
      icon: '💼',
    },
    {
      mode: 'ielts_speaking',
      title: t.mode_ielts_speaking,
      desc: t.mode_ielts_speaking_desc,
      icon: '🎓',
    },
    {
      mode: 'travel_english',
      title: t.mode_travel_english,
      desc: t.mode_travel_english_desc,
      icon: '✈️',
    },
    {
      mode: 'debate',
      title: t.mode_debate,
      desc: t.mode_debate_desc,
      icon: '⚖️',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center max-w-4xl mx-auto px-4">
        {/* Level & Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-200 dark:border-blue-800 mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'uz' ? `Sizning joriy darajangiz: CEFR ${userLevel}` : `Current Level: CEFR ${userLevel}`}</span>
          <span className="opacity-40">•</span>
          <button
            onClick={onOpenLevelTest}
            className="underline hover:text-blue-900 dark:hover:text-blue-100 font-bold"
          >
            {t.takeLevelTest}
          </button>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => onStartSpeaking('free_conversation')}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Mic className="w-5 h-5" />
            <span>{t.startSpeaking}</span>
          </button>

          <button
            onClick={onOpenLevelTest}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-xs transition-all hover:scale-105"
          >
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{t.takeLevelTest}</span>
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">O'zbekcha Tushuntirish</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Clear grammar logic</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Real Voice Chat</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Minimal delay speech</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">IELTS Simulation</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Part 1, 2, 3 Band scores</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">A1 - C2 Levels</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Adaptive curriculum</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Speaking Modes */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t.modesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.modesSubtitle}
            </p>
          </div>
          <button
            onClick={() => onStartSpeaking()}
            className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>{lang === 'uz' ? "Barcha 14 ta rejim" : "View all 14 modes"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredModes.map((item) => (
            <div
              key={item.mode}
              onClick={() => onStartSpeaking(item.mode)}
              className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>{lang === 'uz' ? "Mashqni boshlash" : "Start Practice"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Deep-Dive Cards */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t.featuresTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Real-time Correction */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-blue-50/40 dark:from-slate-900 dark:to-blue-950/20 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.featureCorrectionTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.featureCorrectionDesc}
            </p>
            {/* Visual Mini Preview */}
            <div className="mt-4 p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-red-500 line-through">"Yesterday I go to market for buy fruits."</div>
              <div className="text-emerald-600 font-semibold font-sans">"Yesterday I went to the market to buy some fruit."</div>
              <div className="text-[11px] text-purple-600 font-sans italic">
                O'zbekcha: O'tgan zamonda "go" fe'lining o'rniga "went", maqsad uchun "to buy" ishlatiladi.
              </div>
            </div>
          </div>

          {/* Card 2: Lessons & Curricula */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/20 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.featureLessonsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.featureLessonsDesc}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={onExploreLessons}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                {t.exploreLessons}
              </button>
              <button
                onClick={onOpenVocabulary}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t.vocabularyVault}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
