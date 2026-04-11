import NextLink from 'next/link';
import { Book, ChevronLeft, Search, Code, Cpu, Terminal, Shield } from 'lucide-react';
import LandingNav from '../../components/LandingNav';
import MarketingFooter from '../../components/MarketingFooter';

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans selection:bg-indigo-500/30">
            <LandingNav />

            <main className="flex-1 pt-48 pb-32 relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
                
                <div className="max-w-6xl mx-auto px-6">
                    <NextLink href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] mb-12 transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Core
                    </NextLink>

                    <div className="mb-24 text-center">
                        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/20 shadow-2xl backdrop-blur-md mx-auto">
                            <Book className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Knowledge Base</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95]">
                            The Service <span className="text-indigo-500">Manual</span>
                        </h1>
                        
                        <div className="max-w-2xl mx-auto relative group mt-12">
                            <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                            <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-xl group-hover:bg-white/[0.05] transition-all">
                                <Search className="w-5 h-5 text-slate-500 mr-4" />
                                <input 
                                    type="text" 
                                    placeholder="SEARCH SYSTEM PROTOCOLS..." 
                                    className="bg-transparent border-none text-white text-xs font-black uppercase tracking-widest focus:ring-0 w-full placeholder:text-slate-700"
                                />
                                <div className="text-[10px] font-black text-slate-600 bg-white/5 px-2 py-1 rounded border border-white/5 uppercase tracking-tighter">⌘K</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Core Architecture", icon: Cpu, desc: "A technical deep-dive into the NexusDesk multi-tenant signal node infrastructure." },
                            { title: "API Reference", icon: Code, desc: "Industrial-grade endpoints for automated transmission and ticket synchronization." },
                            { title: "Authentication", icon: Shield, desc: "Implementing RSA-4096 organizational handshakes and JWT-based operator validation." },
                            { title: "CLI Command", icon: Terminal, desc: "Advanced terminal protocols for managing headless support nodes." },
                            { title: "Smart Routing", icon: Search, desc: "Configuring neural algorithms for automated ticket classification and priority." },
                            { title: "Data Residency", icon: Book, desc: "Protocol guides for managing regional data compliance and isolated node storage." }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-500">
                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-xl shadow-indigo-500/5 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{item.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm font-medium">{item.desc}</p>
                                <NextLink href="#" className="inline-flex items-center gap-2 mt-8 text-[10px] font-black text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                                    Read Protocol <ChevronLeft className="w-3 h-3 rotate-180" />
                                </NextLink>
                            </div>
                        ))}
                    </div>

                    <div className="mt-40 p-12 rounded-[3rem] bg-gradient-to-br from-indigo-500/5 to-violet-500/5 border border-white/5 text-center">
                        <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Technical Inquiries?</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-10 max-w-md mx-auto">Our engineering command is available for specialized architectural consultations.</p>
                        <NextLink href="/support" className="inline-flex items-center gap-4 text-[12px] font-black bg-white text-slate-950 px-10 py-5 rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest">
                            Contact Support Hub
                        </NextLink>
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </div>
    );
}
