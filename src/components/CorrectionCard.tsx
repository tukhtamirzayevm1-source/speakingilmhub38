import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Volume2,
  Sparkles,
  BookOpen,
  ChevronDown,
  ChevronUp,
  MessageSquareQuote,
  Copy,
  Check,
} from 'lucide-react';
import { CorrectionData, Language } from '../types';
import { translations } from '../i18n/translations';
import { SpeechService } from '../services/speechService';

interface CorrectionCardProps {
  correction: CorrectionData;
  lang: Language;
}

export const CorrectionCard: React.FC<CorrectionCardProps> = ({ correction, lang }) => {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  const handlePlayPronunciation = (text: string) => {
    SpeechService.speak(text, { rate: 0.9 });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!correction) return null;

  return (
    <div className="mt-2 rounded-xl border transition-all overflow-hidden bg-slate-50/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Header bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          {correction.hadErrors ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lang === 'uz' ? "Tuzatishlar mavjud" : "Corrections & Polish"}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'uz' ? "Zo'r! To'g'ri gapirildi" : "Great Grammar!"}</span>
            </span>
          )}

          {correction.scores && (
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span>Grammar: <strong className="text-slate-700 dark:text-slate-200">{correction.scores.grammar}%</strong></span>
              <span>•</span>
              <span>Fluency: <strong className="text-slate-700 dark:text-slate-200">{correction.scores.fluency}%</strong></span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <span className="text-xs font-medium hidden sm:inline">
            {expanded ? (lang === 'uz' ? 'Yopish' : 'Hide') : (lang === 'uz' ? "Ko'rish" : 'Details')}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Expandable Body */}
      {expanded && (
        <div className="p-3.5 sm:p-4 space-y-3.5 text-xs sm:text-sm">
          {/* YOUR SENTENCE */}
          <div>
            <div className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-1">
              {t.yourSentence}
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
              "{correction.userSentence}"
            </div>
          </div>

          {/* CORRECTED */}
          {correction.hadErrors && correction.correctedSentence && (
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase mb-1">
                <span>{t.correctedSentence}</span>
                <button
                  onClick={() => handlePlayPronunciation(correction.correctedSentence)}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline normal-case font-normal"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === 'uz' ? 'Tinglash' : 'Listen'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium flex items-center justify-between gap-2">
                <span>"{correction.correctedSentence}"</span>
                <button
                  onClick={() => handleCopy(correction.correctedSentence)}
                  title="Copy"
                  className="p-1 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* MORE NATURAL */}
          {correction.moreNatural && (
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase mb-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{t.moreNatural}</span>
                </span>
                <button
                  onClick={() => handlePlayPronunciation(correction.moreNatural)}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline normal-case font-normal"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{lang === 'uz' ? 'Tinglash' : 'Listen'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 italic">
                "{correction.moreNatural}"
              </div>
            </div>
          )}

          {/* EXPLANATION */}
          {correction.explanation && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase mb-1">
                <BookOpen className="w-3 h-3" />
                <span>{t.explanation}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-purple-50/40 dark:bg-purple-950/20 p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/40">
                {correction.explanation}
              </p>
            </div>
          )}

          {/* PRONUNCIATION */}
          {correction.pronunciationTips && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-teal-600 dark:text-teal-400 uppercase mb-1">
                <Volume2 className="w-3 h-3" />
                <span>{t.pronunciationGuidance}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-teal-50/30 dark:bg-teal-950/20 p-2.5 rounded-lg border border-teal-100 dark:border-teal-900/30">
                {correction.pronunciationTips}
              </p>
            </div>
          )}

          {/* SUGGESTED VOCABULARY */}
          {correction.suggestedVocabulary && correction.suggestedVocabulary.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                {t.recommendedVocab}:
              </span>
              {correction.suggestedVocabulary.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs"
                >
                  <strong>{v.word}</strong>
                  <span className="text-[10px] opacity-75">({v.translation})</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
