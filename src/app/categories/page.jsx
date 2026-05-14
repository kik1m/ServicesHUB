import React from 'react';
import { categoriesService } from '../../services/categoriesService';
import { toolsService } from '../../services/toolsService';
import CategoriesClient from './CategoriesClient';

/**
 * Categories Directory Page - Server Component (Elite 10/10)
 * Rule #2: SSR Logic Implementation
 */
export const revalidate = 3600; // ISR: 1 hour

export async function generateMetadata() {
    return {
        title: 'Browse Elite AI & SaaS Tool Categories | Find the Best Software',
        description: 'Explore our curated directory of AI and SaaS categories. From LLMs to Productivity, find the perfect tools for your workflow.',
        openGraph: {
            title: 'Professional AI & SaaS Categories | HUBly',
            description: 'Discover specialized AI and SaaS software categories curated for professional workflows.',
            url: 'https://www.hubly-tools.com/categories',
            type: 'website',
        },
    };
}

export default async function CategoriesPage() {
    // Rule #2.1: Parallel Fetching (Optimization)
    const [categoriesResult, bannerResult] = await Promise.all([
        categoriesService.getCategoriesWithCounts(),
        toolsService.getBannerTools()
    ]);

    const { data: rawCategories = [], counts = {} } = categoriesResult || {};
    const { data: bannerTools = [] } = bannerResult || {};

    // Normalize categories with counts
    const normalizedCategories = (rawCategories || []).map(cat => ({
        ...cat,
        toolCount: counts?.[cat.id] || 0
    }));

    return (
        <CategoriesClient 
            initialCategories={normalizedCategories}
            bannerTools={bannerTools}
        />
    );
}
