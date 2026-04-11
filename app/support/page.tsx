import NextLink from 'next/link';
import { MessageSquare, ChevronLeft, Mail, MessageCircle, Clock, Zap } from 'lucide-react';
import LandingNav from '../../components/LandingNav';
import MarketingFooter from '../../components/MarketingFooter';

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans selection:bg-indigo-500/30">
            <LandingNav />

            <main className="flex-1 pt-48 pb-32 relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
                
                <div className="max-w-4xl mx-auto px-6">
                    <NextLink href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.3em] mb-12 transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Core
                    </NextLink>

                    <div className="mb-24">
                        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/20 shadow-2xl backdrop-blur-md">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Support Hub</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95]">
                            Operational <span className="text-indigo-500">Command</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                            Our command cluster is available 24/7 to resolve technical transmissions and architectural blockers.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-24">
                        {[
                            { title: "Direct Signal", icon: Mail, contact: "support@nexusdesk.com", desc: "Preferred method for non-critical node inquiries." },
                            { title: "Live Protocol", icon: MessageCircle, contact: "Dashboard Chat", desc: "Real-time communication for verified organization operators." },
                            { title: "SLA Response", icon: Clock, contact: "< 15 Minutes", desc: "Target resolution window for Priority-1 transmission failures." },
                            { title: "Urgent Hotfix", icon: Zap, contact: "Emergency Node", desc: "Direct engineering tunnel for infrastructure critical events." }
                        ].map((item, i) => (
                            <div key={i} className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-xl shadow-indigo-500/5 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{item.title}</h3>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{item.contact}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="p-12 rounded-[3rem] bg-indigo-500/5 border border-indigo-500/10">
                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">Submit Operation Ticket</h3>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Operator Identity</label>
                                    <input type="text" placeholder="FULL NAME" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-black uppercase tracking-widest focus:border-indigo-500/50 focus:ring-0 outline-none transition-all placeholder:text-slate-700" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Communication Channel</label>
                                    <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-black uppercase tracking-widest focus:border-indigo-500/50 focus:ring-0 outline-none transition-all placeholder:text-slate-700" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Signal Content</label>
                                <textarea placeholder="DETAILED TRANSMISSION CONTENT..." rows={4} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-black uppercase tracking-widest focus:border-indigo-500/50 focus:ring-0 outline-none transition-all placeholder:text-slate-700 resize-none"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-white text-slate-950 text-[11px] font-black uppercase tracking-[0.2em] py-5 rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl">
                                DISPATCH SIGNAL
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </div>
    );
}
