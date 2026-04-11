import NextLink from 'next/link';
import { Shield, ChevronLeft } from 'lucide-react';
import LandingNav from '../../components/LandingNav';
import MarketingFooter from '../../components/MarketingFooter';

export default function PrivacyPage() {
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
                            <Shield className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Protocol Integrity</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95]">
                            Privacy <span className="text-indigo-500">Policy</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Last Updated: April 12, 2026. This document outlines our commitment to data sovereignty and transparency.
                        </p>
                    </div>

                    <div className="space-y-16">
                        <section className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05]">
                            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">1. Data Collection Node</h2>
                            <p className="text-slate-500 leading-relaxed font-medium mb-4">
                                We synchronize only the essential telemetry required to maintain your support infrastructure. This includes organizational metadata, operator identifiers, and transmission logs.
                            </p>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                NexusDesk does not sell your operational data. Your nodes are isolated and encrypted at rest.
                            </p>
                        </section>

                        <section className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05]">
                            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">2. Security Protocols</h2>
                            <p className="text-slate-500 leading-relaxed font-medium mb-4">
                                Every transmission within the NexusDesk network is protected via RSA-4096 encryption. Our multi-tenant architecture ensures that organization nodes remain cryptographically separated.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Isolated database shards for every organization.",
                                    "End-to-end encrypted service-to-service communication.",
                                    "Strict Role-Based Access Control (RBAC) internal policies."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-400">
                                        <div className="w-1 h-1 rounded-full bg-indigo-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05]">
                            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">3. Your Sovereignty</h2>
                            <p className="text-slate-500 leading-relaxed font-medium mb-4">
                                You retain absolute ownership of all ticket data and operator activity logs generated within your organization. You may request full node deletion at any time.
                            </p>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                For specialized data residency requirements, contact our Infrastructure Command.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </div>
    );
}
