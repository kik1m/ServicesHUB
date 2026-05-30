import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Social Following & Networking | HUBly Docs',
    description: 'Documentation on the HUBly social graph, demonstrating how following industry peers accelerates software discovery.',
    url: 'https://www.hubly-tools.com/docs/social'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>Social Following & Networking</h1>
            <p>
                HUBly transcends the traditional concept of a static software directory by functioning as a <strong>living social network</strong>. 
                Because every user has a public profile, we have integrated a robust "Following" system designed to connect Seekers, Makers, and Industry Experts.
            </p>

            <DocsImage 
                src="/docs-social-modal.png" 
                alt="Social Following Interface" 
                caption="The Social List Modal displaying followers, verified badges, and professional roles." 
            />

            <h2>1. The Follow System</h2>
            <p>
                At the core of our community ecosystem is the Follow mechanism. Just like standard social networks (Twitter, LinkedIn), you can follow other users on HUBly. 
                However, the <strong>intent</strong> here is entirely professional and discovery-driven:
            </p>
            <ul>
                <li><strong>Following Experts:</strong> When you follow an industry peer, you can constantly monitor their "Favorite Collection" (Tech Stack). If a top-tier marketer favorites a new AI SEO tool, you discover it instantly.</li>
                <li><strong>Following Makers:</strong> By following software founders, you are essentially subscribing to their product catalog. You can track their new software releases and major updates natively within the platform.</li>
            </ul>

            <DocsCallout type="info" title="The Follower Graph">
                <p>
                    Your follower count is a direct indicator of your authority on the platform. High-follower profiles often have their tool reviews weighted more heavily by the community, as they represent trusted voices.
                </p>
            </DocsCallout>

            <h2>2. Exploring Connections (The Social Modal)</h2>
            <p>
                Transparency is key to a trusted ecosystem. By clicking on the "Followers" or "Following" count on any user's profile, the <strong>Social List Modal</strong> will appear. 
                This interface allows you to:
            </p>
            <ul>
                <li>View exactly who is following a specific expert or tool maker.</li>
                <li>Identify <strong>Verified Users</strong> instantly via the blue verification badge.</li>
                <li>See the professional <strong>Role</strong> of each connection (e.g., Founder, Marketer, Developer).</li>
                <li>Navigate directly to any connection's public profile with a single click to explore their tech stacks.</li>
            </ul>

            <h2>3. Discovering Through the Network</h2>
            <p>
                When you visit the profile of someone you follow, you can view their exact <strong>Tech Stack</strong> (the tools they have favorited). This creates an incredibly organic discovery process; instead of relying on ads, you discover the tools that your peers actually use.
            </p>

            

            <DocsFAQ>
                <DocsFAQItem question="Will users know if I follow them?">
                    Yes. Users receive an on-platform notification when someone new follows their profile.
                </DocsFAQItem>
                <DocsFAQItem question="Can I block a follower?">
                    Currently, the social graph is completely open to encourage networking. If a user violates community guidelines, you can report them to our moderation team for review.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Public Profile", href: "/docs/profile" }}
                next={{ title: "Global Search", href: "/docs/search" }}
            />
        </article>
    );
}
