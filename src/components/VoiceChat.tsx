import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Square,
  Play,
  RotateCcw,
  Volume2,
  Send,
  Sparkles,
  AlertCircle,
  Settings2,
  Clock,
  User,
  Bot,
  Gauge,
} from 'lucide-react';
import { ChatMessage, CEFRLevel, Language, SpeakingMode } from '../types';
import { translations } from '../i18n/translations';
import { AIService } from '../services/aiService';
import { SpeechService } from '../services/speechService';
import { dataStore } from '../services/storage';
import { CorrectionCard } from './CorrectionCard';
import { AudioWaveform } from './AudioWaveform';

interface VoiceChatProps {
  mode: SpeakingMode;
  userLevel: CEFRLevel;
  explanationLanguage: Language;
  sessionId: string;
  lessonContext?: string;
  initialPrompt?: string;
  onUpdateStats?: () => void;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({
  mode,
  userLevel,
  explanationLanguage,
  sessionId,
  lessonContext,
  initialPrompt,
  onUpdateStats,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatState, setChatState] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'paused'>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon'>('Kore');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0);
  const [activeAudioPlayingId, setActiveAudioPlayingId] = useState<string | null>(null);
  const [micLang, setMicLang] = useState<'en-US' | 'uz-UZ'>(
    explanationLanguage === 'uz' ? 'uz-UZ' : 'en-US'
  );

  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speakingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const t = translations[explanationLanguage];

  // Load existing chat history or initialize
  useEffect(() => {
    const history = dataStore.getChatHistory(sessionId);
    if (history.length > 0) {
      setMessages(history);
    } else if (initialPrompt) {
      const welcomeMsg: ChatMessage = {
        id: 'msg-welcome',
        role: 'assistant',
        content: initialPrompt,
        timestamp: Date.now(),
      };
      setMessages([welcomeMsg]);
      dataStore.saveChatMessage(sessionId, welcomeMsg);
      // Speak welcome message
      SpeechService.speak(initialPrompt, { rate: speechSpeed, voicePreference: selectedVoice });
    }
  }, [sessionId, initialPrompt]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, interimText, chatState]);

  // Clean up audio & speech on unmount
  useEffect(() => {
    return () => {
      SpeechService.stopListening();
      SpeechService.stopSpeaking();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (speakingTimerRef.current) clearInterval(speakingTimerRef.current);
    };
  }, []);

  const handleStartListening = () => {
    setErrorMessage(null);
    SpeechService.stopSpeaking();

    if (!SpeechService.isRecognitionSupported()) {
      setErrorMessage(t.speechRecognitionNotSupported);
      return;
    }

    setTranscript('');
    setInterimText('');
    setChatState('listening');

    // Start elapsed timer
    speakingTimerRef.current = setInterval(() => {
      setSpeakingSeconds((prev) => prev + 1);
    }, 1000);

    SpeechService.startListening(
      {
        onStart: () => {
          setChatState('listening');
        },
        onInterimResult: (text) => {
          setInterimText(text);
          // Reset silence auto-send timer
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            // Auto submit after 2.2 seconds of clear pause if configured
            handleFinishSpeaking();
          }, 2400);
        },
        onFinalResult: (text) => {
          setTranscript((prev) => (prev ? `${prev} ${text}` : text));
          setInterimText('');
        },
        onError: (err) => {
          if (err === 'NOT_ALLOWED') {
            setErrorMessage(t.micAccessDenied);
          } else if (err === 'NOT_SUPPORTED') {
            setErrorMessage(t.speechRecognitionNotSupported);
          } else {
            console.warn('Speech error:', err);
          }
          setChatState('idle');
          if (speakingTimerRef.current) clearInterval(speakingTimerRef.current);
        },
        onEnd: () => {
          // If we have transcript when mic ends, process it
        },
      },
      micLang
    );
  };

  const handleFinishSpeaking = () => {
    SpeechService.stopListening();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (speakingTimerRef.current) clearInterval(speakingTimerRef.current);

    const fullText = (transcript + ' ' + interimText).trim();
    setTranscript('');
    setInterimText('');

    if (fullText.length > 0) {
      sendMessage(fullText);
    } else {
      setChatState('idle');
    }
  };

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || chatState === 'processing') return;

    setErrorMessage(null);
    setChatState('processing');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    dataStore.saveChatMessage(sessionId, userMsg);

    try {
      const response = await AIService.sendChatMessage({
        userText: textToSend.trim(),
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        mode,
        userLevel,
        explanationLanguage,
        lessonContext,
        tutorVoice: selectedVoice,
      });

      // Attach correction to the user message
      userMsg.correction = response.correction;
      dataStore.saveChatMessage(sessionId, userMsg);

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
        audioBase64: response.audioBase64,
      };

      const updatedHistory = [...newMessages, assistantMsg];
      setMessages(updatedHistory);
      dataStore.saveChatMessage(sessionId, assistantMsg);

      // Record progress metrics in data store
      const minutes = Math.max(0.1, speakingSeconds / 60);
      dataStore.recordSpeakingActivity(minutes, 1, {
        grammar: response.correction.scores?.grammar || 85,
        fluency: response.correction.scores?.fluency || 80,
        pronunciation: 82,
      });
      setSpeakingSeconds(0);
      onUpdateStats?.();

      // Play tutor voice response
      setChatState('speaking');
      setActiveAudioPlayingId(assistantMsg.id);

      await SpeechService.speak(response.reply, {
        audioBase64: response.audioBase64,
        rate: speechSpeed,
        voicePreference: selectedVoice,
        onStart: () => setChatState('speaking'),
        onEnd: () => {
          setChatState('idle');
          setActiveAudioPlayingId(null);
        },
      });
    } catch (err: any) {
      console.error('Error sending message:', err);
      setErrorMessage(t.errorGeneric);
      setChatState('idle');
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const text = textInput;
    setTextInput('');
    sendMessage(text);
  };

  const handleReplay = (msg: ChatMessage) => {
    setActiveAudioPlayingId(msg.id);
    setChatState('speaking');
    SpeechService.speak(msg.content, {
      audioBase64: msg.audioBase64,
      rate: speechSpeed,
      voicePreference: selectedVoice,
      onStart: () => setChatState('speaking'),
      onEnd: () => {
        setChatState('idle');
        setActiveAudioPlayingId(null);
      },
    });
  };

  const handlePauseResume = () => {
    if (chatState === 'speaking') {
      SpeechService.stopSpeaking();
      setChatState('paused');
    } else if (chatState === 'listening') {
      SpeechService.stopListening();
      setChatState('paused');
    } else if (chatState === 'paused') {
      setChatState('idle');
    }
  };

  const handleReset = () => {
    SpeechService.stopListening();
    SpeechService.stopSpeaking();
    dataStore.clearChatHistory(sessionId);
    setMessages([]);
    setChatState('idle');
    setTranscript('');
    setInterimText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] min-h-[580px] max-w-4xl mx-auto rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Top Session Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
            <Bot className="w-4 h-4 text-blue-500" />
            <span>AI Tutor</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-medium">
            {userLevel}
          </span>
          {lessonContext && (
            <span className="hidden md:inline text-slate-500 truncate max-w-[200px]">
              • {lessonContext}
            </span>
          )}
        </div>

        {/* Controls: Speed, Voice, Reset */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px]">
            <Gauge className="w-3 h-3 text-slate-500" />
            <select
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(Number(e.target.value))}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-300 outline-hidden cursor-pointer"
            >
              <option value="0.75">0.75x</option>
              <option value="1.0">1.0x</option>
              <option value="1.25">1.25x</option>
            </select>
          </div>

          {/* Voice Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px]">
            <Settings2 className="w-3 h-3 text-slate-500" />
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              className="bg-transparent font-medium text-slate-700 dark:text-slate-300 outline-hidden cursor-pointer"
            >
              <option value="Kore">Kore (Female)</option>
              <option value="Puck">Puck (Male)</option>
              <option value="Fenrir">Fenrir (Deep)</option>
              <option value="Zephyr">Zephyr (Gentle)</option>
              <option value="Charon">Charon (Calm)</option>
            </select>
          </div>

          {/* Clear Session */}
          <button
            onClick={handleReset}
            title={t.resetChat}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-950/50 border-b border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        ref={chatScrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/40"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 dark:text-slate-500 space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium">{t.noMessagesYet}</p>
            <p className="text-xs max-w-sm">
              {explanationLanguage === 'uz'
                ? "Mikrofon tugmasini bosing yoki quyida yozing. AI o'qituvchi siz bilan muloqot qiladi va xatolaringizni o'zbek tilida tushuntiradi."
                : 'Click the microphone button or type below. The AI tutor will converse naturally and guide your grammar and pronunciation.'}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-1 px-1">
                  {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-blue-500" />}
                  <span>{isUser ? 'You' : 'AI Tutor'}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-sm shadow-blue-500/10'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-750 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2 text-xs">
                      <button
                        onClick={() => handleReplay(msg)}
                        disabled={chatState === 'speaking' && activeAudioPlayingId === msg.id}
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{activeAudioPlayingId === msg.id ? 'Playing...' : t.replayAudio}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Show Linguistic Correction Card for User Turns */}
                {isUser && msg.correction && (
                  <div className="w-full max-w-[95%] sm:max-w-[90%]">
                    <CorrectionCard correction={msg.correction} lang={explanationLanguage} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Live Interim Transcript Bubble */}
        {(transcript || interimText) && chatState === 'listening' && (
          <div className="flex flex-col items-end animate-fadeIn">
            <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-blue-500/80 text-white border border-blue-400 shadow-sm">
              <div className="flex items-center gap-1.5 text-[11px] opacity-80 mb-1">
                <Mic className="w-3 h-3 animate-pulse" />
                <span>Listening...</span>
              </div>
              <p className="italic">
                {transcript} <span className="opacity-75 underline">{interimText}</span>
              </p>
            </div>
          </div>
        )}

        {/* Processing Indicator */}
        {chatState === 'processing' && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span>{t.processing}</span>
          </div>
        )}
      </div>

      {/* Voice Visualizer State Bar */}
      <div className="border-t bg-slate-50/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800 py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium">
          {chatState === 'listening' && (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>{t.listening}</span>
            </span>
          )}
          {chatState === 'speaking' && (
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>{t.aiSpeaking}</span>
            </span>
          )}
          {chatState === 'processing' && (
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{t.processing}</span>
            </span>
          )}
          {chatState === 'idle' && (
            <span className="text-slate-400 dark:text-slate-500">
              {t.pressToSpeak}
            </span>
          )}
        </div>

        {/* Small Audio Waveform */}
        <div className="w-36 h-6">
          <AudioWaveform
            state={
              chatState === 'listening'
                ? 'listening'
                : chatState === 'speaking'
                ? 'speaking'
                : chatState === 'processing'
                ? 'processing'
                : 'idle'
            }
            size="sm"
          />
        </div>
      </div>

      {/* Bottom Voice & Text Interaction Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
        {/* Quick Language Switcher for Speech Recognition */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1.5 flex items-center gap-1">
              <Mic className="w-3 h-3 text-blue-500" />
              <span>{explanationLanguage === 'uz' ? "Mikrofon tili:" : "Mic Language:"}</span>
            </span>
            <button
              type="button"
              onClick={() => setMicLang('en-US')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                micLang === 'en-US'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇺🇸 English</span>
            </button>
            <button
              type="button"
              onClick={() => setMicLang('uz-UZ')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                micLang === 'uz-UZ'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🇺🇿 O'zbekcha</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:block">
            {micLang === 'uz-UZ'
              ? "🇺🇿 O'zbekcha gapiring: AI inglizcha tarjimasi va to'g'ri talaffuzini o'rgatadi"
              : "🇺🇸 Speak in English: AI will evaluate your speech & correct grammar"}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Large Voice Microphone Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            {chatState === 'listening' ? (
              <button
                onClick={handleFinishSpeaking}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-lg shadow-red-500/30 transition-all scale-105 active:scale-95 animate-pulse"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>{t.stopSpeaking}</span>
              </button>
            ) : (
              <button
                onClick={handleStartListening}
                disabled={chatState === 'processing'}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Mic className="w-5 h-5" />
                <span>{t.startVoice}</span>
              </button>
            )}

            {/* Pause/Resume button if active */}
            {(chatState === 'speaking' || chatState === 'paused') && (
              <button
                onClick={handlePauseResume}
                className="p-3 rounded-full border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                title={chatState === 'paused' ? t.resume : t.pause}
              >
                {chatState === 'paused' ? <Play className="w-4 h-4" /> : <Square className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Text Input Fallback */}
          <form onSubmit={handleTextSubmit} className="flex-1 flex items-center gap-2 w-full">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                micLang === 'uz-UZ'
                  ? "O'zbekcha yozing yoki gapiring (AI inglizchasini o'rgatadi)..."
                  : (explanationLanguage === 'uz' ? "Inglizcha yoki o'zbekcha yozing..." : t.typeInstead)
              }
              disabled={chatState === 'processing'}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || chatState === 'processing'}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all"
              title={t.send}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
