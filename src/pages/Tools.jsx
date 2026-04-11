import useSEO from '../hooks/useSEO';
import { useToolsData } from '../hooks/useToolsData';

// Import Modular Components
import SmartBanner from '../components/SmartBanner';
import ToolsHeader from '../components/Tools/ToolsHeader';
import ToolsFilterBar from '../components/Tools/ToolsFilterBar';
import ToolsGrid from '../components/Tools/ToolsGrid';
import ToolsSubmitCTA from '../components/Tools/ToolsSubmitCTA';

// Import Modular CSS
import styles from './Tools.module.css';

const Tools = () => {
    const {
        tools,
        categories,
        selectedCategory,
        setSelectedCategory,
        priceFilter,
        setPriceFilter,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
        loading,
        loadingMore,
        error,
        setPage,
        hasMore,
        totalResults
    } = useToolsData();

    useSEO({
        title: "Discover 500+ AI Tools | HUBly Directory",
        description: "Browse our comprehensive directory of AI and SaaS tools. Filter by price, category, and find the perfect solution.",
        url: typeof window !== 'undefined' ? window.location.href : 'https://hubly.com/tools'
    });

    return (
        <div className={`page-wrapper ${styles.toolsDirectoryPage}`}>
            <SmartBanner />
            
            <ToolsHeader 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                totalResults={totalResults} 
                loading={loading} 
            />

            <main className="main-section">
                <ToolsFilterBar 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    priceFilter={priceFilter}
                    setPriceFilter={setPriceFilter}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                <ToolsGrid 
                    tools={tools} 
                    loading={loading} 
                    loadingMore={loadingMore} 
                    error={error} 
                    hasMore={hasMore} 
                    setPage={setPage} 
                />

                <ToolsSubmitCTA />
            </main>
        </div>
    );
};

export default Tools;
