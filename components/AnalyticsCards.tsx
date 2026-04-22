'use client';

import { Ticket, CheckCircle2, Clock, CalendarDays, TrendingUp, Activity, Gauge } from 'lucide-react';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import { motion } from 'framer-motion';
import { fetchOrgTelemetry, fetchVolumeTrend, OrgTelemetry } from '../lib/analyticsService';
import { useEffect, useState } from 'react';
import { useOrganization } from './OrganizationProvider';

interface AnalyticsData {
    total: number;
    open: number;
    closed: number;
    today: number;
}

const Sparkline = ({ color, trend }: { color: string, trend: number[] }) => {
    // Transform trend data into SVG points (x: 0-100, y: 0-30)
    const maxVal = Math.max(...trend, 1);
    const points = trend.map((val, i) => {
        const x = (i / (trend.length - 1)) * 100;
        const y = 30 - (val / maxVal) * 25; // Keep 5px padding
        return `${x},${y}`;
    }).join(' ');

    return (
        <motion.svg 
            viewBox="0 0 100 30" 
            className={`w-full h-8 mt-4 opacity-50 ${color}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
        >
            <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </motion.svg>
    );
};

export default function AnalyticsCards() {
    const { activeOrganization, loading: orgLoading } = useOrganization();
    const [data, setData] = useState<OrgTelemetry | null>(null);
    const [trend, setTrend] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!activeOrganization) {
                setLoading(false);
                return;
            }
            setLoading(true);

            try {
                const [telemetry, volumeTrend] = await Promise.all([
                    fetchOrgTelemetry(activeOrganization.id),
                    fetchVolumeTrend(activeOrganization.id)
                ]);
                setData(telemetry);
                setTrend(volumeTrend);
            } catch (err) {
                console.error('[Analytics] Fetch failed:', err);
            } finally {
                setLoading(false);
            }
        };

        if (!orgLoading) fetchAnalytics();
    }, [activeOrganization, orgLoading]);

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
            title: 'Aggregate Load',
            value: data?.total || 0,
            label: 'Total Nexus',
            icon: Ticket,
            color: 'from-blue-500/20 to-indigo-500/20',
            textColor: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            suffix: ''
        },
        {
            title: 'Resolution Power',
            value: data?.resolution_rate || 0,
            label: 'Stability',
            icon: Gauge,
            color: 'from-emerald-500/20 to-teal-500/20',
            textColor: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            suffix: '%'
        },
        {
            title: 'Avg Response Latency',
            value: data?.avg_latency_hours || 0,
            label: 'Velocity',
            icon: Activity,
            color: 'from-amber-500/20 to-orange-500/20',
            textColor: 'text-amber-400',
            bg: 'bg-amber-500/10',
            suffix: 'h'
        },
        {
            title: 'Today\'s Transmissions',
            value: data?.today || 0,
            label: 'Telemetry',
            icon: CalendarDays,
            color: 'from-violet-500/20 to-purple-500/20',
            textColor: 'text-purple-400',
            bg: 'bg-purple-500/10',
            suffix: ''
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
                                <h3 className="text-4xl font-black text-white tracking-tight">
                                    {card.value}
                                    <span className="text-xl ml-1 opacity-50 font-bold">{card.suffix}</span>
                                </h3>
                                {card.value > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 mb-1">
                                        <TrendingUp className="w-2.5 h-2.5" />
                                        <span>Live</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">{card.title}</p>
                        </div>

                        <Sparkline color={card.textColor} trend={trend} />

                        {/* Visual accent */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} blur-[60px] -mr-12 -mt-12 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none`} />
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}

