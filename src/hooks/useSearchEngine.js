import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useInfiniteQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { queryOptions } from '../lib/queryOptions';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';
import { PRICING_MODELS } from '../constants/searchConstants';

/**
 * 🚀 Elite Unified Search Engine (Next.js App Router Version)
 */
const searchCache = new Map();
let categoriesCache = null;

export const useSearchEngine = ({ 
    mode = 'full', 
    syncUrl = true,
    fixedCategory = 'All',
    fixedCategoryId = null,
    itemsPerPage = 20,
    debounceMs = 400
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // 1. Local State Fallbacks (for modals/syncUrl=false)
    const [localQuery, setLocalQuery] = useState('');
    const [localCategory, setLocalCategory] = useState(fixedCategory);
    const [localCategoryId, setLocalCategoryId] = useState(fixedCategoryId);
    const [localPrice, setLocalPrice] = useState('All');
    const [localSort, setLocalSort] = useState('featured');
    const [localPage, setLocalPage] = useState(0);

    // 2. Source of Truth Extraction
    // Use local states as the primary source of truth after initial mount to prevent Next.js server re-renders
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const searchQuery = (syncUrl && !isMounted) ? (searchParams.get('q') || '') : localQuery;
    const selectedCategory = (syncUrl && !isMounted) ? (searchParams.get('category') || 'All') : localCategory;
    const selectedPrice = (syncUrl && !isMounted) ? (searchParams.get('price') || 'All') : localPrice;
    const sortBy = (syncUrl && !isMounted) ? (searchParams.get('sort') || 'featured') : localSort;
    const rawPage = (syncUrl && !isMounted) ? parseInt(searchParams.get('page') || '0', 10) : localPage;
    const page = isNaN(rawPage) ? 0 : rawPage;

    // 🎯 Sync fixedCategoryId when it changes
    useEffect(() => {
        if (fixedCategoryId) setLocalCategoryId(fixedCategoryId);
    }, [fixedCategoryId]);

    // Sync initial URL params to local state on mount
    useEffect(() => {
        if (syncUrl) {
            setLocalQuery(searchParams.get('q') || '');
            setLocalCategory(searchParams.get('category') || fixedCategory || 'All');
            setLocalPrice(searchParams.get('price') || 'All');
            setLocalSort(searchParams.get('sort') || 'featured');
            setLocalPage(parseInt(searchParams.get('page') || '0', 10) || 0);
        }
    }, [syncUrl, searchParams, fixedCategory]);

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
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    /**
     * State Dispatcher (Hybrid URL/Local)
     */
    const updateParams = useCallback((newParams) => {
        // Always update local state immediately for instant UI response
        if (newParams.q !== undefined) setLocalQuery(newParams.q);
        if (newParams.category !== undefined) setLocalCategory(newParams.category);
        if (newParams.price !== undefined) setLocalPrice(newParams.price);
        if (newParams.sort !== undefined) setLocalSort(newParams.sort);
        if (newParams.page !== undefined) setLocalPage(newParams.page);
        else if (Object.keys(newParams).length > 0 && newParams.page === undefined) setLocalPage(0);

        if (syncUrl) {
            // Silently update URL without triggering Next.js server navigation
            const params = new URLSearchParams(window.location.search);
            Object.keys(newParams).forEach(key => {
                const val = newParams[key];
                if (val === '' || val === 'All' || val === 0 || val === 'featured' || val === null || val === undefined) {
                    params.delete(key);
                } else {
                    params.set(key, String(val));
                }
            });
            if (!Object.keys(newParams).includes('page') && newParams.page === undefined) params.delete('page');
            
            const newUrl = `${pathname}?${params.toString()}`;
            window.history.replaceState(null, '', newUrl);
        }
    }, [pathname, syncUrl]);

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

    // 4. React Query for Categories
    const { data: rawCategories = [] } = useQuery(queryOptions.categories());

    const queryCategories = useMemo(() => {
        return [{ id: 'All', name: 'All' }, ...rawCategories];
    }, [rawCategories]);

    // Sync categories locally for derived state logic
    useEffect(() => {
        if (queryCategories.length > 1) { // >1 because 'All' is always there
            setCategories(queryCategories);
            categoriesCache = queryCategories;
        }
    }, [queryCategories]);

    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        isPending, // Added to track initial loading without data
        error: queryError,
        refetch
    } = useInfiniteQuery({
        ...queryOptions.toolsSearch({
            searchQuery,
            selectedCategory,
            selectedCategoryId: localCategoryId,
            selectedPrice,
            sortBy,
            itemsPerPage,
            queryCategories
        }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((acc, p) => acc + p.data.length, 0);
            const totalCount = lastPage.count !== null ? lastPage.count : loadedCount;
            if (loadedCount >= totalCount || lastPage.data.length === 0) return undefined;
            return loadedCount;
        },
        placeholderData: keepPreviousData,
        enabled: queryCategories.length > 0 || selectedCategory === 'All'
    });

    // 6. Map Infinite Query Data to Backward Compatible State
    useEffect(() => {
        if (infiniteData) {
            const allResults = infiniteData.pages.flatMap(p => p.data);
            setResults(allResults);
            setHasMore(!!hasNextPage);
            setTotalResults(infiniteData.pages[0]?.count || allResults.length);
        }
    }, [infiniteData, hasNextPage]);

    // 7. Sync loading states
    useEffect(() => {
        // Use isPending for initial load (when no data exists), not for background fetching!
        setIsLoading(isPending);
        setLoadingMore(isFetchingNextPage);
        setError(queryError ? queryError.message : null);
    }, [isPending, isFetchingNextPage, queryError]);

    // 🎯 Reset page to 0 if filters change to avoid out-of-bounds pages
    // The queryKey change automatically resets the infinite query!
    // But we need to sync the URL.
    useEffect(() => {
        if (page > 0 && !isFetching && infiniteData && infiniteData.pages && infiniteData.pages.length === 1) {
             updateParams({ page: 0 });
        }
    }, [searchQuery, selectedCategory, selectedPrice, sortBy, itemsPerPage, page, isFetching, infiniteData, updateParams]);

    // Override setPageNum to use fetchNextPage and update URL
    const setPageNum = useCallback((val) => {
        const nextVal = typeof val === 'function' ? val(page) : val;
        updateParams({ page: nextVal });
        if (nextVal > page) {
            fetchNextPage();
        }
    }, [updateParams, page, fetchNextPage]);

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
        setFilters: updateParams,
        isMobileFiltersOpen,
        setIsMobileFiltersOpen,
        refresh: () => {
            refetch();
        }
    };
};
