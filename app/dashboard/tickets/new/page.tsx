'use client';

import TicketForm from '../../../../components/TicketForm';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewTicketPage() {
    return (
        <div className="max-w-3xl mx-auto py-4">
            <header className="mb-6 flex items-center justify-between">
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-black text-white tracking-tighter"
                >
                    New <span className="text-indigo-500">Request</span>
                </motion.h2>

                <Link 
                    href="/dashboard/tickets" 
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors group"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Back to Hub</span>
                </Link>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <TicketForm className="shadow-2xl shadow-indigo-500/5" />
            </motion.div>
        </div>
    );
}
