import React, { useState, useMemo, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useAdminData } from '../hooks/useAdminData';
import { getChangedFields } from '../utils/adminUtils';
import { ADMIN_UI_CONSTANTS } from '../constants/adminConstants';

// Import Global UI Components - Rule #19: Atomic Unified Components
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';

// Import Modular Admin Components
import AdminStats from '../components/Admin/AdminStats';
import AdminGrowthChart from '../components/Admin/AdminGrowthChart';
import AdminTabs from '../components/Admin/AdminTabs';
import AdminQueue from '../components/Admin/AdminQueue';
import AdminBlogManager from '../components/Admin/AdminBlogManager';
import AdminSettingsManager from '../components/Admin/AdminSettingsManager';
import AdminUserManager from '../components/Admin/AdminUserManager';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminReviewModal from '../components/Admin/AdminReviewModal';
import AdminToolManager from '../components/Admin/AdminToolManager';
import AdminAIManager from '../components/Admin/AdminAIManager'; // [NEW] AI Manager

// Styles
import styles from './AdminDashboard.module.css';

/**
 * AdminDashboard - Elite 10/10 Orchestrator (Full Scope)
 */
const AdminDashboard = () => {
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
        handleOpenReview, handleOpenEdit, handleCloseReview,
        init // For retry
    } = useAdminData();

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'admin' });

    const TAB_RESOURCES = useMemo(() => ({
        'ai-manager': (
            <AdminAIManager activeTab={activeTab} />
        ),
        pending: (
            <AdminQueue 
                activeTab={activeTab}
                pendingTools={pendingTools}
                handleOpenReview={handleOpenReview}
                handleReject={handleReject}
                isLoading={loading}
                error={error}
                onRetry={init}
            />
        ),
        'manage-tools': (
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
                handleDelete={handleReject}
                isLoading={loading}
                error={error}
                onRetry={init}
            />
        ),
        featured: (
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
        ),
        blog: (
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
                onRetry={init}
            />
        ),
        'add-tool': (
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
                error={error}
                onRetry={init}
            />
        ),
        categories: (
            <AdminSettingsManager 
                activeTab={activeTab}
                newCategory={newCategory} 
                setNewCategory={setNewCategory}
                handleCreateCategory={(e) => handleCategoryAction('create', 'tool', newCategory)} 
                handleDeleteCategory={(id) => handleCategoryAction('delete', 'tool', id)}
                categories={toolCategories}
                submitting={submitting}
                isLoading={loading}
                error={error}
                onRetry={init}
            />
        ),
        'blog-categories': (
            <AdminSettingsManager 
                activeTab={activeTab}
                newCategory={newCategory} 
                setNewCategory={setNewCategory}
                handleCreateBlogCategory={(e) => handleCategoryAction('create', 'blog', { label: newCategory.name, slug: newCategory.slug })}
                handleDeleteBlogCategory={(id) => handleCategoryAction('delete', 'blog', id)}
                blogCategories={blogCategories}
                submitting={submitting}
                isLoading={loading}
                error={error}
                onRetry={init}
            />
        ),
        users: (
            <AdminUserManager 
                activeTab={activeTab}
                allUsers={allUsers}
                isLoading={loading}
                error={error}
                onRetry={init}
            />
        ),
        newsletter: (
            <AdminUserManager 
                activeTab={activeTab}
                subscribers={subscribers}
                isLoading={loading}
                error={error}
                onRetry={init}
            />
        )
    }), [
        activeTab, pendingTools, featuredTools, allTools, allToolsTotal, allToolsPage, setAllToolsPage,
        blogPosts, newPost, blogCategories, 
        newTool, adminImagePreview, adminUseManualUrl, submitting, uploading, toolCategories, 
        newCategory, allUsers, subscribers, adminSearchQuery, adminSearchResults, isSearchingTools,
        handleOpenReview, handleOpenEdit, handleCloseReview, handleApprove, handleReject, 
        handleToggleFeatured, handleAdminSearch, handleUpdateToolDirect,
        setNewPost, handleCreateBlogPost, handleDeleteBlog, setNewTool, 
        setAdminUseManualUrl, handleAdminFileChange, addAdminFeature, removeAdminFeature, 
        handleAdminFeatureChange, handleDirectAddTool, setNewCategory, handleCategoryAction, 
        loading, error, init
    ]);

    const activeTabView = TAB_RESOURCES[activeTab] || null;

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
                        <AdminStats stats={stats} isLoading={loading} error={actionError} onRetry={() => setActionError(null)} />
                        <AdminGrowthChart isLoading={loading} error={actionError} onRetry={() => setActionError(null)} />

                        <AdminTabs 
                            activeTab={activeTab} 
                            setActiveTab={setActiveTab}
                            pendingCount={pendingTools?.length || 0}
                            blogCount={blogPosts?.length || 0}
                            userCount={allUsers?.length || 0}
                            newsCount={subscribers?.length || 0}
                            isLoading={loading}
                            error={actionError}
                            onRetry={() => setActionError(null)}
                        />

                        <div className={`${styles.contentGrid} ${(activeTab === 'pending' || activeTab === 'featured') ? styles.withSidebar : ''}`}>
                            <section className={styles.activeSection}>
                                {activeTabView}
                            </section>

                            <AdminSidebar activeTab={activeTab} isLoading={loading} error={actionError} onRetry={() => setActionError(null)} />
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

export default AdminDashboard;
