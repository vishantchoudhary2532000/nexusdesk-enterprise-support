import { createClient } from './supabaseClient';

export async function getPublicOrgBySlug(slug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('organizations')
        .select('id, name, slug, branding')
        .eq('slug', slug)
        .single();
    
    if (error) return null;
    return data;
}

export async function getPublicArticles(orgId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('knowledge_articles')
        .select('id, title, slug, category, created_at')
        .eq('organization_id', orgId)
        .eq('is_public', true)
        .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
}

export async function getPublicArticle(orgId: string, articleSlug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('organization_id', orgId)
        .eq('slug', articleSlug)
        .eq('is_public', true)
        .single();
    
    if (error) return null;
    return data;
}
