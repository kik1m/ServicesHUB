import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Premium Memberships | HUBly Docs',
    description: 'Unlock the full power of HUBly with Premium Memberships designed for power users, agencies, and investors.',
    url: 'https://www.hubly-tools.com/docs/premium'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>Premium Memberships</h1>
            <p>
                While the core discovery features of HUBly are free for all users, professionals who rely heavily on software research—such as marketing agencies, venture capitalists, and enterprise IT managers—require higher capabilities. 
                <strong>HUBly Subscriptions</strong> offer two dedicated tiers: <strong>Pro</strong> and <strong>Elite</strong>, built exclusively for power users.
            </p>

            <DocsImage 
                src="/docs-premium-features.png" 
                alt="Subscription Features" 
                caption="Unlock advanced capabilities, higher AI quotas, and priority support." 
            />

            <h2>1. Scaled AI Intelligence & Quotas</h2>
            <p>
                Processing natural language search queries and rendering automated verdicts requires massive computational power. Our subscriptions grant higher limits on our core Artificial Intelligence systems:
            </p>
            <ul>
                <li><strong>Pro Tier:</strong> 150 AI queries every 6 hours, powered by standard robust models (Claude 3.5 Sonnet & GPT-4o).</li>
                <li><strong>Elite Tier:</strong> 500 AI queries every 6 hours, utilizing the absolute state-of-the-art models (OpenAI o1 & Claude 3.5 Opus) for deepest reasoning and complex stack architecture planning.</li>
            </ul>

            <h2>2. Instant Updates & Early Access</h2>
            <p>
                The AI and SaaS landscape moves at breakneck speed. Premium members receive <strong>Instant Notifications and Updates</strong> regarding the newest tools added to the platform before they are officially indexed for the public. This gives investors and agencies a crucial head-start on emerging technologies.
            </p>

            <DocsCallout type="info" title="Distinct Community Appearance (The Subscription Badge)">
                <p>
                    Subscribing to either tier grants your profile a highly visible, exclusive "Pro" or "Elite" badge. This provides you with a <strong>distinct appearance across the entire platform community</strong>. Whether you are leaving comments on a review, interacting in discussions, or acting as a Tool Publisher (Maker) or a Tool Hunter (Seeker), your name will be highlighted. This subtle visual indicator elevates your authority, making your interactions significantly more influential.
                </p>
            </DocsCallout>

            <DocsCallout type="warning" title="Secure Billing">
                <p>
                    All HUBly Premium transactions are securely processed by <strong>LemonSqueezy</strong>, acting as our Merchant of Record. We do not store your credit card details on our servers.
                </p>
            </DocsCallout>

            

            <h2>3. Seamless Subscription Management</h2>
            <p>
                You can upgrade, downgrade, pause, or cancel your Subscription at any time directly from the <strong>Billing</strong> tab in your Account Settings. All billing is strictly monthly with no hidden fees or long-term lock-in contracts.
            </p>
            
            <DocsFAQ>
                <DocsFAQItem question="Can I cancel my Premium Membership at any time?">
                    Yes. You can cancel your subscription directly from the 'Billing' tab in your Account Settings. Your premium features will remain active until the end of your current billing cycle.
                </DocsFAQItem>
                <DocsFAQItem question="Does Premium include Promotions?">
                    No. Premium Membership is for 'Seekers' (users looking for tools) to unlock advanced discovery features. 'Promotions' are a separate advertising service for 'Makers' (founders looking to sell tools).
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Promotions & Ads", href: "/docs/promotions" }}
                next={{ title: "Reviews & Feedback", href: "/docs/reviews" }}
            />
        </article>
    );
}
