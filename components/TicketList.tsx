'use client';

import { useEffect, useState, useCallback, MouseEvent } from 'react';
import { createClient } from '../lib/supabaseClient';
import { Paperclip, MessageSquare, Trash2, Edit2, Loader2, FilterX } from 'lucide-react';
import TicketFilters from './TicketFilters';
import ConfirmModal from './ConfirmModal';
import CustomSelect from './CustomSelect';
import EditTicketModal from './EditTicketModal';
import { useOrganization } from './OrganizationProvider';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Skeleton from './ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const statusOptions = [
    { label: 'Open', value: 'open' },
    { label: 'Pending', value: 'pending' },
    { label: 'Closed', value: 'closed' }
];

interface Ticket {
    id: string;
    title: string;
    description: string;
    priority: string;
    category: string;
    status: string;
    attachment_url: string | null;
    created_at: string;
}

export default function TicketList({ refreshTrigger, viewMode = 'personal' }: { refreshTrigger: number, viewMode?: 'personal' | 'admin' }) {
    const supabase = createClient();
    const { activeOrganization, loading: orgLoading } = useOrganization();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

    // Filters and Sorting State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const fetchTickets = useCallback(async () => {
        if (!activeOrganization) {
            setLoading(false);
            return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        let query = supabase
            .from('tickets')
            .select('*')
            .eq('organization_id', activeOrganization.id);

        if (viewMode === 'personal') {
            query = query.eq('user_id', user.id);
        }

        const { data, error } = await query;

        if (!error && data) {
            setTickets(data);
        }
        setLoading(false);
    }, [activeOrganization, viewMode, supabase]);

    useEffect(() => {
        if (!orgLoading) fetchTickets();
    }, [fetchTickets, refreshTrigger, orgLoading]);

    useEffect(() => {
        let subscription: any = null;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || !activeOrganization) return;

            const filterStr = viewMode === 'personal'
                ? `user_id=eq.${user.id}`
                : `organization_id=eq.${activeOrganization.id}`;

            subscription = supabase
                .channel('public:tickets')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'tickets', filter: filterStr },
                    () => fetchTickets()
                )
                .subscribe();
        };

        setupRealtime();

        return () => {
            if (subscription) supabase.removeChannel(subscription);
        };
    }, [fetchTickets, activeOrganization, viewMode, supabase]);

    const handleStatusChange = async (newStatus: string, ticketId: string) => {
        setUpdatingStatusId(ticketId);

        await supabase
            .from('tickets')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', ticketId);

        setUpdatingStatusId(null);
        fetchTickets();
    };

    const handleDeleteRequest = (e: MouseEvent, ticketId: string) => {
        e.stopPropagation();
        setShowDeleteConfirm(ticketId);
    };

    const handleConfirmDelete = async () => {
        if (!showDeleteConfirm) return;
        setDeletingId(showDeleteConfirm);
        await supabase.from('tickets').delete().eq('id', showDeleteConfirm);
        setDeletingId(null);
        setShowDeleteConfirm(null);
        fetchTickets();
    };

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            default: return 'indigo';
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'closed': return 'default';
            case 'pending': return 'warning';
            default: return 'success';
        }
    };

    let filteredTickets = tickets.filter(t => {
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
        if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    filteredTickets.sort((a, b) => {
        if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        if (sortBy === 'priority') {
            const p = { high: 3, medium: 2, low: 1 };
            return (p[b.priority as keyof typeof p] || 0) - (p[a.priority as keyof typeof p] || 0);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    if (loading) {
        return (
            <Card className="p-0 border-slate-800/40">
                <div className="px-6 py-5 border-b border-slate-800/40">
                    <Skeleton className="w-48 h-6" />
                </div>
                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-4 items-center">
                            <Skeleton className="w-1/2 h-5" />
                            <Skeleton className="w-20 h-5" />
                            <Skeleton className="w-20 h-5" />
                            <Skeleton className="w-24 h-8 ml-auto" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <TicketFilters
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter}
                sortBy={sortBy} setSortBy={setSortBy}
            />

            <Card className="p-0 border-white/[0.05] overflow-hidden flex flex-col min-h-[500px] bg-[#0f172a]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl relative">
                {/* Ambient Queue Glow */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -ml-32 -mt-32 pointer-events-none" />

                <div className="px-10 py-7 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between relative z-10">
                    <div>
                        <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tighter uppercase mb-1">
                            Active Transmission Queue
                            <Badge variant="indigo" className="ml-1 px-3 py-1 bg-indigo-500/10 border-indigo-500/20 text-indigo-400 rounded-lg text-[10px] font-black">
                                {filteredTickets.length}
                            </Badge>
                        </h2>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Queue Node: Alpha-7 / Support Cluster</p>
                    </div>
                </div>

                {filteredTickets.length === 0 ? (
                    <div className="flex-1 p-20 text-center flex flex-col items-center justify-center">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-slate-900/60 p-8 rounded-[3rem] border border-white/[0.05] mb-8 shadow-2xl"
                        >
                            <FilterX className="w-12 h-12 text-slate-600" />
                        </motion.div>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Silence in the queue</h3>
                        <p className="mt-2 text-slate-500 max-w-sm font-medium leading-relaxed">No transmissions detected on the current frequency. Adjust your lens or initialize new protocols.</p>
                        <Button variant="outline" size="sm" className="mt-8 rounded-2xl px-8 py-6 text-[11px] font-black uppercase tracking-widest bg-white/5 border-white/10 hover:bg-white/10 transition-all" onClick={() => {
                            setSearchQuery(''); setStatusFilter('all'); setPriorityFilter('all');
                        }}>
                           Reset Frequency
                        </Button>
                    </div>
                ) : (
                    <div className="flex-1 w-full overflow-x-auto custom-scrollbar relative z-10">
                        <table className="w-full table-fixed divide-y divide-white/[0.03]">
                            <thead className="bg-[#0b0f19]/40">
                                <tr>
                                    <th scope="col" className="w-[40%] px-10 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Objective / Trace ID</th>
                                    <th scope="col" className="w-[15%] px-4 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hidden sm:table-cell">State</th>
                                    <th scope="col" className="w-[15%] px-4 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hidden lg:table-cell">Criticality</th>
                                    <th scope="col" className="w-[15%] px-4 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hidden lg:table-cell">Logged At</th>
                                    <th scope="col" className="w-[15%] px-4 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pr-10">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                <AnimatePresence mode="popLayout">
                                    {filteredTickets.map((ticket, idx) => {
                                        const traceId = `#TR-${ticket.id.slice(0, 3)}-${ticket.id.slice(-2)}`.toUpperCase();
                                        const statusLabel = ticket.status === 'open' ? 'Operational' : ticket.status === 'pending' ? 'Idle State' : 'Finalized';
                                        const priorityLabel = ticket.priority === 'high' ? 'Critical' : ticket.priority === 'medium' ? 'Nominal' : 'Routine';

                                        return (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ delay: idx * 0.03, duration: 0.4 }}
                                                key={ticket.id}
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="hover:bg-white/[0.02] transition-all duration-300 group cursor-pointer relative"
                                            >
                                                <td className="px-10 py-6 overflow-hidden align-middle">
                                                    <div className="text-[15px] font-black text-white group-hover:text-indigo-400 transition-colors mb-1.5 truncate tracking-tight">{ticket.title}</div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{traceId}</span>
                                                        <span className="w-1 h-1 rounded-full bg-slate-800" />
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{ticket.category || 'General'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6 whitespace-nowrap align-middle hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            ticket.status === 'open' ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                            ticket.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'
                                                        }`} />
                                                        <span className={`text-[11px] font-black uppercase tracking-widest ${
                                                            ticket.status === 'open' ? 'text-emerald-400' :
                                                            ticket.status === 'pending' ? 'text-amber-400' : 'text-slate-500'
                                                        }`}>
                                                            {statusLabel}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6 whitespace-nowrap align-middle hidden lg:table-cell">
                                                    <Badge variant={getPriorityVariant(ticket.priority) as any} className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border-white/5 bg-white/[0.02]">
                                                        {priorityLabel}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-6 whitespace-nowrap text-[12px] font-black text-slate-500 align-middle hidden lg:table-cell tracking-tighter uppercase">
                                                    {new Date(ticket.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-6 whitespace-nowrap align-middle text-right pr-10">
                                                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" title="View Transmission" className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-indigo-500/10 hover:text-indigo-400 transition-all border border-transparent hover:border-indigo-500/20" onClick={() => (window.location.href = `/dashboard/tickets/${ticket.id}`)}>
                                                            <MessageSquare className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="Protocol Override" className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 hover:text-emerald-400 transition-all border border-transparent hover:border-emerald-500/20" onClick={() => setEditingTicket(ticket)}>
                                                            <Edit2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" title="Terminate" className="w-9 h-9 rounded-xl bg-white/[0.03] hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-transparent hover:border-rose-500/20" onClick={(e) => handleDeleteRequest(e, ticket.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Selection Modal (Refined) */}
            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" onClick={() => setSelectedTicket(null)}>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-10 py-8 border-b border-slate-800/50 flex justify-between items-start">
                                <div>
                                    <Badge variant="indigo" className="mb-3">{selectedTicket.category || 'general'}</Badge>
                                    <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">{selectedTicket.title}</h3>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedTicket(null)} className="rounded-full bg-slate-800/50 hover:bg-slate-800">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-10">
                                <div className="flex gap-4 mb-8">
                                    <Badge variant={getStatusVariant(selectedTicket.status) as any} className="px-4 py-1.5 rounded-xl">
                                        Status: {selectedTicket.status}
                                    </Badge>
                                    <Badge variant={getPriorityVariant(selectedTicket.priority) as any} className="px-4 py-1.5 rounded-xl">
                                        Priority: {selectedTicket.priority}
                                    </Badge>
                                </div>

                                <div className="mb-8">
                                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Description</h5>
                                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/30 text-slate-300 text-base leading-relaxed max-h-[240px] overflow-y-auto custom-scrollbar">
                                        {selectedTicket.description}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="primary" className="flex-1 rounded-2xl" onClick={() => (window.location.href = `/dashboard/tickets/${selectedTicket.id}`)}>
                                        Open Chat Thread
                                    </Button>
                                    {selectedTicket.attachment_url && (
                                        <Button variant="secondary" className="rounded-2xl" onClick={() => window.open(selectedTicket.attachment_url!, '_blank')}>
                                            <Paperclip className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <EditTicketModal
                ticket={editingTicket}
                isOpen={!!editingTicket}
                onClose={() => setEditingTicket(null)}
                onSuccess={() => fetchTickets()}
            />

            <ConfirmModal
                isOpen={!!showDeleteConfirm}
                title="Delete Ticket"
                message="Are you sure you want to delete this ticket? This action cannot be undone and all associated messages and files will be permanently removed."
                loading={deletingId !== null}
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteConfirm(null)}
            />
        </div>
    );
}

function X(props: any) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );
}
