/**
 * 📊 HUBly Elite Analytics Engine (GA4)
 * This service handles global event tracking and page view monitoring.
 */

const MEASUREMENT_ID = 'G-EEENREWLGQ';

/**
 * Initialize Google Analytics 4
 */
export const initGA = () => {
    if (typeof window === 'undefined') return;

    // 1. Inject Google Tag Script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // 2. Initialize DataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, {
        send_page_view: false // We handle page views manually for SPA accuracy
    });

    console.log('✅ [Analytics Engine] GA4 Initialized');
};

/**
 * Log Page View (Manual Trigger for React Router)
 */
export const logPageView = (path, title) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'page_view', {
            page_path: path,
            page_title: title,
            send_to: MEASUREMENT_ID
        });
    }
};

/**
 * Log Custom Events (e.g., clicks, searches)
 */
export const logEvent = (action, category, label, value) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};
