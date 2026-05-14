import React from 'react';
import { notFound } from 'next/navigation';
import { profilesService } from '../../../services/profilesService';
import { socialService } from '../../../services/socialService';
import { favoritesService } from '../../../services/favoritesService';
import PublicProfileClient from './PublicProfileClient';

export const revalidate = 3600; // ISR: Update profile every hour

export async function generateMetadata(props) {
    const params = await props.params;
    const { id } = params;

    const profile = await profilesService.getPublicProfile(id);
    
    if (!profile) {
        return {
            title: 'Member Profile Not Found | HUBly',
            robots: { index: false }
        };
    }

    const title = `${profile.full_name} - AI Portfolio & Favorites | HUBly Community`;
    const description = profile.bio 
        ? `${profile.bio} Explore curated AI tools and software favorites by ${profile.full_name}.`
        : `View ${profile.full_name}'s AI toolkit and activity on HUBly.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: profile.avatar_url || 'https://www.hubly-tools.com/og-image.jpg' }],
            type: 'profile',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [profile.avatar_url || 'https://www.hubly-tools.com/og-image.jpg'],
        }
    };
}

export default async function PublicProfilePage(props) {
    const params = await props.params;
    const { id } = params;

    // Parallel Fetching for Elite Performance
    const profile = await profilesService.getPublicProfile(id);

    if (!profile) {
        notFound();
    }

    const [socialCounts, tools, favRes] = await Promise.all([
        socialService.getSocialCounts(profile.id),
        profilesService.getPublicTools(profile.id),
        favoritesService.getUserFavorites(profile.id)
    ]);

    const favorites = (favRes?.data || []).map(f => f.tools).filter(Boolean);

    const initialData = {
        profile,
        socialCounts,
        tools: Array.isArray(tools) ? tools : [],
        favorites
    };

    return (
        <PublicProfileClient 
            id={id} 
            initialData={initialData} 
        />
    );
}
