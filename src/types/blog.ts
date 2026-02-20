// Types pour le blog de l'ambassade
export type PostPriority = 'urgent' | 'important' | 'normal';
export type PostCategory =
  | 'événement'
  | 'actualité'
  | 'urgence'
  | 'information'
  | 'communiqué';

export interface Author {
  id: string;
  name: string;
  role: string; // Fonction à l'ambassade
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  category: PostCategory;
  priority: PostPriority;
  tags: string[];
  readingTime: number; // en minutes
  featured?: boolean;
  expiresAt?: string; // Pour les urgences avec date d'expiration
}

export interface CreatePostDTO {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  category: PostCategory;
  priority: PostPriority;
  tags: string[];
  featured?: boolean;
  expiresAt?: string;
}

export interface UpdatePostDTO {
  title?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  author?: Author;
  category?: PostCategory;
  priority?: PostPriority;
  tags?: string[];
  featured?: boolean;
  expiresAt?: string;
}

export interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface BlogListProps {
  posts: BlogPost[];
  currentPage?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
