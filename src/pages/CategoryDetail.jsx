import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import useSEO from '../hooks/useSEO';

// Import Global Components
import SmartBanner from '../components/SmartBanner';

// Import Modular Components
import CategoryDetailHeader from '../components/CategoryDetail/CategoryDetailHeader';
import CategoryDetailTools from '../components/CategoryDetail/CategoryDetailTools';
import CategoryDetailEmpty from '../components/CategoryDetail/CategoryDetailEmpty';

// Import Modular CSS
import '../styles/Pages/Categories.css';

const CategoryDetail = () => {
    const { id: slug } = useParams();
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
        description: `Explore the best curated ${category?.name || 'various'} tools on HUBly. Discover top-rated software for your needs.`,
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        setPage(0);
        setTools([]);
        setHasMore(true);
    }, [slug]);

    useEffect(() => {
        let mounted = true;

        const fetchCategoryData = async () => {
            if (page === 0) setLoading(true);
            else setLoadingMore(true);

            try {
                // Fetch Category (only once per slug)
                let currentCat = category;
                if (!currentCat || currentCat.slug !== slug) {
                    const { data: catData, error: catError } = await supabase
                        .from('categories')
                        .select('*')
                        .eq('slug', slug)
                        .single();
                    if (catError) throw catError;
                    if (mounted) {
                        setCategory(catData);
                        currentCat = catData;
                    }
                }

                // Fetch Tools
                if (currentCat && mounted) {
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

                    if (toolData && mounted) {
                        if (page === 0) setTools(toolData);
                        else setTools(prev => [...prev, ...toolData]);

                        if (toolData.length < ITEMS_PER_PAGE) setHasMore(false);
                        if (count !== null) setTotalResults(count);
                    }
                }
            } catch (error) {
                console.error('Error fetching category detail:', error);
            } finally {
                if (mounted) {
                    setLoading(false);
                    setLoadingMore(false);
                }
            }
        };

        fetchCategoryData();
        return () => { mounted = false; };
    }, [slug, page, category]);

    const filteredTools = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.short_description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && page === 0) {
        return (
            <div className="page-wrapper category-detail-page">
                <header className="page-header hero-section-slim" style={{ minHeight: '35vh' }}>
                    <div className="hero-content">
                        {/* Skeleton handled in parent for smooth transition */}
                        <div style={{ height: '400px' }}></div>
                    </div>
                </header>
            </div>
        );
    }

    if (!category && !loading) {
        return (
            <div className="page-wrapper" style={{ textAlign: 'center', padding: '150px 5%' }}>
                <h2 className="hero-title">Category <span className="gradient-text">Not Found</span></h2>
            </div>
        );
    }

    return (
        <div className="page-wrapper category-detail-page">
            <SmartBanner />
            
            {category && (
                <CategoryDetailHeader 
                    category={category} 
                    totalResults={totalResults} 
                />
            )}

            <main className="category-content">
                {tools.length > 0 || loading ? (
                    <CategoryDetailTools 
                        tools={tools}
                        filteredTools={filteredTools}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        loading={loading}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        setPage={setPage}
                        totalResults={totalResults}
                        categoryName={category?.name || 'Category'}
                    />
                ) : (
                    <CategoryDetailEmpty categoryName={category?.name || 'Category'} />
                )}
            </main>
        </div>
    );
};

export default CategoryDetail;
