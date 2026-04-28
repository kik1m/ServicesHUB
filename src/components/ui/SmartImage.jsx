import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Skeleton from './Skeleton';
import styles from './SmartImage.module.css';

/**
 * Shared UI Atom: SmartImage
 * Handles loading states and error fallbacks for images.
 */
const SmartImage = ({ 
    src, 
    alt, 
    fallbackIcon: FallbackIcon = Sparkles,
    className = '', 
    containerClassName = '',
    objectFit = 'cover' 
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

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
            ) : (
                <img
                    src={src}
                    alt={alt}
                    className={`
                        ${styles.image} 
                        ${isLoading ? styles.hidden : ''} 
                        ${objectFit === 'contain' ? styles.fitContain : styles.fitCover}
                        ${className}
                    `.trim()}
                    onLoad={handleLoad}
                    onError={handleError}
                />
            )}
        </div>
    );
};

export default SmartImage;
