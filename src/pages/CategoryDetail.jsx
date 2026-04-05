import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';
import { ArrowLeft, Star, ArrowRight, Sparkles, LayoutGrid, Search, Zap, CheckCircle2 } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import SmartBanner from '../components/SmartBanner';
import Breadcrumbs from '../components/Breadcrumbs';
import useSEO from '../hooks/useSEO';
import ToolCard from '../components/ToolCard';

const CategoryDetail = () => {
    const { id: slug } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [tools, setTools] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 12;

    useSEO({
        title: category?.name ? `Best ${category.name} Tools` : 'Category Details',
        description: `Explore the best curated ${category?.name || 'various'} tools on ServicesHUB. Discover top-rated software for your needs.`,
        url: window.location.href
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        setPage(0);
        setTools([]);
        setHasMore(true);
    }, [slug]);

    useEffect(() => {
        const fetchCategoryData = async () => {
            if (page === 0) setLoading(true);
            else setLoadingMore(true);

            try {
                // Fetch Category (only once)
                let currentCat = category;
                if (!currentCat || currentCat.slug !== slug) {
                    const { data: catData, error: catError } = await supabase
                        .from('categories')
                        .select('*')
                        .eq('slug', slug)
                        .single();
                    if (catError) throw catError;
                    setCategory(catData);
                    currentCat = catData;
                }

                // Fetch Tools
                if (currentCat) {
                    const from = page * ITEMS_PER_PAGE;
                    const to = from + ITEMS_PER_PAGE - 1;
                    
                    const { data: toolData, error: toolError, count } = await supabase
                        .from('tools')
                        .select('id, name, slug, short_description, image_url, pricing_type, rating, reviews_count, is_featured, is_verified, categories(name)', { count: 'exact' })
                        .eq('category_id', currentCat.id)
                        .eq('is_approved', true)
                        .order('is_featured', { ascending: false })
                        .order('created_at', { ascending: false })
                        .range(from, to);
                    
                    if (toolError) throw toolError;
                    
                    if (toolData) {
                        if (page === 0) setTools(toolData);
                        else setTools(prev => [...prev, ...toolData]);
                        
                        if (toolData.length < ITEMS_PER_PAGE) setHasMore(false);
                        if (count !== null) setTotalResults(count);
                    }
                }
            } catch (error) {
                console.error('Error fetching category detail:', error);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        fetchCategoryData();
    }, [slug, page, category]);

    const filteredTools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.short_description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="page-wrapper">
                <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '40px' }}>
                    <div className="hero-content">
                        <SkeletonLoader type="text" width="100px" style={{ margin: '0 auto 1.5rem' }} />
                        <SkeletonLoader type="title" width="60%" style={{ margin: '0 auto 1.5rem' }} />
                        <SkeletonLoader type="text" width="40%" style={{ margin: '0 auto' }} />
                    </div>
                </header>
                <section className="main-section">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <SkeletonLoader key={i} type="card" />
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="page-wrapper" style={{ textAlign: 'center', padding: '150px 5%' }}>
                <h2 className="hero-title">Category <span className="gradient-text">Not Found</span></h2>
                <Link to="/categories" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Categories</Link>
            </div>
        );
    }

    const categoryColor = 'var(--primary)'; // Default color for all categories now

    return (
        <div className="page-wrapper category-detail-page">
            <SmartBanner />
            <header className="category-header hero-section-slim" style={{
                paddingTop: '80px',
                paddingBottom: '30px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '400px',
                    height: '400px',
                    background: categoryColor,
                    filter: 'blur(150px)',
                    opacity: 0.1,
                    zIndex: 0
                }}></div>

                <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
                    <Breadcrumbs items={[
                        { label: 'Categories', link: '/categories' },
                        { label: category.name }
                    ]} />
                    <button onClick={() => navigate('/categories')} className="btn-text" style={{ marginBottom: '2rem', color: 'white' }}>
                        <ArrowLeft size={18} /> All Categories
                    </button>

                    <div className="cat-header-icon" style={{
                        color: categoryColor,
                        marginBottom: '1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '20px',
                        margin: '0 auto 2rem',
                        border: `1px solid var(--border)`
                    }}>
                        {getIcon(category.icon_name || 'LayoutGrid', 40)}
                    </div>

                    <h1 className="hero-title-slim">
                        {category.name} Tools
                    </h1>
                    <p className="hero-subtitle-slim" style={{ margin: '1rem auto' }}>
                        Expertly curated {category.name} tools to help you build better and faster.
                    </p>
                    <div className="badge" style={{ borderColor: categoryColor, color: 'white' }}>
                        {totalResults.toLocaleString()} Tools Available
                    </div>
                </div>
            </header>

            <section className="main-section" style={{ paddingTop: '2rem' }}>
                <div className="hero-search-wrapper-large glass-card" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                    <Search size={20} color="var(--primary)" />
                    <input 
                        type="text" 
                        placeholder={`Search ${category.name} tools...`} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="section-header-row">
                    <h2 className="section-title">Explore <span className="gradient-text">Top Tools</span></h2>
                    <div className="filter-count">Showing {tools.length} of {totalResults} world-class solutions</div>
                </div>

                {tools.length > 0 ? (
                    <>
                        <div className="tools-grid" style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                            gap: '2.5rem',
                            marginTop: '3rem'
                        }}>
                            {filteredTools.map(tool => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>

                        {hasMore && tools.length > 0 && !loading && (
                            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                                <button 
                                    onClick={() => setPage(prev => prev + 1)}
                                    className="btn-primary"
                                    disabled={loadingMore}
                                    style={{ padding: '1rem 3rem' }}
                                >
                                    {loadingMore ? 'Loading Tools...' : 'Load More Tools'}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="glass-card submit-cta-card" style={{ 
                        marginTop: '6rem', padding: '3.5rem', textAlign: 'center', 
                        background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--border)', borderRadius: '30px'
                    }}>
                        <Zap size={32} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Know a great {category.name} tool?</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                            Help others discover the best solutions in this category. Submit your own or a tool you love!
                        </p>
                        <Link to="/submit" className="btn-outline">Submit to this Category</Link>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CategoryDetail;
