'use client';

import { useState } from 'react';
import TicketForm from '../../../components/TicketForm';
import TicketList from '../../../components/TicketList';
import { motion } from 'framer-motion';

export default function TicketsPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleTicketCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="space-y-10 pb-12">
            <header className="mb-10">
                <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-white tracking-tight"
                >
                    Support Hub
                </motion.h2>
                <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 mt-2 text-lg font-medium"
                >
                    Track, manage, and resolve customer inquiries with precision.
                </motion.p>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 items-start">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="xl:col-span-1"
                >
                    <TicketForm onTicketCreated={handleTicketCreated} />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="xl:col-span-3"
                >
                    <TicketList refreshTrigger={refreshTrigger} />
                </motion.div>
            </div>
        </div>
    );
}
