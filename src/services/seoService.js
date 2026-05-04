import { supabase } from '../lib/supabaseClient';

/**
 * AI SEO Service - The Bridge between Database and Search Engines
 * Rule #14: Service Centralization
 */
export const seoService = {
    /**
     * Fetch optimized metadata for any entity (tool, blog, faq, etc.)
     * @param {string} entityId - The unique ID of the item
     * @param {string} entityType - The type (e.g., 'tool', 'blog')
     * @returns {Promise<Object|null>}
     */
    async getMetadata(entityId, entityType) {
        if (!entityId || !entityType) return null;

        // Prevent PostgreSQL 400 errors by validating UUID format
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(entityId);
        if (!isUUID) return null;
        
        try {
            const { data, error } = await supabase
                .from('seo_metadata')
                .select('*')
                .eq('entity_id', entityId)
                .eq('entity_type', entityType)
                .single();

            if (error) {
                // PGRST116 is 'not found', which is expected for new/unoptimized items
                if (error.code !== 'PGRST116') {
                    console.error('SEO Service Error:', error.message);
                }
                return null;
            }
            return data;
        } catch (err) {
            console.error('SEO Service Exception:', err);
            return null;
        }
    },

    /**
     * Trigger pre-emptive AI generation for a new or updated entity
     * @param {string} entityId 
     * @param {string} entityType 
     */
    async triggerGeneration(entityId, entityType) {
        if (!entityId || !entityType) return null;
        try {
            // We use a fire-and-forget fetch to not block the UI
            fetch('/api/generate-seo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entityId, entityType })
            }).catch(e => console.warn('[SEO TRIGGER FAILED]:', e));
            
            return true;
        } catch (err) {
            return false;
        }
    }
};
