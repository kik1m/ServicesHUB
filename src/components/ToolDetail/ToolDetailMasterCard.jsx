import React from 'react';
import { ExternalLink, Heart, Star, CheckCircle2, HelpCircle } from 'lucide-react';
import { getIcon } from '../../utils/iconMap.jsx';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import styles from './ToolDetailMasterCard.module.css';

/**
 * ToolDetailMasterCard - The Advanced Elite Identity
 * Version 2.3: Zero-Background Icon Guarantee.
 */
const ToolDetailMasterCard = ({ 
    tool, 
    isFavorited, 
    toggleFavorite,
    onExternalClick,
    isLoading,
    error,
    onRetry,
    content 
}) => {
    if (isLoading) {
        return (
            <div className={styles.masterCardSkeleton}>
                <div className={styles.skeletonAvatar} />
                <div className={styles.skeletonContent}>
                    <div className={`${styles.skeletonLine} ${styles.width40}`} />
                    <div className={`${styles.skeletonLine} ${styles.width70}`} />
                </div>
            </div>
        );
    }

    if (!tool) return null;

    const IconComponent = getIcon(tool?.icon_name) || HelpCircle;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.premiumCardContainer}>
                <div className={styles.identitySection}>
                    {/* 100% PURE IDENTITY ANCHOR */}
                    <div className={styles.pureAvatarAnchor}>
                        <SmartImage 
                            src={tool?.image_url} 
                            alt={tool?.name} 
                            fallbackIcon={IconComponent}
                            className={styles.toolIconImg}
                            containerClassName={styles.pureImageContainer} // Rule #19: Forcing zero background
                        />
                    </div>

                    <div className={styles.identityDetails}>
                        <div className={styles.topRow}>
                            <h1 className={styles.titleText}>{tool?.name}</h1>
                            {tool?.is_verified && (
                                <CheckCircle2 size={20} className={styles.verifiedCheck} />
                            )}
                            {tool?.is_featured && (
                                <div className={styles.featuredBadgeMini}>
                                    <Star size={10} fill="currentColor" /> {content?.badges?.featured}
                                </div>
                            )}
                        </div>
                        <p className={styles.tagline}>{tool?.short_description}</p>
                    </div>
                </div>

                <div className={styles.actionSection}>
                    <div className={styles.buttonStack}>
                        <Button 
                            as="a"
                            href={tool?.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            variant="primary"
                            className={styles.primaryVisitBtn} 
                            icon={ExternalLink}
                            iconPosition="right"
                            onClick={onExternalClick}
                        >
                            {content?.actions?.visit}
                        </Button>
                        <Button 
                            variant="secondary"
                            className={`${styles.iconicFavBtn} ${isFavorited ? styles.isActive : ''}`} 
                            onClick={toggleFavorite}
                        >
                            <Heart 
                                size={20} 
                                fill={isFavorited ? 'currentColor' : 'none'} 
                                className={isFavorited ? styles.heartActive : ''} 
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </Safeguard>
    );
};

export default ToolDetailMasterCard;
