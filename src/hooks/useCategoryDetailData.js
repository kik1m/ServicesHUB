import { useState, useEffect, useCallback } from 'react';
import { categoriesService } from '../services/categoriesService';
import { toolsService } from '../services/toolsService';

/**
 * Custom hook for managing category detail page data, tools, and pagination
 * @param {string} slug - The category slug from URL params
 */
export const useCategoryDetailData = (slug) => {
    const [category, setCategory] = useState(null);
    const [tools, setTools] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 12;

    // Reset state when slug changes
    useEffect(() => {
        window.scrollTo(0, 0);
        setPage(0);
        setTools([]);
        setHasMore(true);
        setCategory(null);
    }, [slug]);

    // Fetch initial category and first page of tools
    const fetchCategoryAndTools = useCallback(async () => {
        if (!slug) return;
        
        if (page === 0) setLoading(true);
        else setLoadingMore(true);

        try {
            let currentCat = category;
            
            // 1. Fetch Category if not already loaded or slug changed
            if (!currentCat || currentCat.slug !== slug) {
                const { data: catData, error: catError } = await categoriesService.getCategoryBySlug(slug);
                if (catError) throw catError;
                setCategory(catData);
                currentCat = catData;
            }

            // 2. Fetch Tools for this category
            if (currentCat) {
                const { data: toolData, error: toolError, count } = await toolsService.getToolsPaginated({
                    page,
                    itemsPerPage: ITEMS_PER_PAGE,
                    categoryName: currentCat.name,
                    // Pass empty categories array because getToolsPaginated finds ID by name from it
                    // Or let's just make sure getToolsPaginated handles this case if categories is empty
                    categories: [currentCat] 
                });

                if (toolError) throw toolError;

                if (toolData) {
                    if (page === 0) setTools(toolData);
                    else setTools(prev => [...prev, ...toolData]);

                    if (toolData.length < ITEMS_PER_PAGE) setHasMore(false);
                    if (count !== null) setTotalResults(count);
                }
            }
        } catch (error) {
            console.error('Error in useCategoryDetailData:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [slug, page, category]);

    useEffect(() => {
        fetchCategoryAndTools();
    }, [fetchCategoryAndTools]);

    // Local search filtering (as per original logic)
    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.short_description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        category,
        tools,
        filteredTools,
        totalResults,
        searchQuery,
        setSearchQuery,
        loading,
        loadingMore,
        hasMore,
        setPage,
        page
    };
};
