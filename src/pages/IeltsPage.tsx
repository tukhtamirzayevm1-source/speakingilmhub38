import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  FileText,
  Volume2,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { VoiceChat } from '../components/VoiceChat';

interface IeltsPageProps {
  lang: Language;
  onUpdateStats?: () => void;
}

export const IeltsPage: React.FC<IeltsPageProps> = ({ lang, onUpdateStats }) => {
  const [activePart, setActivePart] = useState<'part1' | 'part2' | 'part3'>('part1');
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number>(60);
  const [isPrepRunning, setIsPrepRunning] = useState<boolean>(false);
  const [speechSecondsLeft, setSpeechSecondsLeft] = useState<number>(120);
  const [isSpeechRunning, setIsSpeechRunning] = useState<boolean>(false);

  const t = translations[lang];

  // 1-minute prep timer for Part 2
  useEffect(() => {
    let interval: any = null;
    if (isPrepRunning && prepSecondsLeft > 0) {
      interval = setInterval(() => setPrepSecondsLeft((p) => p - 1), 1000);
    } else if (prepSecondsLeft === 0) {
      setIsPrepRunning(false);
    }
    return () => clearInterval(interval);
  }, [isPrepRunning, prepSecondsLeft]);

  // 2-minute speaking timer for Part 2
  useEffect(() => {
    let interval: any = null;
    if (isSpeechRunning && speechSecondsLeft > 0) {
      interval = setInterval(() => setSpeechSecondsLeft((s) => s - 1), 1000);
    } else if (speechSecondsLeft === 0) {
      setIsSpeechRunning(false);
    }
    return () => clearInterval(interval);
  }, [isSpeechRunning, speechSecondsLeft]);

  const cueCardTopic = {
    title: 'Describe a memorable journey you went on.',
    bulletPoints: [
      'Where you went and how you traveled',
      'Whom you went with',
      'What you did during the journey',
      'And explain why this journey was so unforgettable for you.',
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.ieltsTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.ieltsSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Part Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActivePart('part1')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePart === 'part1'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.ieltsPart1}
        </button>
        <button
          onClick={() => setActivePart('part2')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePart === 'part2'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.ieltsPart2}
        </button>
        <button
          onClick={() => setActivePart('part3')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activePart === 'part3'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t.ieltsPart3}
        </button>
      </div>

      {/* Part 2 Specific Cue Card & Timers */}
      {activePart === 'part2' && (
        <div className="p-6 rounded-2xl border border-purple-200 dark:border-purple-800/80 bg-gradient-to-br from-purple-50/40 via-white to-pink-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-purple-950/20 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-100 dark:border-purple-900/60">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-sm text-purple-900 dark:text-purple-200">
                Official IELTS Candidate Task Card
              </span>
            </div>

            {/* Timers */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>Prep: 00:{prepSecondsLeft < 10 ? `0${prepSecondsLeft}` : prepSecondsLeft}</span>
                <button
                  onClick={() => setIsPrepRunning(!isPrepRunning)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  {isPrepRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button onClick={() => setPrepSecondsLeft(60)} className="text-slate-400">
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Speak: {Math.floor(speechSecondsLeft / 60)}:{speechSecondsLeft % 60 < 10 ? `0${speechSecondsLeft % 60}` : speechSecondsLeft % 60}</span>
                <button
                  onClick={() => setIsSpeechRunning(!isSpeechRunning)}
                  className="ml-1 text-emerald-600 hover:text-emerald-800"
                >
                  {isSpeechRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {cueCardTopic.title}
            </h3>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              You should say:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {cueCardTopic.bulletPoints.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Embedded IELTS Voice Chat Simulator */}
      <VoiceChat
        key={activePart}
        mode="ielts_speaking"
        userLevel="B2"
        explanationLanguage={lang}
        sessionId={`ielts-session-${activePart}`}
        lessonContext={`IELTS Speaking Examination ${activePart.toUpperCase()}. You are a strict but fair certified British Council IELTS Examiner. Assess the student against Fluency, Lexical Resource, Grammar, and Pronunciation.`}
        initialPrompt={
          activePart === 'part1'
            ? "Good day. My name is Dr. Harrison, your IELTS Speaking Examiner. Could you please tell me your full name, and do you currently work or study?"
            : activePart === 'part2'
            ? "Now I am going to give you a topic and I would like you to speak for one to two minutes. Take your time to think, and begin speaking when you are ready."
            : "We have been talking about a memorable journey. Now I'd like to ask you some broader questions related to travel. How has tourism changed the economy of your country?"
        }
        onUpdateStats={onUpdateStats}
      />
    </div>
  );
};
