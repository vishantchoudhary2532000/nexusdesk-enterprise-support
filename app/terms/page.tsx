import NextLink from 'next/link';
import { FileText, ChevronLeft } from 'lucide-react';
import LandingNav from '../../components/LandingNav';
import MarketingFooter from '../../components/MarketingFooter';

export default function TermsPage() {
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
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em]">Operational Framework</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.95]">
                            Service <span className="text-indigo-500">Terms</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            These terms establish the legal parameters for your use of the NexusDesk Intelligence Core.
                        </p>
                    </div>

                    <div className="space-y-16">
                        <section className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05]">
                            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">1. Node Provisioning</h2>
                            <p className="text-slate-500 leading-relaxed font-medium mb-4">
                                By establishing a node on NexusDesk, you agree to provide accurate organizational metadata. We reserve the right to suspend any node that violates our core integrity protocols.
                            </p>
                        </section>

                        <section className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05]">
                            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">2. Acceptable Transmission</h2>
                            <p className="text-slate-500 leading-relaxed font-medium mb-4">
                                The NexusDesk network must not be used for malicious traffic, spam node generation, or unauthorized data scraping.
                            </p>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Violation of these transmission protocols will result in immediate node de-provisioning.
                            </p>
                        </section>

                        <section className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.05]">
                            <h2 className="text-xl font-black text-white mb-6 uppercase tracking-tight">3. Service Uptime</h2>
                            <p className="text-slate-500 leading-relaxed font-medium mb-4">
                                We strive for 99.9% uptime for all Core nodes. Engineering maintenance windows will be communicated via the Mission Changelog.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </div>
    );
}
