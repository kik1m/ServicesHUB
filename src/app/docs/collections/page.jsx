import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Favorites & Collections | HUBly Docs',
    description: 'Learn how to transform your bookmarks into curated Tech Stacks to build authority and organize your digital workflow.',
    url: 'https://www.hubly-tools.com/docs/collections'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>Favorites & Tech Stacks</h1>
            <p>
                In the modern digital landscape, professionals rely on dozens of different SaaS tools daily. Keeping track of them in messy spreadsheets or browser bookmarks is outdated. 
                HUBly's <strong>Favorites & Collections</strong> system allows you to effortlessly curate, organize, and showcase the software that powers your business.
            </p>

            <DocsImage 
                src="/docs-collections-grid.png" 
                alt="Curated Tech Stack Grid" 
                caption="A beautifully organized grid of a user's favorite AI and SaaS tools." 
            />

            <h2>1. The Power of the Save Button</h2>
            <p>
                As you navigate the HUBly directory, you will notice a heart icon on every software card. Clicking this does not just "bookmark" the tool; it instantly adds it to your personal <strong>Tech Stack</strong>. 
                Whether you are browsing via the Global Search, comparing tools in the Matrix, or reading a blog post, you are always one click away from saving a valuable asset.
            </p>

            <h2>2. Personal Utility vs. Public Authority</h2>
            <p>
                The Collections system serves two powerful purposes simultaneously:
            </p>
            <ul>
                <li><strong>Personal Organization (Utility):</strong> You have a single, beautifully organized dashboard where all your critical software links, pricing details, and login portals are accessible.</li>
                <li><strong>Building Authority (Public):</strong> Because your favorites are displayed on your Public Profile, your collection acts as a recommendation engine for your followers. If you are a Senior Developer, junior developers will visit your profile specifically to see which coding tools and AI assistants you trust enough to keep in your stack.</li>
            </ul>

            <DocsCallout type="info" title="Social Proof in Action">
                <p>
                    When a tool is saved by hundreds of verified industry experts, it signals immense credibility to new users. By curating your favorites, you actively participate in HUBly's community-driven quality control.
                </p>
            </DocsCallout>

            <DocsCallout type="tip" title="Leverage Tags">
                <p>
                    Always use Tags! You might remember that you saved a great tool, but 6 months later, scrolling through 50 generic "Favorites" is inefficient. If you tagged it as "Next.js", you can find it instantly.
                </p>
            </DocsCallout>

            

            <h2>3. Seamless Synchronization</h2>
            <p>
                Your collections are synced instantly across all your devices. The moment you save an interesting tool on your mobile phone during a commute, it will be waiting in your Tech Stack grid when you open HUBly on your desktop at the office.
            </p>
            
            <DocsFAQ>
                <DocsFAQItem question="Is there a limit to how many tools I can save?">
                    No, there is currently no limit to the number of tools you can add to your Favorites or Collections.
                </DocsFAQItem>
                <DocsFAQItem question="Can I share my Collections with others?">
                    Because Collections form your 'Tech Stack' which is visible on your Public Profile, anyone who visits your profile can view your categorized collections.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Compare Builder", href: "/docs/compare" }}
                next={{ title: "Terms of Service", href: "/docs/terms" }}
            />
        </article>
    );
}
