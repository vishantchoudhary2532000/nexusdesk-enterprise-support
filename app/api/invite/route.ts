import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, role, organization_id } = await request.json();

        if (!email || !role || !organization_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey) {
            return NextResponse.json(
                { error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY is missing from .env.local' },
                { status: 500 }
            );
        }

        const supabaseAdmin = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            {
                cookies: {
                    // Admin client doesn't need to read/write current cookies since it acts as service role
                    get(name: string) { return undefined; },
                    set(name: string, value: string, options: CookieOptions) {},
                    remove(name: string, options: CookieOptions) {}
                }
            }
        );

        // Verify the user making the request is an owner of the organization
        const cookieStore = await cookies();
        const supabaseAuth = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value; },
                    set(name: string, value: string, options: CookieOptions) { cookieStore.set(name, value, options); },
                    remove(name: string, options: CookieOptions) { cookieStore.delete(name); }
                }
            }
        );

        const { data: { user } } = await supabaseAuth.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: membership } = await supabaseAdmin
            .from('organization_members')
            .select('role')
            .eq('organization_id', organization_id)
            .eq('user_id', user.id)
            .single();

        if (!membership || membership.role !== 'owner') {
            return NextResponse.json({ error: 'Only owners can invite new members' }, { status: 403 });
        }

        // Send the invite via Supabase Admin
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

        if (inviteError) {
            return NextResponse.json({ error: inviteError.message }, { status: 400 });
        }

        // Insert logic: once they accept the invite, they become a user.
        // Wait! We can pre-create their organization_members record using their new internal user ID from inviteData.
        if (inviteData && inviteData.user) {
            await supabaseAdmin.from('organization_members').insert({
                organization_id,
                user_id: inviteData.user.id,
                role
            });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
