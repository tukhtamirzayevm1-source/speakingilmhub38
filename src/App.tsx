import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LevelTestModal } from './components/LevelTestModal';
import { HomePage } from './pages/HomePage';
import { TutorPage } from './pages/TutorPage';
import { ModesPage } from './pages/ModesPage';
import { LessonsPage } from './pages/LessonsPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { PronunciationPage } from './pages/PronunciationPage';
import { IeltsPage } from './pages/IeltsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { CEFRLevel, Language, SpeakingMode, UserSettings, UserStats } from './types';
import { dataStore } from './services/storage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [settings, setSettings] = useState<UserSettings>(dataStore.getSettings());
  const [stats, setStats] = useState<UserStats>(dataStore.getStats());
  const [isLevelTestOpen, setIsLevelTestOpen] = useState<boolean>(false);
  const [activeSpeakingMode, setActiveSpeakingMode] = useState<SpeakingMode>('free_conversation');

  // Apply dark mode class to html element
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    dataStore.saveSettings(updated);
  };

  const handleToggleLang = () => {
    const nextLang: Language = settings.interfaceLanguage === 'uz' ? 'en' : 'uz';
    handleUpdateSettings({
      interfaceLanguage: nextLang,
      explanationLanguage: nextLang,
    });
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    handleUpdateSettings({ theme: nextTheme });
  };

  const handleApplyLevel = (level: CEFRLevel) => {
    const current = dataStore.getStats();
    current.currentLevel = level;
    dataStore.saveStats(current);
    setStats({ ...current });
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all progress data?')) {
      dataStore.resetAllData();
      setStats(dataStore.getStats());
      setSettings(dataStore.getSettings());
      setCurrentTab('home');
    }
  };

  const handleStartSpeaking = (mode?: SpeakingMode) => {
    if (mode) {
      setActiveSpeakingMode(mode);
    }
    setCurrentTab('tutor');
  };

  const handleUpdateStats = () => {
    setStats(dataStore.getStats());
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        lang={settings.interfaceLanguage}
        onToggleLang={handleToggleLang}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        currentLevel={stats.currentLevel}
        onOpenLevelTest={() => setIsLevelTestOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 sm:pt-6">
        {currentTab === 'home' && (
          <HomePage
            lang={settings.interfaceLanguage}
            userLevel={stats.currentLevel}
            onStartSpeaking={handleStartSpeaking}
            onOpenLevelTest={() => setIsLevelTestOpen(true)}
            onExploreLessons={() => setCurrentTab('lessons')}
            onOpenVocabulary={() => setCurrentTab('vocabulary')}
          />
        )}

        {currentTab === 'tutor' && (
          <TutorPage
            lang={settings.interfaceLanguage}
            userLevel={stats.currentLevel}
            explanationLanguage={settings.explanationLanguage}
            initialMode={activeSpeakingMode}
            onUpdateStats={handleUpdateStats}
            onExploreLessons={() => setCurrentTab('lessons')}
          />
        )}

        {currentTab === 'modes' && (
          <ModesPage
            lang={settings.interfaceLanguage}
            onSelectMode={(mode) => {
              setActiveSpeakingMode(mode);
              setCurrentTab('tutor');
            }}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonsPage
            lang={settings.interfaceLanguage}
            userLevel={stats.currentLevel}
            explanationLanguage={settings.explanationLanguage}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {currentTab === 'vocabulary' && (
          <VocabularyPage
            lang={settings.interfaceLanguage}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {currentTab === 'pronunciation' && (
          <PronunciationPage
            lang={settings.interfaceLanguage}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {currentTab === 'ielts' && (
          <IeltsPage
            lang={settings.interfaceLanguage}
            onUpdateStats={handleUpdateStats}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            stats={stats}
            lang={settings.interfaceLanguage}
            onOpenLevelTest={() => setIsLevelTestOpen(true)}
            onStartSpeaking={() => handleStartSpeaking()}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            stats={stats}
            settings={settings}
            lang={settings.interfaceLanguage}
            onOpenLevelTest={() => setIsLevelTestOpen(true)}
            onResetData={handleResetData}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsPage
            settings={settings}
            lang={settings.interfaceLanguage}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

      {/* Placement Level Test Modal */}
      <LevelTestModal
        isOpen={isLevelTestOpen}
        onClose={() => setIsLevelTestOpen(false)}
        lang={settings.interfaceLanguage}
        onApplyLevel={handleApplyLevel}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} LingoMentor AI • Real-Time Voice English Speaking Teacher
          </span>
          <span className="text-[11px] text-slate-400">
            {settings.interfaceLanguage === 'uz'
              ? "Ingliz tili nutqini rivojlantirish platformasi"
              : "Advanced English Fluency & CEFR Mastery"}
          </span>
        </div>
      </footer>
    </div>
  );
}
