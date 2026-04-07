import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

// Import Modular Components
import PromoteHero from '../components/Promote/PromoteHero';
import ToolSelector from '../components/Promote/ToolSelector';
import PromotionPlans from '../components/Promote/PromotionPlans';
import PromoteTrustFooter from '../components/Promote/PromoteTrustFooter';

// Import Modular CSS
import '../styles/Pages/Promote.css';

const Promote = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    // Promotion Plans Data
    const PLANS = [
        {
            id: 'featured',
            name: "Featured",
            price: "$49",
            amount: 49,
            period: "/mo",
            desc: "Dominant homepage presence for 30 days.",
            features: ["Homepage Hero slot (30 days)", "Priority Category Ranking", "Newsletter Spotlight", "Social Media Shoutout", "Verified Tool Badge"],
            recommended: true,
            theme: "#00d2ff",
            glow: "rgba(0, 210, 255, 0.3)",
            cta: "Get Featured"
        },
        {
            id: 'enterprise',
            name: "Market Authority",
            price: "$149",
            amount: 149,
            period: "/mo",
            desc: "Ultimate visibility & SEO power.",
            features: ["Permanent Featured Status", "Do-Follow Backlink (SEO)", "Dedicated Review Article", "Side-wide Banner Ads", "Priority Review Sync"],
            recommended: false,
            theme: "#bf5af2",
            glow: "rgba(191, 90, 242, 0.3)",
            cta: "Go Enterprise"
        }
    ];

    const toolId = searchParams.get('toolId');
    const [toolName, setToolName] = useState('');
    const [userTools, setUserTools] = useState([]);
    const [selectedToolId, setSelectedToolId] = useState(toolId || '');
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [loadingTools, setLoadingTools] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/auth');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const initializePromote = async () => {
            if (authLoading || !user) return;

            if (toolId) {
                const { data } = await supabase.from('tools').select('name').eq('id', toolId).single();
                if (data) {
                    setToolName(data.name);
                    setSelectedToolId(toolId);
                }
            } else {
                setLoadingTools(true);
                try {
                    const { data } = await supabase
                        .from('tools')
                        .select('id, name')
                        .eq('user_id', user.id)
                        .eq('is_approved', true);

                    setUserTools(data || []);
                } catch (err) {
                    console.error('Fetch user tools error:', err);
                } finally {
                    setLoadingTools(false);
                }
            }
        };

        initializePromote();
    }, [toolId, user, authLoading]);

    const handlePromote = async (plan) => {
        if (!selectedToolId) {
            showToast('Please select a tool to promote first.', 'warning');
            return;
        }

        setLoadingPlan(plan.name);
        try {
            const { data } = await axios.post(`/api/create-checkout-session`, {
                userId: user.id,
                toolId: selectedToolId,
                toolName: toolName || userTools.find(t => t.id === selectedToolId)?.name,
                planName: plan.name,
                priceAmount: plan.amount,
                itemType: 'tool_promotion'
            });

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('Promotion error:', err);
            showToast('Failed to initiate checkout.', 'error');
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="promote-view-container container" style={{ padding: '40px 5% 80px' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Promote Tool' }]} />

                <PromoteHero />

                <ToolSelector 
                    toolName={toolName}
                    loadingTools={loadingTools}
                    userTools={userTools}
                    selectedToolId={selectedToolId}
                    setSelectedToolId={setSelectedToolId}
                />

                <PromotionPlans 
                    plans={PLANS}
                    handlePromote={handlePromote}
                    loadingPlan={loadingPlan}
                    selectedToolId={selectedToolId}
                />

                <PromoteTrustFooter />

            </div>
        </div>
    );
};

export default Promote;
