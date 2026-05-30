import React from 'react';
import PremiumClient from './PremiumClient';
import { PREMIUM_UI_CONSTANTS } from '@/constants/premiumConstants';

import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

// Rule #2: Metadata & SEO Logic
export async function generateMetadata() {
    const { seo } = PREMIUM_UI_CONSTANTS;
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.premium, 'page');
    
    return {
        title: dynamicSeo?.title || seo.title,
        description: dynamicSeo?.description || seo.description,
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

export default function PremiumPage() {
    return <PremiumClient />;
}
