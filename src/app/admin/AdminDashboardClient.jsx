'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAdminData } from '../../hooks/useAdminData';
import { getChangedFields } from '../../utils/adminUtils';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';

// Import Global UI Components
import PageHero from '../../components/ui/PageHero';
import Safeguard from '../../components/ui/Safeguard';

// Import Modular Admin Components
import AdminStats from '../../components/Admin/AdminStats';
import AdminGrowthChart from '../../components/Admin/AdminGrowthChart';
import AdminTabs from '../../components/Admin/AdminTabs';
import AdminQueue from '../../components/Admin/AdminQueue';
import AdminBlogManager from '../../components/Admin/AdminBlogManager';
import AdminSettingsManager from '../../components/Admin/AdminSettingsManager';
import AdminUserManager from '../../components/Admin/AdminUserManager';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminReviewModal from '../../components/Admin/AdminReviewModal';
import AdminToolManager from '../../components/Admin/AdminToolManager';
import AdminAIManager from '../../components/Admin/AdminAIManager';
import AdminNewsletterManager from '../../components/Admin/AdminNewsletterManager';
import NotificationLab from '../../components/Admin/NotificationLab';
import AdminAnalytics from '../../components/Admin/AdminAnalytics';

// Styles
import styles from './AdminDashboard.module.css';

/**
 * AdminDashboardClient - Elite 10/10 Orchestrator (Next.js Port)
 */
const AdminDashboardClient = () => {
    const {
        loading, isAdmin, error, actionError, setActionError, stats, activeTab,
        pendingTools, featuredTools, allTools, allToolsTotal, allToolsPage, setAllToolsPage,
        blogPosts, blogCategories, toolCategories,
        allUsers, subscribers, adminSearchQuery, adminSearchResults, isSearchingTools,
        submitting, uploading,
        setActiveTab, handleApprove, handleReject, handleAdminSearch, handleToggleFeatured,
        handleCreateBlogPost, handleDeleteBlog, handleCategoryAction,
        handleAdminFileChange, handleDirectAddTool, handleUpdateToolDirect,
        addAdminFeature, removeAdminFeature, handleAdminFeatureChange,
        adminImagePreview, adminUseManualUrl, setAdminUseManualUrl,
        newPost, setNewPost, newCategory, setNewCategory, newTool, setNewTool,
        selectedReview, showReviewModal, editMode,
        handleOpenReview, handleOpenEdit, handleCloseReview, handleDeleteTool,
        campaignData, setCampaignData, handleBroadcast,
        init // For retry
    } = useAdminData();

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const unifiedError = error || actionError;
    const hasSidebar = ['pending', 'featured'].includes(activeTab);

    const renderTabContent = useCallback(() => {
        if (!isMounted) return null;

        switch (activeTab) {
            case 'ai-manager': 
                return <AdminAIManager activeTab={activeTab} />;
            case 'pending':
                return (
                    <AdminQueue 
                        activeTab={activeTab}
                        pendingTools={pendingTools}
                        handleOpenReview={handleOpenReview}
                        handleReject={handleReject}
                        isLoading={loading}
                        error={error}
                        onRetry={init}
                    />
                );
            case 'manage-tools':
                return (
                    <AdminToolManager 
                        allTools={allTools}
                        totalTools={allToolsTotal}
                        currentPage={allToolsPage}
                        setPage={setAllToolsPage}
                        handleAdminSearch={handleAdminSearch}
                        adminSearchQuery={adminSearchQuery}
                        adminSearchResults={adminSearchResults}
                        isSearching={isSearchingTools}
                        handleOpenEdit={handleOpenEdit} 
                        handleDelete={handleDeleteTool}
                        isLoading={loading}
                        error={error}
                        onRetry={init}
                    />
                );
            case 'featured':
                return (
                    <AdminQueue 
                        activeTab={activeTab}
                        featuredTools={featuredTools}
                        handleToggleFeatured={handleToggleFeatured}
                        adminSearchQuery={adminSearchQuery}
                        adminSearchResults={adminSearchResults}
                        handleAdminSearch={handleAdminSearch}
                        isLoading={loading}
                        error={error}
                        onRetry={init}
                    />
                );
            case 'blog':
                return (
                    <AdminBlogManager 
                        activeTab={activeTab}
                        blogPosts={blogPosts}
                        newPost={newPost}
                        setNewPost={setNewPost}
                        handleCreateBlogPost={handleCreateBlogPost}
                        handleDeleteBlog={handleDeleteBlog}
                        blogCategories={blogCategories}
                        submitting={submitting}
                        isLoading={loading}
                        error={error}
                        actionError={actionError}
                        onRetry={init}
                        allTools={allTools}
                        handleAdminSearch={handleAdminSearch}
                        adminSearchResults={adminSearchResults}
                        isSearchingTools={isSearchingTools}
                    />
                );
            case 'add-tool':
                return (
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
                        submitting={submitting} 
                        uploading={uploading}
                        isLoading={loading}
                        categories={toolCategories}
                        error={actionError || error}
                        onRetry={init}
                    />
                );
            case 'categories':
                return (
                    <AdminSettingsManager 
                        activeTab={activeTab}
                        newCategory={newCategory} 
                        setNewCategory={setNewCategory}
                        handleCreateCategory={(e) => { e.preventDefault(); handleCategoryAction('create', 'tool', newCategory); }} 
                        handleDeleteCategory={(id) => handleCategoryAction('delete', 'tool', id)}
                        categories={toolCategories}
                        submitting={submitting}
                        isLoading={loading}
                        error={error}
                        onRetry={init}
                    />
                );
            case 'blog-categories':
                return (
                    <AdminSettingsManager 
                        activeTab={activeTab}
                        newCategory={newCategory} 
                        setNewCategory={setNewCategory}
                        handleCreateBlogCategory={(e) => { e.preventDefault(); handleCategoryAction('create', 'blog', { name: newCategory.name, slug: newCategory.slug }); }}
                        handleDeleteBlogCategory={(id) => handleCategoryAction('delete', 'blog', id)}
                        blogCategories={blogCategories}
                        submitting={submitting}
                        isLoading={loading}
                        error={error}
                        onRetry={init}
                    />
                );
            case 'users':
                return (
                    <AdminUserManager 
                        activeTab="users"
                        allUsers={allUsers}
                        isLoading={loading}
                        error={error}
                        onRetry={init}
                    />
                );
            case 'newsletter':
                return (
                    <AdminUserManager 
                        activeTab="newsletter"
                        subscribers={subscribers}
                        isLoading={loading}
                        error={error}
                        onRetry={init}
                    />
                );
            case 'newsletter-manager':
                return (
                    <AdminNewsletterManager 
                        activeTab={activeTab}
                        campaignData={campaignData}
                        setCampaignData={setCampaignData}
                        handleBroadcast={handleBroadcast}
                        isSubmitting={submitting}
                        allTools={allTools}
                    />
                );
            case 'lab':
                return <NotificationLab />;
            default:
                return null;
        }
    }, [
        isMounted, activeTab, pendingTools, featuredTools, allTools, allToolsTotal, allToolsPage, setAllToolsPage,
        blogPosts, newPost, blogCategories, 
        newTool, adminImagePreview, adminUseManualUrl, submitting, uploading, toolCategories, 
        newCategory, allUsers, subscribers, adminSearchQuery, adminSearchResults, isSearchingTools,
        handleOpenReview, handleOpenEdit, handleApprove, handleReject, 
        handleToggleFeatured, handleAdminSearch, handleUpdateToolDirect,
        setNewPost, handleCreateBlogPost, handleDeleteBlog, setNewTool, 
        setAdminUseManualUrl, handleAdminFileChange, addAdminFeature, removeAdminFeature, 
        handleAdminFeatureChange, handleDirectAddTool, setNewCategory, handleCategoryAction, 
        handleDeleteTool, loading, error, actionError, init, campaignData, setCampaignData, handleBroadcast
    ]);

    if (!isMounted) return null;
    if (!isAdmin && !loading) return null;

    return (
        <div className={styles.adminPage} id="admin-dashboard-view">
            <PageHero 
                title={ADMIN_UI_CONSTANTS.header.title}
                highlight={ADMIN_UI_CONSTANTS.header.titleHighlight}
                subtitle={ADMIN_UI_CONSTANTS.header.subtitle}
                breadcrumbs={ADMIN_UI_CONSTANTS.header.breadcrumbs}
                icon={<ShieldCheck size={24} />}
            />

            <div className={styles.adminWrapper}>
                <Safeguard error={error} onRetry={init} fullPage title={ADMIN_UI_CONSTANTS.header?.title}>
                    <div className={styles.adminMainContent}>
                        <AdminAnalytics />
                        <AdminStats stats={stats} isLoading={loading} error={unifiedError} onRetry={() => setActionError(null)} />
                        <AdminGrowthChart isLoading={loading} error={unifiedError} onRetry={() => setActionError(null)} />

                        <AdminTabs 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab}
                            pendingCount={pendingTools?.length || 0}
                            blogCount={blogPosts?.length || 0}
                            userCount={allUsers?.length || 0}
                            newsCount={subscribers?.length || 0}
                            isLoading={loading}
                            error={unifiedError}
                            onRetry={() => setActionError(null)}
                        />

                        <div className={`${styles.contentGrid} ${hasSidebar ? styles.withSidebar : ''}`}>
                            <section className={styles.activeSection}>
                                <div className="fade-in">
                                    {renderTabContent()}
                                </div>
                            </section>

                            <AdminSidebar activeTab={activeTab} isLoading={loading} error={unifiedError} onRetry={() => setActionError(null)} />
                        </div>
                    </div>
                </Safeguard>
            </div>

            <AdminReviewModal 
                showReviewModal={showReviewModal}
                selectedReview={selectedReview}
                editMode={editMode}
                handleCloseReview={handleCloseReview}
                handleApprove={handleApprove}
                handleReject={handleReject}
                handleUpdateToolDirect={handleUpdateToolDirect}
                getChangedFields={getChangedFields}
                isLoading={submitting}
                categories={toolCategories}
            />
        </div>
    );
};

export default AdminDashboardClient;
