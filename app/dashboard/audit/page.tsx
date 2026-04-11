'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabaseClient';
import { useOrganization } from '../../../components/OrganizationProvider';
import { ShieldAlert, FileText, User, UserPlus, FileEdit, Trash } from 'lucide-react';
import DashboardHeader from '../../../components/DashboardHeader';
import Sidebar from '../../../components/Sidebar';

interface AuditLog {
    id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    created_at: string;
    users: { email: string } | null;
}

export default function AuditLogsPage() {
    const supabase = createClient();
    const { activeOrganization, loading: orgLoading } = useOrganization();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        const fetchLogs = async () => {
            if (!activeOrganization) return;
            setLoading(true);

            const { data, error } = await supabase
                .from('activity_logs')
                .select(`
                    id,
                    action,
                    entity_type,
                    entity_id,
                    created_at,
                    users:user_id (email)
                `)
                .eq('organization_id', activeOrganization.id)
                .order('created_at', { ascending: false })
                .range(page * pageSize, (page + 1) * pageSize - 1);

            if (!error && data) {
                // @ts-ignore
                setLogs(data);
            }
            setLoading(false);
        };

        if (!orgLoading) fetchLogs();
    }, [activeOrganization, page, orgLoading, supabase]);

    if (orgLoading) return null;

    if (!activeOrganization || activeOrganization.role === 'member') {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200 mt-8">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
                <p className="text-slate-500 text-center max-w-sm">
                    Only organization admins and owners can view audit logs.
                </p>
            </div>
        );
    }

    const getActionBadge = (action: string) => {
        if (action.includes('delete') || action.includes('remove')) {
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase">{action}</span>;
        }
        if (action.includes('create') || action.includes('invite')) {
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">{action}</span>;
        }
        if (action.includes('update') || action.includes('edit')) {
            return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">{action}</span>;
        }
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">{action}</span>;
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security & Audit Logs</h2>
                <p className="text-slate-500 mt-1">Review all administrative and system actions for {activeOrganization.name}.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-xs text-slate-500 uppercase font-bold bg-slate-50/80 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Entity Type</th>
                                <th className="px-6 py-4 text-right">Entity ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading audit logs...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No audit logs found.</td>
                                </tr>
                            ) : logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-500 tabular-nums">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {log.users?.email || 'System'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getActionBadge(log.action)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium capitalize">
                                        {log.entity_type}
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-xs text-slate-400">
                                        {log.entity_id ? log.entity_id.split('-')[0] + '...' : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 bg-white"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-slate-500 font-medium">Page {page + 1}</span>
                    <button
                        disabled={logs.length < pageSize}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 bg-white"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
