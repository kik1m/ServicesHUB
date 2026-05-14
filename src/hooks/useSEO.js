import { useEffect, useState } from 'react';
import { SEO_CONFIG } from '../constants/seoManifest';
import { seoService } from '../services/seoService';

/**
 * 🚀 Elite Hybrid AI SEO Engine (Version 3.0)
 * Rule #14: Hybrid Source Pattern (DB + Static Fallback)
 * Rule #34: AI-Optimized Metadata Integration
 */
export const useSEO = ({ 
    pageKey, 
    entityId, // Added: ID for DB lookup
    entityType, // Added: Type for DB lookup (tool, blog, etc.)
    title, 
    description, 
    keywords = [],
    image, 
    url,
    schema,
    noindex = false,
    ogType = 'website',
    prev, 
    next  
}) => {
    const [dbMetadata, setDbMetadata] = useState(null);
    const { global } = SEO_CONFIG;

    // 1. Fetch AI Optimized Metadata if entity is provided
    useEffect(() => {
        let activeEntityId = entityId;
        
        // Resolve static page keys to fixed UUIDs for DB compatibility
        if (pageKey && global.pageIds?.[pageKey]) {
            activeEntityId = global.pageIds[pageKey];
        }

        if (activeEntityId && entityType) {
            seoService.getMetadata(activeEntityId, entityType).then(data => {
                if (data) setDbMetadata(data);
            });
        } else {
            setDbMetadata(null);
        }
    }, [entityId, entityType, pageKey, global.pageIds]);

    useEffect(() => {
        const pageData = pageKey ? SEO_CONFIG.pages[pageKey] : {};
        const { global } = SEO_CONFIG;

        // 🧠 Anti-Flash Logic (Rule #34): 
        // If we have an ID but no DB data yet, we wait to avoid the "Title Jump"
        const isWaitingForDb = (entityId || pageKey) && !dbMetadata;
        
        const activeTitle = dbMetadata?.title || (isWaitingForDb ? null : (title || pageData.title));
        const activeDescription = dbMetadata?.description || (isWaitingForDb ? null : (description || pageData.description || global.defaultDescription));
        
        // Only proceed if we have a title to set (prevents flashing manifest title)
        if (!activeTitle) return;

        const activeKeywords = dbMetadata?.keywords ? [...global.defaultKeywords, ...dbMetadata.keywords] : [...global.defaultKeywords, ...(pageData.keywords || []), ...keywords];
        const activeImage = dbMetadata?.og_image || image || global.defaultImage;
        const activeSchema = dbMetadata?.schema_markup || schema;

        const setMetaTag = (attr, content) => {
            if (!content) return;
            let element = document.querySelector(`meta[${attr}]`);
            if (!element) {
                element = document.createElement('meta');
                const [key, val] = attr.split('=');
                element.setAttribute(key.trim(), val.replace(/"/g, '').trim());
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        const setLinkTag = (rel, href) => {
            if (!href) {
                const existing = document.querySelector(`link[rel="${rel}"]`);
                if (existing) existing.remove();
                return;
            }
            let element = document.querySelector(`link[rel="${rel}"]`);
            if (!element) {
                element = document.createElement('link');
                element.rel = rel;
                document.head.appendChild(element);
            }
            element.href = href;
        };

        // --- 1. Canonical URL Hardening (Rule #34: Single Source of Truth)
        const baseUrl = 'https://www.hubly-tools.com';
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        const cleanUrl = `${baseUrl}${currentPath}`;

        // --- 2. Title Management (Branding Rule: Focus on 'HUBly')
        // We prioritize AI Title, then props title, then manifest.
        let finalTitle = activeTitle || `HUBly - Ultimate AI Discovery Hub`;
        
        // Ensure HUBly is present but not duplicated
        const hasBranding = finalTitle.toLowerCase().includes('hubly');
        if (!hasBranding) {
            finalTitle = `${finalTitle}${global.titleSuffix}`;
        }

        document.title = finalTitle;
        setMetaTag('property="og:title"', finalTitle);
        setMetaTag('name="twitter:title"', finalTitle);

        // --- 3. Description & Type ---
        const finalDesc = activeDescription.substring(0, 160);
        setMetaTag('name="description"', finalDesc);
        setMetaTag('property="og:description"', finalDesc);
        setMetaTag('name="twitter:description"', finalDesc);
        setMetaTag('property="og:type"', ogType);

        // --- 4. Keywords ---
        setMetaTag('name="keywords"', activeKeywords.join(', '));

        // --- 5. Image & Identity ---
        setMetaTag('property="og:image"', activeImage);
        setMetaTag('name="twitter:image"', activeImage);
        setMetaTag('property="og:url"', cleanUrl);
        
        // --- 6. Robots Management ---
        const finalNoIndex = noindex || pageData.noindex;
        setMetaTag('name="robots"', finalNoIndex ? 'noindex, nofollow, noarchive' : 'index, follow');
        
        // --- 7. Canonical & Pagination ---
        setLinkTag('canonical', cleanUrl);
        setLinkTag('prev', prev);
        setLinkTag('next', next);
        
        // --- 8. Schema Injection ---
        let schemaScript = document.getElementById('seo-schema-script');
        if (activeSchema) {
            if (!schemaScript) {
                schemaScript = document.createElement('script');
                schemaScript.id = 'seo-schema-script';
                schemaScript.type = 'application/ld+json';
                document.head.appendChild(schemaScript);
            }
            const schemaData = Array.isArray(activeSchema) ? activeSchema : [activeSchema];
            schemaScript.text = JSON.stringify(schemaData.length === 1 ? schemaData[0] : {
                "@context": "https://schema.org",
                "@graph": schemaData
            });
        } else if (schemaScript) {
            schemaScript.remove();
        }

    }, [pageKey, dbMetadata, title, description, keywords, image, url, schema, noindex, prev, next, ogType]);
};

export default useSEO;
