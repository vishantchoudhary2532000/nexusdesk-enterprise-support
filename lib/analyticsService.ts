import { createClient } from './supabaseClient';

export interface OrgTelemetry {
    total: number;
    open: number;
    closed: number;
    today: number;
    resolution_rate: number;
    avg_latency_hours: number;
}

/**
 * Fetches real-time operational telemetry for an organization using Supabase RPC.
 * This replaces simulated data with actual SQL-calculated performance metrics.
 */
export async function fetchOrgTelemetry(orgId: string): Promise<OrgTelemetry> {
    const supabase = createClient();
    
    // Call the high-performance Postgres function implemented in Phase 3
    const { data, error } = await supabase.rpc('get_org_telemetry', { org_id: orgId });
    
    if (error) {
        console.error('[Analytics Service] Telemetry fetch failed:', error.message);
        throw error;
    }

    return data as OrgTelemetry;
}

/**
 * Fetches ticket volume trends for the organization (Sparkline data).
 * Returns count of tickets created per day for the last 7 days.
 */
export async function fetchVolumeTrend(orgId: string): Promise<number[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
        .from('tickets')
        .select('created_at')
        .eq('organization_id', orgId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (error) return [0, 0, 0, 0, 0, 0, 0];

    const counts = new Array(7).fill(0);
    const now = new Date();
    
    data.forEach(ticket => {
        const ticketDate = new Date(ticket.created_at);
        const dayDiff = Math.floor((now.getTime() - ticketDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < 7) {
            counts[6 - dayDiff]++;
        }
    });

    return counts;
}
