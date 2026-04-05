import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';
import SkeletonLoader from '../components/SkeletonLoader';
import SmartBanner from '../components/SmartBanner';
import { Search, Zap, ChevronRight } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [counts, setCounts] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                // Parallel fetching: Categories and Tool Counts
                const [catRes, toolsRes] = await Promise.all([
                    supabase.from('categories').select('*'),
                    supabase.from('tools').select('category_id').eq('is_approved', true)
                ]);

                if (catRes.error) throw catRes.error;
                setCategories(catRes.data || []);

                // Map tool counts
                const toolCounts = (toolsRes.data || []).reduce((acc, tool) => {
                    acc[tool.category_id] = (acc[tool.category_id] || 0) + 1;
                    return acc;
                }, {});
                setCounts(toolCounts);

            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="page-wrapper">
            <SmartBanner />
                <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '40px' }}>
                    <div className="hero-content">
                        <SkeletonLoader type="text" width="100px" style={{ margin: '0 auto 1.5rem' }} />
                        <SkeletonLoader type="title" width="60%" style={{ margin: '0 auto 1.5rem' }} />
                        <SkeletonLoader type="text" width="40%" style={{ margin: '0 auto' }} />
                    </div>
                </header>
                <section className="main-section">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                        {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="glass-card" style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                                <SkeletonLoader type="avatar" width="80px" height="80px" borderRadius="24px" />
                                <SkeletonLoader type="text" width="70%" />
                                <SkeletonLoader type="text" width="40%" height="12px" />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <SmartBanner />
             <header className="page-header hero-section-slim">
                <div className="hero-content">
                    <div className="badge">CATEGORIES</div>
                    <h1 className="hero-title-slim">Browse by <span className="gradient-text">Niche</span></h1>
                    <p className="hero-subtitle-slim">Find the specialized tools you need for any project or industry.</p>
                </div>
            </header>

            <section className="main-section" style={{ paddingTop: '2rem' }}>
                <div className="hero-search-wrapper-large glass-card" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                    <Search size={20} color="var(--primary)" />
                    <input 
                        type="text" 
                        placeholder="Search categories (e.g. Content, Dev...)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="categories-grid-large" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2.5rem'
                }}>
                    {filteredCategories.map((cat, i) => (
                        <Link to={`/category/${cat.slug}`} key={i} className="glass-card category-card-premium compact-glass-card" style={{ 
                            textAlign: 'center', 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textDecoration: 'none',
                            transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div className="cat-count-badge" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.65rem', fontWeight: '800', background: 'rgba(0, 136, 204, 0.1)', padding: '3px 10px', borderRadius: '100px', border: '1px solid var(--border)' }}>
                                {counts[cat.id] || 0} Tools
                            </div>
                            <div className="cat-icon-glow" style={{ 
                                background: `rgba(0, 136, 204, 0.1)`, 
                                padding: '1rem', 
                                borderRadius: '16px',
                                color: 'var(--primary)',
                                marginBottom: '1rem',
                                border: `1px solid var(--primary)22`,
                                transition: '0.3s'
                            }}>
                                {getIcon(cat.icon_name || 'LayoutGrid', 32)}
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.3rem', color: 'white' }}>{cat.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Browse AI Tools <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></p>
                        </Link>
                    ))}
                </div>

                <div className="glass-card submit-cta-card" style={{ 
                    marginTop: '6rem', padding: '3.5rem', textAlign: 'center', 
                    background: 'rgba(255, 255, 255, 0.01)', border: '1px dashed var(--border)', borderRadius: '30px'
                }}>
                    <Zap size={32} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Suggest a Category</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Didnt find the right niche? We are always expanding. Let us know what you are looking for!
                    </p>
                    <Link to="/contact" className="btn-outline">Tell us what's missing</Link>
                </div>
            </section>
        </div>
    );
};

export default Categories;
