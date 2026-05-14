'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useBannerState } from '../hooks/useBannerState';

// Import Modular Home Components
import SmartBanner from '../components/SmartBanner';
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
    
    // Rule #1: Logic Isolation via custom hook
    const banner = useBannerState(initialBannerTools, false);

    const handleExternalClick = useCallback((id) => {
        // Analytics tracking would go here
        console.log('External click tracked:', id);
    }, []);

    return (
        <div className={styles.homeContainer}>
            <SmartBanner 
                tools={initialBannerTools}
                currentIndex={banner.currentIndex}
                next={banner.next}
                prev={banner.prev}
                isLoading={false}
                onExternalClick={handleExternalClick}
            />
            
            <HomeHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                statsCount={initialStats} 
                isLoading={false}
                content={HOME_UI_CONSTANTS.hero}
                popularCategories={initialCategories}
            />

            <HomeStatsBar 
                statsCount={initialStats} 
                categoriesCount={initialCategories?.length || 0} 
                isLoading={false}
            />

            <HomeHowItWorks content={HOME_UI_CONSTANTS.howItWorks} />

            <HomeCategories 
                categories={initialCategories} 
                isLoading={false} 
            />

            <HomeTrending 
                trendingTools={initialTrending} 
                isLoading={false} 
            />

            <HomeComparisons
                comparisons={initialComparisons}
                isLoading={false}
            />

            <HomeLatestArrivals 
                latestTools={initialLatest} 
                isLoading={false} 
            />

            <HomeFeatured 
                tools={initialFeatured} 
                isLoading={false} 
            />

            <HomeValueProp content={HOME_UI_CONSTANTS.valueProp} />

            <HomePublisherCTA content={HOME_UI_CONSTANTS.publisherCTA} />

            <HomeBlogSection 
                latestPosts={initialPosts} 
                isLoading={false}
            />

            <VideoGuide />
        </div>
    );
}
