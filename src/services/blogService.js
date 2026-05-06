import { supabase } from '../lib/supabaseClient';

/**
 * Private normalization helper to ensure data contract stability
 * Rule #24.3: Data Sanitization
 */
const normalizePost = (post) => {
  if (!post) return null;
  return {
    ...post,
    title: post.title || 'Untitled Article',
    excerpt: post.excerpt || 'No description available.',
    category: post.category || 'General',
    author_name: post.author_name || 'ServicesHUB Team',
    image_url: post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=60',
    created_at: post.created_at || new Date().toISOString()
  };
};

/**
 * Service for handling all Blog related database interactions
 */
export const blogService = {
  /**
   * Fetch blog posts with filtering and pagination
   */
  async getPosts({ searchQuery, selectedCategory, page = 0, itemsPerPage = 6 }) {
    let query = supabase
      .from('blog_posts')
      .select('id, title, excerpt, image_url, category, author_name, created_at, slug');

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
    }

    if (selectedCategory && selectedCategory !== 'All') {
      query = query.eq('category', selectedCategory);
    }

    const from = page * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    return { 
      data: data ? data.map(normalizePost) : [], 
      error 
    };
  },

  /**
   * Fetch latest 3 posts for Home page preview
   */
  async getLatestPosts(limit = 3) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, image_url, category, created_at, slug')
      .order('created_at', { ascending: false })
      .limit(limit);

    return {
      data: data ? data.map(normalizePost) : [],
      error
    };
  },

  /**
   * Fetch a single blog post by its ID or Slug
   */
  async getPostByIdOrSlug(idOrSlug) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    
    const query = isUuid 
      ? supabase.from('blog_posts').select('*').eq('id', idOrSlug)
      : supabase.from('blog_posts').select('*').eq('slug', idOrSlug);

    const { data, error } = await query.maybeSingle();

    return {
      data: normalizePost(data),
      error
    };
  },

  /**
   * Fetch all blog categories
   */
  async getCategories() {
    return supabase
      .from('blog_categories')
      .select('name');
  },

  /**
   * Fetch related posts based on category
   */
  async getRelatedPosts(category, excludeId, limit = 2) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, image_url')
      .eq('category', category)
      .neq('id', excludeId)
      .limit(limit);

    return {
      data: data ? data.map(normalizePost) : [],
      error
    };
  }
};
