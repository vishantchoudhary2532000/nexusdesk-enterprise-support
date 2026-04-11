import NextLink from 'next/link';
import { Hexagon, Check, Zap, MessageSquare, Shield, Users, BarChart, Layout, Cpu, Target, Activity, ArrowRight } from 'lucide-react';
import LandingNav from '../../components/LandingNav';
import MarketingFooter from '../../components/MarketingFooter';

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans selection:bg-indigo-500/30">
            <LandingNav />

            <main className="flex-1 pb-32 relative">
                {/* Background Engineering Accents */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />

                <section className="pt-48 pb-24 px-6 max-w-5xl mx-auto text-center">
                    <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/20 shadow-2xl backdrop-blur-md">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Full Feature Protocol</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95]">
                        Support <span className="text-indigo-500">Intelligence</span> <br /> Accelerated
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        NexusDesk leverages high-speed infrastructure to streamline your support operations. Every feature is engineered to help your team resolve issues with absolute precision.
                    </p>
                </section>

                <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: 'Real-time Signal Sync', icon: Zap, desc: 'Bi-directional ticket synchronization at nano-latency. Experience zero-delay operational updates.' },
                        { title: 'Context Condensation', icon: MessageSquare, desc: 'AI-driven intelligence summarizes long transmission threads, reducing operator cognitive friction.' },
                        { title: 'Isolated Multi-Tenancy', icon: Layout, desc: 'Cryptographically separated organization nodes ensures absolute data sovereignty for every client.' },
                        { title: 'Granular Authority', icon: Shield, desc: 'Role-Based Access Control (RBAC) protocols with deterministic authority levels for high-security environments.' },
                        { title: 'Collaborative Clusters', icon: Users, desc: 'Real-time presence and operational heatmaps allow team clusters to converge on critical objectives.' },
                        { title: 'Telemetry Analytics', icon: BarChart, desc: 'High-density metrics provide immediate situational awareness of your entire support front.' }
                    ].map((feature, i) => (
                        <div key={i} className="group bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-indigo-500/30 rounded-[2rem] p-8 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-xl shadow-indigo-500/5 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </section>

                <section className="max-w-4xl mx-auto px-6 mt-40">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[3rem] blur opacity-10 group-hover:opacity-25 transition duration-1000" />
                        <div className="relative bg-[#080a11] border border-white/5 rounded-[3rem] p-12 text-center shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
                            <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Ready to Scale Your Team?</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-10 max-w-md mx-auto">Join 1,000+ support teams already delivering high-fidelity customer experiences.</p>
                            <NextLink href="/signup" className="inline-flex items-center gap-4 text-[12px] font-black bg-white text-slate-950 px-10 py-5 rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest">
                                Get Started Free
                                <ArrowRight className="w-5 h-5" />
                            </NextLink>
                        </div>
                    </div>
                </section>
            </main>

            <MarketingFooter />
        </div>
    );
}
