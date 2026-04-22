'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { createClient } from '../lib/supabaseClient';
import { User, Paperclip, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from './ui/Badge';

interface Message {
    id: string;
    ticket_id: string;
    user_id: string;
    message: string;
    attachment_url: string | null;
    is_internal: boolean;
    created_at: string;
}

interface TicketConversationProps {
    ticketId: string;
}

export default function TicketConversation({ ticketId }: TicketConversationProps) {
    const supabase = createClient();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [roleMap, setRoleMap] = useState<Record<string, string>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback((smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }, []);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setCurrentUserId(user.id);

            // Fetch ticket to get org
            const { data: ticket } = await supabase.from('tickets').select('organization_id').eq('id', ticketId).single();
            if (ticket?.organization_id) {
                const { data: members } = await supabase.from('organization_members').select('user_id, role').eq('organization_id', ticket.organization_id);
                if (members) {
                    const rMap: Record<string, string> = {};
                    members.forEach(m => rMap[m.user_id] = m.role);
                    setRoleMap(rMap);
                }
            }

            const { data } = await supabase
                .from('ticket_messages')
                .select('*')
                .eq('ticket_id', ticketId)
                .order('created_at', { ascending: true });

            if (data) setMessages(data);
            setLoading(false);
            setTimeout(() => scrollToBottom(false), 100);
        };

        init();

        const subscription = supabase
            .channel(`ticket_messages:${ticketId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'ticket_messages', filter: `ticket_id=eq.${ticketId}` },
                (payload) => {
                    setMessages((prev) => {
                        // Avoid duplicates if local optimistic insert happened (though not yet implemented)
                        if (prev.find(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new as Message];
                    });
                    setTimeout(() => scrollToBottom(true), 100);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [ticketId, supabase, scrollToBottom]);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500/50" />
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Protocol Sync...</p>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-800/20 p-6 rounded-[2.5rem] border border-slate-700/20 mb-6 shadow-2xl"
                >
                    <User className="w-10 h-10 text-slate-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-white tracking-tight">Zero Transmission</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-[280px] leading-relaxed font-medium">No messages detected in this thread. Be the first to initialize communication.</p>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">
                    <Sparkles className="w-3 h-3" />
                    AI Ready for Summary
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="p-8 pb-32 space-y-8 max-w-4xl mx-auto w-full">
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => {
                        const isMine = msg.user_id === currentUserId;
                        const userRole = roleMap[msg.user_id] || 'member';
                        const isAgent = userRole === 'admin' || userRole === 'owner';
                        const roleLabel = isAgent ? 'Support Core' : 'Originator';

                        return (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className={`flex gap-5 ${isMine ? 'flex-row-reverse' : 'flex-row'} group relative`}
                            >
                                <div className={`shrink-0 w-12 h-12 rounded-[1.25rem] flex items-center justify-center border transition-all mt-6 ${isMine
                                        ? 'bg-gradient-to-br from-indigo-500 to-violet-600 border-white/20 shadow-xl shadow-indigo-500/20'
                                        : 'bg-slate-900 border-slate-800 text-slate-500 shadow-inner'
                                    }`}>
                                    <User className={`w-6 h-6 ${isMine ? 'text-white' : ''}`} />
                                </div>

                                <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                                    <div className={`flex items-center gap-3 mb-2.5 px-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className="flex items-center gap-2">
                                            {isMine ? (
                                                <Sparkles className={`w-3 h-3 ${msg.is_internal ? 'text-amber-400' : 'text-indigo-400'}`} />
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                            )}
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                                                msg.is_internal ? 'text-amber-500' : isMine ? 'text-indigo-400' : 'text-slate-500'
                                            }`}>
                                                {msg.is_internal ? 'Internal Support Log' : isMine ? 'Nexus Protocol Response' : 'Neural Identification'}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-black text-slate-700 tracking-widest tabular-nums uppercase">
                                            {new Date(msg.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                    
                                    <div className={`px-8 py-5 rounded-[2.25rem] text-[15px] leading-relaxed shadow-2xl border relative group-hover:shadow-black/60 transition-all duration-300 ${
                                            msg.is_internal 
                                            ? 'bg-amber-950/40 border-amber-500/30 text-amber-100 rounded-tr-none ring-1 ring-amber-500/10'
                                            : isMine
                                            ? 'bg-indigo-600 border-indigo-500/50 text-white rounded-tr-none'
                                            : 'bg-[#0f172a]/80 backdrop-blur-2xl border-white/[0.03] text-slate-200 rounded-tl-none shadow-inner'
                                        }`}>
                                        <p className="whitespace-pre-wrap break-words font-medium tracking-tight">{msg.message}</p>

                                        {msg.attachment_url && (
                                            <div className="mt-5 pt-5 border-t border-white/10">
                                                <button 
                                                    onClick={() => window.open(msg.attachment_url!, '_blank')}
                                                    className={`inline-flex items-center px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl ${isMine
                                                        ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                                        : 'bg-slate-950/40 text-indigo-400 hover:text-indigo-300 hover:bg-slate-950 border border-slate-800'
                                                    }`}>
                                                    <Paperclip className="w-3.5 h-3.5 mr-2.5" /> 
                                                    Secure Resource
                                                </button>
                                            </div>
                                        )}
                                        
                                        {/* Hidden metadata on hover */}
                                        <div className={`absolute -bottom-8 ${isMine ? 'right-2' : 'left-2'} opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0`}>
                                            <div className="flex items-center gap-3 text-[9px] font-black text-slate-600 uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 shadow-2xl">
                                                <span>Protocol: ECC-384</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                <span>Route: Primary-Node-A</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-4" />
            </div>
        </div>
    );
}
