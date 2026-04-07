import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import useSEO from '../hooks/useSEO';

// Import Modular Components
import SmartBanner from '../components/SmartBanner';
import ToolsHeader from '../components/Tools/ToolsHeader';
import ToolsFilterBar from '../components/Tools/ToolsFilterBar';
import ToolsGrid from '../components/Tools/ToolsGrid';
import ToolsSubmitCTA from '../components/Tools/ToolsSubmitCTA';

// Import Modular CSS
import '../styles/Pages/Tools.css';

const Tools = () => {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const ITEMS_PER_PAGE = 12;

    useSEO({
        title: "Discover 500+ AI Tools | HUBly Directory",
        description: "Browse our comprehensive directory of AI and SaaS tools. Filter by price, category, and find the perfect solution.",
        url: typeof window !== 'undefined' ? window.location.href : 'https://hubly.com/tools'
    });

    // Fetch Categories once on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), 4000);
                const { data } = await supabase.from('categories').select('*').abortSignal(controller.signal);
                clearTimeout(id);
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
        setTools([]);
        setHasMore(true);
    }, [selectedCategory, priceFilter, sortBy, searchQuery]);

    // Fetch Tools when filters, search, page or categories change
    useEffect(() => {
        const fetchTools = async () => {
            if (page === 0) setLoading(true);
            else setLoadingMore(true);
            setError(null);

            try {
                let query = supabase
                    .from('tools')
                    .select('id, name, slug, short_description, image_url, pricing_type, rating, reviews_count, is_featured, is_verified, categories(name)', { count: 'exact' })
                    .eq('is_approved', true);

                if (searchQuery) {
                    query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
                }

                if (selectedCategory !== 'All') {
                    const catObj = categories.find(c => c.name === selectedCategory);
                    if (catObj) {
                        query = query.eq('category_id', catObj.id);
                    }
                }

                if (priceFilter !== 'All') {
                    query = query.eq('pricing_type', priceFilter);
                }

                const from = page * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;
                query = query.range(from, to);

                if (sortBy === 'Newest') {
                    query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
                } else if (sortBy === 'Rating') {
                    query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
                } else if (sortBy === 'Popular') {
                    query = query.order('is_featured', { ascending: false }).order('view_count', { ascending: false });
                }

                const { data, count, error: fetchErr } = await query;
                if (fetchErr) throw fetchErr;

                if (page === 0) {
                    setTools(data || []);
                } else {
                    setTools(prev => [...prev, ...(data || [])]);
                }

                if (data && data.length < ITEMS_PER_PAGE) setHasMore(false);
                if (count !== null) setTotalResults(count);
            } catch (err) {
                console.error('Error fetching tools:', err);
                setError("Unable to fetch tools. Please check your connection.");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchTools();
    }, [selectedCategory, priceFilter, sortBy, categories, searchQuery, page]);

    return (
        <div className="page-wrapper tools-directory-page">
            <SmartBanner />
            
            <ToolsHeader 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                totalResults={totalResults} 
                loading={loading} 
            />

            <main className="main-section">
                <ToolsFilterBar 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    priceFilter={priceFilter}
                    setPriceFilter={setPriceFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                <ToolsGrid 
                    tools={tools} 
                    loading={loading} 
                    loadingMore={loadingMore} 
                    error={error} 
                    hasMore={hasMore} 
                    setPage={setPage} 
                />

                <ToolsSubmitCTA />
            </main>
        </div>
    );
};

export default Tools;
