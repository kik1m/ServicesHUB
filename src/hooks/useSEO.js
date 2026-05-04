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

    // 1. Fetch AI Optimized Metadata if entity is provided
    useEffect(() => {
        if (entityId && entityType) {
            seoService.getMetadata(entityId, entityType).then(data => {
                if (data) setDbMetadata(data);
            });
        } else {
            setDbMetadata(null);
        }
    }, [entityId, entityType]);

    useEffect(() => {
        const pageData = pageKey ? SEO_CONFIG.pages[pageKey] : {};
        const { global } = SEO_CONFIG;

        // Use AI Data if exists, otherwise Fallback to Props/Manifest
        const activeTitle = dbMetadata?.title || title || pageData.title;
        const activeDescription = dbMetadata?.description || description || pageData.description || global.defaultDescription;
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

        // --- 1. Canonical URL ---
        const currentFullUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
        const cleanUrl = currentFullUrl.split('?')[0].split('#')[0];

        // --- 2. Title Management ---
        const shouldAppendSuffix = activeTitle && !activeTitle.includes('HUBly') && !activeTitle.includes(global.siteName);
        const fullTitle = activeTitle 
            ? (shouldAppendSuffix ? `${activeTitle}${global.titleSuffix}` : activeTitle)
            : global.titleSuffix.replace(' | ', '');
            
        document.title = fullTitle;
        setMetaTag('property="og:title"', fullTitle);
        setMetaTag('name="twitter:title"', fullTitle);

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
