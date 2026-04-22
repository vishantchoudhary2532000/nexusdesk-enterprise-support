'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Zap, ChevronDown, Check, Info, Command } from 'lucide-react';
import { fetchMacros, executeNexusCommand, Macro } from '../lib/macroService';
import { useOrganization } from './OrganizationProvider';
import { createClient } from '../lib/supabaseClient';

interface MacroSelectorProps {
    ticketId: string;
    onSuccess?: () => void;
}

export default function MacroSelector({ ticketId, onSuccess }: MacroSelectorProps) {
    const { activeOrganization } = useOrganization();
    const [macros, setMacros] = useState<Macro[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [executing, setExecuting] = useState(false);
    const [selectedMacro, setSelectedMacro] = useState<Macro | null>(null);

    useEffect(() => {
        if (activeOrganization) {
            fetchMacros(activeOrganization.id).then(newMacros => {
                // Defensive deduplication to prevent "Double data" in UI
                const unique = new Map();
                newMacros.forEach(m => {
                    if (!unique.has(m.name)) unique.set(m.name, m);
                });
                setMacros(Array.from(unique.values()));
            });
        }
    }, [activeOrganization]);

    const handleExecute = async (macro: Macro) => {
        setExecuting(true);
        setSelectedMacro(macro);
        
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                await executeNexusCommand(ticketId, macro, user.id);
                if (onSuccess) onSuccess();
                setIsOpen(false);
            }
        } catch (err) {
            console.error('Command execution failed');
        } finally {
            setExecuting(false);
            setSelectedMacro(null);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/20 transition-all text-xs font-black uppercase tracking-widest group"
            >
                <Terminal className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Nexus Commands</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsOpen(false)} 
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-full mt-3 left-0 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl z-[500] overflow-hidden"
                        >
                            <div className="p-4 border-b border-slate-800 bg-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Command className="w-4 h-4 text-indigo-400" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Command Palette</h4>
                                </div>
                                <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            </div>

                            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                                {macros.map((macro) => (
                                    <button
                                        key={macro.id}
                                        disabled={executing}
                                        onClick={() => handleExecute(macro)}
                                        className="w-full text-left p-3 rounded-xl hover:bg-white/5 group transition-all relative overflow-hidden disabled:opacity-50"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                                                {macro.name}
                                            </span>
                                            {executing && selectedMacro?.id === macro.id ? (
                                                <motion.div 
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                >
                                                    <Zap className="w-3 h-3 text-indigo-400" />
                                                </motion.div>
                                            ) : (
                                                <Zap className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed truncate">
                                            {macro.description}
                                        </p>

                                        {/* Action Badges in Preview */}
                                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {macro.actions.status && (
                                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-black">
                                                    {macro.actions.status}
                                                </span>
                                            )}
                                            {macro.actions.priority && (
                                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-black">
                                                    {macro.actions.priority}
                                                </span>
                                            )}
                                            {macro.actions.message && (
                                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-black">
                                                    +MSG
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="p-3 bg-white/5 border-t border-slate-800">
                                <p className="text-[9px] text-slate-500 flex items-center gap-1.5 leading-relaxed">
                                    <Info className="w-3 h-3" />
                                    <span>Executing a command will perform atomic system updates instantly.</span>
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
