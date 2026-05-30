import React from 'react';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

export const metadata = {
    title: 'Submit & Launch a Tool | HUBly Docs',
    description: 'A comprehensive guide for Makers on how to submit, publish, and launch their software on the HUBly ecosystem.',
    url: 'https://www.hubly-tools.com/docs/submit'
};

export default function DocsPage() {
    return (
        <article className={styles.article}>
            <h1>Submit & Launch a Tool</h1>
            <p>
                If you are a software founder, developer, or agency, HUBly is your ultimate growth engine. 
                Submitting your tool to our platform is the first step toward getting your product in front of thousands of high-intent buyers, investors, and industry experts.
            </p>

            <DocsImage 
                src="/docs-submit-form.png" 
                alt="Tool Submission Form Interface" 
                caption="The streamlined submission portal, designed to capture your software's best features." 
            />

            <h2>1. The Smart Submission Portal</h2>
            <p>
                We have engineered the submission process to be as fast and intuitive as possible while capturing enough detail to make your software shine in our Global Directory. 
                The submission form is divided into three core sections:
            </p>
            <ul>
                <li><strong>Basic Identity:</strong> The core metadata of your software. You will provide the Tool Name, the official URL, the Pricing Model (Free, Freemium, Paid), and select the most accurate Category so users can find you instantly.</li>
                <li><strong>Media Assets:</strong> Visuals sell software. You will upload a crisp Icon and a high-resolution hero image or screenshot that represents your product's UI.</li>
                <li><strong>Deep Details:</strong> This is where you convince the buyer. You will input your core features, target use-cases, and a comprehensive description. The description fully supports rich <strong>Markdown</strong> formatting, allowing you to build beautiful, highly structured presentation pages.</li>
            </ul>

            <DocsCallout type="tip" title="Optimize Your Description">
                <p>
                    Take advantage of our <strong>Markdown Engine</strong>. Use headers, bold text, lists, and code blocks to organize your description into scannable sections (Overview, Innovation, Impact) on your tool's page. The better formatted your page, the higher your conversion rate!
                </p>
            </DocsCallout>

            <h2>2. The Review & Approval Process</h2>
            <p>
                HUBly is an elite, highly curated ecosystem. We do not accept spam, unfinished products, or low-quality software. 
                Once you hit "Submit," your tool enters our moderation queue. Our internal team reviews the submission to ensure the links are valid, the images are high quality, and the tool delivers real value.
            </p>
            <p>
                Once approved, your tool goes live instantly. It will appear in Global Searches, become eligible for the Compare Builder, and can be saved to users' Tech Stacks.
            </p>

            <h2>3. Claiming an Existing Tool</h2>
            <p>
                Sometimes, our community members or editorial team might add a great tool to the directory before the founder even knows about it. 
                If you find your software already listed on HUBly, you can click the <strong>"Claim Tool"</strong> button on its page sidebar. After verifying your identity, we will transfer ownership of the listing to your account, giving you full access to its analytics and editing capabilities.
            </p>
            
            <DocsCallout type="warning" title="Quality Assurance">
                <p>
                    Ensure your links are correct, and your images are high resolution. Low-effort submissions (e.g., missing descriptions, broken links) will be rejected during the moderation phase to maintain directory quality.
                </p>
            </DocsCallout>

            

            <DocsFAQ>
                <DocsFAQItem question="How long does it take for a tool to be approved?">
                    Standard review takes 24-48 hours. Our editorial team manually verifies that the tool functions as described and does not violate our Terms of Service.
                </DocsFAQItem>
                <DocsFAQItem question="Can I submit a tool that I didn't create?">
                    Yes! You can hunt and submit great tools built by others. However, the original creator has the right to 'claim' the tool later via our support channel to take over its management.
                </DocsFAQItem>
            </DocsFAQ>
            
            <DocsNav 
                prev={{ title: "Expert Verdicts", href: "/docs/verdict" }}
                next={{ title: "Maker Dashboard", href: "/docs/dashboard" }}
            />
        </article>
    );
}
