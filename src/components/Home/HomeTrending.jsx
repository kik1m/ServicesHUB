import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import SkeletonLoader from '../SkeletonLoader';
import { getIcon } from '../../utils/iconMap';
import styles from './HomeTrending.module.css';

const HomeTrending = ({ trendingTools, loading }) => {
    return (
        <section className={`main-section ${styles.trendingSection}`}>
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">Trending <span className="gradient-text">Now</span></h2>
                    <p className="section-desc">Popular tools and AI solutions gaining traction today.</p>
                </div>
                <span className={styles.livePill}><span className={styles.dot}></span> LIVE DATA</span>
            </div>
            <div className={styles.trendingGrid}>
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => <SkeletonLoader key={i} type="trending" />)
                ) : (
                    (trendingTools || []).map(tool => (
                        <Link to={`/tool/${tool?.slug}`} key={tool?.id} className={`${styles.trendingItem} glass-card`}>
                            <div className={styles.trendingToolIcon}>
                                {tool.image_url ? <img src={tool.image_url} alt={tool.name} /> : getIcon(tool.icon_name || 'Zap')}
                            </div>
                            <div className={styles.trendingToolInfo}>
                                <h4>{tool.name}</h4>
                                <div className={styles.trendingStats}>
                                    <TrendingUp size={12} /> {(tool.view_count || 0).toLocaleString()} views
                                </div>
                            </div>
                            <ArrowRight size={18} className={styles.trendingArrow} />
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
};

export default HomeTrending;
