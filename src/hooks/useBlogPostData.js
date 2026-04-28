import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { blogService } from '../services/blogService';
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
                const { data: postData, error: postError } = await blogService.getPostById(id);
                if (postError) throw postError;
                if (mounted) setPost(postData);

                // Fetch Related
                if (postData && mounted) {
                    const { data: related } = await blogService.getRelatedPosts(postData.category, postData.id);
                    if (mounted) setRelatedPosts(related || []);
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

    return {
        post,
        relatedPosts,
        loading,
        error
    };
};
