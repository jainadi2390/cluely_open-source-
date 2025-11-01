import React from 'react';
import { Sparkles, Wand2, MessageCircle, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToolbarProps {
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ className }) => {
  const tools = [
    { icon: Sparkles, label: 'Assist' },
    { icon: Wand2, label: 'What should I say?' },
    { icon: MessageCircle, label: 'Follow-ups' },
    { icon: RotateCcw, label: 'Recap' },
  ];

  return (
    <div className={cn('flex items-center gap-2 px-4 py-2 border-b border-white/10', className)}>
      {tools.map((tool) => (
        <button
          key={tool.label}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          title={tool.label}
        >
          <tool.icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{tool.label}</span>
        </button>
      ))}
    </div>
  );
};
