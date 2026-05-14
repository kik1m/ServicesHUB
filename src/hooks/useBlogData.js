import { useState, useMemo, useEffect } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { blogService } from '../services/blogService';
import { BLOG_CONSTANTS } from '../constants/blogConstants';

/**
 * 🚀 Elite Blog Data Engine (React Query Optimized)
 * Rule #1: Logic Isolation
 * Pattern: SWR (Stale-While-Revalidate) with Cross-Page Memory Cache
 */
export const useBlogData = ({ initialPosts, initialCategories } = {}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(BLOG_CONSTANTS.FILTERS.ALL);
    const { ITEMS_PER_PAGE } = BLOG_CONSTANTS.GRID;

    // 1. React Query for Categories
    const { data: categories = [BLOG_CONSTANTS.FILTERS.ALL] } = useQuery({
        queryKey: ['blog', 'categories'],
        queryFn: async () => {
            const { data } = await blogService.getCategories();
            if (data) {
                return [BLOG_CONSTANTS.FILTERS.ALL, ...data.map(c => c.name)];
            }
            return [BLOG_CONSTANTS.FILTERS.ALL];
        },
        initialData: initialCategories,
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });

    // 2. React Query for Posts (Infinite Scroll)
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['blog', 'posts', { searchQuery, selectedCategory, ITEMS_PER_PAGE }],
        initialPageParam: 0,
        queryFn: async ({ pageParam = 0 }) => {
            const { data, error } = await blogService.getPosts({ 
                searchQuery, 
                selectedCategory, 
                page: pageParam, 
                itemsPerPage: ITEMS_PER_PAGE 
            });

            if (error) throw error;
            return { data: data || [], page: pageParam };
        },
        initialData: initialPosts ? {
            pages: [{ data: initialPosts, page: 0 }],
            pageParams: [0]
        } : undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.data.length < ITEMS_PER_PAGE) {
                return undefined;
            }
            return lastPage.page + 1;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // 3. Derived State Mapping
    const posts = useMemo(() => {
        if (!infiniteData) return [];
        return infiniteData.pages.flatMap(p => p.data);
    }, [infiniteData]);

    const page = useMemo(() => {
        if (!infiniteData) return 0;
        return infiniteData.pages[infiniteData.pages.length - 1]?.page || 0;
    }, [infiniteData]);

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        posts,
        categories,
        loading: isFetching && !isFetchingNextPage,
        loadingMore: isFetchingNextPage,
        hasMore: !!hasNextPage,
        loadMore: () => {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        page
    };
};
