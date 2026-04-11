import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling all Blog related database interactions
 */
export const blogService = {
  /**
   * Fetch blog posts with filtering and pagination
   * @param {Object} filters - { searchQuery, selectedCategory, page, itemsPerPage }
   */
  async getPosts({ searchQuery, selectedCategory, page = 0, itemsPerPage = 6 }) {
    let query = supabase
      .from('blog_posts')
      .select('id, title, excerpt, image_url, category, author_name, created_at');

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
    }

    if (selectedCategory && selectedCategory !== 'All') {
      query = query.eq('category', selectedCategory);
    }

    const from = page * itemsPerPage;
    const to = from + itemsPerPage - 1;

    return query
      .order('created_at', { ascending: false })
      .range(from, to);
  },

  /**
   * Fetch latest 3 posts for Home page preview
   */
  async getLatestPosts(limit = 3) {
    return supabase
      .from('blog_posts')
      .select('id, title, image_url, category, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  /**
   * Fetch a single blog post by its ID (or slug)
   * @param {string} id - The post ID
   */
  async getPostById(id) {
    return supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
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
   * @param {string} category - The category to match
   * @param {string} excludeId - The current post ID to exclude
   * @param {number} limit - Number of related posts to fetch
   */
  async getRelatedPosts(category, excludeId, limit = 2) {
    return supabase
      .from('blog_posts')
      .select('id, title, image_url')
      .eq('category', category)
      .neq('id', excludeId)
      .limit(limit);
  }
};
