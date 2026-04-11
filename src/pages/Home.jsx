import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useHomeData } from '../hooks/useHomeData';

// Import Global Components
import SmartBanner from '../components/SmartBanner';
import VideoGuide from '../components/VideoGuide';

// Import Modular Home Components
import HomeHero from '../components/Home/HomeHero';
import HomeStatsBar from '../components/Home/HomeStatsBar';
import HomeHowItWorks from '../components/Home/HomeHowItWorks';
import HomeCategories from '../components/Home/HomeCategories';
import HomeTrending from '../components/Home/HomeTrending';
import HomeLatestArrivals from '../components/Home/HomeLatestArrivals';
import HomeFeatured from '../components/Home/HomeFeatured';
import HomeValueProp from '../components/Home/HomeValueProp';
import HomePublisherCTA from '../components/Home/HomePublisherCTA';
import HomeBlogSection from '../components/Home/HomeBlogSection';

// Modular Home Components are imported with their own styles

const Home = () => {
    const {
        categories,
        featuredTools,
        latestTools,
        trendingTools,
        latestPosts,
        statsCount,
        loading,
        error
    } = useHomeData();
    
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useSEO({
        title: "The Ultimate AI & SaaS Tools Directory",
        description: "Discover and compare the world's most innovative AI and SaaS tools. Curated for founders, developers, and creators.",
        url: typeof window !== 'undefined' ? window.location.href : 'https://hubly.com'
    });

    return (
        <div className="home-container">
            <SmartBanner />
            
            <HomeHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                navigate={navigate} 
                statsCount={statsCount} 
            />

            <HomeStatsBar 
                statsCount={statsCount} 
                categoriesCount={categories?.length || 0} 
                loading={loading}
            />

            <HomeHowItWorks />

            <HomeCategories 
                categories={categories} 
                loading={loading} 
            />

            <HomeTrending 
                trendingTools={trendingTools} 
                loading={loading} 
            />

            <HomeLatestArrivals 
                latestTools={latestTools} 
                loading={loading} 
            />

            <HomeFeatured 
                featuredTools={featuredTools} 
                loading={loading} 
                error={error} 
            />

            <HomeValueProp />

            <HomePublisherCTA />

            <HomeBlogSection 
                latestPosts={latestPosts} 
                loading={loading}
            />

            <VideoGuide />
        </div>
    );
};

export default Home;
