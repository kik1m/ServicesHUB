import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.settings, 'page');
    return {
        title: dynamicSeo?.title || 'Account Settings | HUBly',
        description: dynamicSeo?.description || 'Manage your profile, security, and preferences on HUBly.',
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

export default function SettingsLayout({ children }) {
    return <>{children}</>;
}
