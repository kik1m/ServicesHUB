import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryOptions } from '../lib/queryOptions';
import { adminService } from '../services/adminService';
import { seoService } from '../services/seoService';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useRouter } from 'next/navigation';
import { sendNotification } from '../utils/notifications';
import { emailTriggers } from '../utils/emailService';
import { Package, Users, Clock, Activity } from 'lucide-react';
import { ADMIN_UI_CONSTANTS } from '../constants/adminConstants';

/**
 * 🚀 Elite Admin Data Hook (Next.js Port)
 */
export const useAdminData = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');
    const [adminSearchQuery, setAdminSearchQuery] = useState('');
    const [adminSearchResults, setAdminSearchResults] = useState([]);
    const [isSearchingTools, setIsSearchingTools] = useState(false);
    const [adminImagePreview, setAdminImagePreview] = useState(null);
    const [adminUseManualUrl, setAdminUseManualUrl] = useState(false);

    const [newPost, setNewPost] = useState({ title: '', category: '', excerpt: '', content: '' });
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', icon_name: '' });
    const [newTool, setNewTool] = useState({
        name: '', url: '', category_id: '', short_description: '',
        description: '', image_url: '', pricing_type: 'Free', features: [''], pricing_details: ''
    });

    const [campaignData, setCampaignData] = useState({
        subject: '',
        intro: '',
        selectedTools: [],
        specialOffer: { title: '', description: '', link: '' }
    });
    
    const [selectedReview, setSelectedReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [allToolsPage, setAllToolsPage] = useState(1);

    // Hydration check
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    // Role Check
    const { data: adminRoleData, isLoading: roleLoading, error: roleError } = useQuery(queryOptions.admin.role(user?.id));

    const isAdmin = adminRoleData?.role === 'admin';

    // Dashboard Data
    const { data: dashboardData, isLoading: dashboardLoading, error: dashboardQueryError, refetch: refetchDashboard } = useQuery({
        ...queryOptions.admin.dashboard(),
        enabled: isMounted && isAdmin,
    });

    // Paginated Tools
    const { data: allToolsData, isLoading: toolsLoading } = useQuery({
        ...queryOptions.admin.allTools(allToolsPage),
        enabled: isMounted && isAdmin && activeTab === 'manage-tools',
        placeholderData: keepPreviousData
    });

    // Auth Redirects
    useEffect(() => {
        if (isMounted && !authLoading && !user) {
            router.push('/auth');
        } else if (isMounted && !roleLoading && roleError) {
            router.push('/');
        }
    }, [user, authLoading, roleLoading, roleError, router, isMounted]);

    const { counts } = dashboardData || {};

    // Rule #35: Derived Data Stability - Add formatted dates for UI consistency
    const processedPendingTools = useMemo(() => {
        return (dashboardData?.pendingTools || []).map(tool => ({
            ...tool,
            formatted_date: new Date(tool.created_at).toLocaleDateString()
        }));
    }, [dashboardData?.pendingTools]);

    const processedFeaturedTools = useMemo(() => {
        return (dashboardData?.featuredTools || []).map(tool => ({
            ...tool,
            formatted_date: new Date(tool.created_at).toLocaleDateString()
        }));
    }, [dashboardData?.featuredTools]);

    const processedAllTools = useMemo(() => {
        return (allToolsData?.data || []).map(tool => ({
            ...tool,
            formatted_date: new Date(tool.created_at).toLocaleDateString()
        }));
    }, [allToolsData?.data]);

    const allToolsTotal = allToolsData?.total || 0;

    const stats = useMemo(() => {
        if (!dashboardData?.counts) return [];
        const { counts } = dashboardData;
        const labels = ADMIN_UI_CONSTANTS.stats;
        return [
            { id: 'tools', label: labels.totalTools, value: counts.totalTools, icon: Package, color: 'var(--primary)' },
            { id: 'users', label: labels.totalUsers, value: counts.totalUsers, icon: Users, color: 'var(--secondary)' },
            { id: 'pending', label: labels.pendingApps, value: counts.totalPending, icon: Clock, color: '#ffcc00' },
            { id: 'status', label: labels.systemStatus, value: labels.online, icon: Activity, color: '#00ff88' }
        ];
    }, [dashboardData]);

    const error = dashboardQueryError ? `${ADMIN_UI_CONSTANTS.errors.systemAccess}: ${dashboardQueryError.message}` : null;
    const loading = !isMounted || authLoading || roleLoading || (isAdmin && dashboardLoading);

    const handleBroadcast = useCallback(async () => {
        if (!campaignData.subject || campaignData.selectedTools.length === 0) {
            showToast('Subject and at least one tool are required!', 'warning');
            return;
        }
        if (!window.confirm(`Are you ready to broadcast?`)) return;
        setSubmitting(true);
        try {
            const results = await adminService.sendNewsletterBroadcast(campaignData);
            showToast(`Sent: ${results.sent}, Failed: ${results.failed}`, 'success');
        } catch (err) {
            setActionError(`Broadcast Failed: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    }, [campaignData, showToast]);

    const handleOpenReview = useCallback((tool) => {
        setSelectedReview(tool);
        setEditMode(false);
        setShowReviewModal(true);
    }, []);

    const handleOpenEdit = useCallback((tool) => {
        setSelectedReview(tool);
        setEditMode(true);
        setShowReviewModal(true);
    }, []);

    const handleCloseReview = useCallback(() => {
        setShowReviewModal(false);
        setSelectedReview(null);
        setEditMode(false);
    }, []);

    const handleUpdateToolDirect = useCallback(async (toolId, updatedData) => {
        setSubmitting(true);
        try {
            const updatedTool = await adminService.updateToolDirect(toolId, updatedData);
            queryClient.invalidateQueries({ queryKey: ['admin_dashboard_data'] });
            queryClient.invalidateQueries({ queryKey: ['admin_all_tools'] });
            showToast('Tool updated!', 'success');
            return updatedTool;
        } catch (err) {
            setActionError(`Update Failed: ${err.message}`);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [showToast, queryClient]);

    const handleApprove = useCallback(async (tool, feedback = '') => {
        if (!window.confirm(`Approve "${tool.name}"?`)) return;
        setSubmitting(true);
        try {
            const isUpdate = !!tool.pending_changes;
            await adminService.approveTool(tool);
            
            // 1. Internal Notification
            await sendNotification(tool.user_id, isUpdate ? 'Update Approved' : 'Tool Approved', `${tool.name} is now live!`, 'approval');
            
            // 2. Elite Email Notification
            if (tool.user_id) {
                const { data: userData } = await supabase.from('profiles').select('email').eq('id', tool.user_id).maybeSingle();
                if (userData?.email) {
                    await emailTriggers.sendToolStatus(
                        userData.email,
                        tool.name,
                        'approved',
                        tool.slug,
                        feedback || (isUpdate ? 'Your tool update has been reviewed and approved.' : 'Your tool submission is now live on our platform.')
                    ).catch(err => console.warn('Email failed:', err));
                }
            }

            // 3. Optimistic Cache Update
            queryClient.setQueryData(['admin_dashboard_data'], old => old ? {
                ...old,
                pendingTools: (old.pendingTools || []).filter(t => t.id !== tool.id)
            } : old);

            showToast(isUpdate ? 'Update applied!' : 'Tool approved!', 'success');
            handleCloseReview();
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setSubmitting(false);
        }
    }, [showToast, handleCloseReview, queryClient]);

    const handleReject = useCallback(async (tool, feedback = '') => {
        if (!window.confirm(`Reject "${tool.name}"?`)) return;
        setSubmitting(true);
        try {
            await adminService.rejectTool(tool);
            
            // 1. Internal Notification
            await sendNotification(tool.user_id, 'Submission Rejected', `Sorry, ${tool.name} was not accepted.`, 'rejection');
            
            // 2. Elite Email Notification
            if (tool.user_id) {
                const { data: userData } = await supabase.from('profiles').select('email').eq('id', tool.user_id).maybeSingle();
                if (userData?.email) {
                    await emailTriggers.sendToolStatus(
                        userData.email,
                        tool.name,
                        'rejected',
                        tool.slug,
                        feedback || 'Sorry, your tool submission did not meet our criteria at this time.'
                    ).catch(err => console.warn('Email failed:', err));
                }
            }

            // 3. Optimistic Cache Update
            queryClient.setQueryData(['admin_dashboard_data'], old => old ? {
                ...old,
                pendingTools: (old.pendingTools || []).filter(t => t.id !== tool.id)
            } : old);

            showToast('Rejected.', 'info');
            handleCloseReview();
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setSubmitting(false);
        }
    }, [showToast, handleCloseReview, queryClient]);

    const handleDeleteTool = useCallback(async (tool) => {
        if (!window.confirm(`Delete "${tool.name}" forever?`)) return;
        setSubmitting(true);
        try {
            await adminService.deleteTool(tool.id);
            
            // Optimistic Update
            queryClient.setQueryData(['admin_dashboard_data'], old => old ? {
                ...old,
                pendingTools: (old.pendingTools || []).filter(t => t.id !== tool.id),
                featuredTools: (old.featuredTools || []).filter(t => t.id !== tool.id)
            } : old);
            
            queryClient.invalidateQueries({ queryKey: ['admin_all_tools'] });
            showToast('Deleted.', 'success');
        } catch (err) {
            showToast(`Error: ${err.message}`, 'error');
        } finally {
            setSubmitting(false);
        }
    }, [showToast, queryClient]);

    const handleAdminSearch = useCallback(async (e) => {
        const query = e.target.value;
        setAdminSearchQuery(query);
        if (!query.trim()) {
            setAdminSearchResults([]);
            return;
        }
        setIsSearchingTools(true);
        try {
            const results = await adminService.searchTools(query);
            setAdminSearchResults(results);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearchingTools(false);
        }
    }, []);

    const handleToggleFeatured = useCallback(async (tool) => {
        try {
            await adminService.toggleFeatured(tool.id, tool.is_featured);
            
            // Optimistic Update
            queryClient.setQueryData(['admin_dashboard_data'], old => old ? {
                ...old,
                featuredTools: !tool.is_featured 
                    ? [...(old.featuredTools || []), { ...tool, is_featured: true }]
                    : (old.featuredTools || []).filter(t => t.id !== tool.id)
            } : old);

            showToast('Status updated!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    }, [showToast, queryClient]);

    const handleCreateBlogPost = useCallback(async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const authorName = adminRoleData?.full_name || 'Admin';
            const post = await adminService.createBlogPost(newPost, authorName);
            if (post?.id) seoService.triggerGeneration(post.id, 'blog');
            queryClient.invalidateQueries({ queryKey: ['admin_dashboard_data'] });
            setNewPost({ title: '', category: '', excerpt: '', content: '' });
            showToast('Published!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    }, [newPost, adminRoleData, showToast, queryClient]);

    const handleDeleteBlog = useCallback(async (id) => {
        if (!window.confirm('Delete article?')) return;
        try {
            await adminService.deleteBlogPost(id);
            queryClient.invalidateQueries({ queryKey: ['admin_dashboard_data'] });
            showToast('Deleted.', 'info');
        } catch (err) {
            showToast(err.message, 'error');
        }
    }, [showToast, queryClient]);

    const handleCategoryAction = useCallback(async (action, type, payload) => {
        try {
            const isBlog = type === 'blog';
            if (action === 'create') {
                await adminService.createCategory(payload, isBlog);
                queryClient.invalidateQueries({ queryKey: ['admin_dashboard_data'] });
                setNewCategory({ name: '', slug: '', icon_name: '' });
                showToast('Added!', 'success');
            } else if (action === 'delete') {
                if (!window.confirm('Delete category?')) return;
                await adminService.deleteCategory(payload, isBlog);
                queryClient.invalidateQueries({ queryKey: ['admin_dashboard_data'] });
                showToast('Deleted.', 'info');
            }
        } catch (err) {
            showToast(err.message, 'error');
        }
    }, [showToast, queryClient]);

    const handleAdminFileChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setAdminImagePreview(reader.result);
        reader.readAsDataURL(file);
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `tool-thumbnails/${fileName}`;
            await supabase.storage.from('tool-images').upload(filePath, file);
            const { data: { publicUrl } } = supabase.storage.from('tool-images').getPublicUrl(filePath);
            setNewTool(prev => ({ ...prev, image_url: publicUrl }));
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setUploading(false);
        }
    }, [showToast]);

    const handleDirectAddTool = useCallback(async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const authorId = ADMIN_UI_CONSTANTS.platform.teamId;
            await adminService.addToolDirect(newTool, authorId);
            setNewTool({ name: '', url: '', category_id: '', short_description: '', description: '', image_url: '', pricing_type: 'Free', features: [''], pricing_details: '' });
            setAdminImagePreview(null);
            showToast('Added!', 'success');
            refetchDashboard();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    }, [newTool, showToast, refetchDashboard]);

    const addAdminFeature = () => setNewTool(prev => ({ ...prev, features: [...prev.features, ''] }));
    const removeAdminFeature = (idx) => setNewTool(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
    const handleAdminFeatureChange = (idx, val) => {
        const updated = [...newTool.features];
        updated[idx] = val;
        setNewTool(prev => ({ ...prev, features: updated }));
    };

    return {
        loading, isAdmin, error, actionError, stats, activeTab,
        pendingTools: processedPendingTools,
        featuredTools: processedFeaturedTools,
        allTools: processedAllTools,
        allToolsTotal,
        allToolsPage,
        blogPosts: dashboardData?.blogPosts || [],
        blogCategories: dashboardData?.blogCategories || [],
        toolCategories: dashboardData?.toolCategories || [],
        allUsers: dashboardData?.allUsers || [],
        subscribers: dashboardData?.subscribers || [],
        submitting,
        uploading,
        adminSearchQuery,
        adminSearchResults,
        isSearchingTools,
        adminImagePreview, adminUseManualUrl, newPost, newCategory, newTool,
        selectedReview, showReviewModal, editMode,
        setActiveTab, setActionError, setAdminUseManualUrl, setNewPost, setNewCategory, setNewTool,
        setAllToolsPage, init: refetchDashboard,
        handleApprove, handleReject, handleAdminSearch, handleToggleFeatured,
        handleCreateBlogPost, handleDeleteBlog, handleCategoryAction,
        handleAdminFileChange, handleDirectAddTool, handleUpdateToolDirect,
        handleOpenReview, handleOpenEdit, handleCloseReview, handleDeleteTool,
        addAdminFeature, removeAdminFeature, handleAdminFeatureChange,
        handleBroadcast, setCampaignData, campaignData
    };
};
