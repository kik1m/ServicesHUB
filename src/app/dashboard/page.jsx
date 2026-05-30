import DashboardClient from './DashboardClient';

import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.dashboard, 'page');
    return {
        title: dynamicSeo?.title || 'User Analytics & Dashboard | HUBly',
        description: dynamicSeo?.description || 'Private area for managing your tools, analytics, and favorites on HUBly.',
        robots: {
            index: false,
            follow: false,
        }
    };
}

export default function DashboardPage() {
    return <DashboardClient />;
}
