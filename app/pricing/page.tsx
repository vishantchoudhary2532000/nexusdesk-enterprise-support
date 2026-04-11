import NextLink from 'next/link';
import { Hexagon, CheckCircle2, ArrowRight, Cpu, Zap, Shield, Globe } from 'lucide-react';
import LandingNav from '../../components/LandingNav';
import MarketingFooter from '../../components/MarketingFooter';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans selection:bg-indigo-500/30">
            <LandingNav />

            <main className="flex-1 pb-32 relative">
                {/* Background Engineering Accents */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent" />
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />

                <section className="pt-48 pb-16 px-6 max-w-5xl mx-auto text-center">
                    <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/20 shadow-2xl backdrop-blur-md">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Scalable Support Pricing</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95]">
                        Simple <span className="text-indigo-500">Pricing</span> <br /> Scale As You Grow
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        NexusDesk grows with your team. Start with our powerful free tier and unlock premium features as your support volume expands.
                    </p>
                </section>

                <section className="max-w-7xl mx-auto px-6 flex justify-center mt-12">
                    {/* Starter Plan Card */}
                    <div className="relative group max-w-lg w-full">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                        <div className="relative bg-[#0f172a]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-12 shadow-2xl overflow-hidden">
                            {/* Ambient Glow */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[60px] pointer-events-none" />

                            <div className="absolute top-8 right-10 flex items-center gap-2 px-3 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                                <span className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">Free Forever</span>
                            </div>

                            <div className="mb-10">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Starter Plan</h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed max-w-[280px]">Essential tools for small teams looking to modernize their support.</p>
                            </div>

                            <div className="mb-10 flex items-baseline gap-3">
                                <span className="text-7xl font-black text-white tracking-tighter">$0</span>
                                <span className="text-slate-500 font-black uppercase tracking-widest text-xs">/ per month</span>
                            </div>

                            <div className="space-y-5 mb-12">
                                {[
                                    { text: "100 Tickets Monthly", icon: Zap },
                                    { text: "5 Team Operators", icon: Cpu },
                                    { text: "Smart Rule Engine", icon: Shield },
                                    { text: "Multi-Tenant Support", icon: Globe },
                                    { text: "Real-time Telemetry", icon: CheckCircle2 }
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
                                            <feature.icon className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-300 tracking-tight">{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            <NextLink href="/signup" className="block w-full text-center text-[12px] font-black bg-white text-slate-950 px-8 py-5 rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest">
                                Get Started Free
                            </NextLink>
                            <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mt-6">No credit card or setup fees.</p>
                        </div>
                    </div>
                </section>

                <section className="max-w-2xl mx-auto px-6 mt-32 text-center">
                    <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2rem]">
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Scaling beyond the Starter Protocol? Advanced Enterprise telemetry and high-volume data nodes are currently in the engineering pipeline.<br />
                            <a href="mailto:sales@nexusdesk.com" className="text-indigo-400 font-black uppercase tracking-widest text-[11px] hover:text-indigo-300 transition-colors mt-4 inline-block">Consult Operation Command</a>
                        </p>
                    </div>
                </section>
            </main>

            <MarketingFooter />
        </div>
    );
}
