import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Edit & Manage Tools | HUBly Docs',
    description: 'Learn how to keep your software listings up-to-date and highly optimized for maximum conversions on HUBly.',
    url: 'https://www.hubly-tools.com/docs/edit'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>Edit & Manage Tools</h1>
            <p>
                Software is a living organism. Features are shipped weekly, pricing models pivot, and UI screenshots become outdated. 
                Unlike static directories that lock your submission permanently, HUBly empowers Founders to continuously edit and manage their listings to ensure maximum accuracy and conversion rates.
            </p>

            <DocsImage 
                src="/docs-edit-tool.png" 
                alt="Tool Editing Interface" 
                caption="The seamless editing interface, mirroring the original submission experience." 
            />

            <h2>1. Accessing the Editor</h2>
            <p>
                Navigating to the Editor is effortless. From your <strong>Maker Dashboard</strong>, locate the tool you wish to update in the tracking table and click the "Edit" (pencil) icon. 
                You will be greeted by the same intuitive, 3-step interface you used during the original submission process.
            </p>

            <h2>2. Optimization Best Practices</h2>
            <p>
                Keeping your listing fresh is critical for maintaining high conversion rates. We recommend updating your listing whenever you hit a major milestone:
            </p>
            <ul>
                <li><strong>Pricing Updates:</strong> If you transition from a "Freemium" to a "Paid" model, update your HUBly listing immediately to ensure the Compare Builder reflects your true competitive advantage.</li>
                <li><strong>Fresh Screenshots:</strong> If you redesign your app's dashboard, swap out the old hero image. High-quality, modern UI screenshots dramatically increase click-through rates.</li>
                <li><strong>Feature Expansion:</strong> As you ship new features, add them to your use-case and feature checklists. This ensures your tool surfaces in more specific Global Searches and AI Assistant prompts.</li>
            </ul>

            <DocsCallout type="warning" title="Security & Re-Approval">
                <p>
                    To maintain the absolute integrity of our ecosystem, any modifications to critical data—such as swapping the core URL—may trigger a brief secondary review by our moderation team. This strictly prevents bad actors from bait-and-switching legitimate software with malicious links.
                </p>
            </DocsCallout>

            <h2>2. Preserving Your SEO and Ratings</h2>
            <p>
                When you edit a tool, you are only updating its metadata. Your tool's unique URL (slug), its accumulated views, and all of its Community Reviews remain completely intact. You never lose your hard-earned SEO ranking or social proof by updating your pricing or screenshots.
            </p>

            

            <h2>3. Deleting a Listing</h2>
            <p>
                If your software is deprecated, sunsetted, or acquired, you can permanently delete the listing directly from the Maker Dashboard. We believe you should have absolute control over your digital footprint.
            </p>
            
            <DocsFAQ>
                <DocsFAQItem question="Is there an approval process for edits?">
                    Minor edits (like fixing a typo or updating pricing) go live instantly. However, if you change core data like the primary Tool Name or the target URL, the tool will temporarily enter 'Pending' status until approved by our moderators to prevent bait-and-switch tactics.
                </DocsFAQItem>
                <DocsFAQItem question="How often can I edit my tool?">
                    You can edit your tool as frequently as you like. We encourage Founders to keep their listings as up-to-date as possible to ensure users get accurate pricing and feature information.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Maker Dashboard", href: "/docs/dashboard" }}
                next={{ title: "Promotion Plans", href: "/docs/promotions" }}
            />
        </article>
    );
}
