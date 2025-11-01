import React, { useState, useEffect } from 'react';
import { Dashboard } from '../components/Dashboard';
import { ChatOverlay } from '../components/ChatOverlay';
import { Settings } from '../components/chat/Settings';
import { storage } from '../lib/storage';
import { initializeGemini } from '../services/gemini';
import { Settings as SettingsIcon } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(storage.getApiKey() || '');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (apiKey) {
      try {
        initializeGemini(apiKey);
      } catch (error) {
        console.error('Failed to initialize Gemini:', error);
      }
    } else {
      setIsSettingsOpen(true);
    }
  }, [apiKey]);

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    storage.setApiKey(newKey);
    if (newKey) {
      try {
        initializeGemini(newKey);
      } catch (error) {
        console.error('Failed to initialize Gemini:', error);
      }
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage.setTheme(newTheme);
  };

  return (
    <div className="relative min-h-screen">
      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-4 z-30 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
      >
        <SettingsIcon className="w-5 h-5 text-white" />
      </button>

      {/* Dashboard */}
      <Dashboard onStartChat={() => setIsChatOpen(true)} />

      {/* Chat Overlay */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        apiKey={apiKey}
      />

      {/* Settings Modal */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
    </div>
  );
};
