import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Global Search & Filtering | HUBly Docs',
    description: 'Master the HUBly Omnibox and advanced filtering sidebar to pinpoint the exact software you need in seconds.',
    url: 'https://www.hubly-tools.com/docs/search'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>Global Search & Filtering</h1>
            <p>
                Finding the right software among thousands of options can be overwhelming. HUBly’s Global Search is not just a standard search bar; it is an intelligent <strong>Omnibox</strong> designed to understand context and instantly filter out noise.
            </p>

            <DocsImage 
                src="/docs-search-omnibox.png" 
                alt="HUBly Global Search Omnibox" 
                caption="The central search Omnibox provides instant autocomplete suggestions as you type." 
            />

            <h2>1. Using the Omnibox</h2>
            <p>
                The Omnibox is prominently located at the top of the HUBly interface. Here is exactly how to use it:
            </p>
            <ul>
                <li><strong>Instant Autocomplete:</strong> As you begin typing a tool's name (e.g., "Figm..."), a dropdown will instantly appear showing the exact tool logo, name, and category. Clicking a result takes you directly to its detail page.</li>
                <li><strong>Category Searching:</strong> You do not need to know a tool's name. If you type "Video Editing", the Omnibox will suggest the top categories matching that intent. Pressing `Enter` will take you to the full results page for that category.</li>
                <li><strong>Keyboard Shortcut:</strong> Press <code>Ctrl + K</code> (or <code>Cmd + K</code> on Mac) from anywhere on the site to instantly focus the Omnibox without using your mouse.</li>
            </ul>

            <h2>2. The Advanced Filtering Sidebar</h2>
            <p>
                If your search query is broad (e.g., you searched for "Marketing" and got 500 results), you will be taken to the Search Results page. On the left side of this page is the <strong>Advanced Filtering Sidebar</strong>.
            </p>
            <p>This is where you narrow down your choices based on strict business requirements:</p>
            <ul>
                <li><strong>Pricing Filters:</strong> Check the "Free" or "Freemium" boxes to instantly hide tools that require an upfront enterprise subscription.</li>
                <li><strong>Rating Thresholds:</strong> Drag the slider to only show tools with a "4 Stars and Above" community rating.</li>
                <li><strong>Verified Only:</strong> Toggle this switch to exclusively see tools that have been manually verified by the HUBly editorial team.</li>
            </ul>

            <DocsCallout type="tip" title="Combining Filters">
                <p>
                    Filters stack dynamically. You can search for "SEO", select the "Free" pricing filter, and check "4+ Stars" simultaneously. The results grid will update in real-time without refreshing the page, saving you immense time.
                </p>
            </DocsCallout>

            <h2>3. Sorting Results</h2>
            <p>
                At the top right of the search grid, you will find a Sort dropdown. By default, results are sorted by <strong>Relevance</strong>. However, you can change this to <strong>Most Viewed</strong> to see what the community is currently obsessed with, or <strong>Newest</strong> to discover tools that launched this week.
            </p>

            
            
            <DocsFAQ>
                <DocsFAQItem question="Why does the search bar suggest categories?">
                    Our Omnibox is intent-driven. If it detects you are typing a generic term like 'Video', it suggests the Category 'Video Editing' to give you a comprehensive list of all tools in that vertical, rather than just tools with the word 'Video' in their name.
                </DocsFAQItem>
                <DocsFAQItem question="Are the search results influenced by paid promotions?">
                    Tools with the 'Market Authority' plan receive a slight ranking priority in generic searches to guarantee visibility, but their exact placement is still dictated by relevance to your keyword and their community rating.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Social Following", href: "/docs/social" }}
                next={{ title: "AI Assistant", href: "/docs/ai-assistant" }}
            />
        </article>
    );
}
