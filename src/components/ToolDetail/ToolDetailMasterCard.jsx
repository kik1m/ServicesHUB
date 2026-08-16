import React from 'react';
import { ExternalLink, Heart, CheckCircle2, HelpCircle, GitCompare, Star, Info } from 'lucide-react';
import { getIcon } from '../../utils/iconMap.jsx';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import styles from './ToolDetailMasterCard.module.css';

/**
 * ToolDetailMasterCard - Elite Identity Card v3.0
 * Premium redesign: crisp layout, grouped actions, affiliate badge.
 */
const ToolDetailMasterCard = ({ 
    tool, 
    isFavorited, 
    toggleFavorite,
    onCompare,
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

    const targetUrl = tool?.affiliate_url || tool?.url;
    const isAffiliate = targetUrl?.includes('ref=') || targetUrl?.includes('aff=') || !!tool?.affiliate_url;
    const relValue = isAffiliate ? "sponsored noopener noreferrer" : "noopener noreferrer";

    const IconComponent = getIcon(tool?.icon_name) || HelpCircle;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.premiumCardContainer}>

                {/* ── LEFT: LOGO + NAME + TAGLINE ── */}
                <div className={styles.identitySection}>
                    <div className={styles.pureAvatarAnchor}>
                        <SmartImage 
                            src={tool?.image_url} 
                            alt={tool?.name} 
                            fallbackIcon={IconComponent}
                            className={styles.toolIconImg}
                            containerClassName={styles.pureImageContainer}
                        />
                    </div>

                    <div className={styles.identityDetails}>
                        <div className={styles.topRow}>
                            <h1 className={styles.titleText}>{tool?.name}</h1>
                            {tool?.is_verified && (
                                <CheckCircle2 size={20} className={styles.verifiedCheck} strokeWidth={2.5} />
                            )}
                            {tool?.is_featured && (
                                <div className={styles.featuredBadgeMini}>
                                    <Star size={9} fill="currentColor" /> {content?.badges?.featured}
                                </div>
                            )}
                        </div>
                        <p className={styles.tagline}>{tool?.short_description}</p>
                    </div>
                </div>

                {/* ── RIGHT: ACTIONS ── */}
                <div className={styles.actionSection}>
                    <div className={styles.buttonStack}>
                        {/* Primary CTA */}
                        <Button 
                            as="a"
                            href={targetUrl} 
                            target="_blank" 
                            rel={relValue} 
                            variant="primary"
                            className={styles.primaryVisitBtn} 
                            icon={ExternalLink}
                            iconPosition="right"
                            onClick={onExternalClick}
                        >
                            {content?.actions?.visit}
                        </Button>

                        {/* Visual separator */}
                        <div className={styles.buttonDivider} aria-hidden="true" />

                        {/* Compare */}
                        <Button 
                            variant="secondary"
                            className={styles.iconicActionBtn} 
                            onClick={onCompare}
                            title="Compare Tool"
                            aria-label="Compare Tool"
                        >
                            <GitCompare size={19} />
                        </Button>

                        {/* Favourite */}
                        <Button 
                            variant="secondary"
                            className={`${styles.iconicFavBtn} ${isFavorited ? styles.isActive : ''}`} 
                            onClick={toggleFavorite}
                            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                        >
                            <Heart 
                                size={19} 
                                fill={isFavorited ? 'currentColor' : 'none'} 
                                className={isFavorited ? styles.heartActive : ''} 
                            />
                        </Button>
                    </div>

                    {/* Affiliate disclosure */}
                    {isAffiliate && (
                        <div className={styles.affiliateDisclosure}>
                            <Info size={12} />
                            <small>This link may include an affiliate code and does not affect our review.</small>
                        </div>
                    )}
                </div>

            </div>
        </Safeguard>
    );
};

export default ToolDetailMasterCard;
