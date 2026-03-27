import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LayoutDashboard, Users, Zap, CheckCircle, XCircle, BarChart3, Clock, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [pendingTools, setPendingTools] = useState([]);
    const [featuredTools, setFeaturedTools] = useState([]);
    const [stats, setStats] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAdminAndFetchData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/auth');
                    return;
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile?.role !== 'admin') {
                    navigate('/');
                    return;
                }

                setIsAdmin(true);

                // Fetch Pending Tools
                const { data: pending, error: pendingError } = await supabase
                    .from('tools')
                    .select('*, categories(name)')
                    .eq('is_approved', false)
                    .order('created_at', { ascending: false });
                
                if (pendingError) throw pendingError;
                setPendingTools(pending || []);

                // Fetch Featured Tools
                const { data: featured, error: featuredError } = await supabase
                    .from('tools')
                    .select('*, categories(name)')
                    .eq('is_featured', true)
                    .order('featured_until', { ascending: true });
                
                if (featuredError) throw featuredError;
                setFeaturedTools(featured || []);

                // Fetch Platform Stats
                const { count: toolsCount } = await supabase.from('tools').select('*', { count: 'exact', head: true });
                const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                const { count: pendingCount } = await supabase.from('tools').select('*', { count: 'exact', head: true }).eq('is_approved', false);

                setStats([
                    { label: 'Total Tools', value: toolsCount || 0, icon: <Zap size={20} />, color: 'var(--primary)' },
                    { label: 'Total Users', value: usersCount || 0, icon: <Users size={20} />, color: 'var(--secondary)' },
                    { label: 'Pending Apps', value: pendingCount || 0, icon: <Clock size={20} />, color: '#ffcc00' },
                    { label: 'System Status', value: 'Online', icon: <CheckCircle size={20} />, color: '#00ff88' }
                ]);

            } catch (err) {
                console.error('Admin Fetch Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAdminAndFetchData();
    }, [navigate]);

    const handleApprove = async (id) => {
        try {
            const { error } = await supabase
                .from('tools')
                .update({ is_approved: true })
                .eq('id', id);
            
            if (error) throw error;
            setPendingTools(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert('Error approving tool: ' + err.message);
        }
    };

    const handleRemoveFeature = async (id) => {
        if (!window.confirm('Are you sure you want to remove the featured status?')) return;
        try {
            const { error } = await supabase
                .from('tools')
                .update({ is_featured: false, featured_until: null })
                .eq('id', id);
            
            if (error) throw error;
            setFeaturedTools(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert('Error removing feature: ' + err.message);
        }
    };

    if (loading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="admin-page" style={{ padding: '120px 5% 60px' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Admin Control Center</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, Moderator. Here's what's happening today.</p>
                </div>

                {error && (
                    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid #ff475733', color: '#ff4757', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Approval Queue */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Approvals Queue</h2>
                            <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '700' }}>
                                {pendingTools.length} PENDING
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {pendingTools.length > 0 ? (
                                pendingTools.map(tool => (
                                    <div key={tool.id} className="admin-queue-item" style={{ 
                                        padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '18px',
                                        border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                    }}>
                                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                            <div style={{ width: '45px', height: '45px', background: 'var(--gradient)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>
                                                {tool.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{tool.name}</h4>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                    {tool.categories?.name} • {new Date(tool.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button 
                                                onClick={() => handleApprove(tool.id)}
                                                className="btn-primary-slim" 
                                                style={{ padding: '8px 15px', fontSize: '0.75rem', background: '#00ff88', color: '#070709', border: 'none', borderRadius: '100px', cursor: 'pointer', fontWeight: '700' }}
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReject(tool.id)}
                                                style={{ padding: '8px 15px', fontSize: '0.75rem', background: 'rgba(255, 80, 80, 0.1)', color: '#ff5050', border: '1px solid #ff5050', borderRadius: '100px', cursor: 'pointer' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    No tools awaiting approval. Good job!
                                </div>
                            )}
                        </div>
                    </div>

                        {/* Quick Stats / Feedback */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Featured Tools</h2>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>{featuredTools.length} ACTIVE</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    {featuredTools.map(tool => (
                                        <div key={tool.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <span style={{ fontWeight: '700' }}>{tool.name}</span>
                                                <button onClick={() => handleRemoveFeature(tool.id)} style={{ background: 'none', border: 'none', color: '#ff5050', cursor: 'pointer', fontSize: '0.7rem' }}>Remove</button>
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                                                Expires: {new Date(tool.featured_until).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                    {featuredTools.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>No featured tools.</p>}
                                </div>
                            </div>

                            <div className="glass-card" style={{ padding: '2rem' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Platform Health</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                                            <span>Database Connection</span>
                                            <span style={{ color: 'var(--secondary)' }}>Stable</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                            <div style={{ width: '100%', height: '100%', background: 'var(--secondary)', borderRadius: '10px' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                                            <span>Auth Service</span>
                                            <span style={{ color: 'var(--primary)' }}>Active</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                            <div style={{ width: '100%', height: '100%', background: 'var(--primary)', borderRadius: '10px' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--gradient)', borderRadius: '20px', color: 'white' }}>
                                    <h4 style={{ fontWeight: '800', marginBottom: '10px' }}>Admin Protocol</h4>
                                    <p style={{ fontSize: '0.8rem', opacity: 0.9, lineHeight: '1.4' }}>All approved tools are instantly visible to the public. Be sure to verify the website URL before approving.</p>
                                    <button className="nav-login-btn-slim" style={{ background: 'white', color: 'black', width: '100%', marginTop: '1rem' }}>Review Guidelines</button>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
