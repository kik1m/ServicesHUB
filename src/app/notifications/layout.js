import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.notifications, 'page');
    return {
        title: dynamicSeo?.title || 'Notifications | HUBly',
        description: dynamicSeo?.description || 'View your private notifications and activity updates on HUBly.',
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

export default function NotificationsLayout({ children }) {
    return <>{children}</>;
}
