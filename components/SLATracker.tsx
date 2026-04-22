'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Clock, AlertOctagon } from 'lucide-react';
import { getSLAStatus, formatRemainingTime, SLAHealth } from '../lib/slaUtils';

interface SLATrackerProps {
    deadline: string | null;
}

export default function SLATracker({ deadline }: SLATrackerProps) {
    const [status, setStatus] = useState(getSLAStatus(deadline));

    useEffect(() => {
        const timer = setInterval(() => {
            setStatus(getSLAStatus(deadline));
        }, 30000); // Update every 30 seconds

        return () => clearInterval(timer);
    }, [deadline]);

    const getHealthStyles = (health: SLAHealth) => {
        switch (health) {
            case 'breached':
                return {
                    bg: 'bg-rose-500/10 border-rose-500/20 shadow-rose-500/10',
                    text: 'text-rose-500',
                    icon: AlertOctagon,
                    glow: 'bg-rose-500'
                };
            case 'approaching':
                return {
                    bg: 'bg-amber-500/10 border-amber-500/20 shadow-amber-500/10',
                    text: 'text-amber-500',
                    icon: Clock,
                    glow: 'bg-amber-500'
                };
            default:
                return {
                    bg: 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10',
                    text: 'text-emerald-500',
                    icon: ShieldCheck,
                    glow: 'bg-emerald-500'
                };
        }
    };

    const styles = getHealthStyles(status.health);
    const Icon = styles.icon;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-[2rem] border backdrop-blur-3xl relative overflow-hidden group ${styles.bg}`}
        >
            {/* Background scanner pulse */}
            <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className={`absolute top-0 left-0 w-1/2 h-[1px] ${styles.glow} opacity-20`}
            />

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${styles.text}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80">{status.label}</h3>
                </div>
                {status.health === 'breached' && (
                    <motion.div 
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="px-3 py-1 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg"
                    >
                        SLA Breach
                    </motion.div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Time to Violation</p>
                        <h4 className={`text-2xl font-black tracking-widest tabular-nums ${styles.text}`}>
                            {formatRemainingTime(status.remainingMinutes)}
                        </h4>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Status</p>
                        <p className="text-xs font-bold text-white uppercase tracking-tight">Active Sync</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.max(0, (status.remainingMinutes / (24 * 60)) * 100))}%` }}
                        className={`h-full ${styles.glow} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                    />
                </div>
            </div>

            {/* Visual elements */}
            <div className={`absolute -bottom-4 -right-4 w-24 h-24 blur-3xl opacity-10 rounded-full ${styles.glow}`} />
        </motion.div>
    );
}
