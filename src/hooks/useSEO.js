import { useEffect } from 'react';
import { SEO_CONFIG } from '../constants/seoManifest';

/**
 * 🚀 Elite SEO Hardening Hook (Version 2.0 - Manifest Driven)
 * Rule #14: Constant Centralization
 * Rule #34: Elite Metadata Management
 */
export const useSEO = ({ 
    pageKey, // New: Link to SEO_CONFIG.pages[pageKey]
    title, 
    description, 
    keywords = [],
    image, 
    url,
    schema,
    noindex = false // New: Control indexing for private pages
}) => {
    useEffect(() => {
        // --- 1. Load Data from Manifest if pageKey exists ---
        const pageData = pageKey ? SEO_CONFIG.pages[pageKey] : {};
        const { global } = SEO_CONFIG;

        // --- 2. Helpers ---
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

        const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

        // --- 3. Title Management (Elite Logic: Custom > Manifest > Global) ---
        const rawTitle = title || pageData.title;
        const fullTitle = rawTitle ? `${rawTitle}${global.titleSuffix}` : global.titleSuffix.replace(' | ', '');
        document.title = fullTitle;
        setMetaTag('property="og:title"', fullTitle);
        setMetaTag('name="twitter:title"', fullTitle);

        // --- 4. Description Management ---
        const finalDesc = (description || pageData.description || global.defaultDescription).substring(0, 160);
        setMetaTag('name="description"', finalDesc);
        setMetaTag('property="og:description"', finalDesc);
        setMetaTag('name="twitter:description"', finalDesc);

        // --- 5. Keywords Management ---
        const combinedKeywords = [...global.defaultKeywords, ...(pageData.keywords || []), ...keywords];
        setMetaTag('name="keywords"', combinedKeywords.join(', '));

        // --- 6. Image & URL ---
        const finalImage = image || global.defaultImage;
        setMetaTag('property="og:image"', finalImage);
        setMetaTag('name="twitter:image"', finalImage);
        setMetaTag('property="og:url"', currentUrl);
        
        // --- 7. Robots (noindex) Management ---
        const finalNoIndex = noindex || pageData.noindex;
        setMetaTag('name="robots"', finalNoIndex ? 'noindex, nofollow' : 'index, follow');
        
        if (currentUrl) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.rel = 'canonical';
                document.head.appendChild(canonical);
            }
            canonical.href = currentUrl;
        }

        // --- 7. Schema.org (JSON-LD) Injection ---
        let schemaScript = document.getElementById('seo-schema-script');
        if (schema) {
            if (!schemaScript) {
                schemaScript = document.createElement('script');
                schemaScript.id = 'seo-schema-script';
                schemaScript.type = 'application/ld+json';
                document.head.appendChild(schemaScript);
            }
            // Support multiple schemas via array or single object
            const schemaData = Array.isArray(schema) ? schema : [schema];
            schemaScript.text = JSON.stringify(schemaData.length === 1 ? schemaData[0] : {
                "@context": "https://schema.org",
                "@graph": schemaData
            });
        } else if (schemaScript) {
            schemaScript.remove();
        }

    }, [pageKey, title, description, keywords, image, url, schema]);
};

export default useSEO;
