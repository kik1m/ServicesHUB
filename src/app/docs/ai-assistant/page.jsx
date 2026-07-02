import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'HUBly AI Engine | HUBly Docs',
    description: 'Learn how to leverage the HUBly AI Engine to discover tools, build tech stacks, and make strategic decisions with dynamic conversational AI.',
    url: 'https://www.hubly-tools.com/docs/ai-engine'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>HUBly AI Engine & Copilot</h1>
            <p>
                The <strong>HUBly AI Engine</strong> is a state-of-the-art conversational agent built explicitly for software discovery and strategic decision-making. Operating far beyond a simple search bar, it acts as a highly knowledgeable, somewhat opinionated tech consultant that helps you navigate the noise of the SaaS ecosystem.
            </p>

            <DocsImage 
                src="/docs-ai-chat.png" 
                alt="HUBly AI Engine Interface" 
                caption="The dedicated AI Engine interface handling deep contextual queries and managing smart sessions." 
            />

            <h2>1. Accessing the AI Engine</h2>
            <p>
                The AI Engine has its own dedicated workspace on the platform. You can access it by navigating directly to <strong>/ai-engine</strong> or by clicking the AI Studio buttons distributed throughout the directory. The interface is split into a robust Chat Area and a comprehensive Session Management Sidebar.
            </p>

            <h2>2. Session Management</h2>
            <p>
                Unlike basic chatbots that lose context upon refresh, the HUBly AI Engine operates on a <strong>Persistent Session Architecture</strong>:
            </p>
            <ul>
                <li><strong>Multiple Sessions:</strong> You can create independent chat sessions for different projects (e.g., "Marketing Stack" vs "DevOps Tools").</li>
                <li><strong>Auto-titling:</strong> Once you start a conversation, the AI automatically analyzes the context and generates a relevant, short title for your session.</li>
                <li><strong>Session History:</strong> All your past sessions are securely stored in the sidebar. You can rename them, delete them, or click on them to instantly restore the entire chat history.</li>
            </ul>

            <h2>3. Dynamic AI Settings</h2>
            <p>
                You have unprecedented control over the AI's behavior via the <strong>Settings Modal</strong> located at the top of your active session:
            </p>
            <ul>
                <li><strong>Language Control:</strong> Force the AI to speak entirely in <strong>English</strong> or <strong>Arabic</strong>, or leave it on "Auto" to mirror your language perfectly.</li>
                <li><strong>Tone of Voice:</strong> Need a quick answer? Set the tone to <strong>Concise</strong>. Want a deep architectural breakdown? Choose <strong>Detailed</strong>. Looking for inspiration? Try the <strong>Creative</strong> tone.</li>
            </ul>

            <DocsCallout type="info" title="Zero-Downtime Infrastructure">
                <p>
                    The HUBly AI Engine operates on an advanced <strong>Key-Rotation Architecture</strong>. If one underlying API provider hits a rate limit, the system instantly switches to backup keys in milliseconds, ensuring you never experience downtime during a critical research session.
                </p>
            </DocsCallout>

            <h2>4. Usage Limits & Fair Use</h2>
            <p>
                To maintain lightning-fast response times and cover substantial infrastructure costs, usage limits apply:
            </p>
            <ul>
                <li><strong>Standard Users:</strong> Allowed a maximum of <strong>10 AI responses every 12 hours</strong>. The limit resets automatically.</li>
                <li><strong>HUBly Pro Members:</strong> Enjoy unlimited messages, priority queue access during peak hours, and deeper analytical responses.</li>
            </ul>

            <DocsFAQ>
                <DocsFAQItem question="Can the AI compare tools directly?">
                    Yes! You can ask "Compare Framer vs Webflow" and the AI will break it down. However, for a fully automated, side-by-side data matrix, we highly recommend using the dedicated Compare Builder page, which features an "AI Verdict" based on live API data.
                </DocsFAQItem>
                <DocsFAQItem question="Does the AI hallucinate?">
                    While our AI is heavily aligned to our directory data and instructed to reject speculative answers, it is still a probabilistic model. Always verify critical pricing or feature data on the tool's official website before making financial decisions.
                </DocsFAQItem>
                <DocsFAQItem question="Are my prompts private?">
                    Absolutely. Your prompts are stored securely under enterprise-grade database policies (RLS). We do NOT use your private chat history to train the base AI models.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Global Search", href: "/docs/search" }}
                next={{ title: "Compare Builder", href: "/docs/compare" }}
            />
        </article>
    );
}
