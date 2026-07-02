import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Public Profile | HUBly Docs',
    description: 'Documentation for setting up and leveraging your HUBly Public Profile to build authority and showcase your AI tech stack.',
    url: 'https://www.hubly-tools.com/docs/profile'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>The Public Profile</h1>
            <p>
                On HUBly, your <strong>Public Profile</strong> is more than just a settings page—it is your professional portfolio and social proof engine. 
                Whether you are an industry expert curating the best AI tools, or a founder showcasing your software, your profile serves as the ultimate anchor for trust and authority within the ecosystem.
            </p>
            
            <DocsImage 
                src="/docs-public-profile.png" 
                alt="HUBly Public Profile" 
                caption="A highly interactive public profile displaying social metrics and curated collections." 
            />

            <h2>1. The Profile Hero (Identity & Trust)</h2>
            <p>
                The top section of your profile acts as your digital business card. It displays your avatar, professional bio, location, and verified social links (GitHub, Twitter, Website). 
                This transparency is crucial. When users see your connected accounts and read your biography, the reviews you leave and the tools you recommend instantly gain significant credibility. 
                Additionally, this section displays your <strong>Followers</strong> and <strong>Following</strong> metrics, allowing you to build an audience directly on the platform.
            </p>

            <DocsCallout type="tip" title="Pro Tip: Share Your Link">
                <p>
                    Every profile has a unique shareable URL (`/u/your-id`). You can use the "Copy Link" button to easily share your curated tech stack or portfolio on Twitter/X, LinkedIn, or your personal blog.
                </p>
            </DocsCallout>

            <h2>2. The Maker's Portfolio (Published Tools)</h2>
            <p>
                For software founders and creators, the <strong>Published Tools</strong> tab is your ultimate storefront. 
                Any tool you submit and successfully publish on HUBly will automatically be listed here. This allows potential buyers and investors to see your entire product catalog in one unified, professional view, complete with real-time ratings and engagement metrics.
            </p>

            <h2>3. Curated Tech Stacks (Favorites)</h2>
            <p>
                The <strong>Favorite Collection</strong> tab transforms your profile from a simple portfolio into a highly valuable resource for others. 
                Every time you save or "favorite" a tool while browsing HUBly, it is added to this collection. Over time, you build a highly curated "Tech Stack" of your preferred AI tools, software, and services. 
                Other professionals can visit your profile specifically to discover what tools an expert like you relies on daily.
            </p>

            <DocsImage 
                src="/docs-profile-tabs.png" 
                alt="Profile Portfolio Tabs" 
                caption="Seamlessly toggle between a creator's published software and their highly curated favorite tools." 
            />

            <h2>4. Building an Audience</h2>
            <p>
                Because your profile hosts both your creations and your recommendations, HUBly allows other users to <strong>Follow</strong> you. 
                Building a follower base ensures that whenever you publish a new tool or discover a hidden gem, your audience is the first to know. 
                (We will dive deeper into how this interactive networking functions in the next section).
            </p>

            <DocsCallout type="tip" title="Link Your Startup">
                <p>
                    If you are a Founder, make sure your "Website" link points directly to your startup's homepage. A well-curated Public Profile on HUBly can drive significant organic traffic to your own projects.
                </p>
            </DocsCallout>

            
            
            <DocsFAQ>
                <DocsFAQItem question="Can I make my profile private?">
                    By design, HUBly profiles are public to foster a transparent community where reviews can be verified by viewing the reviewer's background. If you do not wish to be public, we recommend only browsing without an account.
                </DocsFAQItem>
                <DocsFAQItem question="How do I change my profile picture?">
                    If you logged in via Google or GitHub, we sync your avatar automatically. You can update your custom avatar directly in the Account Settings tab.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Account & Settings", href: "/docs/account" }}
                next={{ title: "Social Following", href: "/docs/social" }}
            />
        </article>
    );
}
