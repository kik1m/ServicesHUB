import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '../lib/queryOptions';
import { BLOG_CONSTANTS } from '../constants/blogConstants';

/**
 * 🚀 Elite Blog Post Engine (React Query Optimized)
 * Rule #1: Logic Isolation
 */
export const useBlogPostData = ({ id, initialPost, initialRelatedPosts } = {}) => {
    const { data: post = null, isLoading: loadingPost, error: queryError } = useQuery({
        ...queryOptions.blogPost(id),
        initialData: initialPost,
        initialDataUpdatedAt: initialPost ? Date.now() : undefined,
    });

    const { data: relatedPosts = [], isLoading: loadingRelated } = useQuery({
        ...queryOptions.relatedPosts(post?.category, post?.id),
        initialData: initialRelatedPosts,
        initialDataUpdatedAt: initialRelatedPosts ? Date.now() : undefined,
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
