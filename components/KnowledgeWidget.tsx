'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, ExternalLink, Copy, Check, FileText } from 'lucide-react';
import { searchKnowledgeBase, KnowledgeArticle } from '../lib/knowledgeService';
import { useOrganization } from './OrganizationProvider';
import { toast } from 'sonner';

export default function KnowledgeWidget() {
    const { activeOrganization } = useOrganization();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<KnowledgeArticle[]>([]);
    const [searching, setSearching] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length >= 3 && activeOrganization) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, activeOrganization]);

    const handleSearch = async () => {
        if (!activeOrganization) return;
        setSearching(true);
        try {
            const data = await searchKnowledgeBase(activeOrganization.id, query);
            setResults(data);
        } finally {
            setSearching(false);
        }
    };

    const copyToClipboard = (article: KnowledgeArticle) => {
        const link = `${window.location.origin}/kb/${article.slug}`;
        navigator.clipboard.writeText(link);
        setCopiedId(article.id);
        toast.success('KB Link Copied', {
            description: 'Link has been encrypted to your clipboard.'
        });
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="bg-slate-900/40 rounded-[2rem] border border-white/[0.03] overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="p-6 border-b border-white/[0.03] bg-white/[0.02]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Neural Library</h3>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Scan protocols..."
                        className="w-full bg-slate-950/50 border border-white/[0.05] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/30 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {results.length > 0 ? (
                        <div className="space-y-3">
                            {results.map((article) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl hover:bg-white/[0.04] transition-all group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                                            <h4 className="text-[13px] font-bold text-slate-200 group-hover:text-white transition-colors">{article.title}</h4>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => copyToClipboard(article)}
                                                className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-indigo-400 transition-all"
                                                title="Copy Link"
                                            >
                                                {copiedId === article.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                            <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-indigo-400 transition-all" title="View Full Article">
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 italic">
                                        {article.content.substring(0, 100)}...
                                    </p>
                                    {article.category && (
                                        <div className="mt-3">
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                                                {article.category}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    ) : query.length >= 3 ? (
                        <div className="py-10 text-center">
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No matching protocols found</p>
                        </div>
                    ) : (
                        <div className="py-10 text-center space-y-4">
                            <div className="flex justify-center">
                                <Search className="w-8 h-8 text-slate-800" />
                            </div>
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                                Enter parameters to initiate<br/>Neural Library scan
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
            
            <div className="p-4 bg-indigo-500/5 border-t border-white/[0.03]">
                 <p className="text-[9px] font-black text-indigo-400/50 uppercase tracking-[0.2em] text-center">
                    Grounded AI Engine Online
                 </p>
            </div>
        </div>
    );
}
