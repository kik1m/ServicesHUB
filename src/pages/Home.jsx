import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useHomeData } from '../hooks/useHomeData';
import { useBannerData } from '../hooks/useBannerData';

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
import styles from './Home.module.css';
import { HOME_UI_CONSTANTS } from '../constants/homeConstants';

const Home = () => {
    const {
        categories,
        featured,
        latest,
        trending,
        posts,
        stats,
        trackClick
    } = useHomeData();
    
    // Banner logic lifted to page level (Rule #12)
    const banner = useBannerData();
    
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // 1. Elite Context-Aware SEO Hardening (v4.0)
    useSEO({
        pageKey: 'home',
        entityId: 'home',
        entityType: 'page',
        title: (stats.data?.tools && typeof stats.data.tools === 'number')
            ? `${stats.data.tools}+ AI Tools, SaaS & Automation Discovery Hub | HUBly` 
            : 'Ultimate AI & SaaS Discovery Hub | Discover, Compare & Scale',
        description: 'Discover trending AI tools, premium SaaS platforms, and professional automation software. Explore expert picks, latest arrivals, and top-rated solutions on HUBly.',
        ogType: 'website',
        schema: [
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "HUBly",
                "url": "https://www.hubly-tools.com",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.hubly-tools.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "HUBly Platform",
                "url": "https://www.hubly-tools.com",
                "logo": "https://www.hubly-tools.com/android-chrome-512x512.png",
                "sameAs": [
                    "https://twitter.com/hubly",
                    "https://linkedin.com/company/hubly"
                ]
            },
            {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Trending AI Tools",
                "description": "The most popular AI and SaaS tools right now.",
                "itemListElement": (trending.data || []).slice(0, 10).map((tool, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `https://www.hubly-tools.com/tool/${tool.slug}`
                }))
            }
        ]
    });

    return (
        <div className={styles.homeContainer}>
            <SmartBanner 
                tools={banner.tools}
                currentIndex={banner.currentIndex}
                isLoading={banner.loading}
                error={banner.error}
                onExternalClick={trackClick}
                next={banner.next}
                prev={banner.prev}
            />
            
            <HomeHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                navigate={navigate} 
                statsCount={stats.data} 
                isLoading={stats.loading || categories.loading}
                error={stats.error}
                content={HOME_UI_CONSTANTS.hero}
                popularCategories={categories.data}
            />

            <HomeStatsBar 
                statsCount={stats.data} 
                categoriesCount={categories.data?.length || 0} 
                isLoading={stats.loading || categories.loading}
                error={stats.error || categories.error}
            />

            <HomeHowItWorks content={HOME_UI_CONSTANTS.howItWorks} />

            <HomeCategories 
                categories={categories.data} 
                isLoading={categories.loading} 
                error={categories.error}
            />

            <HomeTrending 
                trendingTools={trending.data} 
                isLoading={trending.loading} 
                error={trending.error}
            />

            <HomeLatestArrivals 
                latestTools={latest.data} 
                isLoading={latest.loading} 
                error={latest.error}
            />

            <HomeFeatured 
                tools={featured.data} 
                isLoading={featured.loading} 
                error={featured.error} 
            />

            <HomeValueProp content={HOME_UI_CONSTANTS.valueProp} />

            <HomePublisherCTA content={HOME_UI_CONSTANTS.publisherCTA} />

            <HomeBlogSection 
                latestPosts={posts.data} 
                isLoading={posts.loading}
                error={posts.error}
            />

            <VideoGuide />
        </div>
    );
};

export default Home;



