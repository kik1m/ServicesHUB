import docsKnowledge from '@/data/docs_knowledge.json';
import platformManifest from '@/data/platform_manifest.json';

export async function search_hubly_docs(fnArgs) {
    try {
        const query = fnArgs.query ? fnArgs.query.toLowerCase().trim() : '';
        const matchedDocs = [];
        const availableSections = Object.values(docsKnowledge).map(d => d.title).join(' | ');

        const isIndexRequest = ['all', 'list', 'sections', 'index', 'فهرس', 'كل', 'اقسام', 'الكل'].includes(query);

        if (isIndexRequest) {
            return { docs: [{ section: 'INDEX', content: `Available doc sections: ${availableSections}` }] };
        }

        const keywords = query.split(/\s+/).filter(k => k.length > 2);
        for (const [sectionSlug, sectionObj] of Object.entries(docsKnowledge)) {
            const title = sectionObj.title || sectionSlug;
            const textContent = sectionObj.content || '';

            const slugLower = sectionSlug.toLowerCase();
            const titleLower = title.toLowerCase();
            const contentLower = textContent.toLowerCase();

            let match = slugLower.includes(query) || titleLower.includes(query) || contentLower.includes(query);
            if (!match && keywords.length > 0) {
                match = keywords.some(kw => slugLower.includes(kw) || titleLower.includes(kw) || contentLower.includes(kw));
            }

            if (match) {
                matchedDocs.push({ section: title, content: textContent.substring(0, 1500) + '...' });
            }
        }

        if (matchedDocs.length > 0) {
            return {
                docs: matchedDocs.slice(0, 3),
                _meta: `Other available sections you can search for: ${availableSections}`
            };
        } else {
            return { error: `No docs found for "${query}". Try searching with a specific keyword. Available sections are: ${availableSections}` };
        }
    } catch (e) {
        return { error: 'Failed to read docs_knowledge.' };
    }
}

export async function get_platform_schema(fnArgs) {
    try {
        if (fnArgs.page_id) {
            const page = platformManifest.find(p => p.page_id === fnArgs.page_id);
            return page ? { page_schema: page } : { error: 'Page not found.' };
        } else {
            return { available_pages: platformManifest.map(p => ({ page_id: p.page_id, title: p.title })) };
        }
    } catch (e) {
        return { error: 'Failed to read platform schema.' };
    }
}
