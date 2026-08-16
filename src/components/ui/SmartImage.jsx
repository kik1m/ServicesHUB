import React, { useState, useEffect, useRef } from 'react';
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
    const imgRef = useRef(null);

    // --- 🛡️ Elite Hydration Protection ---
    // Fixes the classic React hydration race condition where the browser has already loaded the image
    // before React hydrates and attaches onLoad/onError event handlers, leaving the skeleton active forever.
    useEffect(() => {
        // Reset states when src changes
        setIsLoading(!!src);
        setHasError(!src);

        if (imgRef.current) {
            // If image is already fully loaded/cached by the browser
            if (imgRef.current.complete) {
                if (imgRef.current.naturalWidth === 0 || imgRef.current.naturalHeight === 0) {
                    setHasError(true);
                }
                setIsLoading(false);
            }
        }
    }, [src]);

    // --- 🛡️ Elite Hybrid Strategy (Rule #3) ---
    // With Next.js 14 '**' remotePatterns, we now proxy ALL external images
    // safely through Next.js Image Optimization to protect original URLs and 
    // prevent hotlinking breaks without requiring paid storage.
    const isWildHost = false;

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
                    ref={imgRef}
                    src={src}
                    alt={alt || 'HUBly Image'}
                    className={imageClasses}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={priority ? "eager" : "lazy"}
                    width={400}
                    height={400}
                />
            ) : (
                /* Elite next/image for trusted/configured sources */
                <Image
                    ref={imgRef}
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
