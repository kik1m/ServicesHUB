import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, TrendingUp, Settings, Trash2, Edit3, ExternalLink, Loader2, AlertCircle, Zap, CheckCircle2, Eye, MousePointerClick } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { user, loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [userTools, setUserTools] = useState([]);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setIsLoading(true);
            const timeout = setTimeout(() => {
                if (isLoading) setIsLoading(false);
            }, 6000);

            try {
                // Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                if (profileError) console.error('Profile Fetch Error:', profileError);
                setProfile(profileData);

                // Fetch Tools
                const { data: toolsData, error: toolsError } = await supabase
                    .from('tools')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                
                if (toolsError) throw toolsError;
                setUserTools(toolsData || []);

            } catch (err) {
                console.error('Dashboard Fetch Error:', err);
                setError(err.message);
            } finally {
                clearTimeout(timeout);
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, authLoading, navigate]);

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
            <div className="dashboard-page" style={{ padding: '120px 5% 60px' }}>
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between' }}>
                    <SkeletonLoader type="title" width="300px" />
                    <SkeletonLoader type="text" width="150px" height="45px" borderRadius="12px" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <SkeletonLoader height="140px" borderRadius="24px" />
                    <SkeletonLoader height="140px" borderRadius="24px" />
                    <SkeletonLoader height="140px" borderRadius="24px" />
                </div>
                <SkeletonLoader height="400px" borderRadius="24px" />
            </div>
        );
    }

    return (
        <div className="dashboard-page" style={{ padding: '120px 5% 60px' }}>
            <div className="section-header" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Creator Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your AI & SaaS tool listings</p>
                </div>
                <Link to="/submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                    <Plus size={20} /> Submit New Tool
                </Link>
            </div>

            {error && (
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid #ff475733', color: '#ff4757', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            <div className="stats-grid" style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '1.5rem', marginBottom: '3rem' 
            }}>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Submissions</span>
                        <LayoutGrid size={20} color="var(--primary)" />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{userTools.length}</div>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Clicks</span>
                        <MousePointerClick size={20} color="#00e676" />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{userTools.reduce((sum, t) => sum + (t.click_count || 0), 0)}</div>
                </div>
                <div className="glass-card" style={{ padding: '2rem', border: user?.is_premium ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Account type</span>
                        <Settings size={20} color={user?.is_premium ? '#FFD700' : 'var(--primary)'} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: user?.is_premium ? '#FFD700' : 'white' }}>
                            {user?.is_premium ? 'PREMIUM 💎' : 'FREE'}
                        </div>
                        {!user?.is_premium && (
                            <Link to="/premium" style={{ fontSize: '0.75rem', color: 'var(--secondary)', textDecoration: 'underline' }}>Upgrade</Link>
                        )}
                    </div>
                </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>Your Tools</h2>
            <div className="tools-list glass-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Tool Name</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Analytics</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Marketing</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Date</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Pricing</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userTools.length > 0 ? (
                            userTools.map(tool => (
                                <tr key={tool.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.5rem', fontWeight: '600' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                                                {tool.image_url ? <img src={tool.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Zap size={14} color="var(--primary)" />}
                                            </div>
                                            {tool.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{ 
                                            padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem',
                                            background: tool.is_approved ? 'rgba(0, 210, 255, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                                            color: tool.is_approved ? 'var(--secondary)' : '#ffa500',
                                            border: tool.is_approved ? '1px solid var(--secondary)' : '1px solid #ffa50033'
                                        }}>
                                            {tool.is_approved ? 'Published' : 'Pending'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.85rem' }} title="Tool Views">
                                                <Eye size={14} /> {tool.view_count || 0}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#00e676', fontSize: '0.85rem', fontWeight: 'bold' }} title="Outbound Link Clicks">
                                                <MousePointerClick size={14} /> {tool.click_count || 0}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {tool.is_featured && (
                                                    <span style={{ 
                                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem',
                                                        background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700',
                                                        border: '1px solid rgba(255, 215, 0, 0.2)',
                                                        display: 'flex', alignItems: 'center', gap: '4px'
                                                    }}>
                                                        <TrendingUp size={10} /> Featured
                                                    </span>
                                                )}
                                                {tool.is_verified && (
                                                    <span style={{ 
                                                        padding: '2px 8px', borderRadius: '4px', fontSize: '0.65rem',
                                                        background: 'rgba(0, 210, 255, 0.1)', color: 'var(--secondary)',
                                                        border: '1px solid rgba(0, 210, 255, 0.2)',
                                                        display: 'flex', alignItems: 'center', gap: '4px'
                                                    }}>
                                                        <CheckCircle2 size={10} /> Verified
                                                    </span>
                                                )}
                                                {!tool.is_featured && !tool.is_verified && (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Standard</span>
                                                )}
                                            </div>
                                            {tool.is_featured && tool.featured_until && (
                                                <div style={{ 
                                                    fontSize: '0.65rem', 
                                                    color: 'var(--text-muted)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    marginTop: '2px'
                                                }}>
                                                    <AlertCircle size={10} />
                                                    Expires: {new Date(tool.featured_until).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem' }}>{new Date(tool.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '1.5rem' }}>{tool.pricing_type}</td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button 
                                                onClick={() => navigate(`/promote?toolId=${tool.id}`)}
                                                className="btn-outline"
                                                style={{ 
                                                    padding: '6px 12px', 
                                                    fontSize: '0.75rem', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '5px',
                                                    borderColor: 'var(--primary)',
                                                    color: 'white'
                                                }}
                                            >
                                                <Zap size={14} color="var(--primary)" /> Promote
                                            </button>
                                            <Link to={`/edit-tool/${tool.id}`} title="Edit" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                <Edit3 size={18} />
                                            </Link>
                                            <Link to={`/tool/${tool.slug}`} title="View" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ExternalLink size={18} /></Link>
                                            <button 
                                                onClick={() => handleDeleteTool(tool.id, tool.name)}
                                                title="Delete" 
                                                style={{ background: 'transparent', border: 'none', color: 'rgba(255, 80, 80, 0.6)', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                    You haven't submitted any tools yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
