import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { toolsService } from '../services/toolsService';
import { BLOG_CONSTANTS } from '../constants/blogConstants';
import { useSEO } from './useSEO';

/**
 * Custom hook for managing the blog post detail page logic
 * Rule #1: Logic Isolation
 */
export const useBlogPostData = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Rule #30: Unified SEO management
    useSEO({
        title: post ? `${post.title}${BLOG_CONSTANTS.SEO.POST_TITLE_SUFFIX}` : BLOG_CONSTANTS.SEO.LIST_TITLE,
        description: post?.excerpt,
        image: post?.image_url,
        type: BLOG_CONSTANTS.SEO.OG_TYPE
    });

    useEffect(() => {
        let mounted = true;

        const fetchPostAndRelated = async () => {
            setLoading(true);
            try {
                // Fetch Post
                const { data: postData, error: postError } = await blogService.getPostByIdOrSlug(id);
                if (postError) throw postError;
                if (mounted) setPost(postData);

                // Fetch Related
                if (postData && mounted) {
                    const { data: related } = await blogService.getRelatedPosts(postData.category, postData.id);
                    
                    // Rule #44: Fetch embedded tool details
                    const toolIds = [...postData.content.matchAll(/\[tool id="([^"]+)"\]/g)].map(m => m[1]);
                    if (toolIds.length > 0) {
                        const { data: embeddedTools } = await toolsService.getToolsByIds(toolIds);
                        postData.embeddedTools = embeddedTools || [];
                    }

                    if (mounted) {
                        setPost(postData);
                        setRelatedPosts(related || []);
                    }
                }
            } catch (err) {
                console.error('Fetch post error:', err);
                if (mounted) setError(err.message || BLOG_CONSTANTS.POST.ERROR_NOT_FOUND);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchPostAndRelated();
        return () => { mounted = false; };
    }, [id]);

    const calculateReadingTime = (content) => {
        if (!content) return 0;
        const wordsPerMinute = 200;
        const text = content.replace(/<[^>]*>/g, ''); // Remove HTML
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    return {
        post,
        relatedPosts,
        loading,
        error,
        readingTime: calculateReadingTime(post?.content)
    };
};
