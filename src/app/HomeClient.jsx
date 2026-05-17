'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useHomeData } from '../hooks/useHomeData';

// Import Modular Home Components
import VideoGuide from '../components/VideoGuide';
import HomeHero from '../components/Home/HomeHero';
import HomeStatsBar from '../components/Home/HomeStatsBar';
import HomeHowItWorks from '../components/Home/HomeHowItWorks';
import HomeCategories from '../components/Home/HomeCategories';
import HomeTrending from '../components/Home/HomeTrending';
import HomeLatestArrivals from '../components/Home/HomeLatestArrivals';
import HomeComparisons from '../components/Home/HomeComparisons';
import HomeFeatured from '../components/Home/HomeFeatured';
import HomeValueProp from '../components/Home/HomeValueProp';
import HomePublisherCTA from '../components/Home/HomePublisherCTA';
import HomeBlogSection from '../components/Home/HomeBlogSection';
import { HOME_UI_CONSTANTS } from '../constants/homeConstants';
import styles from './page.module.css';

/**
 * HomeClient - Client-side logic for the Home page
 * Receives pre-fetched data from the Server Component
 */
export default function HomeClient({ 
    initialCategories, 
    initialFeatured, 
    initialLatest, 
    initialTrending, 
    initialPosts, 
    initialStats, 
    initialComparisons,
    initialBannerTools 
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    
    // 🚀 Elite: Use React Query to manage Home Data
    // This allows prefetching from the Navbar to make this page instant!
    const { 
        categories, 
        featuredTools, 
        latestTools, 
        trendingTools, 
        blogPosts, 
        stats, 
        comparisons,
        loading 
    } = useHomeData({
        initialCategories,
        initialFeatured,
        initialLatest,
        initialTrending,
        initialPosts,
        initialStats,
        initialComparisons
    });

    return (
        <div className={styles.homeContainer}>
            <HomeHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                statsCount={stats} 
                isLoading={loading}
                content={HOME_UI_CONSTANTS.hero}
                popularCategories={categories}
            />

            <HomeStatsBar 
                statsCount={stats} 
                categoriesCount={categories?.length || 0} 
                isLoading={loading}
            />

            <HomeHowItWorks content={HOME_UI_CONSTANTS.howItWorks} />

            <HomeCategories 
                categories={categories} 
                isLoading={loading} 
            />

            <HomeTrending 
                trendingTools={trendingTools} 
                isLoading={loading} 
            />

            <HomeComparisons
                comparisons={comparisons}
                isLoading={loading}
            />

            <HomeLatestArrivals 
                latestTools={latestTools} 
                isLoading={loading} 
            />

            <HomeFeatured 
                tools={featuredTools} 
                isLoading={loading} 
            />

            <HomeValueProp content={HOME_UI_CONSTANTS.valueProp} />

            <HomePublisherCTA content={HOME_UI_CONSTANTS.publisherCTA} />

            <HomeBlogSection 
                latestPosts={blogPosts} 
                isLoading={loading}
            />

            <VideoGuide />
        </div>
    );
}
