'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabaseClient';
import { useOrganization } from './OrganizationProvider';
import { Activity, Ticket, UserPlus, MessageSquare, History, Sparkles } from 'lucide-react';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import Badge from './ui/Badge';
import { motion } from 'framer-motion';

interface ActivityLog {
    id: string;
    action: string;
    entity_type: string;
    created_at: string;
    user_id?: string;
    profiles?: { full_name: string } | null;
}

export default function ActivityTimeline() {
    const supabase = createClient();
    const { activeOrganization } = useOrganization();
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            if (!activeOrganization) {
                setLoading(false);
                return;
            }
            setLoading(true);

            const { data, error } = await supabase
                .from('activity_logs')
                .select(`
                    id,
                    user_id,
                    action,
                    entity_type,
                    created_at
                `)
                .eq('organization_id', activeOrganization.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (!error && data) {
                const userIds = [...new Set(data.map((d: any) => d.user_id).filter(Boolean))];
                let profilesMap: Record<string, any> = {};

                if (userIds.length > 0) {
                    const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
                    profilesMap = Object.fromEntries(profiles?.map(p => [p.id, p]) || []);
                }

                const enriched = data.map((d: any) => ({
                    ...d,
                    profiles: profilesMap[d.user_id] || { full_name: 'Unknown User' }
                }));

                // @ts-ignore
                setLogs(enriched);
            }
            setLoading(false);
        };

        fetchLogs();
    }, [activeOrganization, supabase]);

    const getIcon = (action: string) => {
        if (action.includes('ticket')) return <Ticket className="w-3.5 h-3.5" />;
        if (action.includes('member') || action.includes('user')) return <UserPlus className="w-3.5 h-3.5" />;
        if (action.includes('message')) return <MessageSquare className="w-3.5 h-3.5" />;
        return <Activity className="w-3.5 h-3.5" />;
    };

    const getIconColor = (action: string) => {
        if (action.includes('ticket')) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
        if (action.includes('member') || action.includes('user')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (action.includes('message')) return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    };

    const formatAction = (action: string) => {
        return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    if (loading) {
        return (
            <Card className="p-0 border-slate-800/40">
                <div className="px-8 py-6 border-b border-slate-800/40">
                    <Skeleton className="w-48 h-6 rounded-lg" />
                </div>
                <div className="p-8 space-y-10">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-10">
                            <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                            <div className="space-y-3 flex-1">
                                <Skeleton className="w-1/3 h-4 rounded-md" />
                                <Skeleton className="w-2/3 h-3 rounded-full opacity-40" />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (logs.length === 0) {
        return (
            <Card className="p-12 text-center border-slate-800/40 flex flex-col items-center">
                <div className="bg-slate-800/50 p-5 rounded-3xl mb-5 border border-slate-700/50">
                    <History className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">Tranquil Trails</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-[240px] leading-relaxed">Your organization's heartbeat will appear here as the team starts moving.</p>
            </Card>
        );
    }

    return (
        <Card className="p-0 border-slate-800/40 overflow-visible relative">
           <div className="absolute top-0 right-0 p-6 opacity-40">
                <Sparkles className="w-6 h-6 text-indigo-500/30" />
           </div>

            <div className="px-8 py-6 border-b border-slate-800/40">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                        <Activity className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Organization Pulse</h3>
                </div>
            </div>

            <div className="p-8">
                <div className="relative border-l-2 border-slate-800/60 ml-3 space-y-10 pb-2">
                    {logs.map((log, idx) => (
                        <motion.div 
                            key={log.id} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative pl-10 group"
                        >
                            {/* Connector dot */}
                            <div className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full border-2 border-[#0b0f19] shadow-lg flex items-center justify-center z-10 ${getIconColor(log.action)}`}>
                                {getIcon(log.action)}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                                    {formatAction(log.action)}
                                </h4>
                                <Badge variant="default" className="text-[9px] py-0.5 bg-slate-900/50 border-slate-700/30 lowercase">
                                    {new Date(log.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </Badge>
                            </div>

                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                <span className="text-slate-300 font-bold border-b border-indigo-500/30 pb-0.5">
                                    {log.profiles?.full_name || 'System'}
                                </span>
                                {' '}refined data in the{' '}
                                <span className="text-indigo-400/80 italic">{log.entity_type}</span> module.
                            </p>
                            
                            {/* Hover effect highlight */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[120%] bg-white/[0.02] rounded-2xl -z-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[2%]" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
