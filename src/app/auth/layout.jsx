import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.auth, 'page');
    return {
        title: dynamicSeo?.title || 'Authentication | HUBly',
        description: dynamicSeo?.description || 'Secure access to the HUBly platform. Manage your AI tools, collections, and professional profile.',
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

export default function AuthLayout({ children }) {
    return <>{children}</>;
}
