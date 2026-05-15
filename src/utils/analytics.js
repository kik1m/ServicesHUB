import { supabase } from '../lib/supabaseClient';

/**
 * دالة تتبع الزيارات - مصممة لتكون خفيفة وآمنة على الخطة المجانية لـ Supabase
 */
export const trackVisit = async (path) => {
  try {
    if (typeof window === 'undefined') return;

    // 1. الحصول على أو إنشاء ID فريد للزائر
    let visitorId = localStorage.getItem('hubly_visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('hubly_visitor_id', visitorId);
    }

    // 2. الحصول على الدولة (اختياري)
    let country = 'Unknown';
    try {
      const geoRes = await fetch('https://ipapi.co/json/');
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        country = geoData.country_name || 'Unknown';
      }
    } catch (e) {
      // Silently fail geo-lookups to not block analytics
    }

    // 3. إرسال البيانات لـ Supabase (Simple Insert for maximum compatibility)
    const { error } = await supabase
      .from('analytics')
      .insert([{
        visitor_id: visitorId,
        page_path: path || window.location.pathname,
        country: country,
        visit_date: new Date().toISOString().split('T')[0]
      }]);

    if (error && error.code !== '23505') {
      console.error('Analytics Error:', error.message);
    }
  } catch (err) {
    console.error('Analytics System Error:', err);
  }
};
