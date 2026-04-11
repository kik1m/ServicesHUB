import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { categoriesService } from '../services/categoriesService';

/**
 * Custom hook for managing Categories Directory page data and tool counts
 */
export const useCategoriesData = () => {
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
                    categoriesService.getAllCategories(),
                    supabase.from('tools').select('category_id').eq('is_approved', true)
                ]);

                if (mounted) {
                    if (catRes.error) throw catRes.error;
                    setCategories(catRes.data || []);

                    // Map tool counts by category_id
                    const toolCounts = (toolsRes.data || []).reduce((acc, tool) => {
                        acc[tool.category_id] = (acc[tool.category_id] || 0) + 1;
                        return acc;
                    }, {});
                    setCounts(toolCounts);
                }
            } catch (error) {
                console.error('Error fetching categories in useCategoriesData:', error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchCategories();
        return () => { mounted = false; };
    }, []);

    // Local filtering logic
    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
        categories: filteredCategories, // Return filtered ones for the grid
        allCategories: categories,      // Original list if needed
        counts,
        searchQuery,
        setSearchQuery,
        loading
    };
};
