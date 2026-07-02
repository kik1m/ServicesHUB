import { profilesService } from '../services/profilesService';
import { favoritesService } from '../services/favoritesService';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';
import { blogService } from '../services/blogService';
import { notificationsService } from '../services/notificationsService';
import { compareService } from '../services/compareService';
import { reviewsService } from '../services/reviewsService';
import { adminService } from '../services/adminService';
import { supabase } from '../lib/supabaseClient';

/**
 * 🚀 Elite React Query Configuration Central
 * This file contains the single source of truth for all Query Keys, Fetcher Functions, and Stale Times.
 * Ensures perfect cache sharing across the platform and eliminates scattered/duplicate logic.
 */

export const queryOptions = {
    // --- User Profile & Identity ---
    profile: (userId, userObj = null) => ({
        queryKey: ['profile', userId],
        queryFn: async () => {
            const { data, error } = await profilesService.getProfileById(userId);
            if (error) throw new Error(error);
            
            // 🚀 Elite Hybrid Strategy: Merge Auth Metadata with Database Profile
            // This ensures we have a fallback for avatar_url and full_name instantly
            const authMeta = userObj?.user_metadata || {};
            
            if (!data) return userObj ? { ...userObj, full_name: authMeta.full_name || 'Member', avatar_url: authMeta.avatar_url } : null;

            return {
                ...data,
                full_name: data.full_name || authMeta.full_name || 'Member',
                avatar_url: data.avatar_url || authMeta.avatar_url || null
            };
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 60 // 1 hour
    }),

    // --- User Collections & Dashboard ---
    favorites: (userId) => ({
        queryKey: ['favorites_list', userId],
        queryFn: async () => {
            const { data, error } = await favoritesService.getUserFavorites(userId);
            if (error) throw error;
            return data || [];
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5 // 5 minutes
    }),

    dashboardTools: (userId) => ({
        queryKey: ['dashboard_tools', userId],
        queryFn: async () => {
            const { data, error } = await toolsService.getUserTools(userId);
            if (error) throw error;
            return data || [];
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5 // 5 minutes
    }),

    notifications: (userId) => ({
        queryKey: ['notifications', userId],
        queryFn: async () => {
            const { data, error } = await notificationsService.fetchNotifications(userId);
            if (error) throw error;
            return data || [];
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 5 // 5 minutes
    }),

    // --- Global Data (Categories, Blog) ---
    categories: () => ({
        queryKey: ['categories', 'all'],
        queryFn: async () => {
            const { data } = await categoriesService.getAllCategories();
            return data || [];
        },
        staleTime: 1000 * 60 * 60 * 24 // 24 hours
    }),

    blogCategories: () => ({
        queryKey: ['blog', 'categories'],
        queryFn: async () => {
            const { data } = await blogService.getCategories();
            return data ? ['All', ...data.map(c => c.name)] : ['All'];
        },
        staleTime: 1000 * 60 * 60 * 24 // 24 hours
    }),

    // --- Tool & Search Queries ---
    toolBySlug: (slug) => ({
        queryKey: ['tool', slug],
        queryFn: async () => {
            const { data, error } = await toolsService.getToolBySlug(slug);
            if (error) throw error;
            if (!data) throw new Error('Tool not found');
            return data;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 10 // 10 minutes
    }),

    categoryBySlug: (slug) => ({
        queryKey: ['category', slug],
        queryFn: async () => {
            const { data, error } = await categoriesService.getCategoryBySlug(slug);
            if (error) throw error;
            return data;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 60 // 1 hour
    }),

    categoryTools: (categoryName) => ({
        queryKey: ['category_tools', categoryName],
        queryFn: async () => {
            const { data, error } = await toolsService.getToolsByCategory(categoryName);
            if (error) throw error;
            return data || [];
        },
        enabled: !!categoryName,
        staleTime: 1000 * 60 * 10 // 10 minutes
    }),

    toolsSearch: (params = {}) => {
        const { 
            searchQuery = '', 
            selectedCategory = 'All', 
            selectedCategoryId = null,
            selectedPrice = 'All', 
            sortBy = 'featured', 
            itemsPerPage = 12, 
            queryCategories = [] 
        } = params;
        
        return {
            queryKey: ['tools_search', { searchQuery, selectedCategory, selectedCategoryId, selectedPrice, sortBy, itemsPerPage }],
            queryFn: async ({ pageParam = 0 }) => {
                // Elite Safety: If we have a category name but no ID and the list hasn't loaded, wait or return empty
                // BUT if we have selectedCategoryId, we can proceed immediately!
                if (selectedCategory !== 'All' && !selectedCategoryId && queryCategories.length <= 1) {
                    return { data: [], count: 0, offset: pageParam };
                }

                const { data, count, error } = await toolsService.getToolsPaginated({
                    offset: pageParam,
                    itemsPerPage,
                    searchQuery,
                    categoryName: selectedCategory,
                    categoryId: selectedCategoryId,
                    priceFilter: selectedPrice,
                    sortBy,
                    categories: queryCategories
                });
                
                if (error) throw new Error(error);
                return { data: data || [], count: count || 0, offset: pageParam };
            },
            staleTime: 1000 * 60 * 5 // 5 minutes
        };
    },

    // --- Home Page Specifics ---
    home: {
        categories: () => ({
            queryKey: ['home', 'categories'],
            queryFn: async () => {
                const res = await categoriesService.getHomeCategories();
                if (res.error) throw res.error;
                return res.data || [];
            },
            staleTime: 1000 * 60 * 60 * 24
        }),
        featured: () => ({
            queryKey: ['home', 'featured'],
            queryFn: async () => {
                const res = await toolsService.getFeaturedTools();
                if (res.error) throw res.error;
                return res.data || [];
            },
            staleTime: 1000 * 60 * 60
        }),
        latest: () => ({
            queryKey: ['home', 'latest'],
            queryFn: async () => {
                const res = await toolsService.getLatestTools();
                if (res.error) throw res.error;
                return res.data || [];
            },
            staleTime: 1000 * 60 * 60
        }),
        trending: () => ({
            queryKey: ['home', 'trending'],
            queryFn: async () => {
                const res = await toolsService.getTrendingTools();
                if (res.error) throw res.error;
                return res.data || [];
            },
            staleTime: 1000 * 60 * 10
        }),
        posts: () => ({
            queryKey: ['home', 'posts'],
            queryFn: async () => {
                const res = await blogService.getLatestPosts();
                if (res.error) throw res.error;
                return res.data || [];
            },
            staleTime: 1000 * 60 * 60
        }),
        comparisons: () => ({
            queryKey: ['home', 'comparisons'],
            queryFn: async () => {
                const res = await compareService.getRecentComparisons();
                if (res.error) throw res.error;
                return res.data || [];
            },
            staleTime: 1000 * 60 * 60
        }),
        stats: () => ({
            queryKey: ['home', 'stats'],
            queryFn: async () => {
                const [toolsRes, usersRes] = await Promise.all([
                    toolsService.getToolsStats(),
                    profilesService.getUsersCount()
                ]);
                if (toolsRes.error || usersRes.error) throw new Error("Stats error");
                return {
                    tools: toolsRes.count || 0,
                    views: toolsRes.views || 0,
                    clicks: toolsRes.clicks || 0,
                    users: usersRes.count || 0
                };
            },
            staleTime: 1000 * 60 * 10
        })
    },

    // --- Admin Dashboard ---
    admin: {
        role: (userId) => ({
            queryKey: ['admin_role', userId],
            queryFn: async () => {
                const { data, error } = await supabase.from('profiles').select('role, full_name').eq('id', userId).single();
                if (error) throw error;
                if (data?.role !== 'admin') throw new Error('Unauthorized');
                return data;
            },
            enabled: !!userId,
            staleTime: Infinity,
            retry: false
        }),
        dashboard: () => ({
            queryKey: ['admin_dashboard_data'],
            queryFn: async () => adminService.fetchDashboardData(),
            staleTime: 1000 * 60 * 2
        }),
        allTools: (page) => ({
            queryKey: ['admin_all_tools', page],
            queryFn: async () => adminService.fetchAllToolsPaginated(page, 10),
            staleTime: 1000 * 60 * 2
        })
    },

    // --- Reviews ---
    reviews: (toolId) => ({
        queryKey: ['reviews', toolId],
        queryFn: async () => {
            const { data, error } = await reviewsService.getReviewsByToolId(toolId);
            if (error) throw error;
            return data?.filter(Boolean) ?? [];
        },
        enabled: !!toolId,
        staleTime: 1000 * 60 * 5 // 5 minutes
    }),

    // --- Banner ---
    bannerTools: (maxItems = 20) => ({
        queryKey: ['banner', 'tools'],
        queryFn: async () => {
            const { data, error } = await toolsService.getBannerTools(maxItems);
            if (error) throw error;
            return (data || []).sort(() => Math.random() - 0.5);
        },
        staleTime: 1000 * 60 * 10
    }),

    // --- Blog ---
    blogPost: (id) => ({
        queryKey: ['blog_post', id],
        queryFn: async () => {
            const { data: postData, error: postError } = await blogService.getPostByIdOrSlug(id);
            if (postError) throw postError;

            // Fetch embedded tool details
            const toolIds = [...(postData.content?.matchAll(/\[tool id="([^"]+)"\]/g) || [])].map(m => m[1]);
            if (toolIds.length > 0) {
                const { data: embeddedTools } = await toolsService.getToolsByIds(toolIds);
                postData.embeddedTools = embeddedTools || [];
            } else {
                postData.embeddedTools = [];
            }
            
            return postData;
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 10
    }),

    relatedPosts: (category, postId) => ({
        queryKey: ['blog_related', category, postId],
        queryFn: async () => {
            const { data } = await blogService.getRelatedPosts(category, postId);
            return data || [];
        },
        enabled: !!category && !!postId,
        staleTime: 1000 * 60 * 60
    })
};
