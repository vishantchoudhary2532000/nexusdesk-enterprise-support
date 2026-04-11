'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabaseClient';
import { useOrganization } from './OrganizationProvider';
import { AlertTriangle, Info } from 'lucide-react';

export default function UsageLimitBanner() {
    const supabase = createClient();
    const { activeOrganization } = useOrganization();
    const [usage, setUsage] = useState({ tickets: 0, maxTickets: 100, percent: 0 });
    const [loading, setLoading] = useState(true);

    // Free plan limits
    const MAX_TICKETS = 100;

    useEffect(() => {
        const fetchUsage = async () => {
            if (!activeOrganization) {
                setLoading(false);
                return;
            }
            setLoading(true);

            // Fetch metrics for the current month. Period format: YYYY-MM
            const d = new Date();
            const period = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

            const { data, error } = await supabase
                .from('usage_metrics')
                .select('*')
                .eq('organization_id', activeOrganization.id)
                .eq('period', period)
                .maybeSingle();

            if (!error && data) {
                const p = Math.min(100, Math.round((data.tickets_created / MAX_TICKETS) * 100));
                setUsage({ tickets: data.tickets_created, maxTickets: MAX_TICKETS, percent: p });
            } else {
                // If no record exists for this month, user is at 0 usage
                setUsage({ tickets: 0, maxTickets: MAX_TICKETS, percent: 0 });
            }

            setLoading(false);
        };

        fetchUsage();
    }, [activeOrganization, supabase]);

    if (loading || usage.percent < 80) return null; // Only show if nearing limit (80%+)

    const isCritical = usage.percent >= 95;

    return (
        <div className={`mb-6 rounded-2xl border p-4 shadow-sm relative overflow-hidden flex items-start sm:items-center gap-4 ${isCritical ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
            }`}>
            <div className={`absolute top-0 left-0 w-1 h-full ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`}></div>

            <div className={`p-2 rounded-xl shrink-0 ${isCritical ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                {isCritical ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
            </div>

            <div className="flex-1">
                <h4 className={`text-sm font-bold ${isCritical ? 'text-red-900' : 'text-amber-900'}`}>
                    {isCritical ? 'Critical Warning: Usage Limit Reached' : 'Approaching Usage Limits'}
                </h4>
                <p className={`text-sm mt-0.5 ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
                    You have used {usage.tickets} of your {usage.maxTickets} tickets for this billing cycle.
                </p>
                <div className="w-full bg-white rounded-full h-2 mt-3 overflow-hidden border border-black/5">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`}
                        style={{ width: `${usage.percent}%` }}
                    ></div>
                </div>
            </div>

            <button className={`hidden sm:block shrink-0 px-4 py-2 bg-white rounded-lg text-sm font-bold shadow-sm border transition-colors ${isCritical ? 'text-red-700 border-red-200 hover:bg-red-50' : 'text-amber-700 border-amber-200 hover:bg-amber-50'
                }`}>
                Upgrade Plan
            </button>
        </div>
    );
}
