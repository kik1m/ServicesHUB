import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'The Compare Builder | HUBly Docs',
    description: 'Learn how to use HUBly’s intelligent Compare Builder to make data-driven, side-by-side software decisions.',
    url: 'https://www.hubly-tools.com/docs/compare'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>The Compare Builder</h1>
            <p>
                Making the wrong software choice can cost your business thousands of dollars and months of lost productivity. 
                The <strong>Compare Builder</strong> is a highly intelligent, side-by-side analysis engine that strips away marketing fluff and presents raw data so you don't have to jump between browser tabs.
            </p>

            <DocsImage 
                src="/docs-compare-builder.png" 
                alt="Compare Builder Interface" 
                caption="The Contextual Wizard guiding you through selecting two competitors for a head-to-head match." 
            />

            <h2>1. Initiating a Comparison</h2>
            <p>
                There are two primary ways to start comparing tools:
            </p>
            <ul>
                <li><strong>From a Tool Card:</strong> While browsing the directory, you will notice a "Compare" icon (resembling a Git branch <code>⑂</code>) on every tool card. Clicking this sets that tool as "Tool A" and opens the selection wizard for Tool B.</li>
                <li><strong>From the Compare Page:</strong> You can navigate directly to <code>/compare</code> and use the empty search slots to manually select Tool A and Tool B.</li>
            </ul>

            <h2>2. The Contextual Selection Wizard</h2>
            <p>
                Choosing the second tool shouldn't be a chore. Our Compare Builder operates with <strong>Contextual Intelligence</strong>. 
                The moment you select your first tool (e.g., an SEO platform), the engine instantly adapts. When asking you to pick the second tool, the dropdown will automatically filter the directory to show you <em>only direct competitors</em> in the SEO category.
            </p>

            <h2>3. Reading the Head-to-Head Matrix</h2>
            <p>
                Once both tools are selected, HUBly generates a pristine Comparison Matrix. Here is how to read the data:
            </p>
            <ul>
                <li><strong>Pricing Row:</strong> Direct side-by-side display of starting prices and models (e.g., Freemium vs. Subscription).</li>
                <li><strong>Feature Breakdown:</strong> A clean list of features with visual indicators (✓ and ✕) showing exactly what each tool offers out of the box.</li>
                <li><strong>Community Ratings:</strong> Side-by-side aggregation of total reviews and exact star ratings to determine which tool is more trusted by the HUBly community.</li>
                <li><strong>AI Engine Verdict:</strong> An automated, deeply analytical summary generated live by the HUBly AI Engine, highlighting the distinct advantages of each tool and declaring an objective winner based on your specific use-case. The verdict is rendered in beautiful rich-text Markdown for easy reading.</li>
            </ul>

            <DocsCallout type="tip" title="Share with Your Team">
                <p>
                    Every comparison generates a unique, synchronized URL (e.g., <code>/compare?toolA=123&toolB=456</code>). You can instantly copy this link from your browser and send it to your manager or team to justify a purchasing decision. They will see the exact same matrix you built.
                </p>
            </DocsCallout>

            
            
            <DocsFAQ>
                <DocsFAQItem question="Can I compare more than two tools at once?">
                    Currently, the Compare Builder is optimized for head-to-head (1-vs-1) analysis to ensure the matrix remains clean and highly readable on all screen sizes, particularly mobile devices.
                </DocsFAQItem>
                <DocsFAQItem question="Why can't I find a specific tool to compare?">
                    The Contextual Wizard automatically filters the second tool to match the exact category of the first tool. If you select an 'Email Marketing' tool first, you cannot compare it against a 'Video Editing' tool, as the feature sets do not align.
                </DocsFAQItem>
                <DocsFAQItem question="Are the comparison results biased?">
                    Never. The Compare Builder is a 100% data-driven matrix. We do not manipulate the layout or hide features to favor one tool over another, even if one of the tools has purchased a Promotion Plan.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "AI Assistant", href: "/docs/ai-assistant" }}
                next={{ title: "Favorites & Collections", href: "/docs/collections" }}
            />
        </article>
    );
}
