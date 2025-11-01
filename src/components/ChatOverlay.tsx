import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2, Minimize2, Eye, Send } from 'lucide-react';
import Draggable from 'react-draggable';
import { Tabs } from './chat/Tabs';
import { Toolbar } from './chat/Toolbar';
import { MessageBubble } from './chat/MessageBubble';
import { ScreenshotGallery } from './ScreenshotGallery';
import { useGeminiChat } from '../hooks/useGeminiChat';
import { cn } from '../lib/utils';

interface ChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
}

export const ChatOverlay: React.FC<ChatOverlayProps> = ({ isOpen, onClose, apiKey }) => {
  const [activeTab, setActiveTab] = useState('Chat');
  const [isDocked, setIsDocked] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, error, sendMessage } = useGeminiChat(apiKey);

  const handleScreenshotAnalysis = (paths: string[], result: string) => {
    // Add the analysis result as a message in the chat
    setActiveTab('Chat');
    sendMessage(`[Screenshot Analysis Result]\n${result}`);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      await sendMessage(input.trim());
      setInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isDocked) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        onClick={() => setIsDocked(false)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full shadow-lg shadow-violet-500/50 flex items-center justify-center hover:shadow-violet-500/70 transition-all z-50"
      >
        <span className="text-2xl">✨</span>
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Focus Mode Background Overlay */}
          {focusMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setFocusMode(false)}
            />
          )}

          <Draggable handle=".drag-handle" disabled={isMaximized}>
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'fixed bg-[#0b0b0f]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50',
                isMaximized
                  ? 'inset-4 rounded-3xl'
                  : 'bottom-6 right-6 w-[420px] h-[600px] rounded-2xl'
              )}
              style={{
                boxShadow: '0 0 60px rgba(139, 92, 246, 0.3)',
              }}
            >
              {/* Header */}
              <div className="drag-handle cursor-move bg-gradient-to-r from-violet-500/10 to-blue-500/10 border-b border-white/10 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div className="ml-2 flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      <span className="text-sm font-semibold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                        Gemini
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFocusMode(!focusMode)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      title="Focus Mode"
                    >
                      <Eye className="w-4 h-4 text-white/70" />
                    </button>
                    <button
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {isMaximized ? (
                        <Minimize2 className="w-4 h-4 text-white/70" />
                      ) : (
                        <Maximize2 className="w-4 h-4 text-white/70" />
                      )}
                    </button>
                    <button
                      onClick={() => setIsDocked(true)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                      title="Dock"
                    >
                      <Minus className="w-4 h-4 text-white/70" />
                    </button>
                    <button
                      onClick={onClose}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-white/70" />
                    </button>
                  </div>
                </div>
                <Tabs tabs={['Chat', 'Screenshots', 'Transcript']} activeTab={activeTab} onChange={setActiveTab} />
              </div>

              {/* Toolbar */}
              {activeTab === 'Chat' && <Toolbar />}

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ height: 'calc(100% - 200px)' }}>
                {activeTab === 'Chat' && (
                  <>
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-6xl mb-4">✨</div>
                        <h3 className="text-lg font-semibold mb-2">Start chatting with Gemini</h3>
                        <p className="text-sm text-white/50 max-w-xs">
                          Ask questions, get creative, or explore new ideas
                        </p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <MessageBubble key={message.id} message={message} />
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 border border-white/10">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </>
                )}

                {activeTab === 'Screenshots' && (
                  <ScreenshotGallery onAnalyze={handleScreenshotAnalysis} />
                )}

                {activeTab === 'Transcript' && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold mb-2">Transcript</h3>
                    <p className="text-sm text-white/50 max-w-xs">
                      Session transcripts will appear here
                    </p>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/20">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Input Area - Only show on Chat tab */}
              {activeTab === 'Chat' && (
                <div className="border-t border-white/10 bg-gradient-to-b from-transparent to-white/5 p-4">
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask Gemini anything..."
                      rows={1}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 resize-none max-h-32"
                      style={{
                        minHeight: '44px',
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                      }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="p-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg shadow-violet-500/20"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-white/30">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <span>⌘K</span>
                  </div>
                </div>
              )}
            </motion.div>
          </Draggable>
        </>
      )}
    </AnimatePresence>
  );
};
