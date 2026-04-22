import { createClient } from './supabaseClient';

export interface KnowledgeArticle {
    id: string;
    title: string;
    content: string;
    slug: string;
    category?: string;
    is_public: boolean;
    created_at: string;
}

/**
 * Searches the Knowledge Base for relevant articles using Postgres Full-Text Search.
 */
export async function searchKnowledgeBase(orgId: string, query: string): Promise<KnowledgeArticle[]> {
    if (!query || query.trim().length < 3) return [];

    const supabase = createClient();
    
    // Using Postgres Full-Text Search via RPC or direct query
    // We'll use the 'fts' column we created in schema.sql
    const { data, error } = await supabase
        .from('knowledge_articles')
        .select('id, title, content, slug, category, is_public, created_at')
        .eq('organization_id', orgId)
        .textSearch('fts', query, {
            type: 'websearch',
            config: 'english'
        })
        .limit(3);

    if (error) {
        console.error('[Knowledge Service] Search failed:', error.message);
        return [];
    }

    return data || [];
}

/**
 * Generates grounded context for the AI based on conversation history.
 */
export async function getGroundedContext(orgId: string, messages: string[]): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return '';

    // Extract keywords or just use the last message as the query
    const results = await searchKnowledgeBase(orgId, lastMessage);
    
    if (results.length === 0) return '';

    const context = results.map(article => (
        `ARTICLE: ${article.title}\nCONTENT: ${article.content}`
    )).join('\n\n---\n\n');

    return `\nRELEVANT KNOWLEDGE BASE CONTEXT:\n${context}\n\n[End of Knowledge Context]`;
}

/**
 * Fetches all articles for an organization.
 */
export async function fetchArticles(orgId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Saves or updates an article.
 */
export async function upsertArticle(article: Partial<KnowledgeArticle> & { organization_id: string }) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('knowledge_articles')
        .upsert(article)
        .select()
        .single();

    if (error) throw error;
    return data;
}
