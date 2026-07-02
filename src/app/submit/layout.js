import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.submit, 'page');
    return {
        title: dynamicSeo?.title || 'Submit Tool | HUBly',
        description: dynamicSeo?.description || 'Publish and submit your AI tools to the HUBly platform.',
        robots: {
            index: false,
            follow: false,
        },
    };
}

export default function SubmitLayout({ children }) {
    return <>{children}</>;
}
