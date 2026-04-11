'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabaseClient';
import { CheckCircle2, ArrowRight, Loader2, Link as LinkIcon, Users, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingWizard() {
    const supabase = createClient();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Org Setup Logic
    const [orgName, setOrgName] = useState('');
    const [userOrgId, setUserOrgId] = useState<string | null>(null);

    // Invite Logic
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteSent, setInviteSent] = useState(false);

    // Initial load: get their current organization if created by the trigger
    useEffect(() => {
        const fetchOrg = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Check if they already have an org
            const { data: memberData } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .single();

            if (memberData) {
                setUserOrgId(memberData.organization_id);
                // Pre-fill org name with the trigger-generated name, minus the " 's Team" suffix if possible
                const { data: orgData } = await supabase
                    .from('organizations')
                    .select('name')
                    .eq('id', memberData.organization_id)
                    .single();
                if (orgData) {
                    setOrgName(orgData.name.replace("'s Team", ""));
                }
            }
        };
        fetchOrg();
    }, [supabase, router]);

    const handleOrgSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (userOrgId) {
            await supabase.from('organizations').update({ name: orgName }).eq('id', userOrgId);
        }
        setStep(2);
        setLoading(false);
    };

    const handleInviteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) {
            setStep(3);
            return;
        }
        setLoading(true);
        try {
            await fetch('/api/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail, role: 'member', organization_id: userOrgId })
            });
            setInviteSent(true);
            setTimeout(() => setStep(3), 1500);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const finishOnboarding = () => {
        router.push('/dashboard');
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-[#0f172a]/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/[0.05] relative">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[60px] pointer-events-none" />

            {/* Progress Header */}
            <div className="px-10 py-8 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between relative z-10">
                <div className="flex gap-3">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="w-10 h-1.5 rounded-full overflow-hidden bg-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: step >= s ? '100%' : '0%' }}
                                transition={{ duration: 0.5 }}
                                className={`h-full bg-gradient-to-r from-indigo-500 to-violet-600 shadow-[0_0_8px_rgba(99,102,241,0.5)]`}
                            />
                        </div>
                    ))}
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Protocol Step {step}/03</div>
            </div>

            <div className="p-10 relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            className="space-y-8"
                        >
                            <div>
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-[1.25rem] flex items-center justify-center mb-6 border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
                                    <Hexagon className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Workspace Identification</h2>
                                <p className="text-slate-500 font-medium leading-relaxed">Establish your technical domain. This identifier will serve as the primary node for your support operations.</p>
                            </div>

                            <form onSubmit={handleOrgSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Domain Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-6 py-4 bg-slate-950/40 border border-white/5 rounded-2xl outline-none focus:border-indigo-500/30 text-white placeholder:text-slate-600 font-bold transition-all shadow-inner"
                                        value={orgName}
                                        onChange={(e) => setOrgName(e.target.value)}
                                        placeholder="ACME-PROTOCOL-01"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !orgName.trim()}
                                    className="w-full bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-2xl shadow-indigo-500/20 flex justify-center items-center gap-3 group disabled:opacity-30 border border-white/10"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <span className="text-[11px] uppercase tracking-widest">Initialize Node</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            className="space-y-8"
                        >
                            <div>
                                <div className="w-12 h-12 bg-violet-500/10 rounded-[1.25rem] flex items-center justify-center mb-6 border border-violet-500/20 shadow-xl shadow-violet-500/5">
                                    <Users className="w-6 h-6 text-violet-400" />
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Sync Collaborators</h2>
                                <p className="text-slate-500 font-medium leading-relaxed">Neural links are more effective in clusters. Authorize additional operators to access this node.</p>
                            </div>

                            <form onSubmit={handleInviteSubmit} className="space-y-6">
                                {inviteSent ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-5 rounded-2xl flex items-center gap-4"
                                    >
                                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-black text-xs uppercase tracking-widest">Authorization Sent</p>
                                            <p className="text-[10px] text-emerald-500/70 mt-0.5 font-bold">Transmission delivered to target address.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Operator Identifier (Email)</label>
                                        <input
                                            type="email"
                                            className="w-full px-6 py-4 bg-slate-950/40 border border-white/5 rounded-2xl outline-none focus:border-indigo-500/30 text-white placeholder:text-slate-600 font-bold transition-all shadow-inner"
                                            value={inviteEmail}
                                            onChange={(e) => setInviteEmail(e.target.value)}
                                            placeholder="operator@nexus.core"
                                        />
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 font-black py-4 px-6 rounded-2xl transition-all shadow-xl active:scale-[0.98] text-[11px] uppercase tracking-widest"
                                    >
                                        Bypass
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || inviteSent}
                                        className="flex-[2] bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-2xl shadow-indigo-500/20 flex justify-center items-center gap-3 group disabled:opacity-30 border border-white/10 text-[11px] uppercase tracking-widest"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Dispatch Sync'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="text-center py-6 space-y-8"
                        >
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse" />
                                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-emerald-500/20 relative z-10">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                                </div>
                            </div>
                            
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Protocol Active</h2>
                                <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">Your operational workspace is fully synchronized. Initializing final redirect to the command dashboard.</p>
                            </div>

                            <button
                                onClick={finishOnboarding}
                                className="w-full bg-slate-950 border border-white/10 hover:bg-slate-900 text-white font-black py-5 px-8 rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-3 group mx-auto active:scale-[0.98]"
                            >
                                <span className="text-[12px] uppercase tracking-[0.2em]">Enter Dashboard</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-indigo-400" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
