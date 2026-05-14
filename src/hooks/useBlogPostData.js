import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { blogService } from '../services/blogService';
import { toolsService } from '../services/toolsService';
import { BLOG_CONSTANTS } from '../constants/blogConstants';

/**
 * 🚀 Elite Blog Post Engine (React Query Optimized)
 * Rule #1: Logic Isolation
 */
export const useBlogPostData = ({ id, initialPost, initialRelatedPosts } = {}) => {
    const { data: post = null, isLoading: loadingPost, error: queryError } = useQuery({
        queryKey: ['blog_post', id],
        queryFn: async () => {
            const { data: postData, error: postError } = await blogService.getPostByIdOrSlug(id);
            if (postError) throw postError;

            // Rule #44: Fetch embedded tool details
            const toolIds = [...(postData.content?.matchAll(/\[tool id="([^"]+)"\]/g) || [])].map(m => m[1]);
            if (toolIds.length > 0) {
                const { data: embeddedTools } = await toolsService.getToolsByIds(toolIds);
                postData.embeddedTools = embeddedTools || [];
            } else {
                postData.embeddedTools = [];
            }
            
            return postData;
        },
        initialData: initialPost,
        enabled: !!id,
        staleTime: 1000 * 60 * 10 // 10 minutes cache
    });

    const { data: relatedPosts = [], isLoading: loadingRelated } = useQuery({
        queryKey: ['blog_related', post?.category, post?.id],
        queryFn: async () => {
            const { data } = await blogService.getRelatedPosts(post.category, post.id);
            return data || [];
        },
        initialData: initialRelatedPosts,
        enabled: !!post?.category && !!post?.id,
        staleTime: 1000 * 60 * 60 // 1 hour cache
    });

    const error = queryError ? (queryError.message || BLOG_CONSTANTS.POST.ERROR_NOT_FOUND) : null;

    const readingTime = useMemo(() => {
        if (!post?.content) return 0;
        const wordsPerMinute = 200;
        const text = post.content.replace(/<[^>]*>/g, ''); // Remove HTML
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    }, [post?.content]);

    return {
        post,
        relatedPosts,
        loading: loadingPost || (!!post && loadingRelated),
        error,
        readingTime
    };
};
