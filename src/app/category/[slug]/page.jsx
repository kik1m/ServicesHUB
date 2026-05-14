import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { categoriesService } from '../../../services/categoriesService';
import { toolsService } from '../../../services/toolsService';
import CategoryDetailClient from './CategoryDetailClient';

/**
 * Category Detail Page - Server Component
 * Rule #2: SSR/ISR Logic
 */
export const revalidate = 3600; // 1 hour

// Rule #14: generateStaticParams for ISR (Pre-render top categories)
export async function generateStaticParams() {
    const { data } = await categoriesService.getAllCategories();
    return (data || []).map((cat) => ({
        slug: cat.slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { data: category } = await categoriesService.getCategoryBySlug(slug);

    if (!category) return { title: 'Category Not Found' };

    return {
        title: `Best ${category.name} Tools & Software (2026)`,
        description: category.description || `Explore the best AI and SaaS tools in the ${category.name} category.`,
        openGraph: {
            title: `Top ${category.name} Solutions | HUBly`,
            description: category.description,
            url: `https://www.hubly-tools.com/category/${slug}`,
            type: 'website',
        },
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;

    // Parallel fetch for category and banner
    const [categoryResult, bannerResult] = await Promise.all([
        categoriesService.getCategoryBySlug(slug),
        toolsService.getBannerTools()
    ]);

    const { data: category, error: catError } = categoryResult || {};
    const { data: bannerTools = [] } = bannerResult || {};

    if (!category || catError) {
        notFound();
    }

    return (
        <Suspense fallback={null}>
            <CategoryDetailClient 
                category={category}
                bannerTools={bannerTools}
            />
        </Suspense>
    );
}
