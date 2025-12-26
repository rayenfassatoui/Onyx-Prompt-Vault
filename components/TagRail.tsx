import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Tag, X } from 'lucide-react';

interface TagRailProps {
  allTags: { name: string; count: number }[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClear: () => void;
}

export const TagRail: React.FC<TagRailProps> = ({ allTags, selectedTags, onToggleTag, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full relative group">
        {/* Gradient Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-onyx-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-onyx-950 to-transparent z-10 pointer-events-none"></div>

        <div 
            ref={scrollRef}
            className="flex items-center gap-3 overflow-x-auto py-4 px-2 no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            <div className="flex items-center gap-2 pr-4 pl-2 shrink-0">
                <span className="text-xs font-mono text-onyx-500 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    Filter Stream
                </span>
                {selectedTags.length > 0 && (
                     <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={onClear}
                        className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20 hover:bg-red-500/20 transition-colors flex items-center gap-1"
                     >
                         <X className="w-3 h-3" /> CLEAR
                     </motion.button>
                )}
            </div>

            {allTags.map((tagObj) => {
                const isSelected = selectedTags.includes(tagObj.name);
                return (
                    <motion.button
                        layout
                        key={tagObj.name}
                        onClick={() => onToggleTag(tagObj.name)}
                        className={`
                            relative shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono border transition-all duration-300 group/tag
                            ${isSelected 
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                : 'bg-onyx-900 border-white/5 text-onyx-400 hover:border-white/20 hover:text-white'
                            }
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>{tagObj.name}</span>
                        <span className={`
                            text-[9px] px-1.5 py-0.5 rounded-full transition-colors
                            ${isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-onyx-800 text-onyx-600 group-hover/tag:bg-onyx-700 group-hover/tag:text-onyx-300'}
                        `}>
                            {tagObj.count}
                        </span>
                        
                        {/* Active Indicator Dot */}
                        {isSelected && (
                            <motion.div 
                                layoutId="activeTagDot"
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full box-content border-2 border-onyx-950"
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    </div>
  );
};