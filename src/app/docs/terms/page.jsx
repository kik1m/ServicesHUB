import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Terms of Service | HUBly Docs',
    description: 'The legally binding terms and conditions governing the use of the HUBly platform for Seekers and Makers.',
    url: 'https://www.hubly-tools.com/docs/terms'
};

export default function DocsLegalPage() {
    return (
        <article className={styles.article}>
            <h1>Terms of Service</h1>
            <p><strong>Last Updated:</strong> May 2026</p>
            
            <DocsCallout type="warning" title="Legal Agreement">
                <p>By accessing, browsing, or registering for an account on the HUBly platform (the "Service"), you acknowledge that you have read, understood, and agree to be legally bound by these Comprehensive Terms of Service.</p>
            </DocsCallout>

            <h2>1. Platform Usage & Account Liability</h2>
            <p>
                HUBly grants you a personal, non-exclusive, non-transferable, revocable license to use the Service. To access core features (such as leaving Reviews, Submitting Tools, or using the AI Assistant), you must register for an account using a valid email address or social provider (Google/GitHub).
            </p>
            <ul>
                <li><strong>Account Security:</strong> You are entirely responsible for maintaining the confidentiality of your account credentials. HUBly utilizes Supabase Auth for enterprise-grade cryptographic security, but you are responsible for any activity under your account.</li>
                <li><strong>Prohibited Activity:</strong> You may not use automated scripts, bots, or scrapers to extract data, tool listings, or user profiles from the directory. Any API abuse will result in immediate IP bans.</li>
            </ul>

            <h2>2. User-Generated Content & Reviews</h2>
            <p>
                As a community-driven platform, HUBly relies on User-Generated Content (UGC). By posting reviews, comments, or public profile information, you grant HUBly a worldwide, royalty-free license to display, reproduce, and distribute your content.
            </p>
            <ul>
                <li><strong>Review Integrity:</strong> Reviews must represent actual, unbiased user experiences. Purchasing fake reviews, creating "sock-puppet" accounts to artificially inflate a tool's rating, or engaging in coordinated "review bombing" of competitors is strictly prohibited.</li>
                <li><strong>Liability Limit:</strong> HUBly acts as a neutral hosting provider. We are not legally liable for defamatory or inaccurate claims made in user reviews, but we provide reporting mechanisms to investigate and remove violations.</li>
            </ul>

            <h2>3. Maker (Creator) Obligations & DMCA</h2>
            <p>
                Founders and agencies submitting software to the directory ("Makers") are bound by strict obligations:
            </p>
            <ul>
                <li><strong>Accuracy of Listings:</strong> You warrant that all provided pricing, features, and logos are accurate and not misleading.</li>
                <li><strong>Malware & Harmful Code:</strong> Submitting software that contains malware, spyware, or violates user privacy will result in permanent removal and reporting to relevant authorities.</li>
                <li><strong>DMCA & Copyright:</strong> You must own or have the explicit right to promote the submitted software. If you believe your intellectual property has been infringed upon (e.g., someone else claimed your tool), please submit a formal DMCA takedown notice to <code>legal@hubly-tools.com</code>.</li>
            </ul>

            <h2>4. Payments, Subscriptions & Refunds</h2>
            <p>
                All financial transactions on HUBly, including Premium Memberships and Promotion Plans, are securely handled by our Merchant of Record, <strong>LemonSqueezy</strong>.
            </p>
            <ul>
                <li><strong>Merchant of Record:</strong> By purchasing a plan, you agree to LemonSqueezy’s Terms of Sale. HUBly never stores or processes raw credit card data.</li>
                <li><strong>Subscription Renewals:</strong> Premium Memberships renew automatically unless canceled prior to the billing cycle end date via your Account Settings.</li>
                <li><strong>Refund Policy:</strong> Due to the immediate digital nature of Promotion Plans (where impressions are delivered instantly), refunds for Promotion Plans are generally not provided once the campaign is active, except in cases of technical platform failure. Premium Memberships may be refunded within 14 days of initial purchase if the AI Assistant features were left unused.</li>
            </ul>

            <h2>5. Limitation of Liability</h2>
            <p>
                In no event shall HUBly, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of your use of the Service or reliance on any software discovered through the directory.
            </p>

            <h2>6. AI Services, Hallucinations & Fair Use</h2>
            <p>
                The <strong>HUBly AI Engine</strong> is provided as an experimental, supplemental feature to assist in software discovery. By using the AI Engine (including the AI Studio and Compare Builder AI Verdicts), you agree to the following terms:
            </p>
            <ul>
                <li><strong>No Professional Advice:</strong> AI responses are algorithmically generated based on probabilities. They do NOT constitute professional financial, legal, or technical advice. You must independently verify all pricing, features, and security claims before purchasing any software recommended by the AI.</li>
                <li><strong>AI Hallucinations:</strong> The AI Engine may occasionally produce inaccurate, misleading, or fabricated information ("hallucinations"). HUBly holds zero liability for any business damages, data loss, or financial losses incurred due to reliance on AI-generated recommendations.</li>
                <li><strong>Fair Usage Limits:</strong> To protect infrastructure stability, Standard Users are strictly limited to 10 messages per AI session. Any attempt to bypass these limits via automated scripts, prompt injection, or malicious API polling will result in an immediate and permanent IP ban.</li>
            </ul>

            <DocsFAQ>
                <DocsFAQItem question="Can these terms change over time?">
                    Yes. We reserve the right to update these terms as the platform evolves. Major changes will be communicated via email to all registered users 30 days before taking effect.
                </DocsFAQItem>
                <DocsFAQItem question="Who do I contact for legal inquiries?">
                    For DMCA notices, subpoenas, or corporate legal inquiries, please contact our legal team directly at legal@hubly-tools.com.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Managing Reviews", href: "/docs/reviews" }}
                next={{ title: "Privacy Policy", href: "/docs/privacy" }}
            />
        </article>
    );
}
