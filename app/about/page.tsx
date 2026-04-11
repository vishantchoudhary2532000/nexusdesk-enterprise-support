import NextLink from 'next/link';
import { Globe, ChevronLeft, Target, Users, Zap } from 'lucide-react';
import LandingNav from '../../components/LandingNav';
import MarketingFooter from '../../components/MarketingFooter';

export default function AboutPage() {
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

                    <div className="mb-16">
                        <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/20 shadow-2xl backdrop-blur-md">
                            <Target className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Our Mission</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95]">
                            The Intelligence <span className="text-indigo-500">Node</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                            NexusDesk was founded with a singular objective: to build the most resilient and high-fidelity support infrastructure for modern engineering teams.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-24">
                        <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10">
                            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Velocity First</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                We believe support shouldn't be a bottleneck. By leveraging nano-latency architectures, we ensure your team can resolve issues at the speed of thought.
                            </p>
                        </div>
                        <div className="p-8 rounded-[2rem] bg-violet-500/5 border border-violet-500/10">
                            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Human + AI</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Our platform doesn't replace operators; it augments them. We provide the AI context and intelligence needed to handle high-volume transmissions without burnout.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Why NexusDesk?</h2>
                        <div className="space-y-6">
                            {[
                                { title: "Resilient Architecture", icon: Zap, desc: "Built on globally distributed edge nodes to ensure zero-downtime support availability." },
                                { title: "Absolute Transparency", icon: Globe, desc: "Open communication and real-time telemetry are at the core of our business model." },
                                { title: "Team Symmetry", icon: Users, desc: "Designed for collaboration. Every operator has perfect situational awareness of the entire support front." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 shrink-0">
                                        <item.icon className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase tracking-tight mb-2">{item.title}</h4>
                                        <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </div>
    );
}
