/**
 * 📊 HUBly Visits Tracker Utility
 * Tracks user visits securely via our server API.
 */
export const trackVisit = async (path) => {
  try {
    if (typeof window === 'undefined') return;

    // 🛡️ SMART FILTERS: Ignore Localhost & Bots for 100% accurate human stats
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return; // Ignore local development visits
    }

    const botPattern = /bot|crawler|spider|crawling|googlebot|bingbot|yandex|baiduspider|slurp|lighthouse|vercel/i;
    if (navigator.userAgent && botPattern.test(navigator.userAgent)) {
      return; // Ignore automated bot visits
    }

    // 1. Get or create unique Visitor ID
    let visitorId = localStorage.getItem('hubly_visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('hubly_visitor_id', visitorId);
    }

    // 2. Track visit via Server API
    const response = await fetch('/api/track-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        visitorId,
        pagePath: path || window.location.pathname
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.warn('Analytics API warning:', errData.error);
    }
  } catch (err) {
    console.error('Analytics System Error:', err);
  }
};
