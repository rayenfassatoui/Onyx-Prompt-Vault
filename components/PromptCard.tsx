import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Hash, ChevronRight } from 'lucide-react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onClick: (id: string) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick }) => {
  return (
    <motion.div
      layout
      layoutId={`card-${prompt.id}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      onClick={() => onClick(prompt.id)}
      className="spotlight-card group relative bg-onyx-900/50 border border-white/5 p-6 rounded-xl cursor-pointer overflow-hidden backdrop-blur-sm hover:border-white/20 transition-colors duration-300 flex flex-col justify-between h-64"
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
            <div className="flex gap-2 flex-wrap">
                {prompt.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-wider text-onyx-400 border border-white/10 px-2 py-1 rounded-full bg-onyx-950/30">
                        {tag}
                    </span>
                ))}
            </div>
            <motion.div 
                layoutId={`icon-${prompt.id}`}
                className="text-onyx-600 group-hover:text-white transition-colors"
            >
                <Hash className="w-5 h-5" />
            </motion.div>
        </div>

        <motion.h3 
            layoutId={`title-${prompt.id}`}
            className="text-xl font-medium text-white mb-2 font-mono group-hover:text-emerald-400 transition-colors"
        >
          {prompt.title}
        </motion.h3>

        <motion.p 
            layoutId={`desc-${prompt.id}`}
            className="text-onyx-400 text-sm line-clamp-3 leading-relaxed"
        >
          {prompt.description}
        </motion.p>

        <div className="mt-auto pt-4 flex items-center text-xs text-onyx-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
            Open Interface <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </motion.div>
  );
};