import { useToolsCache } from '../../hooks/useToolsCache';
import { Globe } from 'lucide-react';
import styles from './SmartToolCard.module.css';

/**
 * Renders a HUBly tool card using the global in-memory cache.
 * Zero DB fetch per card — all tools are loaded once and shared.
 */
export default function SmartToolCard({ slug, preloadedData = null }) {
    const cache = useToolsCache();

    // Use preloaded data (from embedded tag) if available, otherwise look up from cache (case-insensitive)
    const normalizedSlug = slug ? slug.toLowerCase().trim() : '';
    let toolData = preloadedData || (cache && normalizedSlug ? cache[normalizedSlug] : null);
    
    // AI Hallucination Fallback: Fuzzy matching if exact slug fails
    if (!toolData && cache && normalizedSlug) {
        const cleanStr = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const targetClean = cleanStr(normalizedSlug);
        
        const toolsList = Object.values(cache);
        toolData = toolsList.find(t => {
            const slugClean = cleanStr(t.slug);
            const nameClean = cleanStr(t.name);
            return (slugClean && (slugClean === targetClean || targetClean.includes(slugClean) || slugClean.includes(targetClean))) || 
                   (nameClean && nameClean === targetClean);
        });
    }

    const isLoading = !preloadedData && cache === null;

    if (isLoading) {
        return (
            <span className={styles.mdToolCard} style={{ opacity: 0.6 }} dir="auto">
                <span className={styles.mdToolIconFallback} style={{ background: 'rgba(255,255,255,0.05)' }}>•••</span>
                <span className={styles.mdToolInfo}>
                    <span style={{ display: 'block', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', height: '14px', width: '120px' }} />
                    <span style={{ display: 'block', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '10px', width: '180px', marginTop: '6px' }} />
                </span>
            </span>
        );
    }

    if (!toolData) {
        // Tool not found — assume it's an external tool and render a beautiful fallback
        const formattedName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'External Tool';
        const assumedUrl = slug ? `https://${slug.toLowerCase()}.com` : '#';
        
        return (
            <span className={styles.mdToolCard} dir="auto">
                <span className={styles.mdToolIconFallback} style={{ backgroundColor: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff' }}>
                    <Globe size={20} />
                </span>
                <span className={styles.mdToolInfo}>
                    <strong style={{ fontSize: '1.05rem', margin: '0 0 4px 0', color: '#f1f5f9' }}>{formattedName}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.4, display: 'block' }}>External Tool (Auto-linked)</span>
                    <span className={styles.mdToolBadge} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>External</span>
                </span>
                <a href={assumedUrl} target="_blank" rel="noopener noreferrer" className={styles.mdToolLink}>
                    Visit
                </a>
            </span>
        );
    }

    const { name, image_url, pricing_type, short_description } = toolData;
    const displayName = name || slug;
    const isValidImg = image_url && image_url.startsWith('http') && image_url !== 'null';

    return (
        <span className={styles.mdToolCard} dir="auto">
            {isValidImg ? (
                <img
                    src={image_url}
                    alt={displayName}
                    width={40}
                    height={40}
                    className={styles.mdToolImg}
                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                    }}
                />
            ) : null}
            <span
                className={styles.mdToolIconFallback}
                style={{ display: isValidImg ? 'none' : 'flex' }}
            >
                {displayName?.[0]?.toUpperCase() || '?'}
            </span>
            <span className={styles.mdToolInfo}>
                <strong style={{ fontSize: '1.05rem', margin: '0 0 4px 0', color: '#f1f5f9' }}>{displayName}</strong>
                {short_description && <span style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.4, display: 'block' }}>{short_description.substring(0, 60)}...</span>}
                {pricing_type && pricing_type !== 'null' && (
                    <span className={styles.mdToolBadge}>{pricing_type}</span>
                )}
            </span>
            <a
                href={`/tool/${toolData.slug?.trim()}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mdToolLink}
            >
                Visit
            </a>
        </span>
    );
}
