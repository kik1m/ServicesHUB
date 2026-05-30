import React, { Suspense } from 'react';
import SuccessClient from './SuccessClient';

import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

// Rule #34: Success pages must never be indexed or cached
export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.success, 'page');
    return {
        title: dynamicSeo?.title || 'Success | HUBly',
        description: dynamicSeo?.description || 'Operation completed successfully.',
        robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
                index: false,
                follow: false,
                noimageindex: true,
            },
        },
    };
}

export default function SuccessPage() {
    return (
        <Suspense fallback={null}>
            <SuccessClient />
        </Suspense>
    );
}
