import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Global singleton cache — tools are fetched ONCE per page load
 * and shared across ALL SmartToolCard instances. Zero redundant fetches.
 */
let globalToolsCache = null; // null = not loaded, {} = loaded (even if empty)
let globalLoadPromise = null;
const subscribers = new Set();

function notifySubscribers() {
    subscribers.forEach(fn => fn());
}

async function loadToolsCache() {
    if (globalToolsCache !== null) return globalToolsCache;
    if (globalLoadPromise) return globalLoadPromise;

    globalLoadPromise = supabase
        .from('tools')
        .select('slug, name, image_url, pricing_type, short_description')
        .eq('is_approved', true)
        .then(({ data }) => {
            globalToolsCache = {};
            if (data) {
                data.forEach(t => {
                    globalToolsCache[t.slug] = t;
                });
            }
            globalLoadPromise = null;
            notifySubscribers();
            return globalToolsCache;
        });

    return globalLoadPromise;
}

export function useToolsCache() {
    const [cache, setCache] = useState(globalToolsCache);

    useEffect(() => {
        // If already loaded, use it immediately
        if (globalToolsCache !== null) {
            setCache(globalToolsCache);
            return;
        }

        // Subscribe to when cache loads
        const update = () => setCache({ ...globalToolsCache });
        subscribers.add(update);

        // Trigger load
        loadToolsCache();

        return () => subscribers.delete(update);
    }, []);

    return cache;
}
