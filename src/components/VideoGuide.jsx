import React, { useState, useCallback } from 'react';
import { CheckCircle2, Star, Zap } from 'lucide-react';
import Button from './ui/Button';
import { VIDEO_GUIDE_CONTENT } from '../constants/homeConstants';
import styles from './VideoGuide.module.css';

const VideoGuide = () => {
    const [activeTab, setActiveTab] = useState('seeker');

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    const current = VIDEO_GUIDE_CONTENT[activeTab];

    return (
        <section className={styles.videoGuideSection}>
            <div className={styles.sectionHeaderCentered}>
                <div className={styles.badge}>LEARN & GROW</div>
                <h2 className={styles.title}>Master <span className={styles.gradientText}>HUBly</span></h2>
                <p className={styles.description}>Choose your journey and unlock the power of professional AI discovery.</p>
            </div>

            <div className={styles.guideTabs}>
                <Button
                    variant={activeTab === 'seeker' ? 'primary' : 'ghost'}
                    className={`${styles.guideTab} ${activeTab === 'seeker' ? styles.guideTabActive : ''}`}
                    onClick={() => handleTabChange('seeker')}
                    icon={Zap}
                >
                    For Tool Seekers
                </Button>
                <Button
                    variant={activeTab === 'publisher' ? 'primary' : 'ghost'}
                    className={`${styles.guideTab} ${activeTab === 'publisher' ? styles.guideTabActive : ''}`}
                    onClick={() => handleTabChange('publisher')}
                    icon={Star}
                >
                    For Tool Publishers
                </Button>
            </div>

            <div className={styles.guideContainer}>
                <div className={styles.guideInfo}>
                    <h3>{current.title}</h3>
                    <p>{current.subtitle}</p>
                    <ul className={styles.guideFeatures}>
                        {current.features.map((feat, i) => (
                            <li key={`${current.id}-feat-${i}`}>
                                <CheckCircle2 size={18} className={styles.featureIcon} /> {feat}
                            </li>
                        ))}
                    </ul>

                </div>

                <div className={styles.guideVideoWrapper}>
                    {current.videoId ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${current.videoId}`}
                            title="HUBly Guide"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className={styles.soonPlaceholder}>
                            <span className={styles.soonText}>SOON</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default VideoGuide;



