import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Maker Dashboard | HUBly Docs',
    description: 'Learn how to navigate the Maker Dashboard to track your software’s traffic, clicks, and marketing performance.',
    url: 'https://www.hubly-tools.com/docs/dashboard'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>The Maker Dashboard</h1>
            <p>
                Once your tool is submitted to HUBly, you are no longer flying blind. The <strong>Maker Dashboard</strong> is your personal mission control center, providing you with real-time analytics and management capabilities for all your published software.
            </p>

            <DocsImage 
                src="/docs-maker-dashboard.png" 
                alt="Maker Dashboard Interface" 
                caption="Track your software's performance, views, and active marketing campaigns in real-time." 
            />

            <h2>1. Performance Analytics</h2>
            <p>
                As a software founder, your primary goal is driving high-intent traffic to your product. The Dashboard provides crystal-clear metrics on how your tool is performing within the HUBly ecosystem:
            </p>
            <ul>
                <li><strong>Views:</strong> How many times users have opened your tool's detail page, read your Expert Verdict, or analyzed your pricing.</li>
                <li><strong>Clicks (Conversions):</strong> How many users clicked the "Visit Website" button and were successfully routed to your landing page.</li>
            </ul>

            <DocsCallout type="info" title="The Conversion Funnel">
                <p>
                    By monitoring the ratio between Views and Clicks, you can determine if your tool's description and pricing are compelling enough to convert HUBly traffic into actual leads.
                </p>
            </DocsCallout>

            <h2>2. Status & Marketing Tracking</h2>
            <p>
                The Dashboard table gives you a bird's-eye view of your entire portfolio's status. 
                You can instantly see if a recently submitted tool is still <strong>Pending</strong> or has been <strong>Published</strong>. 
            </p>
            <p>
                More importantly, if you have purchased a Promotion Plan, the Dashboard tracks your <strong>Active Marketing Campaigns</strong>. You will see shiny Verified/Featured badges next to promoted tools, along with a live countdown indicating exactly how many days are left on your premium promotion.
            </p>

            <DocsCallout type="tip" title="Act on the Data">
                <p>
                    If your tool is getting thousands of Impressions but very few Profile Views, your logo or Tagline might not be compelling enough. If you get many Profile Views but no "Clicks to Website," your pricing or feature description might need an overhaul.
                </p>
            </DocsCallout>

            

            <h2>3. The Command Center</h2>
            <p>
                From the actions column, you have absolute control over your listings. With a single click, you can view the live public page, permanently delete the listing if the software is discontinued, or jump into the Editor to update its features.
            </p>
            
            <DocsFAQ>
                <DocsFAQItem question="How often does the analytics data update?">
                    The Creator Dashboard aggregates data in near real-time. Impressions and views are updated instantly upon user interaction.
                </DocsFAQItem>
                <DocsFAQItem question="Can I invite team members to view my dashboard?">
                    Currently, dashboard access is tied to the single Maker account that submitted the tool. For agency-level management, please explore our Custom Promotion tier.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Submit a Tool", href: "/docs/submit" }}
                next={{ title: "Edit & Manage", href: "/docs/edit" }}
            />
        </article>
    );
}
