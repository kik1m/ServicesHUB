import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { sendNotification } from '../utils/notifications';
import { Package, Users, Clock, Activity } from 'lucide-react';

/**
 * useAdminData Hook - Handles state and biz logic for the Admin Control Center
 */
export const useAdminData = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    
    // Core Data States
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    
    // Resource States
    const [pendingTools, setPendingTools] = useState([]);
    const [featuredTools, setFeaturedTools] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogCategories, setBlogCategories] = useState([]);
    const [toolCategories, setToolCategories] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [subscribers, setSubscribers] = useState([]);

    // UI States (Search/Modal/Upload)
    const [adminSearchQuery, setAdminSearchQuery] = useState('');
    const [adminSearchResults, setAdminSearchResults] = useState([]);
    const [isSearchingTools, setIsSearchingTools] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    /**
     * Auth & Initial Data Fetch
     */
    useEffect(() => {
        const init = async () => {
            if (authLoading) return;
            if (!user) { navigate('/auth'); return; }

            try {
                // 1. Role Verification
                const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                if (profile?.role !== 'admin') { 
                    navigate('/'); 
                    return; 
                }
                setIsAdmin(true);

                // 2. Parallel Fetch
                const data = await adminService.fetchDashboardData();
                
                setPendingTools(data.pendingTools);
                setFeaturedTools(data.featuredTools);
                setBlogPosts(data.blogPosts);
                setBlogCategories(data.blogCategories);
                setToolCategories(data.toolCategories);
                setAllUsers(data.allUsers);
                setSubscribers(data.subscribers);

                // 3. Map Stats
                const { counts } = data;
                setStats([
                    { id: 'tools', label: 'Total Tools', value: counts.totalTools, icon: Package, color: 'var(--primary)' },
                    { id: 'users', label: 'Total Users', value: counts.totalUsers, icon: Users, color: 'var(--secondary)' },
                    { id: 'pending', label: 'Pending Apps', value: counts.totalPending, icon: Clock, color: '#ffcc00' },
                    { id: 'status', label: 'System Status', value: 'Online', icon: Activity, color: '#00ff88' }
                ]);

            } catch (err) {
                console.error('Admin Init Error:', err);
                setError(err.message);
                showToast('Failed to load admin data: ' + err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [user, authLoading, navigate, showToast]);

    /**
     * Tool Actions
     */
    const handleApprove = async (tool) => {
        try {
            const isUpdate = !!tool.pending_changes;
            await adminService.approveTool(tool);
            
            await sendNotification(
                tool.user_id, 
                isUpdate ? 'Data Update Approved' : 'New Tool Approved', 
                isUpdate ? `Modifications for "${tool.name}" approved.` : `"${tool.name}" is now live.`, 
                'approval'
            );
            
            setPendingTools(prev => prev.filter(t => t.id !== tool.id));
            showToast(isUpdate ? 'Update applied!' : 'Tool approved!', 'success');
        } catch (err) {
            showToast('Approval Error: ' + err.message, 'error');
        }
    };

    const handleReject = async (tool) => {
        const isUpdate = !!tool.pending_changes;
        if (!window.confirm(isUpdate ? `Reject changes for "${tool.name}"?` : `Reject and DELETE "${tool.name}"?`)) return;

        try {
            await adminService.rejectTool(tool);
            
            await sendNotification(
                tool.user_id, 
                'Update Regarding Your Submission', 
                isUpdate ? `Changes for "${tool.name}" rejected.` : `Submission "${tool.name}" not approved.`, 
                'rejection'
            );
            
            setPendingTools(prev => prev.filter(t => t.id !== tool.id));
            showToast('Action completed.', 'info');
        } catch (err) {
            showToast('Rejection Error: ' + err.message, 'error');
        }
    };

    /**
     * Managed Search & Featured Toggle
     */
    const handleAdminSearch = async (e) => {
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
    };

    const handleToggleFeatured = async (tool) => {
        try {
            const newState = await adminService.toggleFeatured(tool.id, tool.is_featured);
            
            // Sync all relevant lists
            const updater = (t) => t.id === tool.id ? { ...t, is_featured: newState } : t;
            
            setFeaturedTools(prev => newState ? [...prev, { ...tool, is_featured: true }] : prev.filter(t => t.id !== tool.id));
            setAdminSearchResults(prev => prev.map(updater));
            setPendingTools(prev => prev.map(updater));
            
            showToast('Status updated!', 'success');
        } catch (err) {
            showToast('Feature Toggle Error: ' + err.message, 'error');
        }
    };

    /**
     * Blog & Category Operations
     */
    const handleCreateBlog = async (postData) => {
        setSubmitting(true);
        try {
            const catObj = blogCategories.find(c => c.id === postData.category || c.name === postData.category);
            const dataWithCat = { ...postData, category: catObj ? catObj.name : postData.category };
            
            const newPost = await adminService.createBlogPost(dataWithCat, user.id);
            setBlogPosts(prev => [newPost, ...prev]);
            showToast('Blog Published!', 'success');
            return true;
        } catch (err) {
            showToast('Blog Error: ' + err.message, 'error');
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBlog = async (id) => {
        if (!window.confirm('Delete article?')) return;
        try {
            await adminService.deleteBlogPost(id);
            setBlogPosts(prev => prev.filter(p => p.id !== id));
            showToast('Deleted.', 'info');
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        }
    };

    const handleCategoryAction = async (action, type, payload) => {
        try {
            const isBlog = type === 'blog';
            if (action === 'create') {
                const newCat = await adminService.createCategory(payload, isBlog);
                isBlog ? setBlogCategories(prev => [...prev, newCat]) : setToolCategories(prev => [...prev, newCat]);
                showToast('Category added!', 'success');
            } else if (action === 'delete') {
                if (!window.confirm('Delete category?')) return;
                await adminService.deleteCategory(payload, isBlog);
                isBlog ? setBlogCategories(prev => prev.filter(c => c.id !== payload)) : setToolCategories(prev => prev.filter(c => c.id !== payload));
                showToast('Category deleted.', 'info');
            }
        } catch (err) {
            showToast('Category Error: ' + err.message, 'error');
        }
    };

    /**
     * Tool Direct Add
     */
    const handleAddToolDirect = async (toolData) => {
        setSubmitting(true);
        try {
            const newTool = await adminService.addToolDirect(toolData, user.id);
            showToast('Full tool added and approved!', 'success');
            return true;
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
            return false;
        } finally {
            setSubmitting(false);
        }
    };

    /**
     * Storage Helper
     */
    const uploadFile = async (file) => {
        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `tool-thumbnails/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('tool-images').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('tool-images').getPublicUrl(filePath);
            return publicUrl;
        } catch (err) {
            showToast('Upload failed: ' + err.message, 'error');
            return null;
        } finally {
            setUploading(false);
        }
    };

    return {
        // States
        loading, isAdmin, error, stats, activeTab,
        pendingTools, featuredTools, blogPosts, blogCategories, toolCategories,
        allUsers, subscribers, adminSearchQuery, adminSearchResults, isSearchingTools,
        submitting, uploading,
        
        // Handlers
        setActiveTab, handleApprove, handleReject, handleAdminSearch, handleToggleFeatured,
        handleCreateBlog, handleDeleteBlog, handleCategoryAction, handleAddToolDirect,
        uploadFile
    };
};
