'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '../lib/supabaseClient';
import { useOrganization } from './OrganizationProvider';
import { UserPlus, Shield, User, Loader2, MoreVertical, Trash2 } from 'lucide-react';
import InviteMemberModal from './InviteMemberModal';

interface Member {
    id: string;
    user_id: string;
    role: string;
    created_at: string;
    profiles?: {
        full_name: string;
    };
}

export default function TeamMembers() {
    const supabase = createClient();
    const { activeOrganization, loading: orgLoading } = useOrganization();
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const isOwner = activeOrganization?.role === 'owner';

    const fetchMembers = useCallback(async () => {
        if (!activeOrganization) {
            setLoading(false);
            return;
        }
        setLoading(true);

        const { data, error } = await supabase
            .from('organization_members')
            .select(`
                id,
                user_id,
                role,
                created_at
            `)
            .eq('organization_id', activeOrganization.id)
            .order('created_at', { ascending: true });

        if (!error && data) {
            const userIds = [...new Set(data.map((d: any) => d.user_id))];
            const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', userIds);
            const profilesMap = Object.fromEntries(profiles?.map(p => [p.id, p]) || []);

            const enriched = data.map((d: any) => ({
                ...d,
                profiles: profilesMap[d.user_id] || { full_name: 'Unknown User' }
            }));

            // @ts-ignore
            setMembers(enriched);
        }
        setLoading(false);
    }, [activeOrganization, supabase]);

    useEffect(() => {
        if (!orgLoading) fetchMembers();
    }, [fetchMembers, orgLoading]);

    const handleRemoveMember = async (memberId: string) => {
        if (!window.confirm('Remove this member from the organization?')) return;

        await supabase.from('organization_members').delete().eq('id', memberId);
        fetchMembers();
    };

    if (orgLoading || loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600 mb-4" />
                <p className="text-slate-500 font-medium">Loading team members...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        Team Directory
                        <span className="ml-2 bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full">{members.length}</span>
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">Manage access for {activeOrganization?.name}</p>
                </div>

                {isOwner && (
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite Member
                    </button>
                )}
            </div>

            <div className="divide-y divide-slate-100">
                {members.map((member) => (
                    <div key={member.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center shrink-0 border border-violet-200/50 shadow-sm">
                                <span className="text-violet-700 font-bold font-mono">
                                    {(member.profiles?.full_name || 'U').charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">{member.profiles?.full_name || 'Team Member'}</p>
                                <p className="text-sm text-slate-500">Joined {new Date(member.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border shadow-sm flex items-center gap-1.5 ${member.role === 'owner' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                member.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                    'bg-slate-50 text-slate-700 border-slate-200'
                                }`}>
                                {member.role === 'owner' && <Shield className="w-3.5 h-3.5" />}
                                {member.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
                                {member.role === 'member' && <User className="w-3.5 h-3.5" />}
                                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                            </span>

                            {isOwner && member.role !== 'owner' && (
                                <button
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                    title="Remove User"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <InviteMemberModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                organizationId={activeOrganization?.id || ''}
                onSuccess={fetchMembers}
            />
        </div>
    );
}
