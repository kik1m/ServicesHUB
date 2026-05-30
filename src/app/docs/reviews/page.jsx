import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Managing Reviews & Feedback | HUBly Docs',
    description: 'A guide for Founders on how to professionally manage community reviews, reply to feedback, and utilize criticism to improve their software.',
    url: 'https://www.hubly-tools.com/docs/reviews'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>Managing Reviews & Feedback</h1>
            <p>
                Your software's rating on HUBly is not just a number; it is public social proof. 
                As a Founder, engaging with the community through the review section is one of the most powerful marketing tactics you can deploy. 
                This guide explains how to properly manage your digital reputation on the platform.
            </p>

            <DocsImage 
                src="/docs-manage-reviews.png" 
                alt="Replying to Reviews" 
                caption="Founders can reply directly to user reviews, building trust and resolving issues publicly." 
            />

            <h2>1. The Power of the Reply</h2>
            <p>
                When a user leaves a review—whether it is a glowing 5-star praise or a critical 2-star bug report—you have the ability to reply directly beneath it. 
                <strong>Buyers read replies.</strong> When potential customers see a Founder actively thanking users or quickly addressing concerns, it signals that the software is actively maintained and backed by excellent customer support.
            </p>

            <DocsCallout type="tip" title="Handling Negative Reviews">
                <p>
                    Do not panic over a bad review. Use it as an opportunity. If a user complains about a missing feature, reply professionally stating that it is on your roadmap. When you eventually build that feature, reply again. A handled negative review often builds more trust than a generic positive one.
                </p>
            </DocsCallout>

            <h2>2. The Feedback Loop</h2>
            <p>
                The HUBly community consists of elite marketers, developers, and founders. The feedback you receive here is highly technical and actionable. 
                We highly recommend treating your HUBly review section as a direct extension of your product roadmap. If multiple experts request a specific API integration in their reviews, that is free, validated market research for your next sprint.
            </p>

            <h2>3. Moderation & Dispute Resolution</h2>
            <p>
                While we champion free speech, we do not tolerate abuse, hate speech, or review bombing from competitors. 
                If you believe a review violates our Community Guidelines (e.g., contains malicious links or is demonstrably false), you can click the <strong>Report</strong> flag next to the review. 
                Our editorial team will manually investigate the claim. However, we will never remove a legitimate critical review simply because a Founder disagrees with it. Transparency remains our ultimate priority.
            </p>
            
            <h2>4. Maker Interactions</h2>
            <p>
                Founders (Makers) can reply directly to reviews left on their tools. We strongly encourage this! If a user leaves a 2-star review due to a missing feature, and you subsequently build that feature, replying to their review shows the community that your team is active and responsive.
            </p>

            

            <DocsFAQ>
                <DocsFAQItem question="Can I delete or edit a review I wrote?">
                    Yes. You can edit or delete your review at any time from your Public Profile or by revisiting the tool's page. The overall star rating of the tool will instantly recalculate.
                </DocsFAQItem>
                <DocsFAQItem question="How do I report a fake or abusive review?">
                    Every review has a 'Report Flag' icon. Clicking this alerts our editorial team, who will investigate the review for violations of our Community Guidelines.
                </DocsFAQItem>
                <DocsFAQItem question="Can a Maker delete bad reviews?">
                    Never. Makers have absolutely no power to delete or hide negative reviews on their tools. The integrity of our rating system is our highest priority.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Premium Memberships", href: "/docs/premium" }}
                next={{ title: "Terms of Service", href: "/docs/terms" }}
            />
        </article>
    );
}
