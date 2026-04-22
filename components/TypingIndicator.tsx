'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool } from 'lucide-react';

interface TypingUser {
    user_id: string;
    full_name: string;
}

interface TypingIndicatorProps {
    ticketId: string;
}

export default function TypingIndicator({ ticketId }: TypingIndicatorProps) {
    const supabase = createClient();
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

    useEffect(() => {
        const channel = supabase.channel(`ticket:typing:${ticketId}`);

        channel
            .on('broadcast', { event: 'typing' }, ({ payload }) => {
                const { user_id, full_name, is_typing } = payload;
                setTypingUsers((prev) => {
                    if (is_typing) {
                        if (prev.find(u => u.user_id === user_id)) return prev;
                        return [...prev, { user_id, full_name }];
                    } else {
                        return prev.filter(u => u.user_id !== user_id);
                    }
                });
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [ticketId, supabase]);

    return (
        <div className="h-6 flex items-center">
            <AnimatePresence>
                {typingUsers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="flex items-center gap-2 px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10 backdrop-blur-3xl shadow-lg"
                    >
                        <PenTool className="w-3 h-3 text-indigo-400 animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {typingUsers.length === 1 
                                ? `${typingUsers[0].full_name} is drafting...`
                                : `${typingUsers.length} users are drafting...`
                            }
                        </p>
                        
                        <div className="flex gap-0.5">
                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1 h-1 bg-indigo-500 rounded-full" />
                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-indigo-500 rounded-full" />
                            <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-indigo-500 rounded-full" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
