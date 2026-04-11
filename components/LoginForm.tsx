'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabaseClient';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Input from './ui/Input';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, Hexagon, Sparkles } from 'lucide-react';

export default function LoginForm() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error('Authentication Failed', { description: error.message });
            setLoading(false);
        } else {
            toast.success('Access Granted', { description: 'Welcome back to the Nexus.' });
            router.push('/dashboard');
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md mx-auto p-12 rounded-[3rem] shadow-2xl bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 blur-[80px] -mr-24 -mt-24 pointer-events-none" />
            
            <header className="mb-12 text-center flex flex-col items-center">
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-violet-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 group-hover:rotate-3 transition-transform">
                        <Hexagon className="w-8 h-8 text-indigo-400 fill-indigo-400/5" />
                    </div>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Initialize <span className="text-indigo-500">Intelligence</span></h2>
                <div className="flex items-center gap-2 justify-center">
                    <span className="h-px w-4 bg-slate-800" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">System Access Protocol</p>
                    <span className="h-px w-4 bg-slate-800" />
                </div>
            </header>

            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                <div className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors z-10" />
                        <Input 
                            type="email"
                            required
                            placeholder="Primary Neural Identity"
                            className="pl-12 h-16 bg-slate-900/50 border-white/5 focus:border-indigo-500/50 rounded-2xl transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors z-10" />
                        <Input 
                            type="password"
                            required
                            placeholder="Static Security Key"
                            className="pl-12 h-16 bg-slate-900/50 border-white/5 focus:border-indigo-500/50 rounded-2xl transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full h-16 rounded-2xl text-[13px] uppercase tracking-[0.2em] font-black bg-indigo-600 hover:bg-indigo-500 border-indigo-500/50 shadow-lg shadow-indigo-600/20"
                    >
                        Authorize Access <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </form>

            <div className="mt-12 text-center pt-8 border-t border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Identity Establishment Required?</p>
                <Link href="/signup" className="group inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-black text-xs uppercase tracking-widest transition-all">
                    Register Entity <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 opacity-30 group">
                <Sparkles className="w-3 h-3 text-indigo-400 group-hover:rotate-12 transition-transform" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Neural Link Encryption: AES-GCM-256</span>
            </div>
        </motion.div>
    );
}
