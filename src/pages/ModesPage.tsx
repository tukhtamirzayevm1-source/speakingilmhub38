import React from 'react';
import {
  MessageSquare,
  Coffee,
  Briefcase,
  Award,
  Plane,
  GraduationCap,
  TrendingUp,
  Volume2,
  BookMarked,
  SpellCheck,
  Scale,
  Theater,
  Dice5,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { Language, SpeakingMode } from '../types';
import { translations } from '../i18n/translations';

interface ModesPageProps {
  lang: Language;
  onSelectMode: (mode: SpeakingMode) => void;
}

export const ModesPage: React.FC<ModesPageProps> = ({ lang, onSelectMode }) => {
  const t = translations[lang];

  const modesList: {
    id: SpeakingMode;
    title: string;
    description: string;
    icon: any;
    color: string;
    tag: string;
  }[] = [
    {
      id: 'free_conversation',
      title: t.mode_free_conversation,
      description: t.mode_free_conversation_desc,
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-600',
      tag: 'Flexible',
    },
    {
      id: 'daily_conversation',
      title: t.mode_daily_conversation,
      description: t.mode_daily_conversation_desc,
      icon: Coffee,
      color: 'from-amber-500 to-orange-600',
      tag: 'Everyday',
    },
    {
      id: 'job_interview',
      title: t.mode_job_interview,
      description: t.mode_job_interview_desc,
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Career',
    },
    {
      id: 'ielts_speaking',
      title: t.mode_ielts_speaking,
      description: t.mode_ielts_speaking_desc,
      icon: Award,
      color: 'from-purple-500 to-pink-600',
      tag: 'Exam Prep',
    },
    {
      id: 'travel_english',
      title: t.mode_travel_english,
      description: t.mode_travel_english_desc,
      icon: Plane,
      color: 'from-cyan-500 to-blue-600',
      tag: 'Global',
    },
    {
      id: 'school_english',
      title: t.mode_school_english,
      description: t.mode_school_english_desc,
      icon: GraduationCap,
      color: 'from-indigo-500 to-purple-600',
      tag: 'Academic',
    },
    {
      id: 'business_english',
      title: t.mode_business_english,
      description: t.mode_business_english_desc,
      icon: TrendingUp,
      color: 'from-blue-600 to-slate-700',
      tag: 'Executive',
    },
    {
      id: 'pronunciation_practice',
      title: t.mode_pronunciation_practice,
      description: t.mode_pronunciation_practice_desc,
      icon: Volume2,
      color: 'from-rose-500 to-red-600',
      tag: 'Accent',
    },
    {
      id: 'vocabulary_practice',
      title: t.mode_vocabulary_practice,
      description: t.mode_vocabulary_practice_desc,
      icon: BookMarked,
      color: 'from-green-500 to-emerald-600',
      tag: 'Lexical',
    },
    {
      id: 'grammar_conversation',
      title: t.mode_grammar_conversation,
      description: t.mode_grammar_conversation_desc,
      icon: SpellCheck,
      color: 'from-violet-500 to-purple-600',
      tag: 'Structure',
    },
    {
      id: 'debate',
      title: t.mode_debate,
      description: t.mode_debate_desc,
      icon: Scale,
      color: 'from-orange-500 to-amber-600',
      tag: 'Argument',
    },
    {
      id: 'roleplay',
      title: t.mode_roleplay,
      description: t.mode_roleplay_desc,
      icon: Theater,
      color: 'from-pink-500 to-rose-600',
      tag: 'Immersive',
    },
    {
      id: 'random_topic',
      title: t.mode_random_topic,
      description: t.mode_random_topic_desc,
      icon: Dice5,
      color: 'from-fuchsia-500 to-purple-600',
      tag: 'Surprise',
    },
    {
      id: 'exam_simulation',
      title: t.mode_exam_simulation,
      description: t.mode_exam_simulation_desc,
      icon: FileCheck,
      color: 'from-slate-600 to-slate-900',
      tag: 'Timed',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t.modesTitle}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.modesSubtitle} (14 {lang === 'uz' ? 'maxsus so\'zlashuv formati' : 'specialized speaking formats'})
        </p>
      </div>

      {/* Grid of 14 Modes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {modesList.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${m.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {m.tag}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>{lang === 'uz' ? 'Suhbatni boshlash' : 'Start Session'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
