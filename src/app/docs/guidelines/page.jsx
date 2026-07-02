import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Community Guidelines | HUBly Docs',
    description: 'The code of conduct ensuring HUBly remains the most trusted, professional ecosystem for software discovery.',
    url: 'https://www.hubly-tools.com/docs/guidelines'
};

export default function DocsLegalPage() {
    return (
        <article className={styles.article}>
            <h1>Community Guidelines</h1>
            
            <p>
                HUBly is built on the foundation of <strong>Authentic Social Proof</strong>. To maintain the highest standard of quality for our Seekers and Makers, we strictly enforce these community guidelines. Violating them will result in account suspension or permanent banning.
            </p>

            <DocsCallout type="warning" title="Zero Tolerance for Fake Reviews">
                <p>
                    We actively monitor review patterns. Purchasing fake reviews, creating multiple alt-accounts to artificially boost your tool's rating, or review-bombing a competitor will result in an immediate, permanent ban and the removal of your software from the directory.
                </p>
            </DocsCallout>

            <h2>1. Professional Discourse</h2>
            <p>
                The HUBly community consists of elite software professionals. Treat everyone with respect. 
                When replying to a review or participating in a discussion, debate the <em>features</em>, not the <em>person</em>. Hate speech, harassment, and personal attacks are strictly forbidden.
            </p>

            <h2>2. No Spam or Self-Promotion Abuse</h2>
            <p>
                While Founders are encouraged to submit their tools, spamming the directory with multiple slightly altered variations of the same software is prohibited. 
                Similarly, dropping irrelevant links to your own product in the review sections of other tools is considered spam and will be removed.
            </p>

            <h2>3. Honest Representation</h2>
            <p>
                Makers must represent their software honestly. Do not claim your tool has a feature if that feature is "coming soon." Do not list your tool as "Free" if it requires a credit card upfront for a 3-day trial. Misrepresenting your software damages the trust of the entire ecosystem.
            </p>

            <h2>4. Reporting Violations</h2>
            <p>
                Community moderation is a collective effort. If you spot a tool that violates these guidelines, or a review that is clearly abusive, use the <strong>Report Flag</strong> icon found on the tool's page or directly on the review. Our editorial team investigates all reports within 24 hours.
            </p>

            <DocsCallout type="warning" title="Enforcement Actions">
                <p>
                    The HUBly moderation team reserves the right to remove content, suspend accounts, or permanently ban users and their associated IP addresses without prior notice if these guidelines are severely violated.
                </p>
            </DocsCallout>

            
            
            <DocsFAQ>
                <DocsFAQItem question="What happens if I accidentally violate a guideline?">
                    For minor infractions, such as using overly aggressive language in a review, our moderators will typically issue a warning and remove the specific comment rather than banning your account immediately.
                </DocsFAQItem>
                <DocsFAQItem question="How can I appeal an account ban?">
                    If you believe your account was suspended in error (e.g., falsely flagged by automated spam filters), you can submit an appeal to support@hubly-tools.com with your account details.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Privacy Policy", href: "/docs/privacy" }}
                next={{ title: "Welcome", href: "/docs" }}
            />
        </article>
    );
}
