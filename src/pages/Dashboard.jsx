import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, TrendingUp, Settings, Trash2, Edit3, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [userTools, setUserTools] = useState([]);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    navigate('/auth');
                    return;
                }

                // Fetch Profile for membership/stats
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(profileData);

                // Fetch Tools submitted by this user
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
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
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
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Approved Tools</span>
                        <TrendingUp size={20} color="var(--secondary)" />
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{userTools.filter(t => t.is_approved).length}</div>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Account type</span>
                        <Settings size={20} color="var(--primary)" />
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--secondary)' }}>{profile?.membership?.toUpperCase() || 'FREE'}</div>
                </div>
            </div>

            <h2 style={{ marginBottom: '1.5rem' }}>Your Tools</h2>
            <div className="tools-list glass-card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Tool Name</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Date</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Pricing</th>
                            <th style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userTools.length > 0 ? (
                            userTools.map(tool => (
                                <tr key={tool.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.5rem', fontWeight: '600' }}>{tool.name}</td>
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
                                    <td style={{ padding: '1.5rem' }}>{new Date(tool.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '1.5rem' }}>{tool.pricing_type}</td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button 
                                                onClick={() => navigate(`/promote?toolId=${tool.id}`)}
                                                title="Promote Tool" 
                                                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                                            >
                                                <Zap size={18} />
                                            </button>
                                            <Link to={`/edit-tool/${tool.id}`} title="Edit" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                                <Edit3 size={18} />
                                            </Link>
                                            <Link to={`/tool/${tool.slug}`} title="View" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ExternalLink size={18} /></Link>
                                            <button title="Delete" style={{ background: 'transparent', border: 'none', color: 'rgba(255, 80, 80, 0.6)', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
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
