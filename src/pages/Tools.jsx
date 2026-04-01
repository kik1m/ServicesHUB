import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
    Search, Zap
} from 'lucide-react';
import CustomSelect from '../components/CustomSelect';
import SkeletonLoader from '../components/SkeletonLoader';
import SmartBanner from '../components/SmartBanner';
import ToolCard from '../components/ToolCard';
import useSEO from '../hooks/useSEO';

const Tools = () => {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 12;

    useSEO({
        title: "Discover 500+ AI Tools | ServicesHUB Directory",
        description: "Browse our comprehensive directory of AI and SaaS tools. Filter by price, category, and find the perfect solution.",
        url: typeof window !== 'undefined' ? window.location.href : 'https://serviceshub.com/tools'
    });

    // Fetch Categories once on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await supabase.from('categories').select('*');
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

            try {
                let query = supabase
                    .from('tools')
                    .select('id, name, slug, short_description, image_url, pricing_type, rating, reviews_count, is_featured, is_verified, categories(name)')
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

                const { data } = await query;
                
                if (data) {
                    if (page === 0) setTools(data);
                    else setTools(prev => [...prev, ...data]);
                    
                    if (data.length < ITEMS_PER_PAGE) setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching tools:', error);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        const timer = setTimeout(fetchTools, page === 0 ? 400 : 0); // Only debounce the first page
        return () => clearTimeout(timer);
    }, [selectedCategory, priceFilter, sortBy, categories, searchQuery, page]);

    return (
        <div className="page-wrapper">
            <SmartBanner />
            <header className="hero-section" style={{ minHeight: '40vh', paddingBottom: '60px' }}>
                <div className="hero-content">
                    <h1 className="hero-title">Explore All <span className="gradient-text">Tools</span></h1>
                    <p className="hero-subtitle">Discover the most powerful AI and SaaS solutions curated for professionals.</p>
                </div>
            </header>

            <main className="main-section">
                {/* Search & Tabs Row */}
                <div style={{ marginBottom: '3rem' }}>
                    <div className="nav-search-wrapper" style={{ 
                        maxWidth: '800px', margin: '0 auto 2.5rem', padding: '15px 25px', 
                        background: 'rgba(255,255,255,0.03)', borderRadius: '20px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid var(--border)' 
                    }}>
                        <Search size={22} color="var(--primary)" />
                        <input 
                            type="text" 
                            placeholder="Find your next favorite tool..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', ml: '15px', outline: 'none', fontSize: '1.1rem' }}
                        />
                    </div>

                    <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div className="category-tabs" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                            {['All', ...categories.map(c => c.name)].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                                    style={{
                                        padding: '10px 22px', borderRadius: '100px', border: '1px solid var(--border)',
                                        background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                                        color: 'white', cursor: 'pointer', transition: '0.3s', fontWeight: '700', fontSize: '0.9rem'
                                    }}
                                >
                                    {cat === 'All' ? 'All Tools' : cat}
                                </button>
                            ))}
                        </div>
                        <div className="sort-filters" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <CustomSelect
                                options={[
                                    { label: 'All Pricing', value: 'All' },
                                    { label: 'Free', value: 'Free' },
                                    { label: 'Freemium', value: 'Freemium' },
                                    { label: 'Paid', value: 'Paid' }
                                ]}
                                value={priceFilter}
                                onChange={(val) => setPriceFilter(val)}
                                placeholder="Price"
                            />
                            <CustomSelect
                                options={[
                                    { label: 'Newest First', value: 'Newest' },
                                    { label: 'Top Rated', value: 'Rating' },
                                    { label: 'Most Popular', value: 'Popular' }
                                ]}
                                value={sortBy}
                                onChange={(val) => setSortBy(val)}
                                placeholder="Sort By"
                            />
                        </div>
                    </div>
                </div>

                <div className="tools-grid-container">
                    <div className="tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2.5rem' }}>
                        {loading ? (
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <SkeletonLoader key={i} type="card" />
                            ))
                        ) : tools.length > 0 ? (
                            tools.map(tool => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                                <Zap size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                <p>No tools found matching your criteria.</p>
                            </div>
                        )}
                    </div>

                    {hasMore && tools.length > 0 && !loading && (
                        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                            <button 
                                onClick={() => setPage(prev => prev + 1)}
                                className="btn-primary"
                                disabled={loadingMore}
                                style={{ padding: '1rem 3rem' }}
                            >
                                {loadingMore ? 'Loading...' : 'Load More Tools'}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Tools;
