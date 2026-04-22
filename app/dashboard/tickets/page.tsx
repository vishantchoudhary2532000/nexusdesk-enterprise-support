'use client';

import { useState } from 'react';
import TicketList from '../../../components/TicketList';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Button from '../../../components/ui/Button';

export default function TicketsPage() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleTicketCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="space-y-10 pb-12">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
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
                </div>
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/dashboard/tickets/new">
                        <Button
                            variant="primary"
                            leftIcon={<Plus className="w-4 h-4" />}
                            className="h-14 px-8"
                        >
                            Initialize Request
                        </Button>
                    </Link>
                </motion.div>
            </header>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full"
            >
                <TicketList refreshTrigger={refreshTrigger} />
            </motion.div>
        </div>
    );
}
