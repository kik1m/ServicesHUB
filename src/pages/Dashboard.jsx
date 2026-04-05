import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, Plus, PlusCircle, TrendingUp, Settings, Trash2, Edit3, ExternalLink, AlertCircle, Zap, CheckCircle2, MousePointerClick, Heart, Star, ArrowRight, Share2, MousePointer2 } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';

const Dashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [userTools, setUserTools] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);

    useSEO({
        title: userTools.length > 0 ? 'Creator Dashboard | ServicesHUB' : 'My Dashboard | ServicesHUB',
        description: 'Manage your submissions, track views, and explore your favorite tools all in one place.',
        url: window.location.href
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setIsLoading(true);
            setError(null);
            
            try {
                // Fetch Tools
                const { data: toolsData, error: toolsErr } = await supabase.from('tools')
                    .select('id, name, slug, short_description, image_url, pricing_type, is_approved, is_featured, is_verified, featured_until, created_at, view_count, rating')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (toolsErr) console.warn('Dashboard: Tools fetch failed:', toolsErr.message);
                setUserTools(toolsData || []);

                // Fetch Favorites
                const { data: favsData, error: favsErr } = await supabase.from('favorites')
                    .select('tool_id, tools(id, name, slug, short_description, image_url, pricing_type, is_verified, categories(name))')
                    .eq('user_id', user.id);
                
                if (favsErr) console.warn('Dashboard: Favorites fetch failed:', favsErr.message);
                setFavorites(favsData || []);

            } catch (err) {
                console.error('Dashboard Critical Error:', err);
                setError("Unable to sync dashboard data completely.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, authLoading, navigate, showToast]);

    const handleDeleteTool = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
        
        try {
            const { error } = await supabase.from('tools').delete().eq('id', id);
            if (error) throw error;
            setUserTools(prev => prev.filter(t => t.id !== id));
            showToast('Tool deleted successfully.', 'success');
        } catch (err) {
            showToast('Error deleting tool: ' + err.message, 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="dashboard-page" style={{ padding: '80px 5% 60px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <SkeletonLoader type="text" width="120px" style={{ marginBottom: '1rem' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <SkeletonLoader type="title" width="300px" />
                        <SkeletonLoader type="text" width="150px" height="40px" borderRadius="10px" />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    <SkeletonLoader height="120px" borderRadius="20px" />
                    <SkeletonLoader height="120px" borderRadius="20px" />
                    <SkeletonLoader height="120px" borderRadius="20px" />
                </div>
                <SkeletonLoader height="350px" borderRadius="20px" />
            </div>
        );
    }

    const isCreator = userTools.length > 0;

    return (
        <div className="dashboard-page" style={{ padding: '80px 5% 60px' }}>
            <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Dashboard' }]} />
            
            <header className="page-header hero-section-slim" style={{ marginBottom: '2rem' }}>
                <div className="hero-content" style={{ textAlign: 'left', margin: 0, padding: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <div>
                            <div className="badge">MEMBER AREA</div>
                            <h1 className="hero-title-slim" style={{ fontSize: '2.5rem' }}>
                                {isCreator ? 'Creator ' : 'My '}<span className="gradient-text">Dashboard</span>
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                                {isCreator ? 'Monitoring your tool clinical performance and listings' : 'Explore your favorites and community activity'}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => {
                                    const url = `${window.location.origin}/u/${user.id}`;
                                    navigator.clipboard.writeText(url);
                                    showToast('Public profile link copied!', 'success');
                                }}
                                className="btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', cursor: 'pointer' }}
                            >
                                <Share2 size={18} /> Share Profile
                            </button>
                            <Link to="/submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', padding: '12px 20px' }}>
                                <Plus size={18} /> {isCreator ? 'Submit Tool' : 'Become Creator'}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {error && (
                <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', border: '1px solid #ff475733', color: '#ff4757', display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9rem' }}>
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            <div className="stats-grid" style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '1rem', marginBottom: '2rem' 
            }}>
                <div className="glass-card compact-glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{isCreator ? 'Total Submissions' : 'Saved Tools'}</span>
                        {isCreator ? <LayoutGrid size={18} color="var(--primary)" /> : <Heart size={18} color="#ff4757" />}
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800' }}>{isCreator ? userTools.length : favorites.length}</div>
                </div>
                
                <div className="glass-card compact-glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{isCreator ? 'Total Views' : 'Account Status'}</span>
                        {isCreator ? <MousePointerClick size={18} color="#00e676" /> : <Star size={18} color="var(--secondary)" />}
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: '800' }}>
                        {isCreator ? userTools.reduce((sum, t) => sum + (t.view_count || 0), 0) : 'Active'}
                    </div>
                </div>

                <div className="glass-card compact-glass-card" style={{ padding: '1.5rem', border: user?.is_premium ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Plan Tier</span>
                        <Zap size={18} color={user?.is_premium ? '#FFD700' : 'var(--primary)'} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: user?.is_premium ? '#FFD700' : 'white' }}>
                            {user?.is_premium ? 'PREMIUM' : 'FREE'}
                        </div>
                        {!user?.is_premium && (
                            <Link to="/premium" style={{ fontSize: '0.7rem', color: 'var(--secondary)', textDecoration: 'underline' }}>Upgrade</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Content for Publishers */}
            {isCreator && (
                <>
                    <div className="glass-card chart-container compact-glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>Views Per Tool</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track engagement for each listing</p>
                            </div>
                            <div style={{ padding: '6px 12px', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--secondary)', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <TrendingUp size={12} /> Live Data
                            </div>
                        </div>

                        {(() => {
                            const maxViews = Math.max(...userTools.map(t => t.view_count || 0), 1);
                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {userTools.map(tool => {
                                        const pct = Math.max(((tool.view_count || 0) / maxViews) * 100, 2);
                                        return (
                                            <div key={tool.id}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{tool.name}</span>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>{(tool.view_count || 0).toLocaleString()} views</span>
                                                </div>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '100px', height: '6px', overflow: 'hidden' }}>
                                                    <div style={{ 
                                                        width: `${pct}%`, height: '100%',
                                                        background: tool.is_featured ? 'linear-gradient(90deg, #FFD700, #FF8C00)' : 'var(--gradient)',
                                                        borderRadius: '100px',
                                                        transition: 'width 0.8s ease'
                                                    }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Your Active Listings</h2>
                    </div>

                    <div className="tools-list glass-card compact-glass-card" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Tool Info</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Status</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Marketing</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Pricing</th>
                                    <th style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userTools.map(tool => (
                                    <tr key={tool.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {tool.image_url ? <img src={tool.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Zap size={12} color="var(--primary)" />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{tool.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Created {new Date(tool.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{ 
                                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem',
                                                background: tool.is_approved ? 'rgba(0, 210, 255, 0.05)' : 'rgba(255, 165, 0, 0.05)',
                                                color: tool.is_approved ? 'var(--secondary)' : '#ffa500',
                                                border: `1px solid ${tool.is_approved ? 'var(--secondary-glow)' : 'rgba(255,165,0,0.2)'}`
                                            }}>
                                                {tool.is_approved ? 'Published' : 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    {tool.is_featured && <TrendingUp size={14} color="#FFD700" title="Featured" />}
                                                    {tool.is_verified && <CheckCircle2 size={14} color="var(--secondary)" title="Verified" />}
                                                    {!tool.is_featured && !tool.is_verified && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</span>}
                                                </div>
                                                {tool.is_featured && tool.featured_until && (() => {
                                                    const daysLeft = Math.max(0, Math.ceil((new Date(tool.featured_until) - new Date()) / (1000 * 60 * 60 * 24)));
                                                    const isExpired = daysLeft === 0;
                                                    return (
                                                        <div style={{ fontSize: '0.65rem', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                                            <span style={{ color: isExpired ? '#ff4757' : daysLeft <= 5 ? '#ffa500' : '#00e676', fontWeight: 'bold' }}>
                                                                {isExpired ? 'Expired' : `${daysLeft}d left`}
                                                            </span>
                                                            <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                                                Until {new Date(tool.featured_until).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{tool.pricing_type}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                <button onClick={() => navigate(`/edit-tool/${tool.id}`)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit3 size={16} /></button>
                                                <button onClick={() => navigate(`/tool/${tool.slug}`)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ExternalLink size={16} /></button>
                                                <button onClick={() => handleDeleteTool(tool.id, tool.name)} style={{ background: 'none', border: 'none', color: 'rgba(255, 71, 87, 0.5)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* Content for Seekers (Favorites & Welcome) */}
            {!isCreator && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="favorites-summary">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Your <span className="gradient-text">Favorites</span></h2>
                            {favorites.length > 0 && <Link to="/profile" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}>View All</Link>}
                        </div>

                        {favorites.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {favorites.slice(0, 4).map(fav => fav.tools && (
                                    <Link key={fav.tools.id} to={`/tool/${fav.tools.slug}`} className="glass-card compact-glass-card" style={{ 
                                        padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'inherit'
                                    }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', overflow: 'hidden', flexShrink: 0 }}>
                                            {fav.tools.image_url ? <img src={fav.tools.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <LayoutGrid size={18} color="var(--primary)" />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{fav.tools.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fav.tools.categories?.name || 'Category'}</p>
                                        </div>
                                        <Star size={14} fill="var(--primary)" color="var(--primary)" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <Heart size={32} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p style={{ fontSize: '0.9rem' }}>No favorites yet. Start exploring!</p>
                                <Link to="/tools" className="btn-text" style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>Browse AI Tools</Link>
                            </div>
                        )}
                    </div>

                    <div className="welcome-banner">
                        <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.05) 0%, rgba(58, 123, 213, 0.05) 100%)', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Want to Publish?</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                Showcase your AI or SaaS tool to thousands of monthly visitors.
                            </p>
                            <Link to="/submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', textDecoration: 'none', fontSize: '0.85rem' }}>
                                <PlusCircle size={16} /> Submit Your Tool
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
