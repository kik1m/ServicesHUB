import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Verdict & Community Ratings | HUBly Docs',
    description: 'Learn how HUBly establishes absolute trust through structured expert analysis and transparent community reviews.',
    url: 'https://www.hubly-tools.com/docs/verdict'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>Verdict & Ratings</h1>
            <p>
                In an era dominated by fake reviews and paid sponsorships, discovering whether a software tool is genuinely good can be incredibly frustrating. 
                HUBly solves this trust crisis by combining structured <strong>Expert Verdicts</strong> with a hyper-transparent <strong>Community Rating Engine</strong>.
            </p>

            <DocsImage 
                src="/docs-reviews-engine.png" 
                alt="HUBly Reviews and Verdict Engine" 
                caption="The Reviews section, displaying verified community feedback and exact star ratings." 
            />

            <h2>1. The Structured Expert Verdict</h2>
            <p>
                When you visit any tool's detail page, you will notice that the information is not just a massive wall of marketing text. 
                Our platform uses a <strong>Smart Parsing Engine</strong> to break down the tool's description into highly scannable, objective sections:
            </p>
            <ul>
                <li><strong>Overview:</strong> What the tool actually does without the fluff.</li>
                <li><strong>Innovation:</strong> What makes this tool unique compared to competitors.</li>
                <li><strong>Impact:</strong> The real-world business value it delivers.</li>
                <li><strong>Summary (Verdict):</strong> The final objective conclusion on who should use this software.</li>
            </ul>

            <h2>2. The Community Rating Engine</h2>
            <p>
                While the expert verdict provides the foundation, the true test of any software is its performance in the real world. 
                Our Community Rating Engine allows users to leave detailed reviews and a 1-to-5 star rating. 
                To ensure absolute integrity, we implemented strict safeguards:
            </p>
            <ul>
                <li><strong>Authenticated Only:</strong> Only logged-in, verified HUBly members can submit a review. This eliminates bot farms and automated spam.</li>
                <li><strong>One Vote Per User:</strong> A user can only review a tool once, preventing review bombing or artificial inflation by the creators themselves.</li>
            </ul>

            <DocsCallout type="warning" title="Total Transparency">
                <p>
                    Every review is permanently attached to the reviewer's Public Profile. If you see a 5-star review, you can click on the user's name, see their role, verify their social links, and check their own Tech Stack. If the reviewer is not credible, their review holds no weight.
                </p>
            </DocsCallout>

            <h2>3. Community Discussions & Replies</h2>
            <p>
                We believe in open, fair discourse. The review section is not a one-way street; it is a collaborative discussion board. 
                <strong>Any registered user</strong> can reply to a review. Whether you are a Maker addressing a bug report on your tool, or a Seeker agreeing with another expert's analysis, you can converse directly beneath the ratings. This interactive layer builds immense trust and fosters a highly engaged software community.
            </p>

            <h2>4. Interacting in Discussions</h2>
            <p>
                Unlike static blogs, the Expert Verdict is dynamic. <strong>All users can leave comments and converse</strong> directly beneath the review. Whether you want to ask a question, challenge a claim, or agree with a point, the discussion section is open to everyone.
            </p>

            
            
            <DocsFAQ>
                <DocsFAQItem question="Are Expert Verdicts sponsored or paid for?">
                    No. The Expert Verdict is strictly editorial and cannot be bought. Even if a tool purchases the 'Market Authority' promotion plan, the review remains unbiased and critical.
                </DocsFAQItem>
                <DocsFAQItem question="I am a Maker. Can I request a re-review if I update my tool?">
                    Yes. If you push a major V2 update that addresses the critical flaws mentioned in our Verdict, you can contact our editorial team for a reassessment.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Favorites & Collections", href: "/docs/collections" }}
                next={{ title: "Submit a Tool", href: "/docs/submit" }}
            />
        </article>
    );
}
