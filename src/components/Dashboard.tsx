import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Tabs } from './chat/Tabs';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface DashboardProps {
  onStartChat: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartChat }) => {
  const [activeTab, setActiveTab] = useState('Summary');
  const [notes, setNotes] = useState('');

  const tabs = ['Summary', 'Transcript', 'Usage'];

  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#0b0b0f] text-white"
    >
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0b0b0f]/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <div>
                <div className="text-sm text-white/50">{getCurrentDate()}</div>
                <h1 className="text-xl font-semibold">Untitled session</h1>
              </div>
            </div>
            <Button
              onClick={onStartChat}
              className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40"
            >
              Start Cluely
            </Button>
          </div>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </header>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'Summary' && (
            <div className="space-y-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your notes here…"
                className="w-full h-[500px] bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 resize-none transition-all"
              />
            </div>
          )}

          {activeTab === 'Transcript' && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <p className="text-white/50 text-center">No transcript available yet</p>
            </div>
          )}

          {activeTab === 'Usage' && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">API Calls</span>
                  <span className="font-mono text-violet-400">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Tokens Used</span>
                  <span className="font-mono text-violet-400">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Session Duration</span>
                  <span className="font-mono text-violet-400">0 min</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
