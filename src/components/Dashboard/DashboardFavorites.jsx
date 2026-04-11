import React from 'react';
import { Heart, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './DashboardFavorites.module.css';

const DashboardFavorites = ({ favorites }) => {
    if (!favorites || favorites.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Heart size={40} style={{ marginBottom: '1.2rem', opacity: 0.3 }} />
                <h3 style={{ marginBottom: '0.5rem' }}>No favorites yet</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Start exploring the directory to save your favorite tools.</p>
                <Link to="/search" className="btn-primary" style={{ display: 'inline-flex' }}>
                    <Search size={18} style={{ marginRight: '8px' }} /> Browse Tools
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.favoritesList}>
            <div style={{ marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Heart size={20} color="#ff4757" fill="#ff475722" />
                    Saved Favorites
                </h2>
            </div>
            
            {favorites.map((fav) => {
                const tool = fav.tools;
                if (!tool) return null;
                return (
                    <div key={tool.id} className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `url(${tool.image_url}) center/cover no-repeat`, border: '1px solid var(--border)', flexShrink: 0 }}></div>
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <h4 style={{ margin: 0, fontWeight: '700' }}>{tool.name}</h4>
                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                                    {tool.categories?.name || 'Tool'}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {tool.short_description}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to={`/tool/${tool.slug}`} className="btn-secondary" style={{ padding: '8px 12px' }}>
                                <ExternalLink size={16} />
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DashboardFavorites;
