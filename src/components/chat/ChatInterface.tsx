import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Settings as SettingsIcon, Trash2 } from 'lucide-react';
import type { Message } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { Settings } from './Settings';
import { Button } from '../ui/button';
import { storage } from '../../lib/storage';
import { initializeGemini, sendMessage, isApiKeyValid } from '../../services/gemini';
import { cn } from '../../lib/utils';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(storage.getApiKey() || '');
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.getTheme());
  const [focusMode, setFocusMode] = useState(storage.getFocusMode());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini on mount or when API key changes
  useEffect(() => {
    if (isApiKeyValid(apiKey)) {
      try {
        initializeGemini(apiKey);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize API');
      }
    }
  }, [apiKey]);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show settings if no API key
  useEffect(() => {
    if (!apiKey) {
      setSettingsOpen(true);
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!isApiKeyValid(apiKey)) {
      setError('Please set your API key in settings');
      setSettingsOpen(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      // Remove the user message if the request failed
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyChange = (newKey: string) => {
    setApiKey(newKey);
    storage.setApiKey(newKey);
    if (isApiKeyValid(newKey)) {
      try {
        initializeGemini(newKey);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storage.setTheme(newTheme);
  };

  const handleFocusModeToggle = () => {
    const newFocusMode = !focusMode;
    setFocusMode(newFocusMode);
    storage.setFocusMode(newFocusMode);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      setMessages([]);
      setError(null);
    }
  };

  return (
    <div className={cn(
      'flex flex-col h-screen transition-all duration-300',
      theme === 'light' ? 'soft-gradient-light' : 'soft-gradient-dark'
    )}>
      {/* Header */}
      {!focusMode && (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Cluely Lite
            </h1>
            <p className="text-xs text-muted-foreground">
              Powered by Google Gemini
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFocusModeToggle}
              title="Focus Mode"
            >
              {focusMode ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearChat}
                title="Clear Chat"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>
      )}

      {/* Focus Mode Indicator */}
      {focusMode && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFocusModeToggle}
            className="rounded-full bg-background/80 backdrop-blur shadow-lg"
            title="Exit Focus Mode"
          >
            <Eye className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-semibold mb-2">
                Welcome to Cluely Lite
              </h2>
              <p className="text-muted-foreground max-w-md">
                Start a conversation with Google Gemini. Ask questions, get
                creative, or just chat!
              </p>
              {!apiKey && (
                <Button
                  onClick={() => setSettingsOpen(true)}
                  className="mt-6"
                >
                  Set API Key to Get Started
                </Button>
              )}
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-card text-card-foreground rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="max-w-4xl mx-auto w-full">
        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading || !isApiKeyValid(apiKey)}
          placeholder={
            !apiKey
              ? 'Please set your API key in settings...'
              : 'Type your message...'
          }
        />
      </div>

      {/* Settings Modal */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
    </div>
  );
};
