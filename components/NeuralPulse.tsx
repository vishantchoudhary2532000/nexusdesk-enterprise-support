'use client';

import { motion } from 'framer-motion';
import { Target, Zap, AlertTriangle, Tag, ShieldCheck } from 'lucide-react';

interface NeuralPulseProps {
    metadata: {
        sentiment?: string;
        category?: string;
        priority_suggestion?: string;
        confidence?: number;
        tags?: string[];
    };
    currentPriority: string;
}

export default function NeuralPulse({ metadata, currentPriority }: NeuralPulseProps) {
    if (!metadata || Object.keys(metadata).length === 0) {
        return (
            <div className="p-6 bg-slate-900/40 rounded-[2rem] border border-white/[0.03] text-center">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Neural Feed Silent</p>
            </div>
        );
    }

    const { sentiment, category, priority_suggestion, confidence, tags } = metadata;

    const getSentimentColor = (s?: string) => {
        switch (s?.toLowerCase()) {
            case 'positive': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'frustrated': 
            case 'negative': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'neutral': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
            default: return 'text-slate-400 bg-slate-800/10 border-slate-700/20';
        }
    };

    const isEscalationWarning = priority_suggestion && 
        ['high', 'urgent'].includes(priority_suggestion) && 
        ['low', 'medium'].includes(currentPriority);

    return (
        <div className="space-y-6">
            {/* Sentiment & Confidence Gauge */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-5 rounded-[1.5rem] border backdrop-blur-3xl transition-all shadow-2xl ${getSentimentColor(sentiment)}`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Sentiment</span>
                    </div>
                    <p className="text-sm font-black uppercase tracking-tight">{sentiment || 'Calibrated'}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-5 bg-[#0f172a]/40 rounded-[1.5rem] border border-white/[0.03] backdrop-blur-3xl shadow-inner relative overflow-hidden"
                >
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                        <ShieldCheck className="w-3 h-3 text-indigo-400" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Certainty</span>
                    </div>
                    <p className="text-sm font-black text-white relative z-10">{confidence || 0}%</p>
                    
                    {/* Micro-gauge bar */}
                    <div className="absolute bottom-0 left-0 h-1 bg-indigo-500/20 w-full">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${confidence || 0}%` }}
                            className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        />
                    </div>
                </motion.div>
            </div>

            {/* AI Predictions */}
            <div className="space-y-4">
                {isEscalationWarning && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-[1.5rem] flex items-center gap-4 shadow-2xl shadow-rose-500/10"
                    >
                        <div className="bg-rose-500 p-2 rounded-xl">
                            <AlertTriangle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Escalation Warning</p>
                            <p className="text-xs font-bold text-white">AI Suggests <span className="uppercase text-rose-500">{priority_suggestion}</span> priority.</p>
                        </div>
                    </motion.div>
                )}

                <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-[2rem] space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Target className="w-3 h-3 text-slate-500" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Classified Mode</span>
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-tight bg-indigo-500/20 px-3 py-1 rounded-lg border border-indigo-500/20">{category || 'Nexus'}</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                             <Tag className="w-3 h-3 text-slate-500" />
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags?.map((tag, i) => (
                                <span key={i} className="text-[9px] font-black text-indigo-400 bg-indigo-500/5 px-3 py-1.5 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-colors cursor-default">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
