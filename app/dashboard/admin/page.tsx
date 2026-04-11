'use client';

import { useOrganization } from '../../../components/OrganizationProvider';
import TicketList from '../../../components/TicketList';
import ActivityTimeline from '../../../components/ActivityTimeline';
import { ShieldAlert } from 'lucide-react';

export default function AdminPage() {
    const { activeOrganization, loading } = useOrganization();

    if (loading) return null;

    if (!activeOrganization || activeOrganization.role === 'member') {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-200 mt-8">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
                <p className="text-slate-500 text-center max-w-sm">
                    Only organization admins and owners can access the Admin Dashboard.
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h2>
                <p className="text-slate-500 mt-1">Manage all support tickets for {activeOrganization.name}.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <TicketList refreshTrigger={0} viewMode="admin" />
                </div>
                <div className="lg:col-span-1">
                    <ActivityTimeline />
                </div>
            </div>
        </div>
    );
}
