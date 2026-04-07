import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import SkeletonLoader from '../SkeletonLoader';
import { getIcon } from '../../utils/iconMap';

const HomeTrending = ({ trendingTools, loading }) => {
    return (
        <section className="main-section trending-section">
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">Trending <span className="gradient-text">Now</span></h2>
                    <p className="section-desc">Popular tools and AI solutions gaining traction today.</p>
                </div>
                <span className="live-pill"><span className="dot"></span> LIVE DATA</span>
            </div>
            <div className="trending-grid">
                {loading ? (
                    [1, 2, 3, 4].map(i => <SkeletonLoader key={i} type="card" />)
                ) : (
                    trendingTools.map(tool => (
                        <Link to={`/tool/${tool.slug}`} key={tool.id} className="trending-item glass-card">
                            <div className="trending-tool-icon">
                                {tool.image_url ? <img src={tool.image_url} alt={tool.name} /> : getIcon(tool.icon_name || 'Zap')}
                            </div>
                            <div className="trending-tool-info">
                                <h4>{tool.name}</h4>
                                <div className="trending-stats">
                                    <TrendingUp size={12} /> {(tool.view_count || 0).toLocaleString()} views
                                </div>
                            </div>
                            <ArrowRight size={18} className="trending-arrow" />
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
};

export default HomeTrending;
