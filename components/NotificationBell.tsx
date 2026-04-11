'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, Check, Loader2, Sparkles, Zap } from 'lucide-react';
import { createClient } from '../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Notification {
    id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationBell() {
    const supabase = createClient();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (data) setNotifications(data);
    };

    useEffect(() => {
        fetchNotifications();

        let subscription: any = null;
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) return;
            subscription = supabase
                .channel('public:notifications')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                    () => {
                        fetchNotifications();
                        // Trigger a subtle toast for background notification
                        toast.info('System Alert', { description: 'New protocol message received.' });
                    }
                )
                .subscribe();
        });

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (subscription) supabase.removeChannel(subscription);
        };
    }, []);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const markAsRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const markAllAsRead = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        toast.success('Clearance complete', { description: 'All alerts marked as secondary.' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-xl transition-all border outline-none ${isOpen 
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600'
                }`}
            >
                <Bell className="w-5 h-5" />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span 
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0b101b] shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                        />
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-4 w-80 sm:w-[400px] bg-slate-900/90 backdrop-blur-2xl rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden z-[100]"
                    >
                        <header className="px-6 py-5 border-b border-slate-800/60 flex justify-between items-center bg-white/[0.02]">
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                    Alert Stream
                                    {unreadCount > 0 && <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg">{unreadCount}</span>}
                                </h3>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time System Logs</p>
                            </div>
                            {unreadCount > 0 && (
                                <button onClick={markAllAsRead} className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors cursor-pointer">
                                    Purge All
                                </button>
                            )}
                        </header>

                        <div className="max-h-[440px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-16 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-slate-800/50 rounded-[1.5rem] flex items-center justify-center mb-6 border border-slate-700/30">
                                        <Bell className="w-6 h-6 text-slate-600" />
                                    </div>
                                    <p className="text-sm font-bold text-white tracking-tight">Signal silence</p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">No system alerts detected in this cycle.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-800/40">
                                    {notifications.map((notification, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            key={notification.id}
                                            className={`p-6 transition-all group relative overflow-hidden ${notification.is_read ? 'bg-transparent opacity-60' : 'bg-indigo-500/5'}`}
                                        >
                                            <div className="flex gap-4 relative z-10">
                                                {!notification.is_read && (
                                                    <div className="mt-1.5 shrink-0">
                                                        <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className={`text-[13px] truncate pr-4 ${notification.is_read ? 'font-semibold text-slate-400' : 'font-bold text-white'}`}>{notification.title}</h4>
                                                        <div className="text-[9px] font-bold text-slate-600 tabular-nums uppercase whitespace-nowrap">
                                                            {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                    <p className="text-[12px] text-slate-500 font-medium leading-relaxed line-clamp-2">{notification.message}</p>
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                                            <Zap className="w-2.5 h-2.5" />
                                                            Priority Alpha
                                                        </div>
                                                        {!notification.is_read && (
                                                            <button
                                                                onClick={(e) => markAsRead(notification.id, e)}
                                                                className="text-[10px] font-black text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:underline uppercase tracking-widest"
                                                            >
                                                                Acknowledge
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {!notification.is_read && <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <footer className="px-6 py-4 bg-slate-900 border-t border-slate-800/60 flex items-center justify-center">
                             <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors">View Secure Logs</button>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
