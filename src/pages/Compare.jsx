import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { RefreshCcw } from 'lucide-react';
import SmartBanner from '../components/SmartBanner';
import useSEO from '../hooks/useSEO';

// Import Modular Components
import CompareHero from '../components/Compare/CompareHero';
import ToolCompareColumn from '../components/Compare/ToolCompareColumn';
import ComparisonMatrix from '../components/Compare/ComparisonMatrix';
import ToolSelectionModal from '../components/Compare/ToolSelectionModal';

// Import Modular CSS
import '../styles/Pages/Compare.css';

const Compare = () => {
    const [tool1, setTool1] = useState(null);
    const [tool2, setTool2] = useState(null);
    const [isSelectingFor, setIsSelectingFor] = useState(null); // 'tool1' or 'tool2'
    const [searchQuery, setSearchQuery] = useState('');
    const [availableTools, setAvailableTools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useSEO({
        title: "Compare AI Tools | Side-by-Side Comparison",
        description: "Compare the best AI tools and services side-by-side to find the perfect fit for your workflow.",
        keywords: "compare ai tools, ai comparison, software comparison, services comparison"
    });

    useEffect(() => {
        if (!isSelectingFor) return;

        const fetchTools = async () => {
            setLoading(true);
            setError(null);
            try {
                let query = supabase.from('tools').select('id, name, slug, short_description, description, image_url, pricing_type, rating, reviews_count, is_verified, features, url, categories(name)').eq('is_approved', true);
                if (searchQuery) {
                    query = query.ilike('name', `%${searchQuery}%`);
                }
                const { data, error: fetchError } = await query.limit(10);
                if (fetchError) throw fetchError;
                setAvailableTools(data || []);
            } catch (err) {
                console.error('Fetch comparison tools error:', err);
                setError('Failed to load tools. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchTools, 300);
        return () => clearTimeout(timer);
    }, [isSelectingFor, searchQuery]);

    const handleSelect = (tool) => {
        if (isSelectingFor === 'tool1') setTool1(tool);
        if (isSelectingFor === 'tool2') setTool2(tool);
        setIsSelectingFor(null);
        setSearchQuery('');
    };

    const resetComparison = () => {
        setTool1(null);
        setTool2(null);
    };

    return (
        <div className="page-wrapper compare-page">
            <SmartBanner />
            
            <CompareHero />

            <section className="main-section compare-main" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '5rem' }}>
                <div className="comparison-container">
                    <ToolCompareColumn 
                        tool={tool1} 
                        slot={1} 
                        onClear={() => setTool1(null)} 
                        onSelect={() => setIsSelectingFor('tool1')}
                    />
                    
                    <div className="vs-divider">VS</div>

                    <ToolCompareColumn 
                        tool={tool2} 
                        slot={2} 
                        onClear={() => setTool2(null)} 
                        onSelect={() => setIsSelectingFor('tool2')}
                    />
                </div>

                <ComparisonMatrix tool1={tool1} tool2={tool2} />

                {tool1 && tool2 && (
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <button onClick={resetComparison} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            <RefreshCcw size={18} /> Reset Comparison
                        </button>
                    </div>
                )}
            </section>

            {/* Selection Modal Overlay */}
            {isSelectingFor && (
                <ToolSelectionModal 
                    onClose={() => setIsSelectingFor(null)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    loading={loading}
                    error={error}
                    availableTools={availableTools}
                    onSelect={handleSelect}
                />
            )}
        </div>
    );
};

export default Compare;
