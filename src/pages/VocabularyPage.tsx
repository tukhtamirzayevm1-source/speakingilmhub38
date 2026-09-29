import React, { useState } from 'react';
import {
  Search,
  Volume2,
  Sparkles,
  BookOpen,
  CheckCircle,
  Check,
  Plus,
  Layers,
  ArrowRight,
  History,
  Trash2,
  X,
} from 'lucide-react';
import { Language, VocabularyWord } from '../types';
import { translations } from '../i18n/translations';
import { VOCABULARY_DATABASE } from '../data/vocabularyData';
import { SpeechService } from '../services/speechService';
import { AIService } from '../services/aiService';
import { dataStore } from '../services/storage';

interface VocabularyPageProps {
  lang: Language;
  onUpdateStats?: () => void;
}

export const VocabularyPage: React.FC<VocabularyPageProps> = ({ lang, onUpdateStats }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchHistory, setSearchHistory] = useState<string[]>(dataStore.getSearchHistory());
  const [learnedWords, setLearnedWords] = useState<VocabularyWord[]>(dataStore.getLearnedWords());
  const [aiLookupQuery, setAiLookupQuery] = useState<string>('');
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [flashcardMode, setFlashcardMode] = useState<boolean>(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const t = translations[lang];

  const categories = [
    { id: 'all', label: t.categoryAll },
    { id: 'common', label: t.categoryCommon },
    { id: 'advanced', label: t.categoryAdvanced },
    { id: 'phrasal_verbs', label: t.categoryPhrasal },
    { id: 'idioms', label: t.categoryIdioms },
    { id: 'collocations', label: t.categoryCollocations },
    { id: 'academic', label: t.categoryAcademic },
    { id: 'business', label: t.categoryBusiness },
    { id: 'ielts', label: t.categoryIelts },
    { id: 'daily', label: t.categoryDaily },
    { id: 'synonyms_antonyms', label: 'Synonyms & Antonyms' },
  ];

  // Merge database with any learned words
  const allWords = [...VOCABULARY_DATABASE];
  learnedWords.forEach((lw) => {
    if (!allWords.some((w) => w.word.toLowerCase() === lw.word.toLowerCase())) {
      allWords.push(lw);
    }
  });

  const filteredWords = allWords.filter((w) => {
    const matchesCategory = activeCategory === 'all' || w.category === activeCategory;
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.uzbekMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.englishDefinition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePronounce = (text: string) => {
    SpeechService.speak(text, { rate: 0.9 });
  };

  const handleToggleMastered = (word: VocabularyWord) => {
    const isMastered = learnedWords.some((w) => w.id === word.id && w.mastered);
    dataStore.markWordMastered(word, !isMastered);
    setLearnedWords(dataStore.getLearnedWords());
    onUpdateStats?.();
  };

  const handleCommitSearch = (term: string) => {
    const trimmed = term.trim();
    if (trimmed) {
      const updated = dataStore.addSearchHistory(trimmed);
      setSearchHistory(updated);
    }
  };

  const handleClearSearchQuery = () => {
    setSearchQuery('');
  };

  const handleSelectHistoryItem = (term: string) => {
    setSearchQuery(term);
    handleCommitSearch(term);
  };

  const handleRemoveHistoryItem = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    const updated = dataStore.removeSearchHistoryItem(term);
    setSearchHistory(updated);
  };

  const handleClearAllHistory = () => {
    dataStore.clearSearchHistory();
    setSearchHistory([]);
  };

  const handleAiLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiLookupQuery.trim()) return;

    handleCommitSearch(aiLookupQuery.trim());
    setIsLoadingAi(true);
    setAiResult(null);

    try {
      const data = await AIService.lookupVocabularyWord(aiLookupQuery.trim(), lang);
      if (data) {
        setAiResult(data);
      }
    } catch (err) {
      console.error('Lookup error:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSaveAiWord = () => {
    if (!aiResult) return;
    const newWord: VocabularyWord = {
      id: `ai-${Date.now()}`,
      word: aiResult.word,
      ipa: aiResult.ipa || '',
      partOfSpeech: aiResult.partOfSpeech || 'noun',
      uzbekMeaning: aiResult.uzbekMeaning,
      englishDefinition: aiResult.englishDefinition,
      exampleSentence: aiResult.exampleSentence,
      uzbekExample: aiResult.uzbekExample,
      level: aiResult.level || 'B2',
      category: 'advanced',
      synonyms: aiResult.synonyms,
      antonyms: aiResult.antonyms,
      mastered: false,
    };
    dataStore.markWordMastered(newWord, false);
    setLearnedWords(dataStore.getLearnedWords());
    setAiResult(null);
    setAiLookupQuery('');
    onUpdateStats?.();
  };

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Title & Flashcard Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t.vocabTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.vocabSubtitle}
          </p>
        </div>

        <button
          onClick={() => setFlashcardMode(!flashcardMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            flashcardMode
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{flashcardMode ? 'Grid Mode' : 'Flashcard Mode'}</span>
        </button>
      </div>

      {/* AI Deep-Dive Explorer Search */}
      <div className="p-4 sm:p-5 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-blue-950/20 shadow-xs">
        <form onSubmit={handleAiLookup} className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
              {t.aiGenerateWord}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={aiLookupQuery}
                onChange={(e) => setAiLookupQuery(e.target.value)}
                placeholder="e.g. Serendipity, Cutting-edge, Look into, In the long run..."
                className="w-full pl-4 pr-9 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              {aiLookupQuery && (
                <button
                  type="button"
                  onClick={() => setAiLookupQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoadingAi || !aiLookupQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors whitespace-nowrap"
            >
              {isLoadingAi ? 'Analyzing...' : 'Explore Word'}
            </button>
          </div>
        </form>

        {/* AI Result Card */}
        {aiResult && (
          <div className="mt-4 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {aiResult.word}
                </span>
                <span className="text-xs font-mono text-slate-500">{aiResult.ipa}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {aiResult.level}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePronounce(aiResult.word)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 hover:bg-blue-50"
                  title="Pronounce"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSaveAiWord}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save to Vocabulary</span>
                </button>
              </div>
            </div>

            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              O'zbekcha: {aiResult.uzbekMeaning}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Definition:</strong> {aiResult.englishDefinition}
            </p>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs italic">
              <div>"{aiResult.exampleSentence}"</div>
              <div className="text-slate-500 not-italic mt-0.5">({aiResult.uzbekExample})</div>
            </div>
          </div>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        {/* Search Input Bar with Clear Button & Submit */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommitSearch(searchQuery);
          }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-12 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearchQuery}
                className="absolute right-2.5 p-1 rounded-lg text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                title={t.clearSearchInput}
              >
                <X className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline text-slate-400 hover:text-red-500">
                  {lang === 'uz' ? "Tozalash" : "Clear"}
                </span>
              </button>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{lang === 'uz' ? "Qidirish" : "Search"}</span>
          </button>
        </form>

        {/* Permanent Search History Panel ("Qidiruv Tarixi") */}
        <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <History className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                {lang === 'uz' ? "Qidiruv Tarixi" : "Search History"}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                {searchHistory.length}
              </span>
            </div>

            {/* Clear Entire Search History Button */}
            {searchHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllHistory}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 border border-red-200 dark:border-red-900/40 transition-colors"
                title={t.clearSearchHistory}
              >
                <Trash2 className="w-3 h-3" />
                <span>{lang === 'uz' ? "Tarixni tozalash" : "Clear History"}</span>
              </button>
            )}
          </div>

          {/* History Item Pills with Delete Buttons */}
          {searchHistory.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {searchHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="group inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs text-xs transition-all hover:border-blue-400 dark:hover:border-blue-500"
                >
                  <span
                    onClick={() => handleSelectHistoryItem(item)}
                    className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 font-medium"
                    title={lang === 'uz' ? `"${item}" bo'yicha qidirish` : `Search "${item}"`}
                  >
                    {item}
                  </span>
                  {/* Delete individual search item button */}
                  <button
                    type="button"
                    onClick={(e) => handleRemoveHistoryItem(e, item)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 transition-colors"
                    title={lang === 'uz' ? `"${item}"ni tarixdan o'chirish` : `Remove "${item}" from history`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400 text-xs py-1">
              <span>{lang === 'uz' ? "Qidiruv tarixi bo'sh. Tezkor tavsiyalar:" : "Search history is empty. Quick suggestions:"}</span>
              {['Accomplish', 'Phrasal verbs', 'Serendipity', 'Idioms', 'Daily'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelectHistoryItem(s)}
                  className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 text-[11px] font-medium hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                >
                  + {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid / Flashcards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.map((word) => {
          const isMastered = learnedWords.some((w) => w.id === word.id && w.mastered);
          const isFlipped = flippedCards[word.id];

          if (flashcardMode) {
            return (
              <div
                key={word.id}
                onClick={() => toggleFlip(word.id)}
                className="h-56 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between text-center select-none transition-all group"
              >
                {!isFlipped ? (
                  <div className="my-auto">
                    <span className="text-[10px] uppercase font-bold text-slate-400">English Word</span>
                    <h3 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                      {word.word}
                    </h3>
                    <p className="text-xs font-mono text-slate-500 mt-1">{word.ipa}</p>
                    <p className="text-[11px] text-slate-400 mt-4">Tap to reveal Uzbek meaning</p>
                  </div>
                ) : (
                  <div className="my-auto animate-fadeIn">
                    <span className="text-[10px] uppercase font-bold text-emerald-500">O'zbekcha Tarjima</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {word.uzbekMeaning}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 italic">"{word.exampleSentence}"</p>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold">{word.level}</span>
                  <span>Flip ↻</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={word.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {word.word}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">{word.ipa}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {word.level}
                  </span>
                </div>

                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">
                  {word.uzbekMeaning}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                  {word.englishDefinition}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs italic text-slate-700 dark:text-slate-300">
                  "{word.exampleSentence}"
                </div>

                {word.synonyms && word.synonyms.length > 0 && (
                  <div className="mt-2 text-[11px] text-slate-400 flex flex-wrap gap-1">
                    <span className="font-semibold">Synonyms:</span>
                    {word.synonyms.join(', ')}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handlePronounce(word.word)}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t.listenWord}</span>
                </button>

                <button
                  onClick={() => handleToggleMastered(word)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    isMastered
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isMastered ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{isMastered ? t.mastered : t.markMastered}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
