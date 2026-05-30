import React from 'react';
import styles from './docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../components/Docs/DocsUI';
import AboutFounderCard from '../../components/Docs/AboutFounderCard';

import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export async function generateMetadata() {
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.docs, 'page');
    return {
        title: dynamicSeo?.title || 'Welcome to HUBly Docs | The Ultimate AI Decision Engine',
        description: dynamicSeo?.description || 'The official documentation for HUBly. More than a directory, HUBly is an intelligent ecosystem for AI software discovery, comparison, and promotion.',
        url: 'https://www.hubly-tools.com/docs'
    };
}

export default function DocsWelcomePage() {
    return (
        <article className={styles.article}>
            <h1>Welcome to HUBly</h1>
            <p>
                Welcome to the official documentation center for <strong>HUBly</strong>. 
                HUBly was not built to be just another conventional "tool directory." It was architecturally designed from the ground up to be a <strong>Strategic Decision-Making Engine</strong>. 
                Our ultimate goal is to eliminate the choice paralysis and noise that professionals, businesses, and creators face when searching for the right AI and SaaS tools.
            </p>

            <DocsImage 
                src="/docs-home-overview.png" 
                alt="HUBly Platform Overview" 
                caption="HUBly Overview: A comprehensive ecosystem for making precise, data-driven technical decisions."
            />

            <h2>Our Core Philosophy (Beyond a Directory)</h2>
            <p>
                In a world where AI evolves exponentially and hundreds of new tools launch daily, finding the right software has become a massive time-sink. 
                That is why we built HUBly as an <strong>Intelligent Ecosystem</strong>. We leverage advanced algorithms and real-time data to provide a seamless, accurate, and clutter-free experience for both <strong>Seekers</strong> (users looking for tools) and <strong>Makers</strong> (founders promoting their software).
            </p>

            <DocsCallout type="info" title="An Environment of Absolute Quality">
                <p>
                    HUBly is governed by rigorous vetting algorithms. We do not accept every random submission. Instead, we manually and algorithmically review every tool to ensure it provides tangible value, guaranteeing our users experience "Quality" over "Quantity".
                </p>
            </DocsCallout>

            <h2>Meet the Founder</h2>
            <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
                <AboutFounderCard />
            </div>

            <h2>The Intelligent Systems of HUBly</h2>
            <p>
                The platform operates through a network of interconnected, state-of-the-art engines designed with global SaaS standards:
            </p>

            <h3>1. HUBly AI Engine & Copilot</h3>
            <p>
                At the heart of the platform sits the <strong>HUBly AI Engine</strong>. It operates far beyond simple keyword matching or standard chatbots. Acting as your dedicated software consultant, you can converse with the AI in isolated <strong>Sessions</strong>, dynamically control its language and tone, and rely on its massive context-awareness to recommend the precise tools that align flawlessly with your project's scope, budget, and technical requirements.
            </p>
            <DocsImage 
                src="/docs-ai-search-demo.png" 
                alt="HUBly AI Engine Interface" 
                caption="The dedicated AI Engine interface handling deep contextual queries and managing smart sessions."
            />

            <h3>2. Comparison Engine & Automated Verdict</h3>
            <p>
                The crown jewel of HUBly. Instead of opening dozens of browser tabs to compare software, our Comparison Engine fetches <strong>real-time technical and pricing data</strong> and places it side-by-side. Most importantly, our AI synthesizes this data to generate a definitive <strong>Verdict</strong>, telling you exactly which tool suits your specific use-case best.
            </p>
            <DocsImage 
                src="/docs-compare-matrix-demo.png" 
                alt="Comparison Engine Matrix" 
                caption="The Smart Comparison Engine generating an automated verdict based on deep data analysis."
            />

            <h3>3. Trust & Community Ecosystem</h3>
            <p>
                We believe deeply in authentic Social Proof. HUBly hosts an active, highly interactive community where users can create detailed public profiles, follow industry peers, and explore the favorite tools and curated tech stacks of other professionals. By viewing their connected social media accounts and verified tool reviews, you gain unprecedented transparency. This robust system eliminates fake reviews and provides new users with blind trust when choosing a tool backed by real experts.
            </p>
            <DocsImage 
                src="/docs-community-reviews.png" 
                alt="Community and Reviews" 
                caption="Live interactions, public profiles, and verified reviews within the HUBly community."
            />

            <h3>4. Curated Tech Stacks & Collections</h3>
            <p>
                As you navigate HUBly, you aren't just browsing—you are building. Our Collections feature allows you to save, categorize, and organize the tools you discover into customized "Tech Stacks." Whether you are building a stack for a marketing agency or a personal productivity suite, your collections are always one click away.
            </p>
            <DocsImage 
                src="/docs-collections-overview.png" 
                alt="Custom Tech Stacks" 
                caption="Organize your favorite tools into custom Collections and Tech Stacks."
            />

            <h3>5. The Launchpad (For Creators & Founders)</h3>
            <p>
                For software developers and founders, HUBly acts as a complete growth engine. Through our advanced Creator Dashboard and proprietary Promotion Algorithms, we guarantee your software reaches thousands of <strong>high-intent buyers</strong> at the exact moment they are looking for a solution like yours.
            </p>
            <DocsImage 
                src="/docs-creator-growth.png" 
                alt="Creator Dashboard and Growth" 
                caption="The Creator Dashboard allowing founders to monitor traffic, engagement, and conversion metrics."
            />

            <h3>6. Editorial Insights & Magazine</h3>
            <p>
                Making a decision isn't just about comparing features; it's about staying educated. The HUBly Magazine delivers deep dives, industry trends, and exclusive interviews with SaaS founders, ensuring you are always at the cutting edge of the AI ecosystem.
            </p>

            <h2>How to Read This Documentation?</h2>
            <p>
                We have structured this documentation center to thoroughly explain each of the sophisticated systems mentioned above. Whether you are a Seeker navigating the comparison matrix, or a Maker utilizing our premium promotion plans, you will find everything you need here. 
                Use the Sidebar navigation to explore the different sections of the platform.
            </p>

            <DocsCallout type="success" title="Ready to Dive In?">
                <p>
                    Use the sidebar on the left to navigate through specific tutorials, or simply start exploring the <strong>Global Directory</strong> to see these features in action.
                </p>
            </DocsCallout>

            

            <DocsFAQ>
                <DocsFAQItem question="Is HUBly completely free to use?">
                    Yes. Core discovery features, searching, comparing, and reading reviews are 100% free. We offer Premium Memberships only for power users who need advanced capabilities like unlimited AI searches.
                </DocsFAQItem>
                <DocsFAQItem question="Do I need an account to use the platform?">
                    You can browse the directory without an account. However, to leave reviews, save tools to your Tech Stack, use the AI Assistant, or submit your own software, you must create a free account.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                next={{ title: "Account & Settings", href: "/docs/account" }}
            />
        </article>
    );
}
