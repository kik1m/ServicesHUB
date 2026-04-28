import React, { memo } from 'react';
import { Mail, MessageCircle, MapPin, Twitter, Github, Linkedin } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ContactInfoSidebar.module.css';

/**
 * ContactInfoSidebar - Elite Component
 * Rule #14: Data-Driven UI
 * Rule #112: Zero inline styles
 */
const ContactInfoSidebar = ({ isLoading, error, content }) => {
    if (isLoading) {
        return (
            <div className={styles.sidebar}>
                <div className={`${styles.infoCard} glass-card`}>
                    <Skeleton className={styles.skeletonMainTitle} />
                    {[1, 2, 3].map(i => (
                        <div key={i} className={styles.infoItem}>
                            <Skeleton className={styles.skeletonIcon} />
                            <div className={styles.infoContent}>
                                <Skeleton className={styles.skeletonTitle} />
                                <Skeleton className={styles.skeletonValue} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`${styles.socialBox} glass-card`}>
                    <Skeleton className={styles.skeletonSocialTitle} />
                    <div className={styles.socialLinks}>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className={styles.skeletonSocialIcon} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const infoItems = [
        { 
            icon: <Mail size={20} />, 
            title: content?.email?.title, 
            value: content?.email?.value
        },
        { 
            icon: <MessageCircle size={20} />, 
            title: content?.chat?.title, 
            value: content?.chat?.value
        },
        { 
            icon: <MapPin size={20} />, 
            title: content?.location?.title, 
            value: content?.location?.value
        }
    ];

    return (
        <Safeguard error={error}>
            <div className={styles.sidebar}>
                <div className={`${styles.infoCard} glass-card`}>
                    <h3 className={styles.infoTitle}>
                        {content?.title}
                    </h3>

                    {infoItems.map((item, i) => (
                        <div key={i} className={styles.infoItem}>
                            <div className={styles.iconWrapper}>
                                {item.icon}
                            </div>
                            <div className={styles.infoContent}>
                                <h4>{item.title}</h4>
                                <p>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`${styles.socialBox} glass-card`}>
                    <h4 className={styles.socialBoxTitle}>{content?.social?.title}</h4>
                    <div className={styles.socialLinks}>
                        <button className={styles.socialIcon} aria-label="Twitter"><Twitter size={18} /></button>
                        <button className={styles.socialIcon} aria-label="Github"><Github size={18} /></button>
                        <button className={styles.socialIcon} aria-label="Linkedin"><Linkedin size={18} /></button>
                    </div>
                </div>
            </div>
        </Safeguard>
    );
};

export default memo(ContactInfoSidebar);
