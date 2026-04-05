import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const [error, setError] = useState(null);
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
                
                setTools(data || []);
                
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

    const [totalResults, setTotalResults] = useState(0);

    return (
        <div className="page-wrapper">
            <SmartBanner />
            <header className="hero-section-slim">
                <div className="hero-content">
                    <h1 className="hero-title-slim">Explore All <span className="gradient-text">Tools</span></h1>
                    <p className="hero-subtitle-slim">Discover the most powerful AI and SaaS solutions curated for professionals.</p>
                </div>
            </header>

            <main className="main-section" style={{ paddingTop: '2rem' }}>
                {/* Search & Tabs Row */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div className="hero-search-wrapper-large glass-card" style={{ maxWidth: '600px', margin: '0 auto 1rem' }}>
                        <Search size={22} color="var(--primary)" />
                        <input 
                            type="text" 
                            placeholder="Find your next favorite AI tool..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {loading ? 'Searching...' : `Found ${totalResults.toLocaleString()} world-class tools`}
                    </div>

                    <div className="filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="category-scroll-container" style={{ 
                            width: '100%', 
                            overflowX: 'auto', 
                            padding: '5px 0 15px',
                            maskImage: 'linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)',
                            WebkitMaskImage: 'linear-gradient(to right, transparent, black 30px, black calc(100% - 30px), transparent)',
                            cursor: 'grab'
                        }}>
                            <div className="category-tabs" style={{ 
                                display: 'flex', 
                                gap: '0.8rem', 
                                whiteSpace: 'nowrap',
                                padding: '0 30px',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}>
                                <style dangerouslySetInnerHTML={{ __html: `
                                    .category-tabs::-webkit-scrollbar { display: none; }
                                    .tab-btn:hover { border-color: var(--primary) !important; background: rgba(var(--primary-rgb), 0.05) !important; transform: translateY(-2px); }
                                    .tab-btn.active { box-shadow: 0 5px 15px var(--primary-glow); }
                                ` }} />
                                {['All', ...categories.map(c => c.name)].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                                        style={{
                                            padding: '12px 26px', borderRadius: '100px', border: '1px solid var(--border)',
                                            background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                            color: 'white', cursor: 'pointer', transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)', fontWeight: '700', fontSize: '0.9rem',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0
                                        }}
                                    >
                                        {cat === 'All' ? 'All Tools' : cat}
                                    </button>
                                ))}
                            </div>
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
                        ) : error ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                                <p style={{ color: '#ff4444' }}>{error}</p>
                                <button onClick={() => window.location.reload()} className="btn-outline" style={{ marginTop: '1rem' }}>Retry Now</button>
                            </div>
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
                                {loadingMore ? 'Loading More...' : 'Load More Tools'}
                            </button>
                        </div>
                    )}

                    <div className="glass-card submit-cta-card" style={{ 
                        marginTop: '6rem', padding: '3rem', textAlign: 'center', 
                        background: 'linear-gradient(135deg, rgba(0, 136, 204, 0.05) 0%, rgba(0, 210, 255, 0.05) 100%)',
                        border: '1px dashed var(--primary)', borderRadius: '30px'
                    }}>
                        <Zap size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Missing a great tool?</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                            Help the community discover the best AI solutions. If you know a tool that should be here, let us know!
                        </p>
                        <Link to="/submit" className="btn-outline">Submit Your Tool Now</Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Tools;
