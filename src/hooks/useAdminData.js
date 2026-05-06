import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminService } from '../services/adminService';
import { seoService } from '../services/seoService';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { sendNotification } from '../utils/notifications';
import { emailTriggers } from '../utils/emailService';
import { Package, Users, Clock, Activity } from 'lucide-react';
import { ADMIN_UI_CONSTANTS } from '../constants/adminConstants';

/**
 * useAdminData Hook - Elite Hardened Version
 * Rule #1: Full Logic Isolation
 * Rule #22: Hybrid Error Management
 */
export const useAdminData = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    
    // 1. Loading & Auth States
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 2. Hybrid Error States
    const [error, setError] = useState(null); // Critical Page Error
    const [actionError, setActionError] = useState(null); // Local Section Error
    
    // 3. Core Data Resources
    const [stats, setStats] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [pendingTools, setPendingTools] = useState([]);
    const [featuredTools, setFeaturedTools] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogCategories, setBlogCategories] = useState([]);
    const [toolCategories, setToolCategories] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [subscribers, setSubscribers] = useState([]);

    // 4. Local UI Form States (Moved from component to hook)
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
    
    const handleBroadcast = useCallback(async () => {
        if (!campaignData.subject || campaignData.selectedTools.length === 0) {
            showToast('Subject and at least one tool are required!', 'warning');
            return;
        }

        if (!window.confirm(`Are you ready to broadcast this newsletter to all subscribers?`)) return;

        setSubmitting(true);
        try {
            setActionError(null);
            const results = await adminService.sendNewsletterBroadcast({
                ...campaignData,
                tools: campaignData.selectedTools
            });
            showToast(`Broadcast Finished! Sent: ${results.sent}, Failed: ${results.failed}`, 'success');
        } catch (err) {
            setActionError(`Broadcast Failed: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    }, [campaignData, showToast]);

    const [selectedReview, setSelectedReview] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

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

    const [allTools, setAllTools] = useState([]);
    const [allToolsTotal, setAllToolsTotal] = useState(0);
    const [allToolsPage, setAllToolsPage] = useState(1);

    /**
     * Initial Data Gateway
     */
    const init = useCallback(async () => {
        if (authLoading) return;
        if (!user) { navigate('/auth'); return; }

        try {
            setLoading(true);
            setError(null);
            
            // Role Verification
            const { data: profile, error: profileErr } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single();
            if (profileErr || profile?.role !== 'admin') { 
                navigate('/'); 
                return; 
            }
            setIsAdmin(true);
            user.full_name = profile.full_name;

            // Parallel Fetch Dashboard Data
            const data = await adminService.fetchDashboardData();
            
            setPendingTools(data.pendingTools);
            setFeaturedTools(data.featuredTools);
            setBlogPosts(data.blogPosts);
            setBlogCategories(data.blogCategories);
            setToolCategories(data.toolCategories);
            setAllUsers(data.allUsers);
            setSubscribers(data.subscribers);

            // Fetch Initial Tools Management Page
            const toolsData = await adminService.fetchAllToolsPaginated(1, 10);
            setAllTools(toolsData.data);
            setAllToolsTotal(toolsData.total);

            // Map Statistics - Rule #14
            const { counts } = data;
            const labels = ADMIN_UI_CONSTANTS.stats;
            setStats([
                { id: 'tools', label: labels.totalTools, value: counts.totalTools, icon: Package, color: 'var(--primary)' },
                { id: 'users', label: labels.totalUsers, value: counts.totalUsers, icon: Users, color: 'var(--secondary)' },
                { id: 'pending', label: labels.pendingApps, value: counts.totalPending, icon: Clock, color: '#ffcc00' },
                { id: 'status', label: labels.systemStatus, value: labels.online, icon: Activity, color: '#00ff88' }
            ]);

        } catch (err) {
            console.error('Admin Init Error:', err);
            setError(`${ADMIN_UI_CONSTANTS.errors.systemAccess}: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [user, authLoading, navigate]);

    // Handle Page Change for Tools Manager
    useEffect(() => {
        if (activeTab === 'manage-tools') {
            const fetchPage = async () => {
                try {
                    setLoading(true);
                    const toolsData = await adminService.fetchAllToolsPaginated(allToolsPage, 10);
                    setAllTools(toolsData.data);
                    setAllToolsTotal(toolsData.total);
                } catch (err) {
                    setActionError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchPage();
        }
    }, [allToolsPage, activeTab]);

    useEffect(() => {
        init();
    }, [init]);

    // Rule #35: Derived Data Stability
    const processedPendingTools = useMemo(() => {
        return pendingTools.map(tool => ({
            ...tool,
            formatted_date: new Date(tool.created_at).toLocaleDateString()
        }));
    }, [pendingTools]);

    const processedFeaturedTools = useMemo(() => {
        return featuredTools.map(tool => ({
            ...tool,
            formatted_date: new Date(tool.created_at).toLocaleDateString()
        }));
    }, [featuredTools]);

    const processedAllTools = useMemo(() => {
        return allTools.map(tool => ({
            ...tool,
            formatted_date: new Date(tool.created_at).toLocaleDateString()
        }));
    }, [allTools]);

    /**
     * Tool Actions - Rule #13
     */
    const handleUpdateToolDirect = useCallback(async (toolId, updatedData) => {
        setSubmitting(true);
        try {
            setActionError(null);
            const updatedTool = await adminService.updateToolDirect(toolId, updatedData);
            
            // Sync all lists
            const updater = (t) => t.id === toolId ? { ...t, ...updatedTool } : t;
            setAllTools(prev => prev.map(updater));
            setFeaturedTools(prev => prev.map(updater));
            setPendingTools(prev => prev.map(updater));
            setAdminSearchResults(prev => prev.map(updater));
            
            showToast('Tool updated successfully!', 'success');
            return updatedTool;
        } catch (err) {
            setActionError(`Update Failed: ${err.message}`);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [showToast]);

    const handleApprove = useCallback(async (tool, feedback = '') => {
        const msg = ADMIN_UI_CONSTANTS.messages.approvals;
        if (!window.confirm(`Are you sure you want to approve "${tool.name}"?`)) return;

        setSubmitting(true);
        try {
            setActionError(null);
            showToast(`Approving ${tool.name}...`, 'info');
            
            const isUpdate = !!tool.pending_changes;
            await adminService.approveTool(tool);
            
            // 1. Internal Notification
            await sendNotification(
                tool.user_id, 
                isUpdate ? msg.updateApproved : msg.toolApproved, 
                isUpdate ? msg.updateApprovedDesc.replace('{name}', tool.name) : msg.toolApprovedDesc.replace('{name}', tool.name), 
                'approval'
            );

            // 2. Elite Email Notification
            if (tool.profiles?.email) {
                await emailTriggers.sendToolStatus(
                    tool.profiles.email,
                    tool.name,
                    'approved',
                    tool.slug,
                    feedback || (isUpdate ? 'Your tool update has been reviewed and approved.' : 'Your tool submission is now live on our platform.')
                ).catch(err => console.warn('Email failed:', err));
            }
            
            setPendingTools(prev => prev.filter(t => t.id !== tool.id));
            showToast(isUpdate ? 'Update applied!' : 'Tool approved!', 'success');
            handleCloseReview();
        } catch (err) {
            console.error('Approval Error:', err);
            showToast(`Approval Failed: ${err.message}`, 'error');
            setActionError(`Approval Failed: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    }, [showToast, handleCloseReview]);

    const handleReject = useCallback(async (tool, feedback = '') => {
        const msg = ADMIN_UI_CONSTANTS.messages.approvals;
        const isUpdate = !!tool.pending_changes;
        const confirmMsg = isUpdate ? msg.rejectConfirm.replace('{name}', tool.name) : msg.deleteConfirm.replace('{name}', tool.name);
        
        if (!window.confirm(confirmMsg)) return;

        setSubmitting(true);
        try {
            setActionError(null);
            showToast(`Rejecting ${tool.name}...`, 'info');
            
            await adminService.rejectTool(tool);
            
            // 1. Internal Notification
            await sendNotification(
                tool.user_id, 
                msg.rejectSubject, 
                isUpdate ? msg.rejectUpdateDesc.replace('{name}', tool.name) : msg.rejectToolDesc.replace('{name}', tool.name), 
                'rejection'
            );

            // 2. Elite Email Notification (With Dynamic Feedback)
            if (tool.profiles?.email) {
                await emailTriggers.sendToolStatus(
                    tool.profiles.email,
                    tool.name,
                    'rejected',
                    tool.slug,
                    feedback || 'Unfortunately, your submission does not meet our current quality standards or editorial guidelines.'
                ).catch(err => console.warn('Email failed:', err));
            }
            
            setPendingTools(prev => prev.filter(t => t.id !== tool.id));
            setAllTools(prev => prev.filter(t => t.id !== tool.id));
            setFeaturedTools(prev => prev.filter(t => t.id !== tool.id));
            
            showToast('Action completed.', 'info');
            handleCloseReview();
        } catch (err) {
            console.error('Rejection Error:', err);
            showToast(`Rejection Failed: ${err.message}`, 'error');
            setActionError(`Rejection Failed: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    }, [showToast, handleCloseReview]);

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
            setActionError(null);
            const newState = await adminService.toggleFeatured(tool.id, tool.is_featured);
            const updater = (t) => t.id === tool.id ? { ...t, is_featured: newState } : t;
            
            setFeaturedTools(prev => newState ? [...prev, { ...tool, is_featured: true }] : prev.filter(t => t.id !== tool.id));
            setAdminSearchResults(prev => prev.map(updater));
            setPendingTools(prev => prev.map(updater));
            setAllTools(prev => prev.map(updater));
            
            showToast('Status updated!', 'success');
        } catch (err) {
            setActionError(`Toggle Failed: ${err.message}`);
        }
    }, [showToast]);

    /**
     * Blog & Category Operations
     */
    const handleCreateBlogPost = useCallback(async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            setActionError(null);
            const catObj = blogCategories.find(c => c.id === newPost.category || c.name === newPost.category);
            const dataWithCat = { ...newPost, category: catObj ? catObj.name : newPost.category };
            const authorName = user?.full_name || 'Admin';
            
            const post = await adminService.createBlogPost(dataWithCat, authorName);
            
            // Rule #14: Automated AI SEO Generation for Blog Posts
            if (post?.id) {
                seoService.triggerGeneration(post.id, 'blog');
            }

            setBlogPosts(prev => [post, ...prev]);
            setNewPost({ title: '', category: '', excerpt: '', content: '' });
            showToast('Blog Published!', 'success');
        } catch (err) {
            setActionError(`Blog Post Error: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    }, [newPost, blogCategories, user, showToast]);

    const handleDeleteBlog = useCallback(async (id) => {
        if (!window.confirm(ADMIN_UI_CONSTANTS.blog.manager.deleteConfirm)) return;
        try {
            setActionError(null);
            await adminService.deleteBlogPost(id);
            setBlogPosts(prev => prev.filter(p => p.id !== id));
            showToast('Deleted.', 'info');
        } catch (err) {
            setActionError(`Delete Error: ${err.message}`);
        }
    }, [showToast]);

    const handleCategoryAction = useCallback(async (action, type, payload) => {
        try {
            setActionError(null);
            const isBlog = type === 'blog';
            if (action === 'create') {
                const newCat = await adminService.createCategory(payload, isBlog);
                isBlog ? setBlogCategories(prev => [...prev, newCat]) : setToolCategories(prev => [...prev, newCat]);
                setNewCategory({ name: '', slug: '', icon_name: '' });
                showToast('Category added!', 'success');
            } else if (action === 'delete') {
                if (!window.confirm(ADMIN_UI_CONSTANTS.settings.categories.deleteConfirm)) return;
                await adminService.deleteCategory(payload, isBlog);
                isBlog ? setBlogCategories(prev => prev.filter(c => c.id !== payload)) : setToolCategories(prev => prev.filter(c => c.id !== payload));
                showToast('Category deleted.', 'info');
            }
        } catch (err) {
            setActionError(`Category Action Failed: ${err.message}`);
        }
    }, [showToast]);

    /**
     * Tool Direct Add Logic
     */
    const handleAdminFileChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onloadend = () => setAdminImagePreview(reader.result);
        reader.readAsDataURL(file);
        
        try {
            setUploading(true);
            setActionError(null);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `tool-thumbnails/${fileName}`;
            
            const { error: uploadError } = await supabase.storage.from('tool-images').upload(filePath, file);
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage.from('tool-images').getPublicUrl(filePath);
            setNewTool(prev => ({ ...prev, image_url: publicUrl }));
        } catch (err) {
            setActionError(`Upload Failed: ${err.message}`);
        } finally {
            setUploading(false);
        }
    }, []);

    const handleDirectAddTool = useCallback(async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            setActionError(null);
            // Use the official Team Hubly ID for all admin/platform uploads
            const authorId = ADMIN_UI_CONSTANTS.platform.teamId;

            await adminService.addToolDirect(newTool, authorId);
            setNewTool({
                name: '', url: '', category_id: '', short_description: '',
                description: '', image_url: '', pricing_type: 'Free', features: [''], pricing_details: ''
            });
            setAdminImagePreview(null);
            showToast('Full tool added and approved!', 'success');
            init(); // Refresh data
        } catch (err) {
            setActionError(`Add Tool Failed: ${err.message}`);
        } finally {
            setSubmitting(false);
        }
    }, [newTool, user, showToast, init]);

    const addAdminFeature = useCallback(() => setNewTool(prev => ({ ...prev, features: [...prev.features, ''] })), []);
    const removeAdminFeature = useCallback((idx) => setNewTool(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) })), []);
    const handleAdminFeatureChange = useCallback((idx, val) => {
        const updated = [...newTool.features];
        updated[idx] = val;
        setNewTool(prev => ({ ...prev, features: updated }));
    }, [newTool]);

    // Stable Interface
    return {
        // Core States
        loading, isAdmin, error, actionError, stats, activeTab,
        pendingTools: processedPendingTools, 
        featuredTools: processedFeaturedTools, 
        allTools: processedAllTools,
        allToolsTotal, allToolsPage,
        blogPosts, blogCategories, toolCategories,
        allUsers, subscribers, submitting, uploading,
        
        // Form States
        adminSearchQuery, adminSearchResults, isSearchingTools,
        adminImagePreview, adminUseManualUrl, newPost, newCategory, newTool,
        selectedReview, showReviewModal, editMode,
        
        // State Setters
        setActiveTab, setActionError, setAdminUseManualUrl, setNewPost, setNewCategory, setNewTool,
        setAllToolsPage,
        
        // Handlers
        init, // For retry logic
        handleApprove, handleReject, handleAdminSearch, handleToggleFeatured,
        handleCreateBlogPost, handleDeleteBlog, handleCategoryAction,
        handleAdminFileChange, handleDirectAddTool, handleUpdateToolDirect,
        handleOpenReview, handleOpenEdit, handleCloseReview,
        addAdminFeature, removeAdminFeature, handleAdminFeatureChange,
        handleBroadcast, setCampaignData, campaignData
    };
};
