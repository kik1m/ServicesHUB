import React from 'react';
import useSEO from '../hooks/useSEO';
import { useSearchData } from '../hooks/useSearchData';

// Import Modular Components
import SearchHeader from '../components/Search/SearchHeader';
import SearchSidebar from '../components/Search/SearchSidebar';
import SearchResults from '../components/Search/SearchResults';

// Import Modular CSS
import styles from './Search.module.css';

const Search = () => {
    const {
        isLoading,
        loadingMore,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPrice,
        setSelectedPrice,
        sortBy,
        setSortBy,
        setPage,
        hasMore,
        results,
        categories,
        pricingModels
    } = useSearchData();

    useSEO({
        title: searchQuery ? `Search: ${searchQuery}` : 'Explore Tools',
        description: 'Discover the best AI and SaaS tools in our comprehensive universe. Filter by category, price, and rating.',
        url: typeof window !== 'undefined' ? window.location.href : 'https://hubly.com/search'
    });

    return (
        <div className={`page-wrapper ${styles.searchPage}`}>
            <div className={styles.searchContainer}>
                
                <SearchHeader 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                />

                <div className={styles.searchGridLayout}>
                    <SearchSidebar 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        pricingModels={pricingModels}
                        selectedPrice={selectedPrice}
                        setSelectedPrice={setSelectedPrice}
                    />

                    <SearchResults 
                        results={results}
                        isLoading={isLoading}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        setPage={setPage}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                </div>
            </div>
        </div>
    );
};

export default Search;
