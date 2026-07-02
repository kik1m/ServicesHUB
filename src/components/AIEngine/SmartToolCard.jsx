import { useToolsCache } from '../../hooks/useToolsCache';
import { Globe } from 'lucide-react';
import styles from './SmartToolCard.module.css';

/**
 * Renders a HUBly tool card using the global in-memory cache.
 * Zero DB fetch per card — all tools are loaded once and shared.
 */
export default function SmartToolCard({ slug, preloadedData = null, compact = false }) {
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
            <span className={`${styles.mdToolCard} ${styles.loadingState}`} dir="auto">
                <span className={styles.mdToolIconFallback}>•••</span>
                <span className={styles.mdToolInfo}>
                    <span className={styles.skeletonTitle} />
                    <span className={styles.skeletonDesc} />
                </span>
            </span>
        );
    }

    if (!toolData) {
        // Tool not found — assume it's an external tool and render a beautiful fallback
        const formattedName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'External Tool';
        const isValidSlug = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/i.test(slug || '');
        const cleanDomain = isValidSlug ? `${slug.toLowerCase().trim()}.com` : '';
        const faviconUrl = cleanDomain ? `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=64` : '/logo.png';
        const assumedUrl = isValidSlug ? `https://${cleanDomain}` : '#';
        
        return (
            <span className={styles.mdToolCard} dir="auto">
                <img
                    src={faviconUrl}
                    alt={formattedName}
                    width={40}
                    height={40}
                    className={styles.toolImg}
                    onError={(e) => {
                        e.currentTarget.src = '/logo.png';
                    }}
                />
                <span className={styles.mdToolInfo}>
                    <strong className={styles.toolName}>{formattedName}</strong>
                    <span className={styles.toolSubtext}>External Tool (Auto-linked)</span>
                    <span className={`${styles.mdToolBadge} ${styles.badgeExternal}`}>External</span>
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
    const displayImgSrc = isValidImg ? image_url : '/logo.png';

    return (
        <span className={compact ? styles.mdToolCardCompact : styles.mdToolCard} dir="auto">
            <img
                src={displayImgSrc}
                alt={displayName}
                width={compact ? 28 : 40}
                height={compact ? 28 : 40}
                className={styles.toolImg}
                onError={(e) => {
                    e.currentTarget.className = styles.fallbackHidden;
                    if (e.currentTarget.nextSibling) {
                        e.currentTarget.nextSibling.classList.add(styles.fallbackIconShow);
                    }
                }}
            />
            <span
                className={`${compact ? styles.mdToolIconFallbackCompact : styles.mdToolIconFallback} ${styles.fallbackIcon}`}
            >
                {displayName?.[0]?.toUpperCase() || '?'}
            </span>
            <span className={compact ? styles.mdToolInfoCompact : styles.mdToolInfo}>
                <strong className={compact ? styles.toolNameCompact : styles.toolName}>{displayName}</strong>
                {!compact && short_description && (
                    <span className={styles.toolSubtext}>{short_description.substring(0, 60)}...</span>
                )}
                {pricing_type && pricing_type !== 'null' && (
                    <span className={`${styles.mdToolBadge} ${compact ? styles.badgeCompact : ''}`}>{pricing_type}</span>
                )}
            </span>
            <a
                href={`/tool/${toolData.slug?.trim()}`}
                target="_blank"
                rel="noopener noreferrer"
                className={compact ? styles.mdToolLinkCompact : styles.mdToolLink}
            >
                Visit
            </a>
        </span>
    );
}
