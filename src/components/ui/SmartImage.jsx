import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import Skeleton from './Skeleton';
import styles from './SmartImage.module.css';

/**
 * Shared UI Atom: SmartImage (Elite v2.0 - Next.js Optimized)
 * Handles loading states, error fallbacks, and automatic performance optimization.
 */
const SmartImage = ({ 
    src, 
    alt, 
    fallbackIcon: FallbackIcon = Sparkles,
    className = '', 
    containerClassName = '',
    objectFit = 'cover',
    priority = false,
    unoptimized = false
}) => {
    const [isLoading, setIsLoading] = useState(!!src);
    const [hasError, setHasError] = useState(!src);

    // --- 🛡️ Elite Hybrid Strategy (Rule #3) ---
    // If it's an external host we don't control, use standard <img> 
    // to prevent Next.js image-unconfigured-host crashes.
    const isWildHost = React.useMemo(() => {
        if (!src || typeof src !== 'string') return false;
        if (src.startsWith('/') || src.startsWith('.') || src.includes('localhost')) return false;
        
        const trustedHosts = [
            'supabase.co', 
            'supabase.in',
            'gstatic.com', 
            'googleusercontent.com', 
            'unsplash.com', 
            'bing.net',
        ];
        return src.startsWith('http') && !trustedHosts.some(host => src.includes(host));
    }, [src]);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const imageClasses = `
        ${styles.image} 
        ${objectFit === 'contain' ? styles.fitContain : styles.fitCover}
        ${className}
        ${isLoading ? styles.loading : styles.loaded}
    `.trim();

    return (
        <div className={`${styles.imageContainer} ${containerClassName}`}>
            {isLoading && (
                <div className={styles.skeletonOverlay}>
                    <Skeleton width="100%" height="100%" borderRadius="inherit" />
                </div>
            )}
            
            {hasError || !src ? (
                <div className={styles.fallbackWrapper}>
                    {React.isValidElement(FallbackIcon) ? (
                        FallbackIcon
                    ) : (
                        <FallbackIcon size={24} className={styles.fallbackIcon} />
                    )}
                </div>
            ) : isWildHost ? (
                /* Standard img for unknown external sources to avoid config crashes */
                <img
                    src={src}
                    alt={alt || 'HUBly Image'}
                    className={imageClasses}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? "eager" : "lazy"}
                />
            ) : (
                /* Elite next/image for trusted/configured sources */
                <Image
                    src={src}
                    alt={alt || 'HUBly Image'}
                    className={imageClasses}
                    onLoad={handleLoad}
                    onError={handleError}
                    priority={priority}
                    unoptimized={unoptimized}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            )}
        </div>
    );
};

export default SmartImage;
