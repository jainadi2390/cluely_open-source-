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
  const [apiKey, setApiKey] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const isElectron = typeof window !== 'undefined' && window.electronAPI;

  useEffect(() => {
    // Load API key from Electron if available, otherwise from localStorage
    const loadApiKey = async () => {
      if (isElectron) {
        try {
          const key = await window.electronAPI.getApiKey();
          setApiKey(key || '');
          if (key) {
            initializeGemini(key);
          } else {
            setIsSettingsOpen(true);
          }
        } catch (error) {
          console.error('Error loading API key from Electron:', error);
          const localKey = storage.getApiKey() || '';
          setApiKey(localKey);
          if (!localKey) {
            setIsSettingsOpen(true);
          }
        }
      } else {
        const localKey = storage.getApiKey() || '';
        setApiKey(localKey);
        if (localKey) {
          initializeGemini(localKey);
        } else {
          setIsSettingsOpen(true);
        }
      }
    };

    loadApiKey();
  }, [isElectron]);

  const handleApiKeyChange = async (newKey: string) => {
    setApiKey(newKey);
    storage.setApiKey(newKey);

    // Save to Electron if available
    if (isElectron) {
      try {
        await window.electronAPI.saveApiKey(newKey);
      } catch (error) {
        console.error('Error saving API key to Electron:', error);
      }
    }

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
