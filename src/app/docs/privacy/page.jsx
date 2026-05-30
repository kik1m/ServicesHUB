import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Privacy Policy | HUBly Docs',
    description: 'How HUBly collects, secures, and utilizes your data in compliance with strict privacy regulations including GDPR and CCPA.',
    url: 'https://www.hubly-tools.com/docs/privacy'
};

export default function DocsLegalPage() {
    return (
        <article className={styles.article}>
            <h1>Privacy Policy</h1>
            <p><strong>Last Updated:</strong> May 2026</p>
            
            <p>
                At HUBly, absolute transparency is our core principle. This comprehensive Privacy Policy outlines exactly what data we collect, how our infrastructure secures it, and the legal rights you hold over your digital footprint. 
                <strong>We do not, and will never, sell your personal data to third-party data brokers.</strong>
            </p>

            <h2>1. Information We Collect</h2>
            <p>To provide a highly personalized discovery experience, we collect specific data points:</p>
            <ul>
                <li><strong>Authentication Data:</strong> When you register, we collect your email address. Passwords are never stored in plain text; they are cryptographically hashed by our auth provider (Supabase). If you use Google or GitHub OAuth, we collect your public profile name and avatar.</li>
                <li><strong>Public Profile Data:</strong> Information you voluntarily add in the Account Settings (Bio, Job Role, Social Links, Tech Stack) is collected and made public.</li>
                <li><strong>Behavioral & Usage Data:</strong> We track anonymous interactions—such as clicks on a tool's "Visit Website" button—to provide accurate performance analytics to Makers via the Dashboard. We also log AI Assistant query metadata to improve response accuracy.</li>
                <li><strong>Payment Data:</strong> We do NOT collect credit card numbers. All payment data is routed directly through our PCI-DSS compliant Merchant of Record (LemonSqueezy).</li>
            </ul>

            <DocsCallout type="info" title="Public Visibility of Content">
                <p>
                    Please be aware that any reviews you write, comments you post, or tools you add to your "Favorites" are permanently associated with your Public Profile. This transparency is crucial for the integrity of our community rating engine. Do not place sensitive personal information in public text fields.
                </p>
            </DocsCallout>

            <h2>2. Enterprise-Grade Security Infrastructure</h2>
            <p>
                We employ defense-in-depth strategies to protect your data. Our database operates on <strong>Row Level Security (RLS)</strong> policies. This means that at the database level, no user can read or modify another user's private data (like billing emails or draft tools), even if API endpoints are exposed. All data in transit is encrypted via TLS 1.3.
            </p>

            <h2>3. Cookies & Tracking Technologies</h2>
            <p>
                HUBly uses essential cookies to maintain your login session and secure your requests against Cross-Site Request Forgery (CSRF). We also utilize minimal first-party analytics cookies to measure aggregated site traffic. We do not use intrusive cross-site tracking pixels.
            </p>

            <h2>4. Your GDPR & CCPA Rights</h2>
            <p>
                Regardless of your geographic location, HUBly extends strict GDPR and CCPA compliance rights to all users globally:
            </p>
            <ul>
                <li><strong>Right to Access:</strong> You may request a complete JSON export of all personal data we hold associated with your account.</li>
                <li><strong>Right to Rectification:</strong> You can instantly update your data via your Account Settings.</li>
                <li><strong>Right to be Forgotten (Deletion):</strong> You have a "Delete Account" button in your settings. Clicking this initiates a hard deletion of your authentication record, profile data, and saved collections. (Note: Public reviews may be anonymized rather than deleted to maintain historical tool ratings).</li>
            </ul>

            <h2>5. Contact the Data Protection Officer</h2>
            <p>
                If you have complex privacy inquiries or wish to execute a specific data rights request, please contact our Data Protection Officer directly at <code>privacy@hubly-tools.com</code> or use our <a href="/contact">Contact Page</a>. We commit to responding within 72 hours.
            </p>

            <h2>6. AI Data Processing & Prompts</h2>
            <p>
                When you interact with the HUBly AI Engine, your text prompts are processed to generate conversational responses and contextual tool recommendations.
            </p>
            <ul>
                <li><strong>Third-Party Processors:</strong> We utilize Google Gemini's advanced API for natural language generation. Under our enterprise API agreements, your chat data and prompts are <strong>NOT</strong> used by Google to train their base foundational models.</li>
                <li><strong>Session Privacy:</strong> Your AI sessions are stored securely in our database, protected by Row Level Security (RLS). No other user can view your private chat sessions.</li>
                <li><strong>Data Deletion:</strong> You have full control over your AI data. You can delete individual AI sessions directly from the AI Engine sidebar, which instantly removes them from our databases.</li>
            </ul>

            <DocsFAQ>
                <DocsFAQItem question="Do you sell my data to advertisers?">
                    Absolutely not. Our business model relies on Premium Memberships and Maker Promotions. We do not sell user profiles or email lists to third-party data brokers.
                </DocsFAQItem>
                <DocsFAQItem question="How long do you retain my data?">
                    We retain your active account data indefinitely to provide our services. If you delete your account, your authentication data is wiped immediately, though some anonymized metadata (like aggregated review scores) may remain.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Terms of Service", href: "/docs/terms" }}
                next={{ title: "Community Guidelines", href: "/docs/guidelines" }}
            />
        </article>
    );
}
