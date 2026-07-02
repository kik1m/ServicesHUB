import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import { MDXRemote } from 'next-mdx-remote/rsc';
import styles from '../docsContent.module.css';
import { DocsCallout, DocsImage, DocsNav, DocsFAQ, DocsFAQItem } from '../../../components/Docs/DocsUI';

// Mapping MDX components to our custom UI components
const components = {
    DocsImage,
    DocsCallout,
    DocsFAQ,
    DocsFAQItem,
    DocsNav,
    img: (props) => <DocsImage src={props.src} alt={props.alt} caption={props.alt} />
};

export async function generateMetadata({ params }) {
    const { slug } = params;
    const { data } = await supabase.from('platform_docs').select('title').eq('slug', slug).single();
    
    if (!data) return { title: 'Not Found | HUBly Docs' };
    
    return {
        title: `${data.title} | HUBly Docs`,
        description: `Documentation for ${data.title} on HUBly.`,
    };
}

export default async function DynamicDocsPage({ params }) {
    const { slug } = params;

    const { data: doc, error } = await supabase
        .from('platform_docs')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !doc) {
        notFound();
    }

    return (
        <article className={styles.article}>
            <h1>{doc.title}</h1>
            <MDXRemote source={doc.content} components={components} />
        </article>
    );
}
