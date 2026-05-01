import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';
import { PRICING_MODELS } from '../constants/searchConstants';

/**
 * 🚀 Elite Unified Search Engine
 * Rule #1: Full Logic Isolation
 * Rule #2: URL as Single Source of Truth
 * Pattern: SWR (Stale-While-Revalidate) with Cross-Page Memory Cache
 */

const searchCache = new Map();
let categoriesCache = null;

export const useSearchEngine = ({ 
    mode = 'full', // 'full' | 'lite' | 'category'
    syncUrl = true,
    fixedCategory = 'All',
    itemsPerPage = 20, // Standardized to 20 to match service
    debounceMs = 400
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // 1. Local State Fallbacks (for modals/syncUrl=false)
    const [localQuery, setLocalQuery] = useState('');
    const [localCategory, setLocalCategory] = useState(fixedCategory);
    const [localPrice, setLocalPrice] = useState('All');
    const [localSort, setLocalSort] = useState('featured');
    const [localPage, setLocalPage] = useState(0);

    // 2. Source of Truth Extraction
    const searchQuery = syncUrl ? (searchParams.get('q') || '') : localQuery;
    const selectedCategory = syncUrl ? (searchParams.get('category') || 'All') : localCategory;
    const selectedPrice = syncUrl ? (searchParams.get('price') || 'All') : localPrice;
    const sortBy = syncUrl ? (searchParams.get('sort') || 'featured') : localSort;
    const rawPage = syncUrl ? parseInt(searchParams.get('page') || '0', 10) : localPage;
    const page = isNaN(rawPage) ? 0 : rawPage;

    // 3. Partitioned States
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const [categories, setCategories] = useState(categoriesCache || []);
    const [catSearchQuery, setCatSearchQuery] = useState('');
    const [showAllCats, setShowAllCats] = useState(false);

    /**
     * State Dispatcher (Hybrid URL/Local)
     */
    const updateParams = useCallback((newParams) => {
        if (!syncUrl) {
            if (newParams.q !== undefined) setLocalQuery(newParams.q);
            if (newParams.category !== undefined) setLocalCategory(newParams.category);
            if (newParams.price !== undefined) setLocalPrice(newParams.price);
            if (newParams.sort !== undefined) setLocalSort(newParams.sort);
            if (newParams.page !== undefined) setLocalPage(newParams.page);
            else setLocalPage(0); // Reset page on filter change
            return;
        }

        setSearchParams(prev => {
            const params = new URLSearchParams(prev);
            Object.keys(newParams).forEach(key => {
                const val = newParams[key];
                if (val === '' || val === 'All' || val === 0 || val === 'featured' || val === null || val === undefined) {
                    params.delete(key);
                } else {
                    params.set(key, String(val));
                }
            });
            if (!Object.keys(newParams).includes('page')) params.delete('page');
            return params;
        });
    }, [setSearchParams, syncUrl]);

    // 🎯 Rule #10: Sync fixed category when it arrives asynchronously
    useEffect(() => {
        if (fixedCategory && fixedCategory !== 'All') {
            if (syncUrl) {
                // If syncing with URL, update the URL to match the fixed category
                const currentCat = searchParams.get('category');
                if (currentCat !== fixedCategory) {
                    updateParams({ category: fixedCategory });
                }
            } else {
                setLocalCategory(fixedCategory);
            }
        }
    }, [fixedCategory, syncUrl, searchParams, updateParams]);

    // Action Handlers
    const setQuery = useCallback((val) => updateParams({ q: val }), [updateParams]);
    const setCategory = useCallback((val) => updateParams({ category: val }), [updateParams]);
    const setPrice = useCallback((val) => updateParams({ price: val }), [updateParams]);
    const setSort = useCallback((val) => updateParams({ sort: val }), [updateParams]);
    const setPageNum = useCallback((val) => {
        const nextVal = typeof val === 'function' ? val(page) : val;
        updateParams({ page: nextVal });
    }, [updateParams, page]);

    // Fetch Categories
    const fetchCategories = useCallback(async () => {
        if (categoriesCache) return;
        try {
            const { data } = await categoriesService.getAllCategories();
            if (data) {
                categoriesCache = [{ id: 'All', name: 'All' }, ...data];
                setCategories(categoriesCache);
            }
        } catch (err) {
            console.error('Category Sync Error:', err);
        }
    }, []);

    // Core Fetch Engine
    const fetchTools = useCallback(async (isInitial = true) => {
        const cacheKey = `${searchQuery}|${selectedCategory}|${selectedPrice}|${sortBy}|${page}|${itemsPerPage}`;
        const cached = searchCache.get(cacheKey);

        if (cached && isInitial) {
            setResults(cached.data);
            setHasMore(cached.hasMore);
            setTotalResults(cached.total || 0);
            setIsLoading(false);
            return;
        }

        // 🛡️ Rule #24.6: Prevent 'All' fallback when category metadata is still loading
        if (selectedCategory !== 'All' && categories.length === 0) {
            return; 
        }

        if (isInitial) setIsLoading(true);
        else setLoadingMore(true);
        setError(null);

        try {
            const { data, count, error: fetchErr } = await toolsService.getToolsPaginated({
                page,
                itemsPerPage,
                searchQuery,
                categoryName: selectedCategory,
                priceFilter: selectedPrice,
                sortBy,
                categories
            });

            if (fetchErr) throw fetchErr;

            if (data) {
                const totalCount = count !== null ? count : (page === 0 ? data.length : totalResults);
                const currentTotalLoaded = (page === 0 ? 0 : results.length) + data.length;
                const hasMoreData = currentTotalLoaded < totalCount;
                
                searchCache.set(cacheKey, { data, hasMore: hasMoreData, total: totalCount });
                
                setResults(prev => page === 0 ? data : [...prev, ...data]);
                setHasMore(hasMoreData);
                setTotalResults(totalCount);
            } else if (page === 0) {
                // Defensive: If first page returns null data, ensure results is empty array
                setResults([]);
                setTotalResults(0);
                setHasMore(false);
            }
        } catch (err) {
            // Rule #32: Graceful degradation for out-of-bounds ranges (416)
            if (err.code === 'PGRST103' || err.message?.includes('416')) {
                if (page > 0 && results.length === 0) {
                    updateParams({ page: 0 });
                }
                setHasMore(false);
                setLoadingMore(false);
                setIsLoading(false);
                return;
            }
            setError(err.message || "Operation failed. Please check your connectivity.");
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    }, [searchQuery, selectedCategory, selectedPrice, sortBy, page, itemsPerPage, categories]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTools(page === 0);
        }, page === 0 ? debounceMs : 0);
        return () => clearTimeout(timer);
    }, [fetchTools, page, debounceMs]);

    // 🎯 Reset page to 0 if itemsPerPage changes to avoid out-of-bounds pages
    useEffect(() => {
        if (page > 0) {
            updateParams({ page: 0 });
        }
    }, [itemsPerPage]);

    // 🚀 Elite Derived Data Logic (Rule #35)
    const searchFilteredCategories = useMemo(() => {
        if (!catSearchQuery) return categories;
        return categories.filter(cat => 
            cat.name?.toLowerCase().includes(catSearchQuery.toLowerCase())
        );
    }, [categories, catSearchQuery]);

    const displayedCategories = useMemo(() => {
        if (!searchFilteredCategories || searchFilteredCategories.length === 0) return [];
        if (catSearchQuery || showAllCats) return searchFilteredCategories;

        const limit = 5;
        if (searchFilteredCategories.length <= limit) return searchFilteredCategories;

        const slice = searchFilteredCategories.slice(0, limit);
        if (selectedCategory && selectedCategory !== 'All') {
            const hasActive = slice.some(c => c.name === selectedCategory);
            if (!hasActive) {
                const activeItem = searchFilteredCategories.find(c => c.name === selectedCategory);
                if (activeItem) return [...slice.slice(0, limit - 1), activeItem];
            }
        }
        return slice;
    }, [searchFilteredCategories, catSearchQuery, showAllCats, selectedCategory]);

    const hiddenCount = searchFilteredCategories.length - displayedCategories.length;

    const formattedTotalResults = useMemo(() => 
        (totalResults || 0).toLocaleString(), 
        [totalResults]
    );

    // 🚀 Elite Relevance Sorting (Rule #35):
    // Dynamically reorder fetched results so Name matches appear before Description matches
    const sortedResults = useMemo(() => {
        if (!searchQuery || results.length === 0) return results;
        
        const lowerQuery = searchQuery.toLowerCase();
        
        return [...results].sort((a, b) => {
            const aName = a.name?.toLowerCase() || '';
            const bName = b.name?.toLowerCase() || '';
            
            // Priority 1: Starts exactly with the query
            const aStarts = aName.startsWith(lowerQuery) ? 1 : 0;
            const bStarts = bName.startsWith(lowerQuery) ? 1 : 0;
            if (aStarts !== bStarts) return bStarts - aStarts;
            
            // Priority 2: Contains the query in the name
            const aIncludes = aName.includes(lowerQuery) ? 1 : 0;
            const bIncludes = bName.includes(lowerQuery) ? 1 : 0;
            if (aIncludes !== bIncludes) return bIncludes - aIncludes;
            
            // Priority 3: Keep original DB order (which is by featured/newest)
            return 0;
        });
    }, [results, searchQuery]);

    return {
        isLoading, loadingMore, error, results: sortedResults, hasMore, totalResults, formattedTotalResults, categories,
        displayedCategories, hiddenCount,
        catSearchQuery, setCatSearchQuery,
        showAllCats, setShowAllCats,
        pricingModels: PRICING_MODELS,
        searchQuery, setQuery,
        selectedCategory, setCategory,
        selectedPrice, setPrice,
        sortBy, setSort,
        page, setPageNum,
        refresh: () => {
            searchCache.clear();
            fetchTools(true);
        }
    };
};
