'use client';

import { createClient } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, User } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { motion } from 'framer-motion';

export default function DashboardHeader() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setEmail(user.email ?? null);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <header className="bg-[#0b0f19]/80 backdrop-blur-xl border-b border-slate-800/60 sticky top-0 z-40 shrink-0">
            <div className="px-6 h-16 flex items-center justify-between w-full">
                {/* Platform Health */}
                <div className="flex items-center gap-3">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none">Platform Health</span>
                        <span className="text-[11px] font-bold text-emerald-400 tracking-tight leading-normal">Nominal / Healthy</span>
                    </div>
                </div>

                <div className="flex items-center gap-5 sm:gap-6">
                    <NotificationBell />

                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-2xl cursor-default shadow-xl"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-md opacity-20" />
                            <div className="relative bg-indigo-500/20 p-2 rounded-xl text-indigo-400 border border-indigo-500/20">
                                <User className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-0.5">Operator Node</span>
                            <span className="text-xs font-bold text-slate-200 tracking-tight leading-normal truncate max-w-[150px]">
                                {email || "System"}
                            </span>
                        </div>
                    </motion.div>

                    <div className="w-px h-6 bg-white/[0.05] hidden sm:block" />

                    <motion.button
                        whileHover={{ scale: 1.05, x: 2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="flex items-center cursor-pointer text-[10px] font-black text-slate-500 hover:text-rose-400 transition-all group px-2 py-1 uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4 mr-2 group-hover:text-rose-500 transition-colors" />
                        <span className="hidden sm:inline">Terminate Session</span>
                    </motion.button>
                </div>
            </div>
        </header>
    );
}
