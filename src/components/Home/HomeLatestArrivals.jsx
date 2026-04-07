import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SkeletonLoader from '../SkeletonLoader';
import { getIcon } from '../../utils/iconMap';

const HomeLatestArrivals = ({ latestTools, loading }) => {
    return (
        <section className="main-section latest-arrivals">
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">New <span className="gradient-text">Arrivals</span></h2>
                    <p className="section-desc">The freshest AI solutions added to our directory this week.</p>
                </div>
                <Link to="/tools" className="view-all-link">Browse All <ArrowRight size={18} /></Link>
            </div>

            <div className="latest-tools-grid-mini">
                {loading ? (
                    [1, 2, 3, 4].map(i => <SkeletonLoader key={i} type="card" />)
                ) : (
                    latestTools.map((tool) => (
                        <Link to={`/tool/${tool.slug}`} key={tool.id} className="glass-card latest-tool-mini">
                            <div className="latest-tool-icon-box">
                                {tool.image_url ? (
                                    <img src={tool.image_url} alt={tool.name} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg ...></svg>'; }} />
                                ) : (
                                    getIcon(tool.icon_name || 'Zap')
                                )}
                            </div>
                            <div className="latest-tool-info-mini">
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
