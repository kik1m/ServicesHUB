import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';
import SkeletonLoader from '../components/SkeletonLoader';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Browse AI Tool Categories | ServicesHUB";
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('categories')
                    .select('*');
                if (error) throw error;
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

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
             <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '40px' }}>
                <div className="hero-content">
                    <div className="badge">CATEGORIES</div>
                    <h1 className="hero-title">Browse by <span className="gradient-text">Niche</span></h1>
                    <p className="hero-subtitle">Find the specialized tools you need for any project or industry.</p>
                </div>
            </header>

            <section className="main-section">
                <div className="categories-grid-large" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '2rem'
                }}>
                    {categories.map((cat, i) => (
                        <Link to={`/category/${cat.slug}`} key={i} className="glass-card category-card-premium" style={{ 
                            textAlign: 'center', 
                            padding: '3rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textDecoration: 'none',
                            transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}>
                            <div className="cat-icon-glow" style={{ 
                                background: `rgba(0, 136, 204, 0.1)`, 
                                padding: '1.5rem', 
                                borderRadius: '24px',
                                color: 'var(--primary)',
                                marginBottom: '2rem',
                                border: `1px solid var(--primary)22`,
                                boxShadow: `0 0 30px var(--primary)11`
                            }}>
                                {getIcon(cat.icon_name || 'LayoutGrid', 36)}
                            </div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', color: 'white' }}>{cat.name}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse All Tools</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Categories;
