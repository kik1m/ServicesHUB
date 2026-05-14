import React from 'react';
import ContactClient from './ContactClient';
import { CONTACT_UI_CONSTANTS } from '@/constants/contactConstants';

// Rule #2: Metadata & SEO Logic
export async function generateMetadata() {
    const { seo } = CONTACT_UI_CONSTANTS;
    return {
        title: seo.title,
        description: seo.description,
        openGraph: {
            title: seo.title,
            description: seo.description,
            type: 'website',
        },
    };
}

// Rule #2: SSG Revalidation
export const revalidate = 86400; // 24 hours

export default function ContactPage() {
    return <ContactClient />;
}
