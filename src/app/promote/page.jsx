import React, { Suspense } from 'react';
import PromoteClient from './PromoteClient';
import { PROMOTE_UI_CONSTANTS } from '@/constants/promoteConstants';

// Rule #2: Metadata & SEO Logic
export async function generateMetadata() {
    const { seo } = PROMOTE_UI_CONSTANTS;
    return {
        title: seo.title,
        description: seo.description,
        openGraph: {
            title: seo.title,
            description: seo.description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.title,
            description: seo.description,
        },
    };
}

// Rule #2: ISR Revalidation
export const revalidate = 3600;

export default function PromotePage() {
    return (
        <Suspense fallback={null}>
            <PromoteClient />
        </Suspense>
    );
}
