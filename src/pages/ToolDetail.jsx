import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { sendNotification } from '../utils/notifications';
import useSEO from '../hooks/useSEO';
import ReviewsSection from '../components/ReviewsSection';
import ReportToolModal from '../components/ReportToolModal';

// Import Modular Components
import ToolDetailSkeleton from '../components/ToolDetail/ToolDetailSkeleton';
import ToolDetailHeader from '../components/ToolDetail/ToolDetailHeader';
import ToolDetailInfo from '../components/ToolDetail/ToolDetailInfo';
import ToolDetailSidebar from '../components/ToolDetail/ToolDetailSidebar';
import ToolDetailRelated from '../components/ToolDetail/ToolDetailRelated';

// Import Modular CSS
import '../styles/pages/ToolDetail.css';

const ToolDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [tool, setTool] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [relatedTools, setRelatedTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Tool
                const { data, error } = await supabase
                    .from('tools')
                    .select('id, name, slug, description, short_description, image_url, icon_name, url, pricing_type, pricing_details, rating, reviews_count, is_featured, is_verified, category_id, view_count, features, user_id, categories(name, slug)')
                    .eq('slug', id)
                    .single();
                
                if (error) throw error;
                setTool(data);

                // Parallel Fetching
                const promises = [
                    supabase.from('tools')
                        .select('id, name, slug, short_description, image_url, rating, reviews_count, is_verified, categories(name)')
                        .eq('category_id', data.category_id)
                        .neq('id', data.id)
                        .limit(3),
                    supabase.from('tools')
                        .update({ view_count: (data.view_count || 0) + 1 })
                        .eq('id', data.id),
                    supabase.from('profiles')
                        .select('id, full_name, avatar_url')
                        .eq('id', data.user_id)
                        .single()
                ];

                if (user) {
                    promises.push(
                        supabase.from('favorites')
                            .select('user_id, tool_id')
                            .eq('user_id', user.id)
                            .eq('tool_id', data.id)
                            .maybeSingle()
                    );
                }

                const results = await Promise.all(promises);
                
                setRelatedTools(results[0].data || []);
                if (results[2]?.data) setPublisher(results[2].data);
                if (user && results[3]?.data) setIsFavorited(true);

            } catch (error) {
                console.error('Error fetching tool detail:', error);
                showToast('Error loading tool: ' + error.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user, showToast]);

    const toggleFavorite = async () => {
        if (!user) { navigate('/auth'); return; }

        try {
            if (isFavorited) {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('tool_id', tool.id);
                if (error) throw error;
                setIsFavorited(false);
                showToast('Removed from favorites', 'info');
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .insert([{ user_id: user.id, tool_id: tool.id }]);
                if (error) throw error;
                setIsFavorited(true);
                
                await sendNotification(
                    user.id, 
                    'Added to Favorites', 
                    `You added ${tool.name} to your favorites list.`,
                    'info'
                );
                showToast('Success. Added to your favorites.', 'success');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showToast('Failed to save favorite.', 'error');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: tool?.name,
                    text: tool?.short_description,
                    url: window.location.href,
                });
            } catch (err) { console.error('Share failed:', err); }
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        }
    };

    useSEO({
        title: tool?.name ? `${tool.name} - Tool Details` : 'Tool Details',
        description: tool?.description,
        image: tool?.image_url,
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    if (loading) return <ToolDetailSkeleton />;

    if (!tool) {
        return (
            <div className="page-wrapper" style={{ textAlign: 'center', padding: '150px 5%' }}>
                <h2 className="hero-title">Tool <span className="gradient-text">Not Found</span></h2>
                <Link to="/tools" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Directory</Link>
            </div>
        );
    }

    return (
        <div className="page-wrapper tool-detail-page">
            <ToolDetailHeader 
                tool={tool} 
                navigate={navigate} 
                isFavorited={isFavorited} 
                toggleFavorite={toggleFavorite} 
            />

            <section className="main-section tool-detail-main">
                <div className="tool-grid-layout">
                    <ToolDetailInfo tool={tool} />

                    <ToolDetailSidebar 
                        tool={tool} 
                        publisher={publisher} 
                        isFavorited={isFavorited} 
                        toggleFavorite={toggleFavorite} 
                        handleShare={handleShare} 
                        setIsReportModalOpen={setIsReportModalOpen} 
                    />
                </div>

                <ToolDetailRelated relatedTools={relatedTools} />
                
                {tool && tool.id && <ReviewsSection toolId={tool.id} />}
            </section>
            
            {isReportModalOpen && (
                <ReportToolModal 
                    toolId={tool.id} 
                    toolName={tool.name} 
                    onClose={() => setIsReportModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default ToolDetail;
