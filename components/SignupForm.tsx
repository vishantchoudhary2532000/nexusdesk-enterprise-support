'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabaseClient';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Input from './ui/Input';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, Sparkles, UserPlus } from 'lucide-react';

export default function SignupForm() {
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/login`,
            }
        });

        if (error) {
            toast.error('Identity Mapping Failed', { description: error.message });
            setLoading(false);
        } else {
            if (data.session) {
                toast.success('Identity Established', { description: 'Welcome to the Nexus network.' });
                router.push('/onboarding');
            } else {
                toast.success('Verification Required', { description: 'Please authorize your neural link via email.' });
                setLoading(false);
            }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md mx-auto p-12 rounded-[3.5rem] shadow-2xl bg-[#0f172a]/80 backdrop-blur-3xl border border-white/5 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/10 blur-[80px] -ml-24 -mt-24 pointer-events-none" />
            
            <header className="mb-12 text-center flex flex-col items-center">
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-10" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                        <UserPlus className="w-8 h-8 text-emerald-400 fill-emerald-400/5" />
                    </div>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Establish <span className="text-emerald-500">Identity</span></h2>
                <div className="flex items-center gap-2 justify-center">
                    <span className="h-px w-4 bg-slate-800" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Node Mapping Protocol</p>
                    <span className="h-px w-4 bg-slate-800" />
                </div>
            </header>

            <form onSubmit={handleSignup} className="space-y-6 relative z-10">
                <div className="space-y-4">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors z-10" />
                        <Input 
                            type="email"
                            required
                            placeholder="Primary Neural Identity"
                            className="pl-12 h-16 bg-slate-900/50 border-white/5 focus:border-emerald-500/50 rounded-2xl transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-emerald-500 transition-colors z-10" />
                        <Input 
                            type="password"
                            required
                            minLength={6}
                            placeholder="Dynamic Security Key"
                            className="pl-12 h-16 bg-slate-900/50 border-white/5 focus:border-emerald-500/50 rounded-2xl transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full h-16 rounded-2xl text-[13px] uppercase tracking-[0.2em] font-black bg-emerald-600 hover:bg-emerald-500 border-emerald-500/50 shadow-lg shadow-emerald-600/20"
                    >
                        Map Identity <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </form>

            <div className="mt-12 text-center pt-8 border-t border-slate-800/50">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Identity Already Mapped?</p>
                <Link href="/login" className="group inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-black text-xs uppercase tracking-widest transition-all">
                    Initialize Access <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 opacity-30 group">
                <Sparkles className="w-3 h-3 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Neural Link Encryption: AES-GCM-256</span>
            </div>
        </motion.div>
    );
}
