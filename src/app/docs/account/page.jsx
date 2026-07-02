import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Account & Settings | HUBly Docs',
    description: 'Documentation for managing your HUBly account, profile, security, and billing in a fully transparent ecosystem.',
    url: 'https://www.hubly-tools.com/docs/account'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>Account & Settings</h1>
            <p>
                Your Account Settings page is the central command hub for managing your identity, security, and subscriptions on HUBly. 
                Because we operate as a highly trusted ecosystem, absolute transparency regarding how we handle your data is our top priority.
            </p>
            
            <DocsImage 
                src="/docs-settings-dashboard.png" 
                alt="Account Settings Dashboard" 
                caption="The central Settings dashboard, providing full control over your digital footprint on HUBly." 
            />
            
            <h2>1. Profile & Identity Management</h2>
            <p>
                The <strong>Profile</strong> tab allows you to shape how the HUBly community perceives you. You can update your display name, professional bio, role, location, and connect your social links (GitHub, Twitter, Website). 
                Uploading a verified avatar and completing your profile is highly recommended, as it adds weight to the reviews you leave and the tools you submit.
            </p>
            <DocsCallout type="warning" title="Public Visibility">
                <p>
                    Information entered in the Profile tab (except your email address) is publicly visible. This transparency is intentional; it allows other users and founders to verify the authenticity of reviews and tech stacks.
                </p>
            </DocsCallout>

            <h2>2. Enterprise-Grade Security</h2>
            <p>
                In the <strong>Security</strong> tab, you can seamlessly update your password. 
                HUBly does not store your passwords in plain-text. We leverage <strong>Supabase Authentication</strong>, which means your credentials are cryptographically hashed using industry-leading protocols. Furthermore, your sensitive database records are protected by strict Row Level Security (RLS) policies, ensuring no unauthorized entity can access your private data.
            </p>
            <DocsImage 
                src="/docs-settings-security.png" 
                alt="Security Settings" 
                caption="Updating security credentials through a secure, encrypted pipeline." 
            />

            <h2>3. Billing & Subscriptions</h2>
            <p>
                The <strong>Billing</strong> tab provides absolute clarity on your financial interactions with HUBly. 
                Whether you are subscribed to a Premium Seeker plan or have purchased Promotion Plans for your tools, you will see your active subscriptions and payment history here. 
                We partner with <strong>LemonSqueezy</strong> as our Merchant of Record to ensure your payment details are processed with bank-level security and are never stored on our servers.
            </p>

            <h2>4. Notifications & Inbox Control</h2>
            <p>
                We respect your inbox. In the <strong>Notifications</strong> tab, you possess granular control over the emails you receive. 
                You can toggle on or off:
            </p>
            <ul>
                <li><strong>Weekly Digests:</strong> Curated lists of top trending tools.</li>
                <li><strong>New Reviews:</strong> Alerts when someone reviews your submitted tool.</li>
                <li><strong>Promotion Updates:</strong> Analytics and status updates regarding your active ad campaigns.</li>
            </ul>
            <DocsCallout type="warning" title="Data Deletion is Permanent">
                <p>
                    If you choose to delete your account, your data is wiped immediately from our servers in compliance with GDPR. There is no recovery option.
                </p>
            </DocsCallout>

            
            
            <DocsFAQ>
                <DocsFAQItem question="Can I change my account email address?">
                    Currently, for security reasons tied to your Supabase Auth identity, changing your primary email address requires contacting our support team directly.
                </DocsFAQItem>
                <DocsFAQItem question="Are my billing details stored on HUBly?">
                    No. All payment and billing information is stored securely on LemonSqueezy's encrypted servers. We only store a secure token referencing your subscription status.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Welcome", href: "/docs" }}
                next={{ title: "Public Profile", href: "/docs/profile" }}
            />
        </article>
    );
}
