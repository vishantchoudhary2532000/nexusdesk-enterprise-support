'use client';

import { useState, useEffect } from 'react';
import { X, Edit3, Zap } from 'lucide-react';
import { createClient } from '../lib/supabaseClient';
import CustomSelect from './CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Input from './ui/Input';
import { toast } from 'sonner';

interface Ticket {
    id: string;
    title: string;
    description: string;
    priority: string;
    category: string;
    status: string;
}

interface EditTicketModalProps {
    ticket: Ticket | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const categoryOptions = [
    { label: 'General Inquiry', value: 'general' },
    { label: 'Bug Report', value: 'bug' },
    { label: 'Feature Request', value: 'feature' },
    { label: 'Billing', value: 'billing' }
];

const priorityOptions = [
    { label: 'Low priority', value: 'low' },
    { label: 'Medium priority', value: 'medium' },
    { label: 'URGENT / HIGH', value: 'high' }
];

export default function EditTicketModal({ ticket, isOpen, onClose, onSuccess }: EditTicketModalProps) {
    const supabase = createClient();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [category, setCategory] = useState('general');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ticket) {
            setTitle(ticket.title);
            setDescription(ticket.description);
            setPriority(ticket.priority);
            setCategory(ticket.category || 'general');
        }
    }, [ticket]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticket) return;
        setLoading(true);

        try {
            const { error: updateError } = await supabase
                .from('tickets')
                .update({
                    title,
                    description,
                    priority,
                    category,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', ticket?.id);

            if (updateError) throw updateError;

            toast.success('System Records Updated');
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error('Sync Error', { description: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && ticket && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/50 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 glow-indigo"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="px-10 py-8 border-b border-slate-800/50 flex justify-between items-center bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                    <Edit3 className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Modify Objective</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ticket ID: {ticket.id.slice(0, 8)}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-3 text-slate-500 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </header>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 gap-8">
                                <Input 
                                    label="Subject Identifier"
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Brief technical summary..."
                                    required
                                />

                                <Input 
                                    label="Detailed Parameters"
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Full context for the support core..."
                                    multiline
                                    rows={5}
                                    required
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Classification</label>
                                        <CustomSelect
                                            value={category}
                                            onChange={setCategory}
                                            options={categoryOptions}
                                            className="h-12 border-slate-800 bg-slate-900/50"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Severity Protocol</label>
                                        <CustomSelect
                                            value={priority}
                                            onChange={setPriority}
                                            options={priorityOptions}
                                            className="h-12 border-slate-800 bg-slate-900/50"
                                            variant={priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'indigo'}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row gap-4">
                                <Button 
                                    variant="secondary" 
                                    className="flex-1 rounded-2xl h-14" 
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    Abort
                                </Button>
                                <Button 
                                    variant="primary" 
                                    className="flex-1 rounded-2xl h-14" 
                                    type="submit"
                                    loading={loading}
                                >
                                    Push Updates
                                </Button>
                            </div>
                        </form>
                        
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <Zap className="w-40 h-40 text-indigo-500" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
