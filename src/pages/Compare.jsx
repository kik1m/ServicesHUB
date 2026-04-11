import React from 'react';
import { RefreshCcw } from 'lucide-react';
import SmartBanner from '../components/SmartBanner';
import useSEO from '../hooks/useSEO';
import { useCompareData } from '../hooks/useCompareData';

// Import Modular Components
import CompareHero from '../components/Compare/CompareHero';
import ToolCompareColumn from '../components/Compare/ToolCompareColumn';
import ComparisonMatrix from '../components/Compare/ComparisonMatrix';
import ToolSelectionModal from '../components/Compare/ToolSelectionModal';

// Import Modular CSS
import styles from './Compare.module.css';

const Compare = () => {
    const {
        tool1,
        tool2,
        isSelectingFor,
        searchQuery,
        setSearchQuery,
        availableTools,
        loading,
        error,
        handleSelect,
        clearTool,
        resetComparison,
        openSelector,
        closeSelector,
        setIsSelectingFor // needed for modal logic
    } = useCompareData();

    useSEO({
        title: "Compare AI Tools | Side-by-Side Comparison",
        description: "Compare the best AI tools and services side-by-side to find the perfect fit for your workflow.",
        keywords: "compare ai tools, ai comparison, software comparison, services comparison"
    });

    return (
        <div className={`page-wrapper ${styles.compareView}`}>
            <SmartBanner />
            
            <CompareHero />

            <section className={styles.compareContainer}>
                <div className={styles.comparisonContainer}>
                    <ToolCompareColumn 
                        tool={tool1} 
                        slot={1} 
                        onClear={() => clearTool('tool1')}
                        onSelect={() => openSelector('tool1')}
                    />
                    
                    <div className={styles.vsDivider}>VS</div>

                    <ToolCompareColumn 
                        tool={tool2} 
                        slot={2} 
                        onClear={() => clearTool('tool2')}
                        onSelect={() => openSelector('tool2')}
                    />
                </div>

                <ComparisonMatrix tool1={tool1} tool2={tool2} />

                {tool1 && tool2 && (
                    <div className={styles.resetContainer}>
                        <button 
                            onClick={resetComparison} 
                            className={`${styles.resetBtn} btn-secondary`}
                        >
                            <RefreshCcw size={18} /> Reset Comparison
                        </button>
                    </div>
                )}
            </section>

            {/* Selection Modal Overlay */}
            {isSelectingFor && (
                <ToolSelectionModal 
                    onClose={closeSelector}
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
