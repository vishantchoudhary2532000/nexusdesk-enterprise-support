'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../../../lib/supabaseClient';
import { motion } from 'framer-motion';
import { Shield, Mail, User, Save, Terminal, Fingerprint, ShieldAlert, Cpu } from 'lucide-react';
import { toast } from 'sonner';
import DashboardHeader from '../../../components/DashboardHeader';
import AvatarUpload from '../../../components/AvatarUpload';

export default function SettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [email, setEmail] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setEmail(user.email || '');

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No user sessionFound');

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;
            toast.success('Identity Synchronized', {
                description: 'Your profile parameters have been updated across the network.'
            });
        } catch (error: any) {
            toast.error('Sync Error', { description: error.message });
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Decrypting Profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0f19] text-white">
            <DashboardHeader />
            
            <main className="max-w-4xl mx-auto px-8 py-20 pb-40">
                <header className="mb-16">
                    <div className="flex items-center gap-2 mb-3">
                        <Fingerprint className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/50">Security & Identity</span>
                    </div>
                    <h1 className="text-5xl font-black uppercase tracking-tight">Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Parameters</span></h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Left: Avatar Column */}
                    <div className="space-y-8">
                        <div className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[3rem] backdrop-blur-3xl shadow-2xl text-center">
                            <AvatarUpload 
                                uid={profile?.id} 
                                url={profile?.avatar_url} 
                                onUpload={(url) => setProfile({ ...profile, avatar_url: url })} 
                            />
                        </div>

                        <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] space-y-6">
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Status: Verified</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                Your identity is secured by Nexus-Grade encryption. All profile changes are audited and logged.
                            </p>
                        </div>
                    </div>

                    {/* Right: Form Column */}
                    <div className="md:col-span-2">
                        <form onSubmit={updateProfile} className="space-y-8">
                            <section className="p-10 bg-white/[0.01] border border-white/[0.04] rounded-[3rem] shadow-inner space-y-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                                            <User className="w-3 h-3" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={profile?.full_name || ''}
                                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500/40 transition-all font-bold text-lg"
                                            placeholder="Enter operational name..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                                            <Mail className="w-3 h-3" />
                                            Transmission Address (Email)
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl px-6 py-4 text-slate-500 outline-none cursor-not-allowed font-medium opacity-60"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Cpu className="w-3.5 h-3.5 text-slate-600" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Last Synced: {new Date(profile?.updated_at).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                                    >
                                        {saving ? 'Syncing...' : 'Save Changes'}
                                        <Save className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </section>

                            <section className="p-10 border border-white/[0.05] rounded-[3rem] flex items-center justify-between group cursor-default">
                                <div>
                                    <h4 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">Credential Hub</h4>
                                    <p className="text-xs text-slate-500 font-medium">Reset password or update security keys.</p>
                                </div>
                                <button type="button" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    Manage
                                </button>
                            </section>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 py-8 px-8 bg-[#0b0f19]/80 backdrop-blur-xl border-t border-white/[0.05] z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-slate-600" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">Secure Environment: Active</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/50">E2E Encryption Enabled</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
