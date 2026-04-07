import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { 
    Loader2, 
    Zap, 
    Users, 
    Clock, 
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import '../styles/pages/AdminDashboard.css';

// Import Modular Components
import AdminStats from '../components/Admin/AdminStats';
import AdminGrowthChart from '../components/Admin/AdminGrowthChart';
import AdminTabs from '../components/Admin/AdminTabs';
import AdminQueue from '../components/Admin/AdminQueue';
import AdminBlogManager from '../components/Admin/AdminBlogManager';
import AdminSettingsManager from '../components/Admin/AdminSettingsManager';
import AdminUserManager from '../components/Admin/AdminUserManager';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminReviewModal from '../components/Admin/AdminReviewModal';

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
    const [activeTab, setActiveTab] = useState('pending');
    const [allUsers, setAllUsers] = useState([]);
    const [subscribers, setSubscribers] = useState([]);

    // Admin Tool Search (for Featured Management)
    const [adminSearchQuery, setAdminSearchQuery] = useState('');
    const [adminSearchResults, setAdminSearchResults] = useState([]);
    const [isSearchingTools, setIsSearchingTools] = useState(false);

    // Modal & Review States
    const [selectedReview, setSelectedReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Form States
    const [newPost, setNewPost] = useState({ title: '', excerpt: '', content: '', category: '', image_url: '' });
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', icon_name: '' });
    const [newTool, setNewTool] = useState({ 
        name: '', 
        url: '', 
        short_description: '', 
        description: '', 
        category_id: '', 
        pricing_type: 'Free', 
        pricing_details: '', 
        image_url: '', 
        features: [] 
    });
    const [adminImagePreview, setAdminImagePreview] = useState(null);
    const [adminUseManualUrl, setAdminUseManualUrl] = useState(false);
    const [toolCategories, setToolCategories] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (file, bucket = 'tool-images', folder = 'tool-thumbnails') => {
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;
            const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
            return publicUrl;
        } catch (err) {
            showToast('Upload failed: ' + err.message, 'error');
            return null;
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const checkAdminAndFetchData = async () => {
            if (authLoading) return;
            if (!user) { navigate('/auth'); return; }
            setLoading(true);
            try {
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                if (profile?.role !== 'admin') { navigate('/'); return; }
                setIsAdmin(true);

                const { data: pending } = await supabase.from('tools').select('*, categories(name)').or('is_approved.eq.false,pending_changes.not.is.null').order('updated_at', { ascending: false });
                setPendingTools(pending || []);

                const { data: featured } = await supabase.from('tools').select('*, categories(name)').eq('is_featured', true).order('featured_until', { ascending: true });
                setFeaturedTools(featured || []);

                const { data: blogs } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
                setBlogPosts(blogs || []);

                const { data: blogCats } = await supabase.from('blog_categories').select('*');
                setBlogCategories(blogCats || []);

                const { data: toolCats } = await supabase.from('categories').select('*');
                setToolCategories(toolCats || []);

                const { data: usersData } = await supabase.from('profiles').select('id, full_name, avatar_url, role, updated_at, is_premium').order('updated_at', { ascending: false });
                setAllUsers(usersData || []);

                const { data: subsData } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
                setSubscribers(subsData || []);

                const { count: toolsCount } = await supabase.from('tools').select('id', { count: 'exact', head: true });
                const { count: usersCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
                const { count: pendingCount } = await supabase.from('tools').select('id', { count: 'exact', head: true }).or('is_approved.eq.false,pending_changes.not.is.null');

                setStats([
                    { id: 'tools', label: 'Total Tools', value: toolsCount || 0, icon: Zap, color: 'var(--primary)' },
                    { id: 'users', label: 'Total Users', value: usersCount || 0, icon: Users, color: 'var(--secondary)' },
                    { id: 'pending', label: 'Pending Apps', value: pendingCount || 0, icon: Clock, color: '#ffcc00' },
                    { id: 'status', label: 'System Status', value: 'Online', icon: CheckCircle, color: '#00ff88' }
                ]);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        checkAdminAndFetchData();
    }, [navigate, user, authLoading]);

    const handleApprove = async (tool) => {
        try {
            let updatePayload = { is_approved: true };
            let isUpdate = false;
            if (tool.pending_changes) {
                updatePayload = { ...updatePayload, ...tool.pending_changes, pending_changes: null };
                isUpdate = true;
            }
            const { error } = await supabase.from('tools').update(updatePayload).eq('id', tool.id);
            if (error) throw error;
            await sendNotification(tool.user_id, isUpdate ? 'Data Update Approved' : 'New Tool Approved', isUpdate ? `Modifications for "${tool.name}" approved.` : `"${tool.name}" is now live.`, 'approval');
            setPendingTools(prev => prev.filter(t => t.id !== tool.id));
            showToast(isUpdate ? 'Update applied!' : 'Tool approved!', 'success');
        } catch (err) { showToast('Error: ' + err.message, 'error'); }
    };

    const handleReject = async (tool) => {
        const isUpdate = !!tool.pending_changes;
        if (!window.confirm(isUpdate ? `Reject changes for "${tool.name}"?` : `Reject and DELETE "${tool.name}"?`)) return;
        try {
            if (isUpdate) await supabase.from('tools').update({ pending_changes: null }).eq('id', tool.id);
            else await supabase.from('tools').delete().eq('id', tool.id);
            await sendNotification(tool.user_id, 'Update Regarding Your Submission', isUpdate ? `Changes for "${tool.name}" rejected.` : `Submission "${tool.name}" not approved.`, 'rejection');
            setPendingTools(prev => prev.filter(t => t.id !== tool.id));
            showToast('Action completed.', 'info');
        } catch (err) { showToast('Error: ' + err.message, 'error'); }
    };

    const handleCreateBlogPost = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const catObj = blogCategories.find(c => c.id === newPost.category || c.name === newPost.category);
            const { data, error } = await supabase.from('blog_posts').insert([{ ...newPost, category: catObj ? catObj.name : newPost.category, author_id: user.id }]).select();
            if (error) throw error;
            setBlogPosts([data[0], ...blogPosts]);
            setNewPost({ title: '', excerpt: '', content: '', category: '', image_url: '' });
            showToast('Published!', 'success');
        } catch (err) { showToast('Error: ' + err.message, 'error'); } finally { setSubmitting(false); }
    };

    const handleDeleteBlog = async (id) => {
        if (!window.confirm('Delete article?')) return;
        try {
            await supabase.from('blog_posts').delete().eq('id', id);
            setBlogPosts(prev => prev.filter(p => p.id !== id));
            showToast('Deleted.', 'info');
        } catch (err) { showToast('Error: ' + err.message, 'error'); }
    };

    const handleDirectAddTool = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const slug = newTool.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const { error } = await supabase.from('tools').insert([{ 
                ...newTool, 
                slug,
                user_id: user.id, 
                is_approved: true,
                rating: 5.0,
                reviews_count: 0,
                view_count: 0
            }]);
            if (error) throw error;
            showToast('Full tool added and approved!', 'success');
            setNewTool({ 
                name: '', 
                url: '', 
                short_description: '', 
                description: '', 
                category_id: '', 
                pricing_type: 'Free', 
                pricing_details: '', 
                image_url: '', 
                features: [] 
            });
            setAdminImagePreview(null);
        } catch (err) { 
            showToast('Error: ' + err.message, 'error'); 
        } finally { 
            setSubmitting(false); 
        }
    };

    // Admin Feature Handlers
    const handleAdminFeatureChange = (index, value) => {
        const newFeatures = [...(newTool.features || [])];
        newFeatures[index] = value;
        setNewTool(prev => ({ ...prev, features: newFeatures }));
    };

    const addAdminFeature = () => {
        setNewTool(prev => ({ 
            ...prev, 
            features: [...(prev.features || []), ''] 
        }));
    };

    const removeAdminFeature = (index) => {
        setNewTool(prev => ({ 
            ...prev, 
            features: (prev.features || []).filter((_, i) => i !== index) 
        }));
    };

    const handleAdminFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const previewUrl = URL.createObjectURL(file);
        setAdminImagePreview(previewUrl);

        const publicUrl = await handleFileUpload(file);
        if (publicUrl) {
            setNewTool(prev => ({ ...prev, image_url: publicUrl }));
            showToast('Admin thumbnail uploaded!', 'success');
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data, error } = await supabase.from('categories').insert([newCategory]).select();
            if (error) throw error;
            setToolCategories([...toolCategories, data[0]]);
            setNewCategory({ name: '', slug: '', icon_name: '' });
            showToast('Category added!', 'success');
        } catch (err) { showToast('Error: ' + err.message, 'error'); } finally { setSubmitting(false); }
    };

    const handleCreateBlogCategory = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data, error } = await supabase.from('blog_categories').insert([{ name: newCategory.name, slug: newCategory.slug }]).select();
            if (error) throw error;
            setBlogCategories([...blogCategories, data[0]]);
            setNewCategory({ name: '', slug: '', icon_name: '' });
            showToast('Blog Category added!', 'success');
        } catch (err) { showToast('Error: ' + err.message, 'error'); } finally { setSubmitting(false); }
    };

    const handleDeleteBlogCategory = async (id) => {
        if (!window.confirm('Delete blog category?')) return;
        try {
            await supabase.from('blog_categories').delete().eq('id', id);
            setBlogCategories(prev => prev.filter(c => c.id !== id));
            showToast('Deleted.', 'info');
        } catch (err) { showToast('Error: ' + err.message, 'error'); }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Delete tool category?')) return;
        try {
            await supabase.from('categories').delete().eq('id', id);
            setToolCategories(prev => prev.filter(c => c.id !== id));
            showToast('Deleted.', 'info');
        } catch (err) { showToast('Error: ' + err.message, 'error'); }
    };

    const handleAdminSearch = async (e) => {
        const query = e.target.value;
        setAdminSearchQuery(query);
        if (!query.trim()) { setAdminSearchResults([]); return; }
        
        setIsSearchingTools(true);
        try {
            const { data } = await supabase
                .from('tools')
                .select('*, categories(name)')
                .eq('is_approved', true)
                .ilike('name', `%${query}%`)
                .limit(5);
            setAdminSearchResults(data || []);
        } catch (err) { console.error(err); } finally { setIsSearchingTools(false); }
    };

    const handleToggleFeatured = async (tool) => {
        try {
            const { error } = await supabase.from('tools').update({ is_featured: !tool.is_featured }).eq('id', tool.id);
            if (error) throw error;
            
            // Sync Featured list
            setFeaturedTools(prev => tool.is_featured ? prev.filter(t => t.id !== tool.id) : [...prev, { ...tool, is_featured: true }]);
            
            // Sync Search Results
            setAdminSearchResults(prev => prev.map(t => t.id === tool.id ? { ...t, is_featured: !t.is_featured } : t));
            
            // Sync Pending list (if tool was there)
            setPendingTools(prev => prev.map(t => t.id === tool.id ? { ...t, is_featured: !t.is_featured } : t));
            
            showToast('Status updated!', 'success');
        } catch (err) { showToast('Error: ' + err.message, 'error'); }
    };

    if (loading) {
        return (
            <div className="admin-page-container">
                <div className="admin-wrapper">
                    <div className="admin-header-section">
                        <SkeletonLoader type="title" width="400px" />
                        <SkeletonLoader type="text" width="300px" />
                    </div>
                    <div className="admin-skeleton-stats-grid">
                        <SkeletonLoader height="100px" borderRadius="16px" /><SkeletonLoader height="100px" borderRadius="16px" /><SkeletonLoader height="100px" borderRadius="16px" /><SkeletonLoader height="100px" borderRadius="16px" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                        <SkeletonLoader width="150px" height="40px" borderRadius="10px" /><SkeletonLoader width="150px" height="40px" borderRadius="10px" /><SkeletonLoader width="150px" height="40px" borderRadius="10px" />
                    </div>
                    <SkeletonLoader height="500px" borderRadius="24px" />
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="admin-page-container">
            <div className="admin-wrapper">
                <header className="admin-header-section">
                    <h1>Admin Control Center</h1>
                    <p>Welcome back, Moderator. Here&apos;s what&apos;s happening today.</p>
                </header>

                {error && (
                    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid #ff475733', color: '#ff4757', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <AlertCircle size={20} /> {error}
                    </div>
                )}

                <AdminStats stats={stats} />
                <AdminGrowthChart />

                <AdminTabs 
                    activeTab={activeTab} setActiveTab={setActiveTab} 
                    pendingCount={pendingTools.length} blogCount={blogPosts.length}
                    userCount={allUsers.length} newsCount={subscribers.length}
                />

                <div className={`admin-content-grid ${(activeTab === 'pending' || activeTab === 'featured') ? 'with-sidebar' : ''}`}>
                    <div className="glass-card admin-main-card">
                        <AdminQueue 
                            activeTab={activeTab} pendingTools={pendingTools} featuredTools={featuredTools}
                            handleOpenReview={(tool) => { setSelectedReview(tool); setShowReviewModal(true); }}
                            handleReject={handleReject}
                            handleToggleFeatured={handleToggleFeatured}
                            adminSearchQuery={adminSearchQuery}
                            adminSearchResults={adminSearchResults}
                            handleAdminSearch={handleAdminSearch}
                            isSearchingTools={isSearchingTools}
                        />
                        <AdminBlogManager 
                            activeTab={activeTab} blogPosts={blogPosts} newPost={newPost} setNewPost={setNewPost}
                            handleCreateBlogPost={handleCreateBlogPost} handleDeleteBlog={handleDeleteBlog}
                            blogCategories={blogCategories.map(c => ({ value: c.id, label: c.name }))}
                            submitting={submitting} uploading={uploading}
                        />
                        <AdminSettingsManager 
                            activeTab={activeTab} 
                            newTool={newTool} 
                            setNewTool={setNewTool} 
                            handleDirectAddTool={handleDirectAddTool}
                            adminImagePreview={adminImagePreview}
                            adminUseManualUrl={adminUseManualUrl}
                            setAdminUseManualUrl={setAdminUseManualUrl}
                            handleAdminFileChange={handleAdminFileChange}
                            addAdminFeature={addAdminFeature}
                            removeAdminFeature={removeAdminFeature}
                            handleAdminFeatureChange={handleAdminFeatureChange}
                            newCategory={newCategory} setNewCategory={setNewCategory} handleCreateCategory={handleCreateCategory} handleDeleteCategory={handleDeleteCategory} categories={toolCategories}
                            handleCreateBlogCategory={handleCreateBlogCategory} handleDeleteBlogCategory={handleDeleteBlogCategory} blogCategories={blogCategories.map(c => ({ value: c.id, label: c.name }))}
                            submitting={submitting} uploading={uploading}
                        />
                        <AdminUserManager activeTab={activeTab} allUsers={allUsers} subscribers={subscribers} />
                    </div>
                    <AdminSidebar activeTab={activeTab} />
                </div>
            </div>

            <AdminReviewModal 
                showReviewModal={showReviewModal} selectedReview={selectedReview}
                handleCloseReview={() => { setShowReviewModal(false); setSelectedReview(null); }}
                handleApprove={handleApprove} handleReject={handleReject}
                getChangedFields={(live, proposed) => {
                    if (!proposed) return [];
                    const fields = [
                        { key: 'name', label: 'Tool Name' }, { key: 'short_description', label: 'Short Pitch' },
                        { key: 'description', label: 'Description' }, { key: 'url', label: 'Website URL' },
                        { key: 'category_id', label: 'Category' }, { key: 'pricing_type', label: 'Pricing Type' },
                        { key: 'features', label: 'Key Features', isArray: true }, { key: 'image_url', label: 'Thumbnail', isImage: true }
                    ];
                    return fields.filter(f => JSON.stringify(live[f.key]) !== JSON.stringify(proposed[f.key]))
                                 .map(f => ({ ...f, oldValue: live[f.key], newValue: proposed[f.key], isImage: f.key === 'image_url', isArray: f.key === 'features' }));
                }}
            />
        </div>
    );
};

export default AdminDashboard;
