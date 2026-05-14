import React from 'react';
import FAQClient from './FAQClient';
import { FAQ_UI_CONSTANTS } from '@/constants/faqConstants';

// Rule #2: Metadata & SEO Logic
export async function generateMetadata() {
    const { seo } = FAQ_UI_CONSTANTS;
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

export default function FAQPage() {
    return <FAQClient />;
}
