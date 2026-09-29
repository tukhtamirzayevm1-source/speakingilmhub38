import React, { useState } from 'react';
import {
  X,
  History,
  Trash2,
  MessageSquare,
  Search,
  Clock,
  Sparkles,
  ArrowRight,
  Bot,
  AlertTriangle,
} from 'lucide-react';
import { ConversationSession, Language } from '../types';
import { translations } from '../i18n/translations';
import { dataStore } from '../services/storage';

interface ConversationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onSelectSession: (sessionId: string, mode: any, level: any) => void;
}

export const ConversationHistoryModal: React.FC<ConversationHistoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSelectSession,
}) => {
  const [sessions, setSessions] = useState<ConversationSession[]>(dataStore.getAllSessions());
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState<boolean>(false);
  const t = translations[lang];

  if (!isOpen) return null;

  const filteredSessions = sessions.filter((s) => {
    const q = filterQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.title.toLowerCase().includes(q) ||
      s.mode.toLowerCase().includes(q) ||
      s.lastMessage.toLowerCase().includes(q)
    );
  });

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    dataStore.deleteSession(sessionId);
    setSessions(dataStore.getAllSessions());
    setDeletingSessionId(null);
  };

  const handleClearAll = () => {
    dataStore.clearAllSessions();
    setSessions([]);
    setShowClearAllConfirm(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t.conversationHistory}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {sessions.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'uz' ? "Barcha saqlangan so'zlashuvlar va xabarlar" : "Saved conversations & voice dialogues"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sessions.length > 0 && !showClearAllConfirm && (
              <button
                onClick={() => setShowClearAllConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 border border-red-200 dark:border-red-900/40 transition-colors"
                title={t.clearAllSessions}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{lang === 'uz' ? "Barchasini o'chirish" : "Clear All"}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clear All In-UI Confirmation Banner */}
        {showClearAllConfirm && (
          <div className="px-5 py-3 bg-red-50 dark:bg-red-950/50 border-b border-red-200 dark:border-red-900 flex items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>
                {lang === 'uz'
                  ? "Barcha suhbatlar tarixini o'chirishni tasdiqlaysizmi?"
                  : "Are you sure you want to delete all saved conversations?"}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleClearAll}
                className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-xs"
              >
                {lang === 'uz' ? "Ha, barchasini o'chirish" : "Yes, Delete All"}
              </button>
              <button
                onClick={() => setShowClearAllConfirm(false)}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
              >
                {lang === 'uz' ? "Bekor qilish" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {/* Search bar inside History */}
        {sessions.length > 0 && (
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder={lang === 'uz' ? "Suhbatlar tarixidan qidirish..." : "Search saved conversations..."}
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
              {filterQuery && (
                <button
                  onClick={() => setFilterQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={t.clearSearchInput}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          {sessions.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-500 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {t.noSessionsFound}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {lang === 'uz'
                  ? "AI o'qituvchi bilan so'zlashuvni boshlaganingizda, suhbatlaringiz avtomatik ravishda bu yerda saqlanadi."
                  : "When you converse with the AI tutor, your speech history and corrections will be stored here."}
              </p>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              {lang === 'uz' ? "Qidiruv bo'yicha hech qanday suhbat topilmadi." : "No conversations matched your search."}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isConfirmingDelete = deletingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    if (!isConfirmingDelete) {
                      onSelectSession(session.id, session.mode, session.userLevel);
                      onClose();
                    }
                  }}
                  className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isConfirmingDelete
                      ? 'border-red-300 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {session.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {session.userLevel}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {session.mode.replace(/_/g, ' ')}
                      </span>
                    </div>

                    {session.lastMessage && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        "{session.lastMessage}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(session.updatedAt)}</span>
                      </span>
                      <span>•</span>
                      <span>{session.messageCount} {t.messagesCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Explicit Delete Button with in-UI confirmation */}
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleDeleteSession(e, session.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                        >
                          {lang === 'uz' ? "O'chirish" : "Confirm"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingSessionId(null);
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] hover:bg-slate-300 transition-colors"
                        >
                          {lang === 'uz' ? "Bekor" : "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingSessionId(session.id);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
                        title={t.deleteSession}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{lang === 'uz' ? "O'chirish" : "Delete"}</span>
                      </button>
                    )}

                    <div className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {lang === 'uz' ? "Suhbatni davom ettirish uchun uning ustiga bosing" : "Click any session to continue speaking"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            {lang === 'uz' ? "Yopish" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
