import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { blogService } from '../services/blogService';

/**
 * Custom hook for managing the blog post detail page logic
 */
export const useBlogPostData = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchPostAndRelated = async () => {
            setLoading(true);
            try {
                // Fetch Post
                const { data: postData, error: postError } = await blogService.getPostById(id);
                if (postError) throw postError;
                if (mounted) setPost(postData);

                // Enhanced SEO
                if (postData && mounted) {
                    const title = `${postData.title} | HUBly Magazine`;
                    const description = postData.excerpt || postData.title;
                    const imageUrl = postData.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=60';
                    const url = window.location.href;

                    document.title = title;

                    const updateMeta = (name, content, attr = 'name') => {
                        let element = document.querySelector(`meta[${attr}="${name}"]`);
                        if (!element) {
                            element = document.createElement('meta');
                            element.setAttribute(attr, name);
                            document.head.appendChild(element);
                        }
                        element.setAttribute('content', content);
                    };

                    updateMeta('description', description);
                    updateMeta('og:title', title, 'property');
                    updateMeta('og:description', description, 'property');
                    updateMeta('og:image', imageUrl, 'property');
                    updateMeta('og:url', url, 'property');
                    updateMeta('og:type', 'article', 'property');
                }

                // Fetch Related
                if (postData && mounted) {
                    const { data: related } = await blogService.getRelatedPosts(postData.category, postData.id);
                    if (mounted) setRelatedPosts(related || []);
                }
            } catch (err) {
                console.error('Fetch post error:', err);
                if (mounted) setError(err.message || 'Article not found');
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
