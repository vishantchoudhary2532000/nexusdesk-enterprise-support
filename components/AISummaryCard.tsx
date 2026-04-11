'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw, BrainCircuit, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface AISummaryCardProps {
    ticketId: string;
    organizationId: string;
    initialSummary?: string | null;
}

export default function AISummaryCard({ ticketId, organizationId, initialSummary }: AISummaryCardProps) {
    const [summary, setSummary] = useState<string | null>(initialSummary || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = async (force = false) => {
        if (summary && !force) return;
        
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/ai/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, organizationId })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Cognitive link failed.');
            
            setSummary(data.summary);
            if (force) toast.success('Neuro-Model Synchronized');
        } catch (err: any) {
            setError(err.message);
            toast.error('Sync Error', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialSummary) fetchSummary(false);
    }, [ticketId]);

    if (!summary && !loading && !error) return (
        <div className="glass p-8 border-slate-800/40 text-center rounded-3xl">
            <Zap className="w-6 h-6 text-slate-700 mx-auto mb-3" />
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Awaiting Neural Data</p>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[2rem] border-slate-800/40 relative overflow-hidden flex flex-col group/card"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[80px] -mr-12 -mt-12 pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />

            <div className="px-6 py-4 border-b border-slate-800/40 flex items-center justify-between bg-white/[0.02] relative z-10">
                <div className="flex items-center gap-2.5">
                    <div className="p-1 px-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="font-black text-white text-[11px] uppercase tracking-[0.2em]">Neural Synopsis</h3>
                        <p className="text-[8px] font-bold text-indigo-500/60 uppercase tracking-widest">Real-time Abstract</p>
                    </div>
                </div>
                <button 
                    onClick={() => fetchSummary(true)} 
                    disabled={loading}
                    className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all disabled:opacity-30 group"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                </button>
            </div>

            <div className="p-6 relative z-10">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-10 flex flex-col items-center justify-center gap-4"
                        >
                            <Loader2 className="w-6 h-6 animate-spin text-indigo-500/40" />
                            <div className="space-y-1.5 w-full px-4">
                                <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                     <motion.div 
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="h-full w-1/3 bg-indigo-500/30"
                                     />
                                </div>
                                <div className="h-2 w-2/3 bg-slate-800/50 rounded-full mx-auto" />
                            </div>
                        </motion.div>
                    ) : error ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-rose-400 text-xs font-bold bg-rose-500/5 p-4 rounded-2xl border border-rose-500/20 text-center"
                        >
                            {error}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[13px] font-semibold text-slate-400 leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/5 shadow-inner"
                        >
                            <div className="relative">
                                <span className="absolute -left-3 -top-2 text-2xl text-indigo-500/20 font-serif">"</span>
                                {summary}
                                <span className="absolute -right-3 -bottom-4 text-2xl text-indigo-500/20 font-serif">"</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="px-6 py-3 bg-slate-900/60 border-t border-slate-800/40 flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Model: Core-Insight-v4</span>
                <Sparkles className="w-3 h-3 text-indigo-500/30" />
            </div>
        </motion.div>
    );
}
