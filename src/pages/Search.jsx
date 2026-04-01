import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import ToolCard from '../components/ToolCard';
import { Search as SearchIcon, Filter, Check } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import CustomSelect from '../components/CustomSelect';

import useSEO from '../hooks/useSEO';

const Search = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPrice, setSelectedPrice] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 12;

    useSEO({
        title: searchQuery ? `Search: ${searchQuery}` : 'Explore Tools',
        description: 'Discover the best AI and SaaS tools in our comprehensive universe. Filter by category, price, and rating.',
        url: window.location.href
    });
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([{ id: 'All', name: 'All' }]);

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
                
                if (data) {
                    if (page === 0) setResults(data);
                    else setResults(prev => [...prev, ...data]);
                    
                    if (data.length < ITEMS_PER_PAGE) setHasMore(false);
                }
            } catch (err) {
                console.error('Search Error:', err);
            } finally {
                setIsLoading(false);
                setLoadingMore(false);
            }
        };

        const timer = setTimeout(fetchTools, page === 0 ? 500 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, selectedPrice, sortBy, page]);

    const pricingModels = ['All', 'Free', 'Freemium', 'Paid', 'Contact'];

    return (
        <div className="search-page" style={{ padding: '120px 5% 60px' }}>
            <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Explore the <span style={{ color: 'var(--primary)' }}>Universe</span></h1>
                    <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
                        <SearchIcon style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }} />
                        <input 
                            type="text" 
                            placeholder="Fine-tune your search..." 
                            className="nav-search-wrapper"
                            style={{ width: '100%', padding: '20px 20px 20px 60px', borderRadius: '25px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', color: 'white' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '3rem' }}>
                    {/* Filters Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                                <Filter size={20} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Filter Tools</h3>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700' }}>CATEGORY</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {categories.map(cat => (
                                        <button 
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            style={{ 
                                                display: 'flex', justifyContent: 'space-between', padding: '10px 15px', borderRadius: '100px',
                                                background: selectedCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                                                border: '1px solid', borderColor: selectedCategory === cat.id ? 'var(--primary)' : 'var(--border)',
                                                color: 'white', textAlign: 'left', cursor: 'pointer', transition: '0.3s', fontWeight: '600'
                                            }}
                                        >
                                            {cat.name} {selectedCategory === cat.id && <Check size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: '700' }}>PRICING</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {pricingModels.map(price => (
                                        <button 
                                            key={price}
                                            onClick={() => setSelectedPrice(price)}
                                            style={{ 
                                                padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600',
                                                background: selectedPrice === price ? 'var(--secondary)' : 'rgba(255,255,255,0.05)',
                                                color: selectedPrice === price ? 'white' : 'var(--text-muted)', border: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            {price}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <main>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>Showing <span style={{ color: 'white', fontWeight: '700' }}>{results.length}</span> tools</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ minWidth: '180px' }}>
                                    <CustomSelect 
                                        options={[
                                            { id: 'Newest', name: 'Newest First' },
                                            { id: 'Popular', name: 'Most Popular' },
                                            { id: 'Rating', name: 'Highest Rated' }
                                        ]}
                                        value={sortBy}
                                        onChange={(val) => setSortBy(val)}
                                        placeholder="Sort By"
                                        style={{ marginBottom: '0' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="results-grid-container">
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                                {isLoading ? (
                                    [1,2,3,4,5,6].map(i => (
                                        <SkeletonLoader key={i} type="card" />
                                    ))
                                ) : results.length > 0 ? (
                                    results.map(tool => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))
                                ) : (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '30px', border: '1px dashed var(--border)' }}>
                                        <SearchIcon size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                        <h3 style={{ fontWeight: '700' }}>No tools found</h3>
                                        <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search query.</p>
                                    </div>
                                )}
                            </div>

                            {hasMore && results.length > 0 && !isLoading && (
                                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                                    <button 
                                        onClick={() => setPage(prev => prev + 1)}
                                        className="btn-primary"
                                        disabled={loadingMore}
                                        style={{ padding: '1rem 3rem' }}
                                    >
                                        {loadingMore ? 'Searching...' : 'Load More Results'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Search;
