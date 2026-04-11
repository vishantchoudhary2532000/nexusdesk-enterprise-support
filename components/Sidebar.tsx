'use client';

import { useState } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { Hexagon, LayoutDashboard, Users, UserCog, BarChart3, LifeBuoy, ShieldAlert, Settings, Menu, X, Sparkles } from 'lucide-react';
import OrganizationSwitcher from './OrganizationSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tickets', href: '/dashboard/tickets', icon: LifeBuoy },
    { name: 'Team', href: '/dashboard/team', icon: Users },
    { name: 'Admin', href: '/dashboard/admin', icon: UserCog },
    { name: 'Audit Logs', href: '/dashboard/audit', icon: ShieldAlert },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-800 text-slate-400 hover:text-white transition-colors shadow-lg"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.div 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0e1a]/95 backdrop-blur-2xl border-r border-slate-800/50 flex flex-col h-full transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Mobile Close */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="md:hidden absolute top-5 right-4 p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Logo area refined */}
                <div className="h-20 flex items-center px-6 border-b border-slate-800/50 shrink-0">
                    <NextLink href="/dashboard" className="flex items-center gap-4 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <motion.div 
                                whileHover={{ rotate: 5, scale: 1.05 }}
                                className="relative bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-[1.25rem] shadow-xl shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all border border-white/10"
                            >
                                <Hexagon className="w-6 h-6 text-white fill-white/10" />
                            </motion.div>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter leading-none">Nexus<span className="text-indigo-500">Desk</span></h1>
                            <p className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-500 mt-1">Core v4.0</p>
                        </div>
                    </NextLink>
                </div>

                {/* Org Switcher */}
                <div className="py-2 shrink-0 border-b border-slate-800/50">
                    <OrganizationSwitcher />
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 custom-scrollbar">
                    {navigation.map((item, idx) => {
                        const isActive = item.href === '/dashboard'
                            ? pathname === '/dashboard'
                            : pathname.startsWith(item.href);

                        return (
                            <NextLink
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                            >
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold transition-all group relative ${isActive
                                        ? 'bg-indigo-500/10 text-indigo-400'
                                        : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-200'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-pill"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.6)]" 
                                        />
                                    )}
                                    <item.icon className={`w-[18px] h-[18px] ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'} transition-colors`} />
                                    <span className="tracking-tight">{item.name}</span>
                                </motion.div>
                            </NextLink>
                        )
                    })}
                </nav>

                {/* Upgrade CTA */}
                <div className="p-4 border-t border-white/[0.05] shrink-0">
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-indigo-600/5 backdrop-blur-3xl rounded-[2rem] p-5 border border-indigo-500/10 relative overflow-hidden group/cta shadow-2xl"
                    >
                        <div className="absolute -right-6 -top-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl group-hover/cta:scale-150 transition-transform duration-700" />
                        <div className="flex items-center gap-3 mb-2.5">
                            <div className="p-1.5 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            </div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Tier: Pro Node</h4>
                        </div>
                        <p className="text-[10px] text-slate-500 mb-4 leading-relaxed font-bold uppercase tracking-tight">Expand Support Capacity & AI Core access.</p>
                        <button className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-black py-3 rounded-xl transition-all shadow-xl border border-indigo-500/20 active:scale-[0.98] uppercase tracking-widest">
                            Initialize Upgrade
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
