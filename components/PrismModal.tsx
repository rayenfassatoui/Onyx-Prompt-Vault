import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Sparkles, Terminal, History, Plus, Trash2, Pencil, Save, AlertCircle } from 'lucide-react';
import { Prompt, VariableMap } from '../types';
import { ScrambleText } from '../utils/scramble';
import gsap from 'gsap';

interface PrismModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePrompt: (updatedPrompt: Prompt) => void;
  onDeletePrompt: (id: string) => void;
}

export const PrismModal: React.FC<PrismModalProps> = ({ prompt, isOpen, onClose, onUpdatePrompt, onDeletePrompt }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // View Mode State
  const [variables, setVariables] = useState<string[]>([]);
  const [variableValues, setVariableValues] = useState<VariableMap>({});
  const [copied, setCopied] = useState(false);
  const [version, setVersion] = useState(100);
  const [prevVersionBracket, setPrevVersionBracket] = useState(2);
  
  // Edit Mode State
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Initialize State on Open
  useEffect(() => {
    if (prompt) {
      // Logic to auto-enter edit mode for new prompts
      const isNew = prompt.id.startsWith('new_');
      setIsEditing(isNew);

      // View Mode Init
      const regex = /\{\{(.*?)\}\}/g;
      const matches = [...prompt.content.matchAll(regex)];
      const uniqueVars = Array.from(new Set(matches.map(m => m[1])));
      setVariables(uniqueVars);
      
      const initialMap: VariableMap = {};
      uniqueVars.forEach(v => initialMap[v] = '');
      setVariableValues(initialMap);
      setCopied(false);
      setVersion(100);
      setPrevVersionBracket(2);
      
      // Edit Mode Init
      setEditTitle(prompt.title);
      setEditDesc(prompt.description);
      setEditContent(prompt.content);
      setEditTags(prompt.tags);
      setNewTagInput('');
      setIsAddingTag(false);
    }
  }, [prompt]);

  // -- View Mode Logic --
  const rawContent = useMemo(() => {
    if (!prompt) return '';
    let content = prompt.content;
    if (version < 100) {
        if (version < 30) {
            content = "Draft v0.1 (Alpha): \n" + content.substring(0, Math.floor(content.length / 3)) + " [DATA CORRUPTED]...";
        } else if (version < 70) {
            content = "Draft v0.5 (Beta): \n" + content.substring(0, Math.floor(content.length / 1.2));
        }
    }
    return content;
  }, [prompt, version]);

  const finalText = useMemo(() => {
    let content = rawContent;
    variables.forEach(v => {
      const val = variableValues[v] || `{{${v}}}`;
      content = content.split(`{{${v}}}`).join(val); 
    });
    return content;
  }, [rawContent, variables, variableValues]);

  // Trigger Jolt on Version Change
  useEffect(() => {
    const currentBracket = version === 100 ? 2 : version < 30 ? 0 : 1;
    if (currentBracket !== prevVersionBracket && !isEditing) {
        setPrevVersionBracket(currentBracket);
        if (textContainerRef.current) {
             gsap.fromTo(textContainerRef.current, 
                { x: -5, opacity: 0.8, filter: 'blur(2px)' },
                { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.1, ease: "power2.out", clearProps: "all" }
             );
        }
    }
  }, [version, prevVersionBracket, isEditing]);

  // -- Handlers --

  const handleCopy = () => {
    navigator.clipboard.writeText(finalText);
    setCopied(true);
    
    if (copyButtonRef.current) {
        const btn = copyButtonRef.current;
        gsap.fromTo(btn, 
            { scale: 0.95, boxShadow: "0 0 0px rgba(16, 185, 129, 0)" },
            { scale: 1, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)", duration: 0.15, yoyo: true, repeat: 1 }
        );
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
      if (prompt) {
          onUpdatePrompt({
              ...prompt,
              title: editTitle,
              description: editDesc,
              content: editContent,
              tags: editTags
          });
          setIsEditing(false);
      }
  };

  const handleDelete = () => {
      if (prompt) {
          // In a real app, adding a confirmation dialog here is best practice.
          // For now, we assume the user knows what they are doing in "Builder Mode".
          onDeletePrompt(prompt.id);
      }
  };

  const handleAddTag = () => {
      if (newTagInput.trim()) {
          setEditTags(prev => [...prev, newTagInput.trim()]);
          setNewTagInput('');
          setIsAddingTag(false);
      }
  };

  const handleRemoveTag = (tagToRemove: string) => {
      setEditTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Detected variables in Edit Mode
  const detectedVariables = useMemo(() => {
      const regex = /\{\{(.*?)\}\}/g;
      const matches = [...editContent.matchAll(regex)];
      return Array.from(new Set(matches.map(m => m[1])));
  }, [editContent]);


  if (!prompt) return null;

  const isHistory = version < 100;
  const historyStyle = isHistory ? {
    filter: `sepia(${100 - version}%) blur(${(100 - version) / 100}px)`,
    opacity: 0.8 + (version / 500), 
    color: version < 70 ? '#d4b483' : undefined 
  } : {};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-40"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              layoutId={`card-${prompt.id}`}
              className="w-full max-w-6xl bg-onyx-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col md:flex-row max-h-[90vh] relative"
            >
              {/* Left Column: Editor/Preview */}
              <div className="w-full md:w-2/3 p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col relative bg-gradient-to-br from-onyx-950 to-onyx-900 transition-colors duration-500">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4 w-full mr-8">
                        <motion.div layoutId={`icon-${prompt.id}`} className="p-2 bg-emerald-900/20 rounded-lg shrink-0">
                            <Terminal className="w-6 h-6 text-emerald-400" />
                        </motion.div>
                        
                        {isEditing ? (
                            <input 
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                className="bg-transparent text-2xl md:text-3xl font-bold text-white font-mono leading-tight w-full focus:outline-none border-b border-dashed border-white/20 focus:border-emerald-500 transition-colors placeholder-white/20"
                                placeholder="PROTOCOL TITLE..."
                            />
                        ) : (
                            <motion.h2 
                                layoutId={`title-${prompt.id}`}
                                className="text-2xl md:text-3xl font-bold text-white font-mono leading-tight"
                            >
                            {prompt.title}
                            </motion.h2>
                        )}
                    </div>
                </div>
                
                {/* Tags Section */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {(isEditing ? editTags : prompt.tags).map(tag => (
                            <span key={tag} className={`group relative text-xs uppercase font-mono tracking-wider text-onyx-400 border border-white/5 px-2 py-1 rounded transition-colors ${isEditing ? 'cursor-pointer hover:border-red-500/50 hover:bg-red-900/10 hover:text-red-400' : ''}`} onClick={() => isEditing && handleRemoveTag(tag)}>
                                {tag}
                                {isEditing && <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-onyx-950 border border-red-500 text-red-500 rounded-full p-0.5"><X className="w-2 h-2" /></span>}
                            </span>
                    ))}
                    {isEditing && (
                        isAddingTag ? (
                            <div className="flex items-center gap-1">
                                <input 
                                    autoFocus
                                    type="text"
                                    value={newTagInput}
                                    onChange={(e) => setNewTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                    onBlur={() => !newTagInput && setIsAddingTag(false)}
                                    className="w-24 bg-onyx-900 border border-emerald-500/50 rounded px-2 py-1 text-xs text-white focus:outline-none"
                                    placeholder="TAG..."
                                />
                                <button onClick={handleAddTag} className="text-emerald-500 hover:text-white"><Check className="w-3 h-3"/></button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsAddingTag(true)}
                                className="text-xs uppercase font-mono tracking-wider text-onyx-600 border border-dashed border-white/10 px-2 py-1 rounded hover:border-emerald-500/50 hover:text-emerald-400 transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Add
                            </button>
                        )
                    )}
                </div>

                {isEditing ? (
                    <input 
                        value={editDesc}
                        onChange={e => setEditDesc(e.target.value)}
                        className="bg-transparent text-onyx-400 mb-6 pb-4 border-b border-white/5 w-full focus:outline-none focus:border-emerald-500 transition-colors placeholder-onyx-600"
                        placeholder="Brief description..."
                    />
                ) : (
                    <motion.p layoutId={`desc-${prompt.id}`} className="text-onyx-400 mb-6 pb-4 border-b border-white/5">
                        {prompt.description}
                    </motion.p>
                )}

                {/* The "Paper" / Editor Area */}
                <div 
                    className={`flex-1 overflow-hidden rounded-lg border border-white/5 relative shadow-inner transition-all duration-300 ${isEditing ? 'bg-black/50' : 'bg-black/30'}`}
                    style={!isEditing ? historyStyle : {}}
                >
                   {/* Grain/Scanline Overlay */}
                   <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHistory && !isEditing ? 'opacity-20' : 'opacity-[0.03]'}`} 
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")` }}>
                   </div>
                   
                   {!isEditing && (
                        <div className="absolute top-2 right-2 text-[10px] text-onyx-600 uppercase tracking-widest flex items-center gap-2 z-20">
                                <div className={`w-1.5 h-1.5 rounded-full ${version === 100 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                                <span className={version < 100 ? "text-amber-500/70" : ""}>
                                    {version === 100 ? 'LIVE PREVIEW' : `ARCHIVE MODE: ${version < 30 ? 'v0.1' : 'v0.5'}`}
                                </span>
                        </div>
                   )}

                   {isEditing ? (
                       <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-full bg-transparent p-8 font-mono text-sm leading-relaxed text-onyx-200 focus:outline-none resize-none custom-scrollbar z-10 relative selection:bg-emerald-500/30 placeholder-onyx-700"
                            placeholder="Type prompt here... use {{variable}} for dynamic fields."
                            spellCheck={false}
                       />
                   ) : (
                        <div ref={textContainerRef} className="relative z-10 p-8 h-full overflow-y-auto custom-scrollbar font-mono text-sm leading-relaxed text-onyx-200">
                                {rawContent.split('\n').map((line, i) => (
                                    <p key={i} className="min-h-[1.5em] mb-2 whitespace-pre-wrap">
                                        {line.split(/(\{\{.*?\}\})/g).map((part, j) => {
                                            if (part.match(/\{\{.*?\}\}/)) {
                                                const varName = part.replace(/\{\{|\}\}/g, '');
                                                const userVal = variableValues[varName];
                                                if (userVal) return <span key={j} className="text-emerald-50 bg-emerald-500/10 px-0.5 rounded transition-colors duration-300">{userVal}</span>;
                                                return <span key={j} className="text-purple-400 bg-purple-400/10 px-1 rounded mx-0.5 inline-block scale-95">{part}</span>;
                                            }
                                            if (!part) return null;
                                            return <ScrambleText key={`${part}-${prevVersionBracket}`} text={part} speed={isHistory ? 3 : 10} className={isHistory ? "opacity-90" : ""} />;
                                        })}
                                    </p>
                                ))}
                        </div>
                   )}
                </div>
                
                {/* Time Travel Slider (Hidden in Edit Mode) */}
                {!isEditing && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="flex items-center justify-between text-[10px] uppercase text-onyx-500 font-mono mb-2">
                            <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                                <History className="w-3 h-3 text-emerald-500"/> 
                                Time Travel
                            </span>
                            <span className={version < 100 ? "text-amber-500" : ""}>
                                {version === 100 ? 'Latest (v1.0)' : version < 30 ? 'Draft (v0.1)' : 'Review (v0.5)'}
                            </span>
                        </div>
                        <div className="relative h-6 flex items-center group">
                            <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-0">
                                {[0, 25, 50, 75, 100].map(i => (
                                    <div key={i} className={`w-px h-2 mt-2 transition-colors duration-300 ${version >= i ? 'bg-emerald-500/50' : 'bg-white/10'}`}></div>
                                ))}
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                step="1"
                                value={version} 
                                onChange={(e) => setVersion(Number(e.target.value))}
                                className="w-full z-10 relative cursor-pointer"
                            />
                        </div>
                    </div>
                )}
              </div>

              {/* Right Column: Injector / Edit Actions */}
              <div className="w-full md:w-1/3 bg-onyx-900 p-8 flex flex-col h-full overflow-hidden border-l border-white/5 relative">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Pencil className="w-3 h-3 text-amber-500" />
                                Builder Mode
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                Variables
                            </>
                        )}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                        {/* Edit Toggle */}
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="text-white/30 hover:text-white transition-colors p-1">
                                <Pencil className="w-4 h-4" />
                            </button>
                        )}
                        <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-1">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {isEditing ? (
                     // -- Edit Mode Sidebar --
                     <div className="flex-1 flex flex-col">
                        <div className="flex-1 overflow-y-auto">
                            <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 mb-6">
                                <h4 className="text-amber-500 text-xs font-mono mb-2 flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3" /> Auto-Detection
                                </h4>
                                <p className="text-onyx-400 text-xs leading-relaxed">
                                    Wrap words in <code className="bg-white/10 px-1 rounded text-white">{`{{brackets}}`}</code> to create dynamic variables.
                                </p>
                            </div>

                            <h4 className="text-[10px] uppercase text-onyx-600 font-bold tracking-widest mb-3">Detected Variables</h4>
                            <div className="space-y-2">
                                {detectedVariables.length > 0 ? (
                                    detectedVariables.map(v => (
                                        <div key={v} className="text-xs font-mono text-purple-400 bg-purple-400/5 border border-purple-400/10 px-2 py-1.5 rounded flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                            {v}
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-onyx-600 text-xs italic">No variables found...</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto space-y-3 pt-6 border-t border-white/5">
                            <button
                                onClick={handleSave}
                                className="w-full bg-emerald-500 text-black font-bold text-xs py-3 rounded-lg hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-xs py-3 rounded-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
                            >
                                <Trash2 className="w-4 h-4" /> Delete Protocol
                            </button>
                        </div>
                     </div>
                ) : (
                    // -- View Mode Sidebar --
                    <>
                        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                            {variables.length > 0 ? (
                                variables.map((v) => (
                                    <div key={v} className="group">
                                        <label className="block text-xs font-mono text-purple-400 mb-2 uppercase opacity-70 group-focus-within:opacity-100 transition-opacity">
                                            {v}
                                        </label>
                                        <input
                                            type="text"
                                            value={variableValues[v]}
                                            onChange={(e) => setVariableValues(prev => ({...prev, [v]: e.target.value}))}
                                            placeholder={`Enter ${v}...`}
                                            disabled={isHistory}
                                            className={`w-full bg-transparent border-b border-white/10 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-white/10 font-sans ${isHistory ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            autoComplete="off"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-onyx-500 text-sm">
                                    No variables detected.
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5">
                            <button
                                ref={copyButtonRef}
                                onClick={handleCopy}
                                disabled={isHistory}
                                className={`w-full bg-white text-black font-medium py-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${isHistory ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-emerald-400 hover:text-black'}`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <ScrambleText text="PAYLOAD COPIED" className="font-mono tracking-tight" />
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        <span>{isHistory ? 'RESTORE VERSION' : 'COPY TO CLIPBOARD'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};