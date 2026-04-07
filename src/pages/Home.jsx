import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import useSEO from '../hooks/useSEO';

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

// Import Modular CSS
import '../styles/Pages/Home.css';
import '../styles/Pages/Tools.css';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [featuredTools, setFeaturedTools] = useState([]);
    const [latestTools, setLatestTools] = useState([]);
    const [trendingTools, setTrendingTools] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [statsCount, setStatsCount] = useState({ tools: 0, users: 0, views: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useSEO({
        title: "The Ultimate AI & SaaS Tools Directory",
        description: "Discover and compare the world's most innovative AI and SaaS tools. Curated for founders, developers, and creators.",
        url: typeof window !== 'undefined' ? window.location.href : 'https://hubly.com'
    });

    useEffect(() => {
        let mounted = true;

        const fetchHomeData = async () => {
            setLoading(true);
            setError(null);

            const safeFetch = async (queryFn, label) => {
                try {
                    const { data, count, error } = await queryFn();
                    if (error) throw error;
                    return { data, count };
                } catch (err) {
                    console.warn(`Home: ${label} fetch partially failed:`, err.message);
                    return { data: [], count: 0 };
                }
            };

            try {
                // 1. Categories
                const catRes = await safeFetch(() => supabase.from('categories').select('id, name, icon_name, slug').limit(12), 'Categories');
                if (mounted) setCategories(catRes.data);

                // 2. Featured Tools
                const toolRes = await safeFetch(() => supabase.from('tools').select('id, name, slug, short_description, image_url, icon_name, is_verified, is_featured, pricing_type, rating, categories(name)').eq('is_approved', true).eq('is_featured', true).limit(6), 'Featured');
                if (mounted) setFeaturedTools(toolRes.data);

                // 3. Latest Tools
                const latestRes = await safeFetch(() => supabase.from('tools').select('id, name, slug, short_description, image_url, icon_name, is_verified, is_featured, pricing_type, rating, categories(name)').eq('is_approved', true).order('created_at', { ascending: false }).limit(4), 'Latest');
                if (mounted) setLatestTools(latestRes.data);

                // 4. Trending Tools
                const trendingRes = await safeFetch(() => supabase.from('tools').select('id, name, slug, short_description, image_url, icon_name, view_count, is_verified, is_featured, pricing_type, rating, categories(name)').eq('is_approved', true).order('view_count', { ascending: false }).limit(4), 'Trending');
                if (mounted) setTrendingTools(trendingRes.data || []);

                // 5. Blog Posts
                const blogRes = await safeFetch(() => supabase.from('blog_posts').select('id, title, excerpt, image_url, category, author_name, created_at').order('created_at', { ascending: false }).limit(3), 'Blog');
                if (mounted) setLatestPosts(blogRes.data);

                // 6. Real Stats
                const toolsCountRes = await safeFetch(() => supabase.from('tools').select('id', { count: 'exact', head: true }).eq('is_approved', true), 'ToolsCount');
                const usersCountRes = await safeFetch(() => supabase.from('profiles').select('id', { count: 'exact', head: true }), 'UsersCount');

                const { data: viewsData } = await supabase.from('tools').select('view_count').eq('is_approved', true);
                const totalViews = viewsData?.reduce((sum, t) => sum + (t.view_count || 0), 0) || 0;

                if (mounted) {
                    setStatsCount({
                        tools: toolsCountRes.count || 0,
                        users: usersCountRes.count || 0,
                        views: totalViews
                    });
                }
            } catch (err) {
                console.error('Home Critical Fetch Error:', err);
                if (mounted) setError("Could not load some content. Please check your connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
        return () => { mounted = false; };
    }, []);

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
                categoriesCount={categories.length} 
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

            <HomeBlogSection latestPosts={latestPosts} />

            <VideoGuide />
        </div>
    );
};

export default Home;
