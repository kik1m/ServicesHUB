'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '../../lib/queryOptions';
import OnboardingModal from './OnboardingModal';
import { usePathname } from 'next/navigation';

export default function OnboardingWrapper({ children }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const [showOnboarding, setShowOnboarding] = useState(false);

    const { data: profile, isLoading: profileLoading } = useQuery({
        ...queryOptions.profile(user?.id, user),
        enabled: !!user?.id
    });

    useEffect(() => {
        if (!loading && user && !profileLoading && profile) {
            // Check if profile is missing the new fields
            const isMissingFields = !profile.experience_level || !profile.primary_goal;
            // Only show if missing fields AND we're not on auth routes to prevent conflict
            const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/signup') || pathname?.startsWith('/auth');
            
            if (isMissingFields && !isAuthRoute) {
                setShowOnboarding(true);
            } else {
                setShowOnboarding(false);
            }
        } else {
            setShowOnboarding(false);
        }
    }, [user, loading, profile, profileLoading, pathname]);

    const handleComplete = (newData) => {
        setShowOnboarding(false);
        window.location.reload();
    };

    return (
        <>
            {children}
            {showOnboarding && user && profile && (
                <OnboardingModal user={user} onComplete={handleComplete} />
            )}
        </>
    );
}
