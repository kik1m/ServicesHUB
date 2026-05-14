'use client';
import React, { memo } from 'react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import Image from 'next/image';
import styles from './SocialLogins.module.css';

// Brand icon components that point to physical image files
const GoogleImage = () => (
    <Image 
        src="/icons/web_dark_rd_na@2x.png" 
        width={24} 
        height={24} 
        alt="Google" 
        className={styles.googleIcon} 
    />
);

const GithubImage = () => (
    <Image 
        src="/icons/GitHub_Invertocat_White_Clearspace.png" 
        width={24} 
        height={24} 
        alt="GitHub" 
        className={styles.githubIcon} 
    />
);

/**
 * SocialLogins - Elite Component (Next.js Port)
 * Configured to use real brand images from public/icons
 */
const SocialLogins = memo(({ onSocialAction, isLoading, error, onRetry }) => {

    if (isLoading) {
        return (
            <>
                <div className={styles.dividerContainer}>
                    <div className={styles.line}></div>
                    <span className={styles.dividerText}>OR CONTINUE WITH</span>
                    <div className={styles.line}></div>
                </div>
                <div className={styles.socialGrid}>
                    <Skeleton className={styles.skeletonSocial} />
                    <Skeleton className={styles.skeletonSocial} />
                </div>
            </>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.dividerContainer}>
                <div className={styles.line}></div>
                <span className={styles.dividerText}>OR CONTINUE WITH</span>
                <div className={styles.line}></div>
            </div>
            
            <div className={styles.socialGrid}>
                <Button 
                    variant="outline"
                    className={`${styles.socialBtn} ${styles.googleBtn}`}
                    onClick={() => onSocialAction('google')}
                    icon={GoogleImage}
                >
                    Google
                </Button>
                <Button 
                    variant="outline"
                    className={`${styles.socialBtn} ${styles.githubBtn}`}
                    onClick={() => onSocialAction('github')}
                    icon={GithubImage}
                >
                    GitHub
                </Button>
            </div>
        </Safeguard>
    );
});

export default SocialLogins;
