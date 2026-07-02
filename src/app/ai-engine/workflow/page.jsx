import React from 'react';
import WorkflowClient from './WorkflowClient';
import AIEngineSkeleton from '../../../components/AIEngine/AIEngineSkeleton';
import { seoService } from '../../../services/seoService';
import { SEO_CONFIG } from '../../../constants/seoManifest';
import { ArtifactProvider } from '../../../context/ArtifactContext';

export async function generateMetadata() {
    // Attempt to fetch dynamic SEO metadata, fallback to static AI Engine config
    const dynamicSeo = await seoService.getMetadata('ai_engine_workflow', 'page').catch(() => null);
    const staticSeo  = SEO_CONFIG.pages?.ai_engine || { title: 'HUBly AI Engine', description: 'Advanced AI Assistant' };

    const title       = dynamicSeo?.title       || `${staticSeo.title} - Interactive Workflows`;
    const description = dynamicSeo?.description || `${staticSeo.description} Build and run interactive workspaces and mock systems in real-time.`;

    return {
        title,
        description,
        keywords: staticSeo.keywords || [],
        openGraph: {
            title,
            description,
            url: 'https://www.hubly-tools.com/ai-engine/workflow',
            siteName: SEO_CONFIG.global?.siteName || 'HUBly',
            images: [{ url: SEO_CONFIG.global?.defaultImage || '/logo.png', width: 512, height: 512 }],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [SEO_CONFIG.global?.defaultImage || '/logo.png'],
        },
    };
}

export default function WorkflowPage() {
    return (
        <React.Suspense fallback={<AIEngineSkeleton />}>
            <ArtifactProvider>
                <WorkflowClient />
            </ArtifactProvider>
        </React.Suspense>
    );
}
