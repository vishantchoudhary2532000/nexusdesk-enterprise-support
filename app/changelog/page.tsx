import NextLink from 'next/link';
import { Zap, ChevronLeft, Rocket, Sparkles, Shield } from 'lucide-react';
import LandingNav from '../../components/LandingNav';
import MarketingFooter from '../../components/MarketingFooter';

export default function ChangelogPage() {
    const updates = [
        {
            version: "v4.0.8",
            date: "April 10, 2026",
            title: "Intelligence Feed Optimization",
            icon: Zap,
            changes: [
                "Re-engineered the dashboard telemetry feed for nano-latency updates.",
                "Optimized high-fidelity image rendering across the Intelligence Core.",
                "Enhanced organizational node isolation protocols."
            ]
        },
        {
            version: "v4.0.5",
            date: "March 28, 2026",
            title: "Neural Routing Engine v2",
            icon: Rocket,
            changes: [
                "Introduced AI-driven context condensation for long transmissions.",
                "New 'Priority Signal' detection algorithm for critical tickets.",
                "Reduced cognitive overhead for multi-tenant account synchronization."
            ]
        },
        {
            version: "v4.0.0",
            date: "March 15, 2026",
            title: "The Industrial Core Launch",
            icon: Shield,
            changes: [
                "Complete UI/UX overhaul to the deep-dark engineering aesthetic.",
                "Migration to micro-latency infrastructure for all global clusters.",
                "Stabilized RSA-4096 endpoint encryption for all enterprise nodes."
            ]
        }
    ];

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
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">System Progress</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95]">
                            Mission <span className="text-indigo-500">Changelog</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Tracking every evolution of the NexusDesk Intelligence Core.
                        </p>
                    </div>

                    <div className="space-y-32 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[31px] top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/40 via-white/5 to-transparent hidden md:block" />

                        {updates.map((update, i) => (
                            <div key={i} className="relative md:pl-24 group">
                                {/* Version Badge */}
                                <div className="absolute left-0 top-0 w-16 h-16 bg-[#0b1222] border border-white/10 rounded-2xl flex items-center justify-center z-10 hidden md:flex ring-8 ring-[#0b0f19]">
                                    <update.icon className="w-8 h-8 text-indigo-400" />
                                </div>

                                <div className="mb-4 flex items-center gap-4">
                                    <span className="text-[10px] font-black text-white bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-widest">{update.version}</span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{update.date}</span>
                                </div>

                                <h2 className="text-3xl font-black text-white mb-8 uppercase tracking-tighter group-hover:text-indigo-400 transition-colors">{update.title}</h2>

                                <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-500">
                                    <ul className="space-y-6">
                                        {update.changes.map((change, j) => (
                                            <li key={j} className="flex gap-4">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                                <p className="text-slate-400 font-medium leading-relaxed">{change}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </div>
    );
}
