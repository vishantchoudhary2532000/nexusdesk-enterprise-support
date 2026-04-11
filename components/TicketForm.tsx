'use client';

import { useState } from 'react';
import { createClient } from '../lib/supabaseClient';
import { useOrganization } from './OrganizationProvider';
import { Paperclip, Loader2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';
import Input from './ui/Input';
import Card from './ui/Card';
import { toast } from 'sonner';

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

export default function TicketForm({ onTicketCreated }: { onTicketCreated: () => void }) {
    const supabase = createClient();
    const { activeOrganization } = useOrganization();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [category, setCategory] = useState('general');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading('Initializing Ticket Protocoal...', {
            description: 'Encrypting data and notifying team nexus.',
        });

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Neural identity not verified. Please log in.');
            }

            let attachment_url = null;

            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('support-files')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('support-files')
                    .getPublicUrl(filePath);

                attachment_url = publicUrlData.publicUrl;
            }

            const { data: createdTicket, error: insertError } = await supabase
                .from('tickets')
                .insert([
                    {
                        title,
                        description,
                        priority,
                        category,
                        user_id: user.id,
                        attachment_url,
                        organization_id: activeOrganization?.id
                    }
                ])
                .select()
                .single();
            if (insertError) throw insertError;

            // Usage and activity (async)
            if (activeOrganization) {
                const d = new Date();
                const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                
                const { data: usageData } = await supabase.from('usage_metrics').select('tickets_created').eq('organization_id', activeOrganization.id).eq('period', period).maybeSingle();
                if (usageData) {
                    await supabase.from('usage_metrics').update({ tickets_created: usageData.tickets_created + 1 }).eq('organization_id', activeOrganization.id).eq('period', period);
                } else {
                    await supabase.from('usage_metrics').insert({ organization_id: activeOrganization.id, period, tickets_created: 1 });
                }

                await supabase.from('activity_logs').insert({
                    organization_id: activeOrganization.id,
                    user_id: user.id,
                    action: 'ticket_created',
                    entity_type: 'ticket',
                    entity_id: createdTicket.id
                });
            }

            setTitle('');
            setDescription('');
            setPriority('low');
            setCategory('general');
            setFile(null);
            
            toast.success('Ticket Logged Successfully', {
                id: toastId,
                description: 'Support core has been alerted.',
            });
            
            onTicketCreated();
        } catch (err: any) {
            toast.error('Submission Failed', {
                id: toastId,
                description: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-10 border-slate-800/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
            
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                            <Plus className="w-6 h-6 text-indigo-400" />
                        </div>
                        Initialize Request
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2 ml-14">Secure Communication Protocol</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Enabled</span>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                <div className="grid grid-cols-1 gap-10">
                    <Input 
                        label="Objective Identifier"
                        placeholder="Brief summary of your requirements..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <Input 
                        label="Core Parameters"
                        placeholder="Provide comprehensive details for accurate processing..."
                        multiline
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Classification Type</label>
                             <CustomSelect
                                value={category}
                                onChange={setCategory}
                                options={categoryOptions}
                                className="h-14 border-slate-800 bg-slate-900/50"
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Urgency Matrix</label>
                             <CustomSelect
                                value={priority}
                                onChange={setPriority}
                                options={priorityOptions}
                                className="h-14 border-slate-800 bg-slate-900/50"
                                variant={priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'indigo'}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Append Resources (Optional)</label>
                        <div className="relative group/upload">
                            <input
                                type="file"
                                className="hidden"
                                id="header-file-upload"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <label
                                htmlFor="header-file-upload"
                                className={`w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all ${file ? 'border-indigo-500/50 bg-indigo-500/5 text-indigo-300' : 'border-slate-800 hover:border-indigo-500/30 hover:bg-slate-800/40 text-slate-500'}`}
                            >
                                <Paperclip className={`w-8 h-8 mb-4 ${file ? 'text-indigo-400' : 'text-slate-600 group-hover/upload:text-indigo-400'}`} />
                                <span className="text-sm font-bold tracking-tight text-center px-4">
                                    {file ? file.name : 'Drop supporting documentation or click to browse'}
                                </span>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-2">{file ? 'File analysis ready' : 'Max payload size: 25MB'}</p>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full h-16 rounded-[1.5rem] text-base"
                    >
                        Initialize Support Chain
                    </Button>
                    <div className="flex items-center justify-center gap-6 mt-6 opacity-30">
                        <div className="flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Real-time Sync</span>
                        </div>
                    </div>
                </div>
            </form>
        </Card>
    );
}
