import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Key, Cpu } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [model, setModel] = useState('openai/gpt-3.5-turbo');

    useEffect(() => {
        if (isOpen) {
            const storedKey = localStorage.getItem('openrouter_api_key');
            const storedModel = localStorage.getItem('openrouter_model');
            if (storedKey) setApiKey(storedKey);
            if (storedModel) setModel(storedModel);
        }
    }, [isOpen]);

    const handleSave = () => {
        localStorage.setItem('openrouter_api_key', apiKey);
        localStorage.setItem('openrouter_model', model);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md bg-onyx-900 border border-white/10 rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-onyx-950">
                                <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-emerald-500" />
                                    AI SETTINGS
                                </h2>
                                <button onClick={onClose} className="text-onyx-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-onyx-500 tracking-wider flex items-center gap-2">
                                        <Key className="w-3 h-3" /> OpenRouter API Key
                                    </label>
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="sk-or-..."
                                        className="w-full bg-onyx-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                                    />
                                    <p className="text-[10px] text-onyx-600">
                                        Your key is stored locally in your browser.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase font-bold text-onyx-500 tracking-wider flex items-center gap-2">
                                        <Cpu className="w-3 h-3" /> Model ID
                                    </label>
                                    <input
                                        type="text"
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        placeholder="openai/gpt-3.5-turbo"
                                        className="w-full bg-onyx-950 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                                    />
                                    <p className="text-[10px] text-onyx-600">
                                        Example: anthropic/claude-3-opus, google/gemini-pro
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/5 bg-onyx-950 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" /> SAVE CONFIG
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
