import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase Admin Client.
 * Uses the SERVICE_ROLE key — bypasses Row-Level Security.
 * NEVER import this in client components.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = (supabaseUrl && serviceRoleKey) ? createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    }
}) : null;
