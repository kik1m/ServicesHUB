import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2, Plus, Settings, ShieldCheck, Zap, Activity } from 'lucide-react';

// Hooks & Context
import { useAdminData } from '../hooks/useAdminData';

// Components
import AdminStats from '../components/Admin/AdminStats';
import AdminGrowthChart from '../components/Admin/AdminGrowthChart';
import AdminTabs from '../components/Admin/AdminTabs';
import AdminQueue from '../components/Admin/AdminQueue';
import AdminBlogManager from '../components/Admin/AdminBlogManager';
import AdminSettingsManager from '../components/Admin/AdminSettingsManager';
import AdminUserManager from '../components/Admin/AdminUserManager';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminReviewModal from '../components/Admin/AdminReviewModal';

// Styles
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const {
        loading, isAdmin, error, stats, activeTab, setActiveTab,
        pendingTools, featuredTools, blogPosts, blogCategories, toolCategories,
        allUsers, subscribers, adminSearchQuery, adminSearchResults,
        submitting, uploading,
        handleApprove, handleReject, handleAdminSearch, handleToggleFeatured,
        handleCreateBlog, handleDeleteBlog, handleCategoryAction, handleAddToolDirect,
        uploadFile
    } = useAdminData();

    // Local UI States for forms & Modals
    const [selectedReview, setSelectedReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    
    const [newPost, setNewPost] = useState({ title: '', category: '', excerpt: '', content: '' });
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', icon_name: '' });
    const [newTool, setNewTool] = useState({
        name: '', url: '', category_id: '', short_description: '',
        description: '', image_url: '', pricing_type: 'Free', features: [''], pricing_details: ''
    });
    const [adminImagePreview, setAdminImagePreview] = useState(null);
    const [adminUseManualUrl, setAdminUseManualUrl] = useState(false);

    /**
     * Modal Handlers
     */
    const handleOpenReview = (tool) => {
        setSelectedReview(tool);
        setShowReviewModal(true);
    };

    const handleCloseReview = () => {
        setShowReviewModal(false);
        setSelectedReview(null);
    };

    /**
     * Local Form Wrappers (Pipes into the hook)
     */
    const handleCreateBlogPost = async (e) => {
        e.preventDefault();
        const success = await handleCreateBlog(newPost);
        if (success) setNewPost({ title: '', category: '', excerpt: '', content: '' });
    };

    const handleCreateCategory = (e) => {
        e.preventDefault();
        handleCategoryAction('create', 'tool', newCategory);
        setNewCategory({ name: '', slug: '', icon_name: '' });
    };

    const handleCreateBlogCategory = (e) => {
        e.preventDefault();
        handleCategoryAction('create', 'blog', { label: newCategory.name, slug: newCategory.slug });
        setNewCategory({ name: '', slug: '', icon_name: '' });
    };

    const handleAdminFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setAdminImagePreview(reader.result);
        reader.readAsDataURL(file);
        
        const url = await uploadFile(file);
        if (url) setNewTool(prev => ({ ...prev, image_url: url }));
    };

    const handleDirectAddTool = async (e) => {
        e.preventDefault();
        const success = await handleAddToolDirect(newTool);
        if (success) {
            setNewTool({
                name: '', url: '', category_id: '', short_description: '',
                description: '', image_url: '', pricing_type: 'Free', features: [''], pricing_details: ''
            });
            setAdminImagePreview(null);
        }
    };

    // Feature Field Array Helpers
    const addAdminFeature = () => setNewTool(prev => ({ ...prev, features: [...prev.features, ''] }));
    const removeAdminFeature = (idx) => setNewTool(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
    const handleAdminFeatureChange = (idx, val) => {
        const updated = [...newTool.features];
        updated[idx] = val;
        setNewTool(prev => ({ ...prev, features: updated }));
    };

    /**
     * Diff Helper for Modal
     */
    const getChangedFields = (oldVal, newVal) => {
        if (!oldVal || !newVal) return [];
        const mapping = {
            name: 'Name', url: 'Website URL', short_description: 'Tagline',
            description: 'Description', image_url: 'Visual Identity',
            pricing_type: 'Model', features: 'Capabilities', pricing_details: 'Pricing Notes'
        };
        
        return Object.keys(newVal)
            .filter(key => mapping[key] && JSON.stringify(oldVal[key]) !== JSON.stringify(newVal[key]))
            .map(key => ({
                key, label: mapping[key], oldValue: oldVal[key], newValue: newVal[key],
                isImage: key === 'image_url', isArray: Array.isArray(newVal[key])
            }));
    };

    if (loading) {
        return (
            <div className={styles.adminPage}>
                <div className={styles.wrapper}>
                    <div className={styles.loadingWrapper}>
                        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                        <p style={{ marginTop: '20px', letterSpacing: '1px' }}>Validating Admin Credentials...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className={styles.adminPage} id="admin-dashboard-view">
            <Helmet>
                <title>Control Center | ServicesHUB Mod</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <main className={styles.wrapper}>
                <header className={styles.headerSection}>
                    <h1>Admin Control Center</h1>
                    <p>Orchestrate your ecosystem, curate high-fidelity tools, and manage platform growth.</p>
                </header>

                <AdminStats stats={stats} />
                <AdminGrowthChart />

                <AdminTabs 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab}
                    pendingCount={pendingTools.length}
                    blogCount={blogPosts.length}
                    userCount={allUsers.length}
                    newsCount={subscribers.length}
                />

                <div className={`${styles.contentGrid} ${activeTab === 'pending' || activeTab === 'featured' ? styles.withSidebar : ''}`}>
                    <section className={`${styles.mainCard} glass-card`}>
                        <AdminQueue 
                            activeTab={activeTab}
                            pendingTools={pendingTools}
                            featuredTools={featuredTools}
                            handleOpenReview={handleOpenReview}
                            handleReject={handleReject}
                            handleToggleFeatured={handleToggleFeatured}
                            adminSearchQuery={adminSearchQuery}
                            adminSearchResults={adminSearchResults}
                            handleAdminSearch={handleAdminSearch}
                        />

                        <AdminBlogManager 
                            activeTab={activeTab}
                            blogPosts={blogPosts}
                            newPost={newPost}
                            setNewPost={setNewPost}
                            handleCreateBlogPost={handleCreateBlogPost}
                            handleDeleteBlog={handleDeleteBlog}
                            blogCategories={blogCategories}
                            submitting={submitting}
                            uploading={uploading}
                        />

                        <AdminSettingsManager 
                            activeTab={activeTab}
                            newTool={newTool} setNewTool={setNewTool} handleDirectAddTool={handleDirectAddTool}
                            adminImagePreview={adminImagePreview} adminUseManualUrl={adminUseManualUrl} setAdminUseManualUrl={setAdminUseManualUrl}
                            handleAdminFileChange={handleAdminFileChange} addAdminFeature={addAdminFeature}
                            removeAdminFeature={removeAdminFeature} handleAdminFeatureChange={handleAdminFeatureChange}
                            newCategory={newCategory} setNewCategory={setNewCategory}
                            handleCreateCategory={handleCreateCategory} handleDeleteCategory={(id) => handleCategoryAction('delete', 'tool', id)}
                            categories={toolCategories}
                            handleCreateBlogCategory={handleCreateBlogCategory}
                            handleDeleteBlogCategory={(id) => handleCategoryAction('delete', 'blog', id)}
                            blogCategories={blogCategories}
                            submitting={submitting} uploading={uploading}
                        />

                        <AdminUserManager 
                            activeTab={activeTab}
                            allUsers={allUsers}
                            subscribers={subscribers}
                        />
                    </section>

                    <AdminSidebar activeTab={activeTab} />
                </div>
            </main>

            <AdminReviewModal 
                showReviewModal={showReviewModal}
                selectedReview={selectedReview}
                handleCloseReview={handleCloseReview}
                handleApprove={handleApprove}
                handleReject={handleReject}
                getChangedFields={getChangedFields}
            />
        </div>
    );
};

export default AdminDashboard;
