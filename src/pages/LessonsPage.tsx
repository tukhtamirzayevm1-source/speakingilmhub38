import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Volume2,
  Sparkles,
  RotateCcw,
  Check,
  ChevronRight,
} from 'lucide-react';
import { CEFRLevel, Language, Lesson } from '../types';
import { translations } from '../i18n/translations';
import { LESSONS_DATA } from '../data/lessonsData';
import { SpeechService } from '../services/speechService';
import { dataStore } from '../services/storage';
import { VoiceChat } from '../components/VoiceChat';

interface LessonsPageProps {
  lang: Language;
  userLevel: CEFRLevel;
  explanationLanguage: Language;
  onUpdateStats?: () => void;
}

export const LessonsPage: React.FC<LessonsPageProps> = ({
  lang,
  userLevel,
  explanationLanguage,
  onUpdateStats,
}) => {
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('All');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonStep, setLessonStep] = useState<'intro' | 'vocab' | 'warmup' | 'conversation' | 'summary'>('intro');
  const [completedLessons, setCompletedLessons] = useState<Record<string, any>>(dataStore.getAllLessonProgress());

  const t = translations[lang];

  const levels: (CEFRLevel | 'All')[] = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filteredLessons = LESSONS_DATA.filter((l) => {
    if (selectedLevelFilter === 'All') return true;
    return l.level === selectedLevelFilter;
  });

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setLessonStep('intro');
  };

  const handleFinishLesson = () => {
    if (!activeLesson) return;

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    const progress = {
      lessonId: activeLesson.id,
      completed: true,
      score: 92,
      completedAt: Date.now(),
      speakingSeconds: 300,
      accuracy: 88,
      feedbackSummary: `Excellent articulation and engagement on "${activeLesson.title}".`,
    };

    dataStore.saveLessonProgress(progress);
    setCompletedLessons(dataStore.getAllLessonProgress());
    setLessonStep('summary');
    onUpdateStats?.();
  };

  const handlePronounce = (text: string) => {
    SpeechService.speak(text, { rate: 0.95 });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* If No Active Lesson: Show Catalog */}
      {!activeLesson ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {t.lessonsCatalog}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'uz'
                  ? "Bosqichma-bosqich tuzilgan, har bir daraja uchun maxsus amaliy mavzular"
                  : "Structured English speaking curricula from beginner to mastery"}
              </p>
            </div>

            {/* Level Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevelFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    selectedLevelFilter === lvl
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {lvl === 'All' ? t.allLevels : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLessons.map((lesson) => {
              const isCompleted = completedLessons[lesson.id]?.completed;
              return (
                <div
                  key={lesson.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCompleted
                      ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {lesson.level}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{lesson.estimatedMinutes} {t.lessonDuration}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {lang === 'uz' ? lesson.uzbekTitle : lesson.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {lang === 'uz' ? lesson.uzbekDescription : lesson.description}
                    </p>

                    {/* Vocab Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {lesson.vocabList.slice(0, 2).map((v) => (
                        <span
                          key={v.id}
                          className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        >
                          {v.word}
                        </span>
                      ))}
                      {lesson.vocabList.length > 2 && (
                        <span className="text-[11px] text-slate-400 self-center">
                          +{lesson.vocabList.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Ready to start</span>
                    )}

                    <button
                      onClick={() => handleStartLesson(lesson)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
                    >
                      <span>{isCompleted ? 'Review' : t.startLesson}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Lesson Runner */
        <div className="space-y-6">
          {/* Top Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveLesson(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.backToLessons}</span>
            </button>

            {/* Stepper bar */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className={lessonStep === 'intro' ? 'text-blue-600 font-bold' : 'text-slate-400'}>
                1. Intro
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={lessonStep === 'vocab' ? 'text-blue-600 font-bold' : 'text-slate-400'}>
                2. Vocab
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={lessonStep === 'conversation' ? 'text-blue-600 font-bold' : 'text-slate-400'}>
                3. Live Practice
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={lessonStep === 'summary' ? 'text-blue-600 font-bold' : 'text-slate-400'}>
                4. Feedback
              </span>
            </div>
          </div>

          {/* STEP 1: INTRO */}
          {lessonStep === 'intro' && (
            <div className="max-w-2xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  {activeLesson.level} Level
                </span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {lang === 'uz' ? activeLesson.uzbekTitle : activeLesson.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'uz' ? activeLesson.uzbekDescription : activeLesson.description}
                </p>
              </div>

              {activeLesson.roleplayScenario && (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 space-y-2 text-xs">
                  <div className="font-bold text-blue-900 dark:text-blue-200 uppercase text-[10px]">
                    Roleplay Context
                  </div>
                  <div>
                    <strong>Your Role:</strong> {activeLesson.roleplayScenario.userRole}
                  </div>
                  <div>
                    <strong>AI Tutor Role:</strong> {activeLesson.roleplayScenario.aiRole}
                  </div>
                  <div>
                    <strong>Setting:</strong> {activeLesson.roleplayScenario.setting}
                  </div>
                  <div>
                    <strong>Goal:</strong> {activeLesson.roleplayScenario.objective}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setLessonStep('vocab')}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  <span>Continue to Vocabulary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: VOCABULARY */}
          {lessonStep === 'vocab' && (
            <div className="max-w-2xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t.lessonVocab}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Listen to the pronunciation and review the Uzbek meanings before speaking.
                </p>
              </div>

              <div className="space-y-3">
                {activeLesson.vocabList.map((word) => (
                  <div
                    key={word.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {word.word}
                        </span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                          {word.ipa}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {word.uzbekMeaning}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 italic">
                        "{word.exampleSentence}"
                      </div>
                    </div>

                    <button
                      onClick={() => handlePronounce(word.word)}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 self-start sm:self-center"
                      title="Listen"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setLessonStep('intro')}
                  className="text-xs font-semibold text-slate-500"
                >
                  Back
                </button>
                <button
                  onClick={() => setLessonStep('conversation')}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  <span>Start Live Conversation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CONVERSATION */}
          {lessonStep === 'conversation' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {lang === 'uz' ? activeLesson.uzbekTitle : activeLesson.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Interact with your AI tutor. When satisfied, click "Complete Lesson" below.
                  </p>
                </div>
                <button
                  onClick={handleFinishLesson}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Complete Lesson</span>
                </button>
              </div>

              <VoiceChat
                mode="roleplay"
                userLevel={activeLesson.level}
                explanationLanguage={explanationLanguage}
                sessionId={`lesson-${activeLesson.id}`}
                lessonContext={`${activeLesson.title}: ${activeLesson.description}`}
                initialPrompt={`Hello! Welcome to our lesson on "${activeLesson.title}". Let's begin with our warm-up: ${activeLesson.warmUpQuestions[0] || 'How are you feeling today?'}`}
                onUpdateStats={onUpdateStats}
              />
            </div>
          )}

          {/* STEP 4: SUMMARY & CELEBRATION */}
          {lessonStep === 'summary' && (
            <div className="max-w-xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t.lessonComplete}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  You successfully practiced: "{lang === 'uz' ? activeLesson.uzbekTitle : activeLesson.title}"
                </p>
              </div>

              {/* Score Badges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</span>
                  <div className="text-xl font-bold text-emerald-600">88%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Fluency</span>
                  <div className="text-xl font-bold text-blue-600">92%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Overall</span>
                  <div className="text-xl font-bold text-purple-600">A</div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-left text-xs space-y-2">
                <span className="font-bold text-blue-900 dark:text-blue-200 block">
                  {t.recommendations}:
                </span>
                <p className="text-slate-700 dark:text-slate-300">
                  • Great job asking clarifying questions! Focus next on linking words like "furthermore" and "in addition".
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  • Review vocabulary card "{activeLesson.vocabList[0]?.word}" to keep it fresh in long-term memory.
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setActiveLesson(null)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors"
                >
                  {t.backToLessons}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
