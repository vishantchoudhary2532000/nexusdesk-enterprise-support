'use client';

import UsageLimitBanner from '../../components/UsageLimitBanner';
import AnalyticsCards from '../../components/AnalyticsCards';
import ActivityTimeline from '../../components/ActivityTimeline';
import { motion } from 'framer-motion';

export default function DashboardOverviewPage() {
    return (
        <div className="space-y-12 pb-12">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-8 bg-indigo-500/50" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Operational Intelligence</span>
                </div>
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                >
                    Engineering <span className="text-indigo-500">Analytics</span>
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 mt-4 text-lg font-medium max-w-2xl leading-relaxed"
                >
                    High-fidelity system monitoring and objective resolution tracking. <span className="text-slate-600">Refining organizational performance through neural analysis.</span>
                </motion.p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <UsageLimitBanner />
            </motion.div>

            <AnalyticsCards />

            <div className="mx-auto max-w-7xl mt-12">
                <ActivityTimeline />
            </div>
        </div>
    );
}
