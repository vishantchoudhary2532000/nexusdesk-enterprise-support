'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabaseClient';
import { History, CheckCircle2, AlertCircle, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from './ui/Skeleton';

interface AuditLog {
    id: string;
    action: string;
    created_at: string;
    profiles?: { full_name: string };
}

interface TicketAuditTrailProps {
    ticketId: string;
}

export default function TicketAuditTrail({ ticketId }: TicketAuditTrailProps) {
    const supabase = createClient();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudit = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('activity_logs')
                .select(`
                    id,
                    action,
                    created_at,
                    user_id
                `)
                .eq('entity_id', ticketId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                const userIds = [...new Set(data.map((d: any) => d.user_id).filter(Boolean))];
                let profilesMap: Record<string, any> = {};

                if (userIds.length > 0) {
                    const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
                    profilesMap = Object.fromEntries(profiles?.map(p => [p.id, p]) || []);
                }

                const enriched = data.map((d: any) => ({
                    ...d,
                    profiles: profilesMap[d.user_id] || { full_name: 'Support Core' }
                }));

                setLogs(enriched);
            }
            setLoading(false);
        };

        fetchAudit();
    }, [ticketId, supabase]);

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                        <div className="space-y-2 flex-1 pt-1">
                            <Skeleton className="w-1/2 h-3 rounded-full opacity-50" />
                            <Skeleton className="w-full h-2 rounded-full opacity-30" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="p-6 rounded-2xl border border-dashed border-slate-800/60 bg-slate-900/10 flex flex-col items-center text-center">
                <div className="p-3 bg-slate-800/50 rounded-xl mb-3">
                    <History className="w-4 h-4 text-slate-500" />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Events Found</p>
                <p className="text-[9px] text-slate-600 mt-1">Status timeline is currently idle.</p>
            </div>
        );
    }

    return (
        <div className="relative space-y-10 pl-6 border-l border-slate-800/40 ml-2">
            {logs.map((log, idx) => {
                const isStatusChange = log.action.includes('status');
                const isCreation = log.action.includes('create');
                const isMessage = log.action.includes('message');

                return (
                    <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative group"
                    >
                        {/* Dot with Glow Effect */}
                        <div className={`absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-[3px] border-[#0a0f1a] z-10 transition-transform group-hover:scale-125 ${
                            isStatusChange ? 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]' : 
                            isCreation ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]' : 
                            isMessage ? 'bg-blue-500' : 'bg-slate-700'
                        }`} />

                        <div className="flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border ${
                                    isStatusChange ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                                    isCreation ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                    'bg-slate-800/50 border-white/[0.03] text-slate-500'
                                }`}>
                                    {log.action.replace('ticket_', '').replace('_', ' ')}
                                </span>
                                <span className="text-[9px] font-black text-slate-700 tracking-widest tabular-nums uppercase">
                                    {new Date(log.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold tracking-tight">
                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                    {log.profiles?.full_name}
                                </div>
                                <span className="text-[8px] font-black text-slate-800 uppercase tracking-tighter">
                                    Protocol Entry: #{log.id.slice(-4).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
