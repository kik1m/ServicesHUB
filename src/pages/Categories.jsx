import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Import Global Components
import SmartBanner from '../components/SmartBanner';

// Import Modular Components
import CategoriesHeader from '../components/Categories/CategoriesHeader';
import CategoriesGrid from '../components/Categories/CategoriesGrid';
import CategoriesSuggestCTA from '../components/Categories/CategoriesSuggestCTA';

// Import Modular CSS
import '../styles/Pages/Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [counts, setCounts] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchCategories = async () => {
            setLoading(true);
            try {
                // Parallel fetching: Categories and Tool Counts
                const [catRes, toolsRes] = await Promise.all([
                    supabase.from('categories').select('*'),
                    supabase.from('tools').select('category_id').eq('is_approved', true)
                ]);

                if (mounted) {
                    if (catRes.error) throw catRes.error;
                    setCategories(catRes.data || []);

                    // Map tool counts
                    const toolCounts = (toolsRes.data || []).reduce((acc, tool) => {
                        acc[tool.category_id] = (acc[tool.category_id] || 0) + 1;
                        return acc;
                    }, {});
                    setCounts(toolCounts);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchCategories();
        return () => { mounted = false; };
    }, []);

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="page-wrapper categories-page">
            <SmartBanner />
            
            <CategoriesHeader 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            <section className="main-section content-layout">
                <CategoriesGrid 
                    categories={filteredCategories} 
                    counts={counts} 
                    loading={loading} 
                />

                <CategoriesSuggestCTA />
            </section>
        </div>
    );
};

export default Categories;
