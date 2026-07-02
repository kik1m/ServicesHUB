import React from 'react';
import AIEngineClient from './AIEngineClient';
import AIEngineSkeleton from '../../components/AIEngine/AIEngineSkeleton';
import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.ai_engine, 'page');
    const staticSeo  = SEO_CONFIG.pages.ai_engine;

    const title       = dynamicSeo?.title       || staticSeo.title;
    const description = dynamicSeo?.description || staticSeo.description;

    return {
        title,
        description,
        keywords: staticSeo.keywords,
        openGraph: {
            title,
            description,
            url: 'https://www.hubly-tools.com/ai-engine',
            siteName: SEO_CONFIG.global.siteName,
            images: [{ url: SEO_CONFIG.global.defaultImage, width: 512, height: 512 }],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [SEO_CONFIG.global.defaultImage],
        },
    };
}

export default function AIEnginePage() {
    return (
        <React.Suspense fallback={<AIEngineSkeleton />}>
            <AIEngineClient />
        </React.Suspense>
    );
}

