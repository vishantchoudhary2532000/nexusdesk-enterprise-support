import NextLink from 'next/link';
import { Hexagon, CheckCircle2, ArrowRight, Zap, Target, Lock, Sparkles, Shield, Cpu, Activity, Globe } from 'lucide-react';
import LandingNav from '../components/LandingNav';
import MarketingFooter from '../components/MarketingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col font-sans selection:bg-indigo-500/30">
      <LandingNav />

      <main className="flex-1 relative">
        {/* Vanguard Hero Section */}
        <section className="relative pt-48 pb-56 overflow-hidden border-b border-white/[0.03]">
          {/* Background Engineering Accents */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
          <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
          <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] -z-10" />

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/5 rounded-full border border-indigo-500/20 shadow-2xl backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Core System v4.08 Active</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.95] max-w-5xl uppercase">
                Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-violet-400">Support</span> <br className="hidden md:block" /> Built for Modern Teams
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed mb-12">
                NexusDesk provides the high-fidelity infrastructure your team needs to resolve tickets faster, collaborate effortlessly, and scale your support operations with technical precision.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <NextLink href="/signup" className="group relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative inline-flex items-center gap-4 bg-white text-slate-950 px-10 py-5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </NextLink>
                <NextLink href="/features" className="inline-flex items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-10 py-5 rounded-[1.5rem] text-[12px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  Explore Features
                </NextLink>
              </div>
            </div>
          </div>
        </section>

        {/* Transmission Showcase (Mockup) */}
        <section className="relative -mt-40 pb-40">
            <div className="max-w-7xl mx-auto px-6">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-violet-600/20 rounded-[3rem] blur-2xl opacity-50" />
                    <div className="relative aspect-[16/10] bg-[#0f172a] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <img 
                          src="/portfolio/nexusdesk_hero_high_res.png" 
                          alt="NexusDesk Dashboard 4K Simulation" 
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-[2000ms] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/20 to-transparent flex flex-col justify-end p-12">
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 backdrop-blur-3xl shadow-2xl">
                                    <Activity className="w-8 h-8 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Real-Time Intelligence Feed</h3>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Seamless Synchronization | Operational Status: Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Feature Grid: Intelligence Nodes */}
        <section className="py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Zap, title: "Nano-Latency Discovery", desc: "Instantly see when tickets are created or updated. Zero manual refreshing, just pure speed." },
                        { icon: Target, title: "Smart Routing", desc: "Automated ticket summaries and rule-based assignments focus your team on what matters most." },
                        { icon: Lock, title: "Secure Multi-Tenancy", desc: "Isolated organizational workspaces with industrial-grade encryption for every tenant." },
                        { icon: Globe, title: "Global Team Sync", desc: "Collaborate in real-time with presence indicators and shared activities across the entire dashboard." },
                        { icon: Shield, title: "Verified Protocols", desc: "Advanced audit trails and granular permissions keep your support infrastructure secure." },
                        { icon: Sparkles, title: "AI-Powered Context", desc: "AI-driven thread summaries quickly condense long conversations so agents get context in seconds." }
                    ].map((f, i) => (
                        <div key={i} className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-8 border border-indigo-500/20 shadow-xl shadow-indigo-500/5 group-hover:scale-110 transition-transform">
                                <f.icon className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight">{f.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm font-medium">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Join the Network */}
        <section className="py-48 bg-[#080a11] border-t border-white/[0.05] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
            
            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase">Ready to Transform <br /> <span className="text-indigo-500">Your Support?</span></h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-12">Join the growing network of teams scaling with NexusDesk.</p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <NextLink href="/signup" className="w-full sm:w-auto text-base font-black bg-white text-slate-950 px-12 py-5 rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest">
                        Start Free Trial
                    </NextLink>
                    <NextLink href="/pricing" className="w-full sm:w-auto text-base font-black bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl transition-all shadow-xl hover:bg-white/10 active:scale-95 uppercase tracking-widest">
                        View Pricing
                    </NextLink>
                </div>
            </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
