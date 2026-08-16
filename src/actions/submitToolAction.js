'use server';

import { supabaseAdmin } from '../lib/supabaseAdmin';
import { seoService } from '../services/seoService';

/**
 * Server Action for Submitting or Updating a Tool
 * Uses supabaseAdmin to bypass RLS limitations on the server (since cookies are not natively passed in the basic supabase client)
 * @param {Object} formData - The structured tool data
 * @param {string} mode - 'submit' or 'edit'
 * @param {string} toolId - Required if mode is 'edit'
 */
export async function submitToolAction(formData, mode, toolId) {
    if (!formData || !mode) {
        return { success: false, error: 'Invalid submission parameters.' };
    }

    try {
        if (mode === 'submit') {
            if (!formData?.name || !formData?.user_id) {
                return { success: false, error: 'Mandatory fields missing (Name/User ID)' };
            }

            const sanitizedData = {
                name: formData.name.trim(),
                url: formData.url?.trim() || '',
                short_description: formData.short_description?.trim() || '',
                description: formData.description?.trim() || '',
                category_id: formData.category_id,
                user_id: formData.user_id,
                image_url: formData.image_url || null,
                pricing_type: formData.pricing_type || 'Free',
                pricing_details: formData.pricing_details?.trim() || '',
                pricing_details_full: formData.pricing_details_full?.trim() || '',
                features: (formData.features || []).map(f => f?.trim()).filter(Boolean),
                use_cases: (formData.use_cases || []).map(f => f?.trim()).filter(Boolean),
                is_approved: false,
                is_verified: false,
                is_featured: false,
                rating: 0,
                reviews_count: 0,
                view_count: 0,
                click_count: 0,
                created_at: new Date().toISOString(),
                slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
            };

            const { data, error } = await supabaseAdmin
                .from('tools')
                .insert([sanitizedData])
                .select()
                .single();
            
            if (error) {
                console.error('[ServerAction: submitToolAction] Create Error:', error);
                return { success: false, error: error.message || error };
            }
            
            if (data) seoService.triggerGeneration(data.id, 'tool');
            return { success: true, data };
        } else if (mode === 'edit') {
            if (!toolId) return { success: false, error: 'Tool ID is required for editing.' };
            
            const sanitizedData = {
                name: formData.name?.trim(),
                url: formData.url?.trim(),
                short_description: formData.short_description?.trim(),
                description: formData.description?.trim(),
                category_id: formData.category_id,
                pricing_type: formData.pricing_type,
                pricing_details: formData.pricing_details?.trim(),
                pricing_details_full: formData.pricing_details_full?.trim(),
                image_url: formData.image_url,
                features: (formData.features || []).map(f => f?.trim()).filter(Boolean),
                use_cases: (formData.use_cases || []).map(f => f?.trim()).filter(Boolean),
                updated_at: new Date().toISOString()
            };

            const isApproved = formData.is_approved || false;
            const payload = isApproved
                ? { pending_changes: sanitizedData }
                : { ...sanitizedData, is_approved: false };

            const { data, error } = await supabaseAdmin
                .from('tools')
                .update(payload)
                .eq('id', toolId)
                .select()
                .single();
            
            if (error) {
                console.error('[ServerAction: submitToolAction] Update Error:', error);
                return { success: false, error: error.message || error };
            }
            
            if (data) seoService.triggerGeneration(toolId, 'tool');
            return { success: true, data };
        } else {
            return { success: false, error: 'Invalid operation mode.' };
        }
    } catch (err) {
        console.error('[ServerAction: submitToolAction] Exception:', err);
        return { success: false, error: err.message || 'Internal Server Error' };
    }
}
