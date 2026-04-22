import { getPublicOrgBySlug, getPublicArticle } from '../../../../lib/publicHelpService';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar, Tag, Share2, Printer } from 'lucide-react';
import type { Metadata } from 'next';

interface Props {
    params: {
        orgSlug: string;
        articleSlug: string;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const org = await getPublicOrgBySlug(params.orgSlug);
    if (!org) return { title: 'Not Found' };
    
    const article = await getPublicArticle(org.id, params.articleSlug);
    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | ${org.name} Help Center`,
        description: article.content.substring(0, 160).replace(/[#*`]/g, ''),
        openGraph: {
            title: article.title,
            description: article.content.substring(0, 160).replace(/[#*`]/g, ''),
            type: 'article',
        }
    };
}

export default async function HelpArticle({ params }: Props) {
    const org = await getPublicOrgBySlug(params.orgSlug);
    if (!org) notFound();

    const article = await getPublicArticle(org.id, params.articleSlug);
    if (!article) notFound();

    const primaryColor = (org.branding as any)?.primaryColor || '#6366f1';

    // JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': article.title,
        'datePublished': article.created_at,
        'author': {
            '@type': 'Organization',
            'name': org.name
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'NexusDesk',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://nexusdesk.ai/logo.png'
            }
        },
        'description': article.content.substring(0, 160).replace(/[#*`]/g, '')
    };

    return (
        <div className="min-h-screen bg-[#0b0f19] text-slate-200">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <nav className="border-b border-white/[0.05] bg-white/[0.01] sticky top-0 z-50 backdrop-blur-3xl">
                <div className="max-w-5xl mx-auto px-8 h-20 flex items-center justify-between">
                    <Link 
                        href={`/help/${params.orgSlug}`}
                        className="flex items-center gap-4 text-slate-400 hover:text-white transition-all group"
                    >
                        <div className="p-2 rounded-xl bg-white/[0.05] group-hover:bg-white/[0.1] transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{org.name}</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all">
                            <Printer className="w-5 h-5" />
                        </button>
                        <button className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-all">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-8 py-24">
                <header className="mb-16">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Synchronized {new Date(article.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: primaryColor }}>
                            <Tag className="w-3.5 h-3.5" />
                            <span>{article.category || 'Documentation'}</span>
                        </div>
                    </div>
                    
                    <h1 className="text-6xl font-black tracking-tight text-white mb-8 leading-[1.1]">
                        {article.title}
                    </h1>
                </header>

                <article className="prose prose-invert prose-lg max-w-none">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-12 shadow-2xl leading-relaxed text-slate-300 font-medium">
                        {/* Simple markdown-lite rendering (newlines to breaks) */}
                        {article.content.split('\n').map((line: string, i: number) => (
                            <p key={i} className={line.startsWith('#') ? 'text-2xl font-black text-white mt-8 mb-4' : 'mb-4'}>
                                {line.startsWith('#') ? line.replace(/#/g, '').trim() : line}
                            </p>
                        ))}
                    </div>
                </article>

                <section className="mt-32 pt-20 border-t border-white/[0.05]">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-12 rounded-[3.5rem] border border-white/[0.03] shadow-inner text-center">
                        <h3 className="text-xl font-bold text-white mb-4">Did this documentation resolve your issue?</h3>
                        <div className="flex justify-center gap-6">
                            <button className="px-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 font-black uppercase tracking-widest text-[10px] transition-all">
                                Protocol Successful
                            </button>
                            <Link 
                                href="/support"
                                className="px-10 py-4 bg-white text-[#0b0f19] hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                            >
                                Initiate Support Transmission
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-20 px-8 border-t border-white/[0.05] text-center">
                 <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-600">
                    Neural Archives by <span className="text-white">NexusDesk AI</span>
                </p>
            </footer>
        </div>
    );
}
