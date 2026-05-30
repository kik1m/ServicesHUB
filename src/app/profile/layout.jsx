import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.profile, 'page');
    return {
        title: dynamicSeo?.title || "Account Overview | HUBly",
        description: dynamicSeo?.description || "Manage your personal profile and preferences.",
        robots: {
            index: false,
            follow: false,
        }
    };
}

export default function ProfileLayout({ children }) {
    return <>{children}</>;
}
