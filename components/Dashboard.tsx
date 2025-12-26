import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Terminal } from 'lucide-react';
import { PromptCard } from './PromptCard';
import { PrismModal } from './PrismModal';
import { SpotlightGrid } from './SpotlightGrid';
import { TagRail } from './TagRail';
import { SettingsModal } from './SettingsModal';
import { Prompt } from '../types';
import { api } from '../src/api';

export const Dashboard: React.FC = () => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        loadPrompts();
    }, []);

    const loadPrompts = async () => {
        try {
            const data = await api.fetchPrompts();
            setPrompts(data);
        } catch (error) {
            console.error('Failed to load prompts:', error);
        }
    };

    // Derived state for Filtered Prompts
    const filteredPrompts = useMemo(() => {
        return prompts.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => p.tags.includes(tag));

            return matchesSearch && matchesTags;
        });
    }, [prompts, searchTerm, selectedTags]);

    // Derived state for All Unique Tags
    const allTags = useMemo(() => {
        const tagMap = new Map<string, number>();
        prompts.forEach(p => {
            p.tags.forEach(tag => {
                tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
            });
        });
        return Array.from(tagMap.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    }, [prompts]);

    const selectedPrompt = useMemo(() =>
        prompts.find(p => p.id === selectedPromptId) || null,
        [prompts, selectedPromptId]);

    // Actions
    const handleUpdatePrompt = async (updatedPrompt: Prompt) => {
        try {
            const savedPrompt = await api.updatePrompt(updatedPrompt);
            setPrompts(prev => prev.map(p => p.id === savedPrompt.id ? savedPrompt : p));
        } catch (error) {
            console.error('Failed to update prompt:', error);
        }
    };

    const handleDeletePrompt = async (id: string) => {
        try {
            await api.deletePrompt(id);
            setPrompts(prev => prev.filter(p => p.id !== id));
            setSelectedPromptId(null);
        } catch (error) {
            console.error('Failed to delete prompt:', error);
        }
    };

    const handleCreatePrompt = async () => {
        const newPrompt: Prompt = {
            id: `new_${Date.now()}`, // Temporary ID, server will assign real one if needed, but we are using text ID so this is fine for now
            title: 'Untitled Protocol',
            description: 'Enter a brief description of what this prompt achieves...',
            content: 'Write your prompt template here. Use {{variables}} to create dynamic fields.',
            tags: ['DRAFT'],
            createdAt: new Date().toISOString()
        };

        try {
            const createdPrompt = await api.createPrompt(newPrompt);
            setPrompts(prev => [createdPrompt, ...prev]);
            setSelectedPromptId(createdPrompt.id);
        } catch (error) {
            console.error('Failed to create prompt:', error);
        }
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    return (
        <div className="min-h-screen bg-onyx-950 text-white relative font-sans selection:bg-purple-500/30">
            {/* Header HUD */}
            <header className="sticky top-0 z-30 bg-onyx-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="font-mono font-bold tracking-widest text-sm">ONYX <span className="text-onyx-500">v1.3</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="text-onyx-500 hover:text-white transition-colors"
                        >
                            <Terminal className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative hidden md:block w-96">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-onyx-500">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH PROMPTS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-onyx-900 border border-white/5 rounded-full py-1.5 pl-10 pr-4 text-xs font-mono focus:outline-none focus:border-white/20 focus:bg-onyx-800 transition-all placeholder-onyx-600"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                            <span className="text-[10px] text-onyx-600 border border-white/5 px-1 rounded bg-onyx-800">⌘K</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleCreatePrompt}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 text-xs font-mono py-1.5 px-3 rounded-lg transition-all text-emerald-400"
                        >
                            <Plus className="w-3 h-3" />
                            <span className="hidden sm:inline">NEW PROTOCOL</span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 opacity-80 shadow-[0_0_15px_rgba(168,85,247,0.4)]"></div>
                    </div>
                </div>
            </header>

            {/* Tag Browser Rail */}
            <div className="border-b border-white/5 bg-onyx-950/50 backdrop-blur-sm sticky top-16 z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <TagRail
                        allTags={allTags}
                        selectedTags={selectedTags}
                        onToggleTag={toggleTag}
                        onClear={() => setSelectedTags([])}
                    />
                </div>
            </div>

            {/* Main Grid */}
            <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
                        Prompt<span className="font-serif italic text-onyx-500">Vault</span>
                    </h1>
                    <p className="text-onyx-400 max-w-xl">
                        A Swiss-style utility for prompt engineering. Select a template, inject variables, and deploy payload.
                    </p>
                </div>

                <SpotlightGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredPrompts.map(prompt => (
                            <PromptCard
                                key={prompt.id}
                                prompt={prompt}
                                onClick={setSelectedPromptId}
                            />
                        ))}
                    </AnimatePresence>
                </SpotlightGrid>

                {filteredPrompts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 border border-dashed border-white/5 rounded-xl bg-white/5"
                    >
                        <p className="text-onyx-500 font-mono text-sm">NO DATA FOUND</p>
                        <button onClick={() => { setSearchTerm(''); setSelectedTags([]) }} className="mt-4 text-xs text-emerald-500 hover:underline">RESET FILTERS</button>
                    </motion.div>
                )}
            </main>

            {/* Floating Mobile Search */}
            <div className="fixed bottom-6 left-6 right-6 md:hidden z-30">
                <div className="relative shadow-2xl">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-onyx-400">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-onyx-800/90 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-lg focus:outline-none focus:border-purple-500/50 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                    />
                </div>
            </div>

            {/* Prism Modal (The Expansion) */}
            <PrismModal
                prompt={selectedPrompt}
                isOpen={!!selectedPromptId}
                onClose={() => setSelectedPromptId(null)}
                onUpdatePrompt={handleUpdatePrompt}
                onDeletePrompt={handleDeletePrompt}
            />

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
};