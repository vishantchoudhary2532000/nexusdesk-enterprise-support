'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Sparkles, Brain, Info, History } from 'lucide-react';
import { createClient } from '../../../../lib/supabaseClient';
import TicketConversation from '../../../../components/TicketConversation';
import MessageInput from '../../../../components/MessageInput';
import AISummaryCard from '../../../../components/AISummaryCard';
import Badge from '../../../../components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';
import TicketAuditTrail from '../../../../components/TicketAuditTrail';

export default function TicketPage() {
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id as string;

    const supabase = createClient();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!ticketId) return;

        const fetchTicket = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('tickets')
                .select('*')
                .eq('id', ticketId)
                .single();

            if (error) console.error("Ticket fetch error:", error);
            if (data) setTicket(data);
            setLoading(false);
        };
        fetchTicket();

        const subscription = supabase
            .channel(`ticket_status:${ticketId}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'tickets', filter: `id=eq.${ticketId}` },
                (payload) => setTicket(payload.new)
            )
            .subscribe();

        return () => { supabase.removeChannel(subscription); }
    }, [ticketId, supabase]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Synchronizing Conversation</p>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="bg-slate-800/40 p-6 rounded-[2.5rem] border border-slate-700/30 mb-6">
                    <Info className="w-10 h-10 text-slate-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Ticket Redacted</h1>
                <p className="text-slate-500 mb-6">The requested identifier does not exist in our secure records.</p>
                <button onClick={() => router.push('/dashboard/tickets')} className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors uppercase tracking-widest text-xs">Return to Nexus</button>
            </div>
        );
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'closed': return 'default';
            case 'pending': return 'warning';
            default: return 'success';
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex h-[calc(100vh-10rem)] bg-[#0a0e1a]/40 backdrop-blur-3xl border border-slate-800/40 rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-black/40"
        >
            {/* Left Column: Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-slate-800/40">
                {/* Chat Header Refined to Transmission Feed */}
                <header className="px-10 py-7 border-b border-slate-800/40 bg-white/[0.01] flex items-center justify-between shrink-0 z-20">
                    <div className="flex items-center gap-8 min-w-0">
                        <button
                            onClick={() => router.push('/dashboard/tickets')}
                            className="p-3 -ml-2 text-slate-500 hover:text-white hover:bg-slate-800/60 rounded-2xl transition-all border border-transparent hover:border-slate-700/50 shadow-inner"
                            title="Abort Feed"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-4 mb-1.5">
                                <h2 className="text-2xl font-black text-white truncate tracking-tighter uppercase">{ticket.title}</h2>
                                <Badge variant={getStatusVariant(ticket.status) as any} className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                                    {ticket.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    Live Feed
                                </span>
                                <span className="opacity-20 text-slate-700">|</span>
                                <span>ID: {ticket.id.slice(0, 8).toUpperCase()}</span>
                                <span className="opacity-20 text-slate-700">|</span>
                                <span className="text-indigo-400/70">Latency: 24ms</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden lg:flex items-center gap-5">
                         <div className="text-right">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Nexus Node</p>
                            <p className="text-sm font-black text-indigo-400 tracking-tight uppercase">Support Core Alpha</p>
                         </div>
                         <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20" />
                            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center border border-white/20 shadow-2xl shadow-indigo-500/30">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                         </div>
                    </div>
                </header>

                {/* Messages Feed */}
                <div className="flex-1 min-h-0 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/[0.02] via-transparent to-transparent pointer-events-none" />
                    <TicketConversation ticketId={ticket.id} />
                </div>

                {/* Dispatch Input Area */}
                <div className="shrink-0 p-8 bg-slate-950/20 border-t border-slate-800/40">
                    <MessageInput ticketId={ticket.id} />
                </div>
            </div>

            {/* Right Column: Metadata & Intelligence */}
            <aside className="hidden xl:flex flex-col w-[400px] shrink-0 bg-[#0a0e1a]/20 border-l border-slate-800/40 h-full overflow-hidden">
                <div className="p-10 space-y-12 overflow-y-auto custom-scrollbar h-full">
                    {/* Identity Metadata */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                    <Info className="w-4 h-4 text-slate-400" />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Metadata</h3>
                            </div>
                            <div className="text-[10px] font-bold text-slate-600 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 uppercase tracking-widest">Global Scan</div>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="group">
                                <p className="text-[9px] text-slate-600 font-black tracking-[0.3em] uppercase mb-4 pl-1">Objective Brief</p>
                                <div className="text-[14px] text-slate-300 font-medium leading-relaxed bg-[#0f172a]/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/[0.03] group-hover:border-indigo-500/20 transition-all shadow-2xl">
                                    {ticket.description}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-6 bg-white/[0.01] rounded-[1.5rem] border border-slate-800/40 hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-indigo-500/[0.03] to-transparent pointer-events-none" />
                                <div>
                                    <p className="text-[9px] text-slate-600 font-black tracking-[0.3em] uppercase mb-2">Priority Level</p>
                                    <p className="text-base font-black text-white uppercase tracking-wider">{ticket.priority}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${ticket.priority === 'high' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'}`}>
                                    {ticket.priority === 'high' ? 'Critical' : 'Nominal'}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Neuro-Analysis (AI) */}
                    <section>
                         <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                <Brain className="w-4 h-4 text-indigo-400" />
                            </div>
                            <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">Neuro-Analysis</h3>
                        </div>
                        <AISummaryCard ticketId={ticket.id} organizationId={ticket.organization_id} initialSummary={ticket.summary} />
                    </section>

                    {/* Protocol Logs (Timeline) */}
                    <section>
                         <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                <History className="w-4 h-4 text-slate-400" />
                            </div>
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol Logs</h3>
                        </div>
                        <TicketAuditTrail ticketId={ticket.id} />
                    </section>
                </div>
            </aside>
        </motion.div>
    );
}
