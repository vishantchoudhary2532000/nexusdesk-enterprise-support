'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '../lib/supabaseClient';

export interface Organization {
    id: string;
    name: string;
    role: string;
}

interface OrganizationContextType {
    organizations: Organization[];
    activeOrganization: Organization | null;
    setActiveOrganization: (orgId: string) => void;
    loading: boolean;
    refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [activeOrganization, setActiveOrgState] = useState<Organization | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshOrganizations = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('organization_members')
            .select(`
                role,
                organizations (
                    id,
                    name
                )
            `)
            .eq('user_id', user.id);

        if (!error && data) {
            const orgs = data.map((d: any) => ({
                id: d.organizations.id,
                name: d.organizations.name,
                role: d.role
            }));

            setOrganizations(orgs);

            if (orgs.length > 0) {
                const savedOrgId = localStorage.getItem('nexus_active_org');
                const savedOrg = orgs.find(o => o.id === savedOrgId);
                if (savedOrg) {
                    setActiveOrgState(savedOrg);
                } else {
                    setActiveOrgState(orgs[0]);
                    localStorage.setItem('nexus_active_org', orgs[0].id);
                }
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshOrganizations();
    }, []);

    const setActiveOrganization = (orgId: string) => {
        const org = organizations.find(o => o.id === orgId);
        if (org) {
            setActiveOrgState(org);
            localStorage.setItem('nexus_active_org', orgId);
            // Optionally, we could reload the page or trigger a global refresh event
            window.dispatchEvent(new Event('org_changed'));
        }
    };

    return (
        <OrganizationContext.Provider value={{ organizations, activeOrganization, setActiveOrganization, loading, refreshOrganizations }}>
            {children}
        </OrganizationContext.Provider>
    );
}

export function useOrganization() {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
    return context;
}
