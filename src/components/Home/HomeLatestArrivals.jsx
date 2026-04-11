import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SkeletonLoader from '../SkeletonLoader';
import { getIcon } from '../../utils/iconMap';
import styles from './HomeLatestArrivals.module.css';

const HomeLatestArrivals = ({ latestTools, loading }) => {
    return (
        <section className="main-section latest-arrivals">
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">New <span className="gradient-text">Arrivals</span></h2>
                    <p className="section-desc">The freshest AI solutions added to our directory this week.</p>
                </div>
                <Link to="/tools" className={styles.viewAllLink}>Browse All <ArrowRight size={18} /></Link>
            </div>

            <div className={styles.latestToolsGridMini}>
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => <SkeletonLoader key={i} type="trending" />)
                ) : (
                    (latestTools || []).map((tool) => (
                        <Link to={`/tool/${tool?.slug}`} key={tool?.id} className={`glass-card ${styles.latestToolMini}`}>
                            <div className={styles.latestToolIconBox}>
                                {tool.image_url ? (
                                    <img src={tool.image_url} alt={tool.name} />
                                ) : (
                                    getIcon(tool.icon_name || 'Zap')
                                )}
                            </div>
                            <div className={styles.latestToolInfoMini}>
                                <h4>{tool.name}</h4>
                                <p>{tool.categories?.name}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
};

export default HomeLatestArrivals;
