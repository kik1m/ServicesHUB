import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { promotionService } from '../services/promotionService';

import { PROMOTE_UI_CONSTANTS } from '../constants/promoteConstants';

/**
 * usePromoteData - Elite Logic Layer
 * Rule #1: Logic Isolation
 * Rule #14: Data SSOT
 */
export const usePromoteData = () => {
    const { PLANS } = PROMOTE_UI_CONSTANTS;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const toolId = searchParams.get('toolId');
    const [toolName, setToolName] = useState('');
    const [userTools, setUserTools] = useState([]);
    const [selectedToolId, setSelectedToolId] = useState(toolId || '');
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [loadingTools, setLoadingTools] = useState(false);

    // Initial Auth Check
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
        }
    }, [user, authLoading, navigate]);

    // Data Initialization
    useEffect(() => {
        const initializeData = async () => {
            if (authLoading || !user) return;

            try {
                if (toolId) {
                    const name = await promotionService.fetchToolName(toolId);
                    if (name) {
                        setToolName(name);
                        setSelectedToolId(toolId);
                    }
                } else {
                    setLoadingTools(true);
                    const tools = await promotionService.fetchUserTools(user.id);
                    setUserTools(tools);
                }
            } catch (err) {
                console.error('Promote initialization error:', err);
                showToast('Failed to load tool data.', 'error');
            } finally {
                setLoadingTools(false);
            }
        };

        initializeData();
    }, [toolId, user, authLoading]);

    /**
     * Handles the promotion CTA click
     */
    const handlePromote = async (plan) => {
        if (!selectedToolId) {
            showToast('Please select a tool to promote first.', 'warning');
            return;
        }

        setLoadingPlan(plan.name);
        try {
            const finalToolName = toolName || userTools.find(t => t.id === selectedToolId)?.name;
            
            const session = await promotionService.createCheckoutSession({
                userId: user.id,
                toolId: selectedToolId,
                toolName: finalToolName,
                planName: plan.name,
                priceAmount: plan.amount
            });

            if (session?.url) {
                window.location.href = session.url;
            } else {
                throw new Error('No checkout URL returned.');
            }
        } catch (err) {
            console.error('Promotion logic error:', err);
            showToast('Failed to initiate checkout.', 'error');
        } finally {
            setLoadingPlan(null);
        }
    };

    return {
        user,
        authLoading,
        PLANS,
        toolName,
        userTools,
        selectedToolId,
        setSelectedToolId,
        loadingPlan,
        loadingTools,
        handlePromote
    };
};
