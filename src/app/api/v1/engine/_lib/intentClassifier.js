import { softwareProjectTemplate } from './templates/softwareProjectTemplate';
import { marketingTemplate } from './templates/marketingTemplate';
import { defaultTemplate } from './templates/defaultTemplate';

export function classifyIntentAndGetTemplate(userMessage, workspaceContext) {
    const text = ((userMessage || '') + ' ' + (workspaceContext?.idea || '')).toLowerCase();
    
    // Keywords for Software Engineering / App Development
    const softwareKeywords = ['تطبيق', 'موقع', 'برمجة', 'كود', 'تطوير', 'برنامج', 'سيستم', 'واجهة', 'قاعدة بيانات', 'مكون', 'مكونات', 'تصميم', 'تصاميم', 'بطاقة', 'بطاقات', 'شارت', 'جدول', 'جداول', 'app', 'website', 'software', 'code', 'develop', 'system', 'saas', 'api', 'react', 'nextjs', 'frontend', 'backend', 'database', 'component', 'components', 'card', 'cards', 'chart', 'charts', 'design', 'ui'];
    
    // Keywords for Marketing / SEO / Campaigns
    const marketingKeywords = ['تسويق', 'اعلان', 'إعلان', 'سوشيال', 'محتوى', 'سيو', 'حملة', 'مبيعات', 'جمهور', 'marketing', 'ads', 'seo', 'campaign', 'social media', 'content', 'tiktok', 'facebook', 'sales', 'audience'];
    
    let softwareScore = softwareKeywords.filter(kw => text.includes(kw)).length;
    let marketingScore = marketingKeywords.filter(kw => text.includes(kw)).length;
    
    if (softwareScore > 0 && softwareScore >= marketingScore) {
        return {
            intent: 'software',
            template: softwareProjectTemplate
        };
    } else if (marketingScore > 0 && marketingScore > softwareScore) {
        return {
            intent: 'marketing',
            template: marketingTemplate
        };
    }
    
    return {
        intent: 'default',
        template: defaultTemplate
    };
}
