import AdminDashboardClient from './AdminDashboardClient';

import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.admin, 'page');
    return {
        title: dynamicSeo?.title || 'System Access | HUBly',
        description: dynamicSeo?.description || 'Secure administrative gateway.',
        robots: {
            index: false,
            follow: false,
            nocache: true,
            googleBot: {
                index: false,
                follow: false,
                noimageindex: true,
                'max-video-preview': -1,
                'max-image-preview': 'none',
                'max-snippet': -1,
            },
        },
    };
}

/**
 * Admin Page Entry - Pure Server Component Wrapper
 */
export default function AdminPage() {
    return <AdminDashboardClient />;
}
