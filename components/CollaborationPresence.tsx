'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, User as UserIcon } from 'lucide-react';

interface PresenceUser {
    user_id: string;
    full_name: string;
    role: string;
    avatar_url?: string;
    online_at: string;
}

interface CollaborationPresenceProps {
    ticketId: string;
}

export default function CollaborationPresence({ ticketId }: CollaborationPresenceProps) {
    const supabase = createClient();
    const [presenceUsers, setPresenceUsers] = useState<PresenceUser[]>([]);

    useEffect(() => {
        const channel = supabase.channel(`ticket:presence:${ticketId}`, {
            config: {
                presence: {
                    key: ticketId,
                },
            },
        });

        const initPresence = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch profile for accurate metadata
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .single();
            
            // Fetch role in org
            const { data: ticket } = await supabase.from('tickets').select('organization_id').eq('id', ticketId).single();
            let role = 'customer';
            if (ticket?.organization_id) {
                const { data: membership } = await supabase
                    .from('organization_members')
                    .select('role')
                    .eq('organization_id', ticket.organization_id)
                    .eq('user_id', user.id)
                    .single();
                if (membership) role = membership.role;
            }

            channel
                .on('presence', { event: 'sync' }, () => {
                    const state = channel.presenceState();
                    const users: PresenceUser[] = [];
                    
                    Object.keys(state).forEach((key) => {
                        (state[key] as any).forEach((presence: any) => {
                            users.push(presence);
                        });
                    });
                    
                    // Deduplicate by user_id
                    const uniqueUsers = Array.from(new Map(users.map(u => [u.user_id, u])).values());
                    setPresenceUsers(uniqueUsers);
                })
                .subscribe(async (status) => {
                    if (status === 'SUBSCRIBED') {
                        await channel.track({
                            user_id: user.id,
                            full_name: profile?.full_name || user.email?.split('@')[0] || 'Unknown User',
                            role: role,
                            avatar_url: profile?.avatar_url,
                            online_at: new Date().toISOString(),
                        });
                    }
                });
        };

        initPresence();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [ticketId, supabase]);

    if (presenceUsers.length <= 1) return null;

    return (
        <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl px-4 py-2 backdrop-blur-3xl shadow-2xl">
            <div className="flex items-center gap-2 mr-2">
                <div className="relative">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Collaboration Live</span>
            </div>

            <div className="flex -space-x-2">
                <AnimatePresence>
                    {presenceUsers.map((user) => (
                        <motion.div
                            key={user.user_id}
                            initial={{ opacity: 0, scale: 0.5, x: -10 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.5, x: 10 }}
                            title={`${user.full_name} (${user.role.toUpperCase()})`}
                            className="relative group"
                        >
                            <div className={`w-8 h-8 rounded-full border-2 p-0.5 overflow-hidden transition-all group-hover:z-10 group-hover:scale-110 ${
                                user.role === 'customer' 
                                ? 'border-emerald-500/30 bg-emerald-500/10' 
                                : 'border-indigo-500/30 bg-indigo-500/10'
                            }`}>
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {user.role === 'customer' ? <UserIcon className="w-4 h-4 text-emerald-400" /> : <Shield className="w-4 h-4 text-indigo-400" />}
                                    </div>
                                )}
                            </div>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                                <p className="text-[10px] font-bold text-white mb-0.5">{user.full_name}</p>
                                <p className={`text-[8px] font-black uppercase tracking-widest ${user.role === 'customer' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                                    {user.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
