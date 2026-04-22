'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Book, Search, Edit3, Trash2, Globe, Lock, ChevronRight, Hash, Terminal } from 'lucide-react';
import { fetchArticles, KnowledgeArticle, upsertArticle } from '../../../lib/knowledgeService';
import { useOrganization } from '../../../components/OrganizationProvider';
import { toast } from 'sonner';
import DashboardHeader from '../../../components/DashboardHeader';

export default function KnowledgeBasePage() {
    const { activeOrganization } = useOrganization();
    const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Partial<KnowledgeArticle> | null>(null);

    useEffect(() => {
        if (activeOrganization) {
            loadArticles();
        }
    }, [activeOrganization]);

    const loadArticles = async () => {
        if (!activeOrganization) return;
        setLoading(true);
        try {
            const data = await fetchArticles(activeOrganization.id);
            setArticles(data || []);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeOrganization || !currentArticle?.title || !currentArticle?.content) return;

        const slug = currentArticle.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        
        try {
            await upsertArticle({
                ...currentArticle,
                slug,
                organization_id: activeOrganization.id
            } as any);
            toast.success('Protocol Synchronization Complete');
            setIsEditing(false);
            setCurrentArticle(null);
            loadArticles();
        } catch (err) {
            toast.error('Sync Error');
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white">
            <DashboardHeader />
            
            <main className="max-w-7xl mx-auto px-8 py-12">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Terminal className="w-4 h-4 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/50">Neural Archives</span>
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tight">Knowledge <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Ecosystem</span></h1>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            setCurrentArticle({ title: '', content: '', category: 'General', is_public: false });
                            setIsEditing(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-2xl shadow-indigo-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Article</span>
                    </motion.button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Categories / Side Stats */}
                    <div className="space-y-6">
                        <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                               <Book className="w-24 h-24" />
                           </div>
                           <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                               <Hash className="w-3.5 h-3.5" />
                               Archive Metrics
                           </h3>
                           <div className="space-y-4">
                               <div className="flex justify-between items-center">
                                   <span className="text-xs text-slate-400">Total Protocols</span>
                                   <span className="text-xl font-black text-indigo-400">{articles.length}</span>
                               </div>
                               <div className="flex justify-between items-center">
                                   <span className="text-xs text-slate-400">Public Access</span>
                                   <span className="text-xl font-black text-emerald-400">{articles.filter(a => a.is_public).length}</span>
                               </div>
                           </div>
                        </div>
                    </div>

                    {/* Articles List */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {articles.map((article) => (
                                <motion.div
                                    key={article.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-6 bg-white/[0.01] border border-white/[0.03] rounded-[1.5rem] hover:bg-white/[0.03] transition-all group flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="p-4 bg-slate-900 rounded-2xl border border-white/[0.05] group-hover:border-indigo-500/30 transition-colors">
                                            <Book className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{article.title}</h4>
                                                {article.is_public ? (
                                                    <Globe className="w-3 h-3 text-emerald-500" />
                                                ) : (
                                                    <Lock className="w-3 h-3 text-slate-600" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Category: {article.category || 'Standard'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => {
                                                setCurrentArticle(article);
                                                setIsEditing(true);
                                            }}
                                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button className="p-3 bg-white/5 hover:bg-rose-500/20 rounded-xl text-slate-400 hover:text-rose-400 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Editor Sidebar / Modal Overlay */}
            <AnimatePresence>
                {isEditing && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditing(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-slate-950 border-l border-white/10 z-[101] overflow-y-auto p-12"
                        >
                            <form onSubmit={handleSave} className="space-y-10">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Protocol Architecture</h2>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Configure Article Parameters</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Article Title</label>
                                        <input
                                            type="text"
                                            value={currentArticle?.title || ''}
                                            onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                                            placeholder="Standard Resolution Logic..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class (Category)</label>
                                            <input
                                                type="text"
                                                value={currentArticle?.category || ''}
                                                onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50 transition-all font-bold"
                                                placeholder="Technical"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visibility</label>
                                            <button
                                                type="button"
                                                onClick={() => setCurrentArticle({ ...currentArticle, is_public: !currentArticle?.is_public } as any)}
                                                className={`w-full h-[60px] rounded-2xl border transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] ${
                                                    currentArticle?.is_public 
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                                    : 'bg-white/5 border-white/10 text-slate-400'
                                                }`}
                                            >
                                                {currentArticle?.is_public ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                                {currentArticle?.is_public ? 'Public Access' : 'Internal Only'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Neural Content (Protocol Data)</label>
                                        <textarea
                                            rows={12}
                                            value={currentArticle?.content || ''}
                                            onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/50 transition-all font-medium leading-relaxed resize-none custom-scrollbar"
                                            placeholder="Draft the core documentation here..."
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-8">
                                    <button
                                        type="submit"
                                        className="flex-1 px-8 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-indigo-600/20"
                                    >
                                        Synchronize Protocol
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-8 py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
                                    >
                                        Abort
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
