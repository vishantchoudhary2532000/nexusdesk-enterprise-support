'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, Paperclip, X } from 'lucide-react';
import { createClient } from '../lib/supabaseClient';
import AttachmentUploader from './AttachmentUploader';
import { generateTicketSummary } from '../lib/ticketSummary';
import { useOrganization } from './OrganizationProvider';
import AIReplyButton from './AIReplyButton';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

interface MessageInputProps {
    ticketId: string;
}

export default function MessageInput({ ticketId }: MessageInputProps) {
    const supabase = createClient();
    const { activeOrganization } = useOrganization();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`;
        }
    }, [message]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!message.trim() && !attachmentUrl) return;

        setLoading(true);
        const currentMessage = message.trim();
        const currentAttachment = attachmentUrl;
        
        // Optimistic clear (to prevent double send and fulfill user request)
        setMessage('');
        setAttachmentUrl(null);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not logged in');

            const { error } = await supabase
                .from('ticket_messages')
                .insert([{
                    ticket_id: ticketId,
                    user_id: user.id,
                    message: currentMessage,
                    attachment_url: currentAttachment
                }]);

            if (error) throw error;

            // Fetch messages for summary (async)
            const { data: messages } = await supabase
                .from('ticket_messages')
                .select('*')
                .eq('ticket_id', ticketId)
                .order('created_at', { ascending: true });

            const { data: ticketReq } = await supabase.from('tickets').select('status, organization_id, user_id, assigned_to').eq('id', ticketId).single();
            
            const isAgent = activeOrganization?.role === 'admin' || activeOrganization?.role === 'owner';
            const newStatus = isAgent ? 'pending' : 'open';
            const newSummary = generateTicketSummary(messages || [], newStatus);

            await supabase
                .from('tickets')
                .update({
                    updated_at: new Date().toISOString(),
                    summary: newSummary,
                    status: newStatus
                })
                .eq('id', ticketId);

            // Notification logic
            let targetUserId = null;
            if (isAgent) {
                targetUserId = ticketReq?.user_id;
            } else {
                targetUserId = ticketReq?.assigned_to;
                if (!targetUserId && ticketReq) {
                    const { data: owner } = await supabase.from('organization_members')
                        .select('user_id')
                        .eq('organization_id', ticketReq.organization_id)
                        .in('role', ['owner', 'admin'])
                        .neq('user_id', user.id)
                        .limit(1)
                        .maybeSingle();
                    targetUserId = owner?.user_id;
                }
            }

            if (targetUserId && targetUserId !== user.id) {
                await supabase.from('notifications').insert({
                    user_id: targetUserId,
                    title: 'New Response Protocol',
                    message: `A transmission has been logged on ticket ${ticketId.slice(0, 8)}.`,
                });
            }

            if (ticketReq?.organization_id) {
                await supabase.from('activity_logs').insert({
                    organization_id: ticketReq.organization_id,
                    user_id: user.id,
                    action: 'message_sent',
                    entity_type: 'ticket',
                    entity_id: ticketId
                });
            }
        } catch (error) {
            console.error('Transmission failed:', error);
            // Revert on failure
            setMessage(currentMessage);
            setAttachmentUrl(currentAttachment);
        } finally {
            setLoading(false);
        }
    };

    const handleAIReply = (text: string) => {
        // Fix: Don't append, replace or clear first as per user's request.
        // User wants the "previous data empty" when AI reply is generated.
        setMessage(text);
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    };

    return (
        <form onSubmit={handleSend} className="max-w-5xl mx-auto">
            <div className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                    {activeOrganization?.id && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-between items-center px-2"
                        >
                            <div className="flex items-center gap-2 group cursor-default">
                                <Sparkles className="w-3 h-3 text-indigo-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">Neural Intelligence Enabled</span>
                            </div>
                            <AIReplyButton 
                                ticketId={ticketId} 
                                organizationId={activeOrganization.id} 
                                onReplyGenerated={handleAIReply}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-4 items-end relative">
                    <div className="shrink-0 mb-1.5">
                        <AttachmentUploader
                            ticketId={ticketId}
                            onUploadComplete={setAttachmentUrl}
                            onReset={() => setAttachmentUrl(null)}
                        />
                    </div>

                    <div className="flex-1 relative group">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Input Transmission..."
                            className="w-full bg-[#0a0e1a]/60 backdrop-blur-3xl border border-white/[0.05] rounded-[2rem] px-8 py-5 outline-none resize-none text-[15px] placeholder:text-slate-600 max-h-[250px] overflow-y-auto custom-scrollbar block text-slate-200 font-medium leading-relaxed transition-all focus:border-indigo-500/30 shadow-2xl shadow-indigo-500/5 group-hover:border-white/10"
                        />
                        
                        {/* Attachment indicator if present */}
                        <AnimatePresence>
                            {attachmentUrl && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, x: 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, x: 10 }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest py-1.5 px-4 rounded-xl flex items-center gap-2 shadow-2xl border border-emerald-500/20 backdrop-blur-xl"
                                >
                                    <Paperclip className="w-3 h-3" />
                                    <span>Resource Encrypted</span>
                                    <button onClick={(e) => { e.stopPropagation(); setAttachmentUrl(null); }} className="ml-1 hover:text-emerald-300 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || (!message.trim() && !attachmentUrl)}
                        className="mb-1.5 h-[64px] px-8 shrink-0 bg-gradient-to-br from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white rounded-2xl transition-all disabled:opacity-20 disabled:grayscale disabled:pointer-events-none shadow-2xl shadow-indigo-500/20 border border-white/20 flex items-center justify-center gap-3 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Dispatch</span>
                                <Send className="w-4 h-4 translate-x-0.5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>
                </div>

                <div className="flex items-center gap-6 px-8 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] cursor-default mb-2">
                    <div className="flex items-center gap-2 group">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="group-hover:text-slate-400 transition-colors">Feed Status: Operational</span>
                    </div>
                    <span className="opacity-10 w-px h-3 bg-white" />
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                        <span>Encryption: Nexus-Grade E2E</span>
                    </div>
                </div>
            </div>
        </form>
    );
}
