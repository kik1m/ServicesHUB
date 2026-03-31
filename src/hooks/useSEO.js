import { useEffect } from 'react';

const useSEO = ({ title, description, image, url }) => {
    useEffect(() => {
        const setMetaTag = (attr, content) => {
            if (!content) return;
            let element = document.querySelector(`meta[${attr}]`);
            if (!element) {
                element = document.createElement('meta');
                const [key, val] = attr.split('=');
                element.setAttribute(key, val.replace(/"/g, ''));
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        if (title) {
            const fullTitle = `${title} | ServicesHUB`;
            document.title = fullTitle;
            setMetaTag('property="og:title"', fullTitle);
            setMetaTag('name="twitter:title"', fullTitle);
        }
        if (description) {
            const cleanDesc = description.substring(0, 160);
            setMetaTag('name="description"', cleanDesc);
            setMetaTag('property="og:description"', cleanDesc);
            setMetaTag('name="twitter:description"', cleanDesc);
        }
        if (image) {
            setMetaTag('property="og:image"', image);
            setMetaTag('name="twitter:image"', image);
            setMetaTag('name="twitter:card"', 'summary_large_image');
        }
        if (url) {
            setMetaTag('property="og:url"', url);
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.rel = 'canonical';
                document.head.appendChild(canonical);
            }
            canonical.href = url;
        }
    }, [title, description, image, url]);
};

export default useSEO;
