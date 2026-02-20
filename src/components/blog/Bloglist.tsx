import { BlogPost } from '@/types/blog';
import BlogCard from './Blogcard';

interface BlogListProps {
  posts: BlogPost[];
  title?: string;
  showFeatured?: boolean;
}

export default function BlogList({
  posts,
  title = 'Derniers articles',
  showFeatured = true,
}: BlogListProps) {
  const featuredPost = showFeatured ? posts.find(post => post.featured) : null;
  const regularPosts = featuredPost
    ? posts.filter(post => post.id !== featuredPost.id)
    : posts;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            {title}
          </h2>
        )}

        {/* Article à la une */}
        {featuredPost && (
          <div className="mb-12">
            <BlogCard post={featuredPost} featured />
          </div>
        )}

        {/* Grille d'articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Message si aucun article */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun article disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
