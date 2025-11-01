import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('flex gap-1 border-b border-white/10', className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium transition-colors',
            activeTab === tab
              ? 'text-white'
              : 'text-white/50 hover:text-white/70'
          )}
        >
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-blue-500"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};
