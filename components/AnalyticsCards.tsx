'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabaseClient';
import { useOrganization } from './OrganizationProvider';
import { Ticket, CheckCircle2, Clock, CalendarDays, TrendingUp } from 'lucide-react';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import { motion } from 'framer-motion';

interface AnalyticsData {
    total: number;
    open: number;
    closed: number;
    today: number;
}

const Sparkline = ({ color, index }: { color: string, index: number }) => {
    // Deterministic random-looking path
    const points = [
        [0, 20], [10, 15], [20, 25], [30, 10], [40, 18], [50, 5], 
        [60, 20], [70, 12], [80, 22], [90, 8], [100, 15]
    ].map(([x, y]) => {
        const offset = (Math.sin(index + x) * 5);
        return `${x},${y + offset}`;
    }).join(' ');

    return (
        <svg viewBox="0 0 100 30" className={`w-full h-8 mt-4 opacity-50 ${color}`}>
            <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    );
};

export default function AnalyticsCards() {
    const supabase = createClient();
    const { activeOrganization, loading: orgLoading } = useOrganization();
    const [data, setData] = useState<AnalyticsData>({ total: 0, open: 0, closed: 0, today: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!activeOrganization) {
                setLoading(false);
                return;
            }
            setLoading(true);

            const queries = [
                supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('organization_id', activeOrganization.id),
                supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('organization_id', activeOrganization.id).eq('status', 'open'),
                supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('organization_id', activeOrganization.id).eq('status', 'closed')
            ];

            const [totalRes, openRes, closedRes] = await Promise.all(queries);

            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const { count: todayCount } = await supabase
                .from('tickets')
                .select('*', { count: 'exact', head: true })
                .eq('organization_id', activeOrganization.id)
                .gte('created_at', startOfToday.toISOString());

            setData({
                total: totalRes.count || 0,
                open: openRes.count || 0,
                closed: closedRes.count || 0,
                today: todayCount || 0
            });

            setLoading(false);
        };

        if (!orgLoading) fetchAnalytics();
    }, [activeOrganization, orgLoading, supabase]);

    if (orgLoading || loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="p-6 h-44 flex flex-col justify-between border-slate-800/40">
                        <div className="flex justify-between items-start">
                             <Skeleton className="w-10 h-10 rounded-xl" />
                             <Skeleton className="w-16 h-5 rounded-lg opacity-50" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="w-12 h-8 rounded-lg" />
                            <Skeleton className="w-full h-8 rounded-lg opacity-20" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: 'Nexus Load',
            value: data.total,
            label: 'Aggregate',
            icon: Ticket,
            color: 'from-blue-500/20 to-indigo-500/20',
            textColor: 'text-indigo-400',
            bg: 'bg-indigo-500/10'
        },
        {
            title: 'Active Protocols',
            value: data.open,
            label: 'Live Ops',
            icon: Clock,
            color: 'from-amber-500/20 to-orange-500/20',
            textColor: 'text-amber-400',
            bg: 'bg-amber-500/10'
        },
        {
            title: 'Resolved Syncs',
            value: data.closed,
            label: 'Stability',
            icon: CheckCircle2,
            color: 'from-emerald-500/20 to-teal-500/20',
            textColor: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
        {
            title: 'New Transmissions',
            value: data.today,
            label: 'Daily',
            icon: CalendarDays,
            color: 'from-violet-500/20 to-purple-500/20',
            textColor: 'text-purple-400',
            bg: 'bg-purple-500/10'
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
            {cards.map((card, idx) => (
                <motion.div key={idx} variants={item}>
                    <Card className="p-6 h-full flex flex-col justify-between border-slate-800/40 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-2.5 rounded-xl ${card.bg} ${card.textColor} ring-1 ring-inset ring-white/5 shadow-inner`}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest ${card.textColor} px-2 py-1 rounded-lg bg-white/5 border border-white/5`}>
                                {card.label}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-white tracking-tight">{card.value}</h3>
                                {card.value > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 mb-1">
                                        <TrendingUp className="w-2.5 h-2.5" />
                                        <span>+Sync</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{card.title}</p>
                        </div>

                        <Sparkline color={card.textColor} index={idx} />

                        {/* Visual accent */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} blur-[60px] -mr-12 -mt-12 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none`} />
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}

