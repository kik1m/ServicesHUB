import React from 'react';
import NotFoundHero from '../components/NotFound/NotFoundHero';
import NotFoundActions from '../components/NotFound/NotFoundActions';
import styles from './not-found.module.css';

import { seoService } from '../services/seoService';
import { SEO_CONFIG } from '../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.notfound, 'page');
    return {
        title: dynamicSeo?.title || 'Page Not Found | HUBly',
        description: dynamicSeo?.description || 'The requested page does not exist on HUBly platform.',
        robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
                index: false,
                follow: false,
            },
        },
    };
}

export default function NotFound() {
    return (
        <main className={`page-wrapper ${styles.notFoundWrapper} fade-in`}>
            <div className={`glass-card ${styles.notFoundCard}`}>
                <NotFoundHero isLoading={false} />
                <NotFoundActions isLoading={false} />
            </div>
        </main>
    );
}
