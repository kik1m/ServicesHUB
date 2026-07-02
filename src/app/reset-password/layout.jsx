import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.reset_password, 'page');
    return {
        title: dynamicSeo?.title || 'Reset Password | HUBly',
        description: dynamicSeo?.description || 'Securely reset your HUBly account password.',
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

export default function ResetPasswordLayout({ children }) {
    return <>{children}</>;
}
