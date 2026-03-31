import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
    Search, Filter, SlidersHorizontal, ArrowUpRight,
    Star, MessageSquare, Zap, LayoutGrid, Cpu,
    Code, Palette, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    const [loading, setLoading] = useState(true);

    useSEO({
        title: "Discover 500+ AI Tools | ServicesHUB Directory",
        description: "Browse our comprehensive directory of AI and SaaS tools. Filter by price, category, and find the perfect solution.",
        url: typeof window !== 'undefined' ? window.location.href : 'https://serviceshub.com/tools'
    });

    // Icons Mapping
    const iconMap = {
        Zap: Zap,
        LayoutGrid: LayoutGrid,
        Cpu: Cpu,
        Code: Code,
        Palette: Palette,
        Globe: Globe
    };

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

    // Fetch Tools when filters or categories change
    useEffect(() => {
        const fetchTools = async () => {
            setLoading(true);
            const timeout = setTimeout(() => {
                if (loading) setLoading(false);
            }, 6000);

            try {
                let query = supabase
                    .from('tools')
                    .select('*, categories(name)')
                    .eq('is_approved', true);

                if (selectedCategory !== 'All') {
                    const catObj = categories.find(c => c.name === selectedCategory);
                    if (catObj) {
                        query = query.eq('category_id', catObj.id);
                    }
                }

                if (priceFilter !== 'All') {
                    query = query.eq('pricing_type', priceFilter);
                }

                if (sortBy === 'Newest') {
                    query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
                } else if (sortBy === 'Rating') {
                    query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
                } else if (sortBy === 'Popular') {
                    query = query.order('is_featured', { ascending: false }).order('view_count', { ascending: false });
                } else {
                    query = query.order('is_featured', { ascending: false });
                }

                const { data } = await query;
                setTools(data || []);
            } catch (error) {
                console.error('Error fetching tools:', error);
            } finally {
                clearTimeout(timeout);
                setLoading(false);
            }
        };

        // Only fetch tools if we have categories loaded or if we are viewing 'All'
        // This prevents multiple fetches on initial mount
        fetchTools();
    }, [selectedCategory, priceFilter, sortBy, categories.length]);

    const renderIcon = (tool) => {
        if (tool.image_url) {
            return <img src={tool.image_url} alt={tool.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
        }
        const IconComponent = iconMap[tool.icon_name] || Zap;
        return <IconComponent size={28} color="var(--primary)" />;
    };

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
                <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div className="category-tabs" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                        {['All', ...categories.map(c => c.name)].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                                style={{
                                    padding: '10px 22px', borderRadius: '100px', border: '1px solid var(--border)',
                                    background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                    color: 'white', cursor: 'pointer', transition: '0.3s', fontWeight: '700', fontSize: '0.9rem'
                                }}
                            >
                                {cat === 'All' ? 'All Tools' : cat}
                            </button>
                        ))}
                    </div>
                    <div className="sort-filters" style={{ display: 'flex', gap: '1rem' }}>
                        <CustomSelect
                            options={[
                                { label: 'All Pricing', name: 'All' },
                                { label: 'Free', name: 'Free' },
                                { label: 'Freemium', name: 'Freemium' },
                                { label: 'Paid', name: 'Paid' }
                            ]}
                            value={priceFilter}
                            onChange={(val) => setPriceFilter(val)}
                            placeholder="Price"
                        />
                        <CustomSelect
                            options={[
                                { label: 'Newest', name: 'Newest' },
                                { label: 'Top Rated', name: 'Rating' },
                                { label: 'Most Viewed', name: 'Popular' }
                            ]}
                            value={sortBy}
                            onChange={(val) => setSortBy(val)}
                            placeholder="Sort By"
                        />
                    </div>
                </div>

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
            </main>
        </div>
    );
};

export default Tools;
