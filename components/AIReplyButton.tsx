'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface AIReplyButtonProps {
    ticketId: string;
    organizationId: string;
    onReplyGenerated: (text: string) => void;
}

export default function AIReplyButton({ ticketId, organizationId, onReplyGenerated }: AIReplyButtonProps) {
    const [loading, setLoading] = useState(false);

    const generateReply = async () => {
        setLoading(true);
        const toastId = toast.loading('Consulting Digital Intelligence...', {
            description: 'Analyzing conversation context for the perfect reply.',
        });

        try {
            const res = await fetch('/api/ai/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, organizationId })
            });
            const data = await res.json();
            
            if (!res.ok) {
                 throw new Error(data.error || 'The digital entity is currently over capacity.');
            }
            
            toast.success('Reply Synthesized', {
                id: toastId,
                description: 'The AI has formulated a professional response.',
            });
            
            onReplyGenerated(data.reply);
        } catch (err: any) {
            toast.error('Synthesis Failed', {
                id: toastId,
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={generateReply}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer group"
        >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />}
            {loading ? 'Synthesizing...' : 'Draft AI Reply'}
        </motion.button>
    );
}
