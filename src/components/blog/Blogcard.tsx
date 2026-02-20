import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const priorityConfig = {
  urgent: {
    badge: '🚨 URGENT',
    bgColor: 'bg-red-600',
    borderColor: 'border-red-500',
    textColor: 'text-red-600',
  },
  important: {
    badge: '⚠️ IMPORTANT',
    bgColor: 'bg-orange-600',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-600',
  },
  normal: {
    badge: '📌 INFO',
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600',
  },
};

const categoryConfig = {
  événement: { icon: '🎉', color: 'bg-purple-100 text-purple-700' },
  actualité: { icon: '📰', color: 'bg-blue-100 text-blue-700' },
  urgence: { icon: '🚨', color: 'bg-red-100 text-red-700' },
  information: { icon: 'ℹ️', color: 'bg-green-100 text-green-700' },
  communiqué: { icon: '📢', color: 'bg-gray-100 text-gray-700' },
};

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const priority = priorityConfig[post.priority];
  const category = categoryConfig[post.category];

  return (
    <article
      className={`group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        featured ? 'md:col-span-2 border-l-4' : 'border-l-4'
      } ${priority.borderColor}`}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge priorité */}
          <div
            className={`absolute top-4 left-4 ${priority.bgColor} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
          >
            {priority.badge}
          </div>

          {/* Badge featured */}
          {post.featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              ⭐ À la une
            </div>
          )}

          {/* Date d'expiration pour les urgences */}
          {post.expiresAt && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-red-600 px-4 py-2 rounded-full text-xs font-semibold">
              ⏰ Expire le{' '}
              {new Date(post.expiresAt).toLocaleDateString('fr-FR')}
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Catégorie et tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className={`text-sm ${category.color} px-3 py-1 rounded-full font-medium`}
            >
              {category.icon} {post.category}
            </span>
            {post.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Titre */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

          {/* Meta informations */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <FiUser size={16} />
                <span className="font-medium">{post.author.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiCalendar size={16} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock size={16} />
                <span>{post.readingTime} min</span>
              </div>
            </div>
          </div>

          {/* Rôle de l'auteur */}
          <div className="mt-2">
            <p className="text-xs text-gray-500 italic">{post.author.role}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
