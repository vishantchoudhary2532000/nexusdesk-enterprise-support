'use client';

import { useState } from 'react';
import { Loader2, X, Mail } from 'lucide-react';
import CustomSelect from './CustomSelect';

const roleOptions = [
    { label: 'Member', value: 'member' },
    { label: 'Admin', value: 'admin' },
];

interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationId: string;
    onSuccess: () => void;
}

export default function InviteMemberModal({ isOpen, onClose, organizationId, onSuccess }: InviteMemberModalProps) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role, organization_id: organizationId })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send invite');
            }

            setEmail('');
            setRole('member');
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <div className="bg-violet-100 p-1.5 rounded-lg">
                            <Mail className="w-4 h-4 text-violet-700" />
                        </div>
                        Invite Team Member
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-3">
                            <div className="bg-red-100 p-1 rounded-full shrink-0 mt-0.5">
                                <X className="w-3 h-3 text-red-600" />
                            </div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="colleague@company.com"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 hover:border-slate-300 transition-all text-sm text-slate-900 placeholder:text-slate-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative z-20">
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assign Role</label>
                            <CustomSelect
                                value={role}
                                onChange={setRole}
                                options={roleOptions}
                                className="px-4 py-3"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Admins can manage tickets and assignments. Members can only create tickets.
                            </p>
                        </div>

                        <div className="pt-2 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-violet-200 flex items-center disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                {loading ? 'Sending Invite...' : 'Send Invitation'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
