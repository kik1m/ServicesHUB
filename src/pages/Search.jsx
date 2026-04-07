import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import useSEO from '../hooks/useSEO';

// Import Modular Components
import SearchHeader from '../components/Search/SearchHeader';
import SearchSidebar from '../components/Search/SearchSidebar';
import SearchResults from '../components/Search/SearchResults';

// Import Modular CSS
import '../styles/pages/Search.css';

const Search = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPrice, setSelectedPrice] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([{ id: 'All', name: 'All' }]);
    const ITEMS_PER_PAGE = 12;

    useSEO({
        title: searchQuery ? `Search: ${searchQuery}` : 'Explore Tools',
        description: 'Discover the best AI and SaaS tools in our comprehensive universe. Filter by category, price, and rating.',
        url: typeof window !== 'undefined' ? window.location.href : 'https://hubly.com/search'
    });

    const pricingModels = ['All', 'Free', 'Freemium', 'Paid', 'Contact'];

    // Fetch initial categories
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*');
            if (data) {
                setCategories([{ id: 'All', name: 'All' }, ...data]);
            }
        };
        fetchCategories();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
        setResults([]);
        setHasMore(true);
    }, [searchQuery, selectedCategory, selectedPrice, sortBy]);

    useEffect(() => {
        let mounted = true;

        const fetchTools = async () => {
            if (page === 0) setIsLoading(true);
            else setLoadingMore(true);

            try {
                let query = supabase
                    .from('tools')
                    .select('id, name, slug, short_description, image_url, pricing_type, rating, reviews_count, is_featured, is_verified, categories(name)')
                    .eq('is_approved', true);

                if (searchQuery) {
                    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
                }

                if (selectedCategory !== 'All') {
                    query = query.eq('category_id', selectedCategory);
                }

                if (selectedPrice !== 'All') {
                    query = query.eq('pricing_type', selectedPrice);
                }

                const from = page * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;
                query = query.range(from, to);

                // Sorting
                if (sortBy === 'Newest') {
                    query = query.order('created_at', { ascending: false });
                } else if (sortBy === 'Popular') {
                    query = query.order('reviews_count', { ascending: false });
                } else if (sortBy === 'Rating') {
                    query = query.order('rating', { ascending: false });
                }

                const { data, error } = await query;
                if (error) throw error;

                if (data && mounted) {
                    if (page === 0) setResults(data);
                    else setResults(prev => [...prev, ...data]);

                    if (data.length < ITEMS_PER_PAGE) setHasMore(false);
                }
            } catch (err) {
                console.error('Search Error:', err);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                    setLoadingMore(false);
                }
            }
        };

        const timer = setTimeout(fetchTools, page === 0 ? 500 : 0);
        return () => { 
            mounted = false;
            clearTimeout(timer); 
        };
    }, [searchQuery, selectedCategory, selectedPrice, sortBy, page]);

    return (
        <div className="page-wrapper search-page">
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                
                <SearchHeader 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                />

                <div className="search-grid-layout">
                    <SearchSidebar 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        pricingModels={pricingModels}
                        selectedPrice={selectedPrice}
                        setSelectedPrice={setSelectedPrice}
                    />

                    <SearchResults 
                        results={results}
                        isLoading={isLoading}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        setPage={setPage}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                </div>
            </div>
        </div>
    );
};

export default Search;
