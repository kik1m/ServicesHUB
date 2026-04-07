import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, LayoutGrid } from 'lucide-react';

const DashboardFavorites = ({ favorites }) => {
    return (
        <div className="favorites-summary">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Your <span className="gradient-text">Favorites</span></h2>
                {favorites.length > 0 && <Link to="/profile" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>View All</Link>}
            </div>

            <div className="favorites-container">
                {favorites.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {favorites.slice(0, 4).map(fav => fav.tools && (
                            <Link key={fav.tools.id} to={`/tool/${fav.tools.slug}`} className="glass-card compact-glass-card" style={{
                                padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit', transition: '0.3s'
                            }}>
                                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', overflow: 'hidden', flexShrink: 0 }}>
                                    {fav.tools.image_url ? 
                                        <img src={fav.tools.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                                        <LayoutGrid size={18} color="var(--primary)" />
                                    }
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>{fav.tools.name}</h4>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fav.tools.categories?.name || 'Category'}</p>
                                </div>
                                <Star size={14} fill="var(--primary)" color="var(--primary)" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '24px' }}>
                        <Heart size={42} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>No favorites yet. Start exploring!</p>
                        <Link to="/tools" className="btn-primary" style={{ fontSize: '0.8rem', padding: '10px 24px', textDecoration: 'none' }}>Browse AI Tools</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardFavorites;
