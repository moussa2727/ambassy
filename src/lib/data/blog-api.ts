import { BlogPost } from '@/types/blog';
import {
  getAllPosts as getAllStaticPosts,
  getPostById as getStaticPostById,
} from '@/lib/data/blog-data';

// Interface pour l'API response
interface BlogPostAPIResponse {
  success: boolean;
  data: BlogPost[];
  total?: number;
}

interface BlogPostResponse {
  success: boolean;
  data: BlogPost;
}

// Obtenir tous les articles depuis l'API avec fallback vers les données statiques
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const result: BlogPostAPIResponse = await response.json();

    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }

    return result.data;
  } catch (error) {
    console.error(
      'Error fetching posts from API, falling back to static data:',
      error
    );
    // Fallback to static data
    return getAllStaticPosts();
  }
}

// Obtenir un article par slug depuis l'API avec fallback
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Since we don't have a slug-based API endpoint, we'll fetch all and filter
    const posts = await getAllPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error(
      'Error fetching post by slug, falling back to static data:',
      error
    );
    // Fallback to static data
    const posts = getAllStaticPosts();
    return posts.find(post => post.slug === slug) || null;
  }
}

// Obtenir un article par ID depuis l'API
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog/${id}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const result: BlogPostResponse = await response.json();

    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    // Fallback to static data - try both ID and slug
    const staticPost =
      getStaticPostById(id) || getAllStaticPosts().find(p => p.slug === id);
    return staticPost || null;
  }
}

// Obtenir les articles par catégorie depuis l'API
export async function getPostsByCategory(
  category: string
): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog?category=${encodeURIComponent(category)}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch posts by category: ${response.statusText}`
      );
    }

    const result: BlogPostAPIResponse = await response.json();

    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
}

// Obtenir les articles par priorité depuis l'API
export async function getPostsByPriority(
  priority: string
): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog?priority=${encodeURIComponent(priority)}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch posts by priority: ${response.statusText}`
      );
    }

    const result: BlogPostAPIResponse = await response.json();

    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching posts by priority:', error);
    return [];
  }
}

// Obtenir les articles par tag depuis l'API
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog?tag=${encodeURIComponent(tag)}`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts by tag: ${response.statusText}`);
    }

    const result: BlogPostAPIResponse = await response.json();

    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching posts by tag:', error);
    return [];
  }
}

// Obtenir les articles featured depuis l'API
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog?featured=true`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch featured posts: ${response.statusText}`);
    }

    const result: BlogPostAPIResponse = await response.json();

    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

// Obtenir les statistiques depuis l'API
export async function getStats() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blog?stats=true`,
      {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      total: 0,
      byCategory: {},
      byPriority: {},
    };
  }
}
