import NextLink from 'next/link';
import { Hexagon, Twitter, Github, Linkedin } from 'lucide-react';

export default function MarketingFooter() {
    return (
        <footer className="bg-[#080a11] border-t border-white/[0.05] pt-24 pb-12 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
                    {/* Brand Identifier */}
                    <div className="md:col-span-4">
                        <NextLink href="/" className="flex items-center gap-4 group mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20" />
                                <div className="relative bg-gradient-to-br from-indigo-500/20 to-violet-600/20 p-2.5 rounded-xl border border-white/10">
                                    <Hexagon className="w-6 h-6 text-indigo-400 fill-indigo-400/5 group-hover:rotate-90 transition-transform duration-700" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white tracking-widest uppercase mb-[-4px]">NexusDesk</span>
                                <span className="text-[9px] font-black text-slate-500 tracking-[0.4em] uppercase">Intelligence Core v4.0</span>
                            </div>
                        </NextLink>
                        <p className="text-sm text-slate-500 max-w-sm font-medium leading-relaxed mb-8">
                            Empowering modern engineering teams with high-fidelity support infrastructure and resilient multi-tenant operational protocols.
                        </p>
                        <div className="flex gap-5">
                            <a href="#" className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all active:scale-90"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all active:scale-90"><Github className="w-5 h-5" /></a>
                            <a href="#" className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all active:scale-90"><Linkedin className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Navigation Hubs */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-8">
                        <div>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Platform</h4>
                            <ul className="space-y-4">
                                <li><NextLink href="/features" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Features</NextLink></li>
                                <li><NextLink href="/pricing" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Pricing</NextLink></li>
                                <li><NextLink href="/changelog" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Changelog</NextLink></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Resources</h4>
                            <ul className="space-y-4">
                                <li><NextLink href="/docs" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Documentation</NextLink></li>
                                <li><NextLink href="/support" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Help Center</NextLink></li>
                                <li><NextLink href="/docs" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">API Reference</NextLink></li>
                            </ul>
                        </div>

                        <div className="col-span-2 sm:col-span-1 border-t border-white/5 pt-12 sm:border-t-0 sm:pt-0">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Company</h4>
                            <ul className="space-y-4">
                                <li><NextLink href="/about" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">About Us</NextLink></li>
                                <li><NextLink href="/privacy" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Privacy Policy</NextLink></li>
                                <li><NextLink href="/terms" className="text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors">Terms of Service</NextLink></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-indigo-500/40 animate-pulse" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            © {new Date().getFullYear()} NexusDesk Intelligence. All protocols finalized.
                        </p>
                    </div>
                    <div className="flex items-center gap-8">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                             System Status: <span className="text-emerald-500/70">Operational</span>
                        </span>
                        <div className="w-px h-4 bg-white/5" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">v4.0.8-STABLE</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
