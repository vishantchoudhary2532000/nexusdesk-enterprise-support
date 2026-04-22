import { getPublicOrgBySlug, getPublicArticles } from '../../../lib/publicHelpService';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Search, BookOpen, ChevronRight, HelpCircle } from 'lucide-react';

export default async function HelpHome({ params }: { params: { orgSlug: string } }) {
    const { orgSlug } = params;
    const org = await getPublicOrgBySlug(orgSlug);

    if (!org) notFound();

    const articles = await getPublicArticles(org.id);
    const primaryColor = (org.branding as any)?.primaryColor || '#6366f1';

    // Grouping by category
    const categories: Record<string, any[]> = {};
    articles.forEach(article => {
        const cat = article.category || 'General';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(article);
    });

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-200 selection:bg-indigo-500/30">
            {/* Branding Injected Header */}
            <header className="relative py-24 px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 50%, ${primaryColor}, transparent)` }} />
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="flex justify-center mb-8">
                        <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-2xl">
                             <HelpCircle className="w-12 h-12" style={{ color: primaryColor }} />
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight text-white mb-6 uppercase">
                        {org.name} <span className="opacity-50">Help Center</span>
                    </h1>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Search protocols, resolution logic, and documentation to solve technical transmissions.
                    </p>

                    <div className="relative max-w-2xl mx-auto group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search help articles..." 
                            className="w-full h-16 bg-white/[0.03] border border-white/[0.1] rounded-[2rem] pl-16 pr-8 text-white text-lg placeholder:text-slate-600 outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all shadow-2xl"
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(categories).map(([name, items]) => (
                        <div key={name} className="group p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] hover:bg-white/[0.04] transition-all hover:translate-y-[-4px] shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10" style={{ color: primaryColor }}>
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-widest text-white">{name}</h3>
                            </div>
                            
                            <ul className="space-y-4 mb-8">
                                {items.slice(0, 5).map(article => (
                                    <li key={article.id}>
                                        <Link 
                                            href={`/help/${orgSlug}/${article.slug}`}
                                            className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center justify-between group/link"
                                        >
                                            <span className="line-clamp-1">{article.title}</span>
                                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-all translate-x-[-10px] group-hover/link:translate-x-0" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <Link 
                                href="#"
                                className="text-xs font-black uppercase tracking-widest flex items-center gap-2 group/all"
                                style={{ color: primaryColor }}
                            >
                                View all {items.length} articles
                                <ChevronRight className="w-3.5 h-3.5 group-hover/all:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Defection Bridge */}
                <div className="mt-32 p-12 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-[3rem] text-center relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white mb-4 uppercase">Still Encrypted?</h2>
                        <p className="text-slate-400 mb-10 max-w-xl mx-auto font-medium">
                            If the Neural Archives didn't provide resolution, our support protocols are available for direct transmission.
                        </p>
                        <Link 
                            href="/support"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#0b0f19] rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all shadow-2xl hover:scale-105 active:scale-95"
                        >
                            Open Support Ticket
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="py-20 px-8 border-t border-white/[0.05] text-center">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-600">
                    Powered by <span className="text-white">NexusDesk AI Suite</span>
                </p>
            </footer>
        </div>
    );
}
