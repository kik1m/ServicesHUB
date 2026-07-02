import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useQuota(user) {
    const subscriptionTier = user?.subscription_tier || (user?.is_premium ? 'pro' : 'free');
    const isPremium = subscriptionTier === 'pro' || subscriptionTier === 'elite';
    const isGuest = !user;

    const [guestMessageCount, setGuestMessageCount] = useState(0);
    const [isGuestLimitReached, setIsGuestLimitReached] = useState(false);
    const [globalMessageCount, setGlobalMessageCount] = useState(0);
    const [limitResetTime, setLimitResetTime] = useState(null);

    let quotaLimit = 10;
    if (subscriptionTier === 'elite') quotaLimit = 500;
    else if (subscriptionTier === 'pro') quotaLimit = 120;

    const isLimitReached = (globalMessageCount >= quotaLimit) || (isGuest && guestMessageCount >= 3);

    useEffect(() => {
        if (isGuest) {
            const count = parseInt(localStorage.getItem('hubly_guest_count') || '0', 10);
            setGuestMessageCount(count);
            if (count >= 3) setIsGuestLimitReached(true);
            return;
        } else {
            setIsGuestLimitReached(false);
        }

        if (user && user.id) {
            const fetchLimit = async () => {
                const { data } = await supabase.from('profiles').select('ai_messages_today, ai_last_reset_date').eq('id', user.id).single();
                if (data) {
                    let resetDateStr = data.ai_last_reset_date;
                    let msgs = data.ai_messages_today || 0;

                    if (resetDateStr) {
                        if (resetDateStr.length === 10) {
                            msgs = 0; // Legacy format
                        } else {
                            const resetTime = new Date(resetDateStr).getTime();
                            if (Date.now() >= resetTime) {
                                msgs = 0;
                            } else if (msgs >= quotaLimit) {
                                setLimitResetTime(resetDateStr);
                            }
                        }
                    }
                    setGlobalMessageCount(msgs);
                }
            };
            fetchLimit();
        }
    }, [user, isPremium, isGuest, quotaLimit]);

    const incrementCount = () => {
        if (isGuest) {
            const newCount = guestMessageCount + 1;
            setGuestMessageCount(newCount);
            localStorage.setItem('hubly_guest_count', newCount.toString());
            if (newCount >= 3) setIsGuestLimitReached(true);
        } else if (!isPremium) {
            setGlobalMessageCount(prev => {
                const next = prev + 1;
                if (next >= 10 && !limitResetTime) {
                    setLimitResetTime(new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString());
                }
                return next;
            });
        }
    };

    const handleLimitError = (resetTime) => {
        if (resetTime) setLimitResetTime(resetTime);
    };

    return {
        isLimitReached,
        isGuestLimitReached,
        globalMessageCount,
        limitResetTime,
        incrementCount,
        handleLimitError,
        isGuest,
        isPremium
    };
}
