import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Users, Zap, CheckCircle, Clock, ArrowUpRight, Loader2, AlertCircle, FileText, PlusCircle, Trash2, LayoutGrid, Image as ImageIcon, X } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import { useNavigate, Link } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [pendingTools, setPendingTools] = useState([]);
    const [featuredTools, setFeaturedTools] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogCategories, setBlogCategories] = useState([]);
    const [stats, setStats] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'featured', 'blogs', 'add-tool', 'categories'
    
    // Form States
    const [newPost, setNewPost] = useState({ title: '', excerpt: '', content: '', category: '', image_url: '' });
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', icon: '' });
    const [newTool, setNewTool] = useState({ name: '', description: '', url: '', category_id: '', pricing_type: 'Free', image_url: '' });
    const [toolCategories, setToolCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (file, bucket = 'tool-images', folder = 'tool-thumbnails') => {
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            return publicUrl;
        } catch (err) {
            console.error('Upload error:', err);
            showToast('Upload failed: ' + err.message, 'error');
            return null;
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const checkAdminAndFetchData = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setLoading(true);
            try {

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

                // Fetch Blogs
                const { data: blogs } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
                setBlogPosts(blogs || []);

                // Fetch Categories for Forms
                const { data: blogCats } = await supabase.from('blog_categories').select('*');
                setBlogCategories(blogCats || []);

                const { data: toolCats } = await supabase.from('categories').select('*');
                setToolCategories(toolCats || []);

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

    const handleApprove = async (tool) => {
        try {
            const { error } = await supabase
                .from('tools')
                .update({ is_approved: true })
                .eq('id', tool.id);
            
            if (error) throw error;

            // Persistent Notification to tool owner
            await sendNotification(
                tool.user_id,
                'Tool Approved! 🎉',
                `Great news! Your tool "${tool.name}" has been approved and is now live.`,
                'approval'
            );

            setPendingTools(prev => prev.filter(t => t.id !== tool.id));
            showToast('Tool approved and user notified! 🎉', 'success');
        } catch (err) {
            showToast('Error approving tool: ' + err.message, 'error');
        }
    };

    const handleReject = async (tool) => {
        if (!window.confirm(`Are you sure you want to reject and delete "${tool.name}"?`)) return;
        try {
            const { error } = await supabase
                .from('tools')
                .delete()
                .eq('id', tool.id);
            
            if (error) throw error;

            // Persistent Notification to tool owner
            await sendNotification(
                tool.user_id,
                'Tool Submission Update',
                `We're sorry, but your submission "${tool.name}" was not approved at this time.`,
                'rejection'
            );

            setPendingTools(prev => prev.filter(t => t.id !== tool.id));
            showToast('Tool rejected and user notified.', 'info');
        } catch (err) {
            showToast('Error rejecting tool: ' + err.message, 'error');
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
            showToast('Featured status removed.', 'success');
        } catch (err) {
            showToast('Error removing feature: ' + err.message, 'error');
        }
    };

    const handleCreateBlogPost = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data, error } = await supabase.from('blog_posts').insert([newPost]).select();
            if (error) throw error;
            setBlogPosts([data[0], ...blogPosts]);
            setNewPost({ title: '', excerpt: '', content: '', category: '', image_url: '' });
            showToast('Blog post published! 🎉', 'success');
        } catch (err) {
            showToast('Error creating blog: ' + err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBlog = async (id) => {
        if (!window.confirm('Delete this article?')) return;
        try {
            const { error } = await supabase.from('blog_posts').delete().eq('id', id);
            if (error) throw error;
            setBlogPosts(prev => prev.filter(p => p.id !== id));
            showToast('Article deleted.', 'info');
        } catch (err) {
            showToast('Error deleting: ' + err.message, 'error');
        }
    };

    const handleDirectAddTool = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase.from('tools').insert([{
                ...newTool,
                user_id: user.id,
                is_approved: true
            }]).select();
            
            if (error) throw error;
            showToast('Tool added and approved successfully! 🎉', 'success');
            setNewTool({ name: '', description: '', url: '', category_id: '', pricing_type: 'Free', image_url: '' });
            // Update stats
        } catch (err) {
            showToast('Error adding tool: ' + err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data, error } = await supabase.from('categories').insert([newCategory]).select();
            if (error) throw error;
            setToolCategories([...toolCategories, data[0]]);
            setNewCategory({ name: '', slug: '', icon: '' });
            showToast('Category added! 🎉', 'success');
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete category? This might break tools using it!')) return;
        try {
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) throw error;
            setToolCategories(prev => prev.filter(c => c.id !== id));
            showToast('Category deleted.', 'info');
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    };

    if (loading) {
        return (
            <div className="admin-page" style={{ padding: '120px 5% 60px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <SkeletonLoader type="title" width="400px" />
                    <SkeletonLoader type="text" width="300px" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    <SkeletonLoader height="100px" borderRadius="16px" />
                    <SkeletonLoader height="100px" borderRadius="16px" />
                    <SkeletonLoader height="100px" borderRadius="16px" />
                    <SkeletonLoader height="100px" borderRadius="16px" />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                    <SkeletonLoader width="150px" height="40px" borderRadius="10px" />
                    <SkeletonLoader width="150px" height="40px" borderRadius="10px" />
                    <SkeletonLoader width="150px" height="40px" borderRadius="10px" />
                </div>
                <SkeletonLoader height="500px" borderRadius="24px" />
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, i) => (
                        <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2px' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
                    {[
                        { id: 'pending', label: 'Approval Queue', icon: <Clock size={16} /> },
                        { id: 'featured', label: 'Featured Tools', icon: <Zap size={16} /> },
                        { id: 'blogs', label: 'Blog Manager', icon: <FileText size={16} /> },
                        { id: 'categories', label: 'Categories', icon: <LayoutGrid size={16} /> },
                        { id: 'add-tool', label: 'Quick Add Tool', icon: <PlusCircle size={16} /> }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', 
                                background: activeTab === tab.id ? 'var(--gradient)' : 'transparent',
                                border: 'none', color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                                borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem',
                                transition: 'all 0.3s'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'pending' || activeTab === 'featured' ? '2fr 1fr' : '1fr', gap: '2rem' }}>
                    {/* Main Content Area */}
                    <div className="glass-card" style={{ padding: '2rem' }}>
                        
                        {activeTab === 'pending' && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Approvals Queue</h2>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--secondary)', fontWeight: '700' }}>{pendingTools.length} PENDING</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {pendingTools.map(tool => (
                                        <div key={tool.id} className="admin-queue-item" style={{ 
                                            padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '18px',
                                            border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                        }}>
                                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                    {tool.image_url ? <img src={tool.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : tool.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>{tool.name}</h4>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tool.categories?.name} • {new Date(tool.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleApprove(tool)} className="btn-primary-slim" style={{ background: '#00ff88', color: '#000', fontWeight: '800' }}>Approve</button>
                                                <button onClick={() => handleReject(tool)} style={{ background: 'rgba(255, 80, 80, 0.1)', color: '#ff5050' }} className="btn-primary-slim">Reject</button>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingTools.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No pending tools.</p>}
                                </div>
                            </>
                        )}

                        {activeTab === 'featured' && (
                            <>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem' }}>Featured Tools Manager</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                    {featuredTools.map(tool => (
                                        <div key={tool.id} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                                            <h4 style={{ fontWeight: '800', marginBottom: '5px' }}>{tool.name}</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Expires: {new Date(tool.featured_until).toLocaleDateString()}</p>
                                            <button onClick={() => handleRemoveFeature(tool.id)} style={{ width: '100%', background: 'rgba(255,80,80,0.1)', color: '#ff5050', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>Remove Status</button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activeTab === 'blogs' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Create New Article</h3>
                                    <form onSubmit={handleCreateBlogPost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <input type="text" placeholder="Title" required value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} className="nav-search-wrapper" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white' }} />
                                        
                                        <CustomSelect 
                                            options={blogCategories}
                                            value={newPost.category}
                                            onChange={(val) => setNewPost({...newPost, category: val})}
                                            placeholder="Select Blog Category"
                                            style={{ marginBottom: '0' }}
                                        />

                                        <div className="file-upload-wrapper" style={{ padding: '1rem' }}>
                                            {newPost.image_url ? (
                                                <div className="preview-img-container" style={{ height: '120px' }}>
                                                    <img src={newPost.image_url} alt="Preview" style={{ height: '100%', objectFit: 'cover' }} />
                                                    <button type="button" className="remove-upload-btn" onClick={() => setNewPost({...newPost, image_url: ''})}><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <label className="file-upload-label" style={{ padding: '1rem', minHeight: '100px' }}>
                                                    <input type="file" accept="image/*" onChange={async (e) => {
                                                        const url = await handleFileUpload(e.target.files[0], 'tool-images', 'blog-images');
                                                        if (url) setNewPost({...newPost, image_url: url});
                                                    }} style={{ display: 'none' }} />
                                                    <ImageIcon size={20} color="var(--primary)" />
                                                    <span style={{ fontSize: '0.8rem' }}>Upload Header Image</span>
                                                </label>
                                            )}
                                        </div>

                                        <textarea placeholder="Short Excerpt..." rows="3" value={newPost.excerpt} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} className="nav-search-wrapper" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white' }}></textarea>
                                        <textarea placeholder="Article Content (HTML/Text)..." rows="6" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} className="nav-search-wrapper" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white' }}></textarea>
                                        <button type="submit" disabled={submitting || uploading} className="btn-primary" style={{ width: '100%' }}>{(submitting || uploading) ? <Loader2 className="animate-spin" size={20} /> : 'Publish Article'}</button>
                                    </form>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Manage Articles ({blogPosts.length})</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
                                        {blogPosts.map(post => (
                                            <div key={post.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <h5 style={{ fontWeight: '700' }}>{post.title}</h5>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.category} • {new Date(post.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <button onClick={() => handleDeleteBlog(post.id)} style={{ color: '#ff5050', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'add-tool' && (
                            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '2rem' }}>Direct Tool Addition</h2>
                                    <form onSubmit={handleDirectAddTool} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <input type="text" placeholder="Tool Name" required value={newTool.name} onChange={e => setNewTool({...newTool, name: e.target.value})} className="nav-search-wrapper" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white' }} />
                                        <input type="text" placeholder="Tool URL" required value={newTool.url} onChange={e => setNewTool({...newTool, url: e.target.value})} className="nav-search-wrapper" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white' }} />
                                        
                                        <CustomSelect 
                                            options={[
                                                { label: 'Free', value: 'Free' },
                                                { label: 'Paid', value: 'Paid' },
                                                { label: 'Freemium', value: 'Freemium' }
                                            ]}
                                            value={newTool.pricing_type}
                                            onChange={(val) => setNewTool({...newTool, pricing_type: val})}
                                            placeholder="Pricing"
                                            style={{ marginBottom: '0' }}
                                        />

                                        <CustomSelect 
                                            options={toolCategories}
                                            value={newTool.category_id}
                                            onChange={(val) => setNewTool({...newTool, category_id: val})}
                                            placeholder="Select Category"
                                            style={{ marginBottom: '0' }}
                                        />

                                        <div className="file-upload-wrapper" style={{ gridColumn: 'span 2', padding: '1rem' }}>
                                            {newTool.image_url ? (
                                                <div className="preview-img-container" style={{ height: '80px', width: '80px' }}>
                                                    <img src={newTool.image_url} alt="Preview" />
                                                    <button type="button" className="remove-upload-btn" onClick={() => setNewTool({...newTool, image_url: ''})}><X size={14} /></button>
                                                </div>
                                            ) : (
                                                <label className="file-upload-label" style={{ padding: '0.8rem', minHeight: '60px' }}>
                                                    <input type="file" accept="image/*" onChange={async (e) => {
                                                        const url = await handleFileUpload(e.target.files[0]);
                                                        if (url) setNewTool({...newTool, image_url: url});
                                                    }} style={{ display: 'none' }} />
                                                    <ImageIcon size={18} color="var(--primary)" />
                                                    <span style={{ fontSize: '0.8rem' }}>Upload Tool Thumbnail</span>
                                                </label>
                                            )}
                                        </div>

                                        <textarea placeholder="Tool Description..." rows="4" value={newTool.description} onChange={e => setNewTool({...newTool, description: e.target.value})} className="nav-search-wrapper" style={{ gridColumn: 'span 2', width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white' }}></textarea>
                                        <button type="submit" disabled={submitting || uploading} className="btn-primary" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>{(submitting || uploading) ? <Loader2 className="animate-spin" size={20} /> : 'Add Approved Tool'}</button>
                                    </form>
                            </div>
                        )}

                        {activeTab === 'categories' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Add Tool Category</h3>
                                    <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <input type="text" placeholder="Category Name (e.g. Video AI)" required value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} className="nav-search-wrapper" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white' }} />
                                        <input type="text" placeholder="Slug (e.g. video-ai)" required value={newCategory.slug} onChange={e => setNewCategory({...newCategory, slug: e.target.value})} className="nav-search-wrapper" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white' }} />
                                        <input type="text" placeholder="Icon Name (Lucide)" value={newCategory.icon} onChange={e => setNewCategory({...newCategory, icon: e.target.value})} className="nav-search-wrapper" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white' }} />
                                        <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%' }}>{submitting ? <Loader2 className="animate-spin" size={20} /> : 'Add Category'}</button>
                                    </form>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Active Categories ({toolCategories.length})</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        {toolCategories.map(c => (
                                            <div key={c.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.85rem' }}>{c.name}</span>
                                                <button onClick={() => handleDeleteCategory(c.id)} style={{ color: '#ff5050', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area (Only for pending/featured) */}
                    {(activeTab === 'pending' || activeTab === 'featured') && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                            </div>
                            
                            <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--gradient)', color: 'white' }}>
                                <h4 style={{ fontWeight: '800', marginBottom: '10px' }}>Admin Shortcuts</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Link to="/tools" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowUpRight size={14} /> View Directory</Link>
                                    <Link to="/blog" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}><ArrowUpRight size={14} /> View Blog</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
