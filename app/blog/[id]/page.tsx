import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPostById, getAllPosts } from '@/lib/data/blog-api';
import { BlogPost, BlogPageProps } from '@/types/blog';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowLeft,
  FiShare2,
  FiAlertTriangle,
  FiPhone,
  FiMail,
} from 'react-icons/fi';
import { getAllPosts as getAllStaticPosts } from '@/lib/data/blog-data';

// Générer les métadonnées dynamiques
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return {
      title: 'Article non trouvé',
    };
  }

  return {
    title: `${post.title} - Ambassade`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

// Générer les chemins statiques (optionnel pour SSG)
export async function generateStaticParams() {
  try {
    // Use static data directly for static generation to avoid API timeouts
    const posts = getAllStaticPosts();
    console.log(
      'Static posts found:',
      posts.map(p => p.slug)
    );
    const params = posts.map(post => ({
      id: post.slug,
    }));
    console.log('Generated static params:', params);
    return params;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

const priorityConfig = {
  urgent: {
    badge: '🚨 URGENT',
    bgColor: 'bg-red-600',
    borderColor: 'border-red-500',
    textColor: 'text-red-600',
    bannerBg: 'bg-red-50 border-red-200',
  },
  important: {
    badge: '⚠️ IMPORTANT',
    bgColor: 'bg-orange-600',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-600',
    bannerBg: 'bg-orange-50 border-orange-200',
  },
  normal: {
    badge: '📌 INFO',
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600',
    bannerBg: 'bg-blue-50 border-blue-200',
  },
};

const categoryConfig = {
  événement: {
    icon: '🎉',
    color: 'bg-purple-100 text-purple-700',
    label: 'Événement',
  },
  actualité: {
    icon: '📰',
    color: 'bg-blue-100 text-blue-700',
    label: 'Actualité',
  },
  urgence: { icon: '🚨', color: 'bg-red-100 text-red-700', label: 'Urgence' },
  information: {
    icon: 'ℹ️',
    color: 'bg-green-100 text-green-700',
    label: 'Information',
  },
  communiqué: {
    icon: '📢',
    color: 'bg-gray-100 text-gray-700',
    label: 'Communiqué',
  },
};

// Related posts section component
async function RelatedPostsSection({ currentPost }: { currentPost: BlogPost }) {
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter(
      (p: BlogPost) =>
        p.id !== currentPost.id &&
        (p.category === currentPost.category ||
          p.priority === currentPost.priority)
    )
    .slice(0, 2);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {relatedPosts.map((relatedPost: BlogPost) => (
        <Link
          key={relatedPost.id}
          href={`/blog/${relatedPost.slug}`}
          className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all"
        >
          <div className="flex gap-2 mb-3">
            <span
              className={`text-xs ${categoryConfig[relatedPost.category].color} px-3 py-1 rounded-full font-medium`}
            >
              {categoryConfig[relatedPost.category].icon}{' '}
              {categoryConfig[relatedPost.category].label}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {relatedPost.title}
          </h3>
          <p className="text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
        </Link>
      ))}
    </div>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  console.log('Loading page for slug:', slug);

  if (!slug) {
    console.log('No slug provided, returning 404');
    notFound();
  }

  const post = await getPostBySlug(slug);
  console.log('Post found:', post ? 'YES' : 'NO');

  if (!post) {
    console.log('Post not found, returning 404');
    notFound();
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const priority = priorityConfig[post.priority];
  const category = categoryConfig[post.category];

  return (
    <main className="min-h-screen bg-white">
      {/* Bouton retour */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
          >
            <FiArrowLeft size={20} />
            <span>Retour sur l'accueil</span>
          </Link>
        </div>
      </div>

      {/* Bannière de priorité */}
      {(post.priority === 'urgent' || post.priority === 'important') && (
        <div
          className={`border-b-4 ${priority.borderColor} ${priority.bannerBg}`}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4 max-w-4xl mx-auto">
              <FiAlertTriangle className={priority.textColor} size={32} />
              <div className="flex-1">
                <div
                  className={`inline-block ${priority.bgColor} text-white px-4 py-2 rounded-full text-sm font-bold mb-2`}
                >
                  {priority.badge}
                </div>
                <p className={`${priority.textColor} font-semibold`}>
                  {post.priority === 'urgent'
                    ? 'Cet article contient des informations urgentes nécessitant votre attention immédiate.'
                    : 'Information importante pour tous les ressortissants.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header de l'article */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Catégorie et tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span
              className={`text-sm ${category.color} px-4 py-2 rounded-full font-medium`}
            >
              {category.icon} {category.label}
            </span>
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-sm bg-gray-100 text-gray-700 px-4 py-2 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-blue-600 pl-6 italic">
            {post.excerpt}
          </p>

          {/* Meta informations */}
          <div className="flex flex-wrap items-center gap-6 pb-8 mb-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                {post.author.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-gray-900">
                    {post.author.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <FiCalendar size={16} />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock size={16} />
                <span>{post.readingTime} min de lecture</span>
              </div>
            </div>

            <div className="ml-auto">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Partager"
              >
                <FiShare2 size={18} />
                <span className="font-medium">Partager</span>
              </button>
            </div>
          </div>

          {/* Date d'expiration */}
          {post.expiresAt && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
              <div className="flex items-center gap-3">
                <FiAlertTriangle className="text-yellow-600" size={24} />
                <div>
                  <p className="font-semibold text-yellow-900">
                    ⏰ Information valable jusqu'au{' '}
                    {new Date(post.expiresAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-yellow-700">
                    Cette information a une date d'expiration. Vérifiez les
                    mises à jour régulièrement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Image de couverture */}
          <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Contenu de l'article */}
          <div className="prose prose-lg max-w-none">
            <div
              className="text-gray-800 leading-relaxed text-lg space-y-6"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .split('\n')
                  .map(line => line.trim())
                  .filter(line => line)
                  .map(line => {
                    if (line.startsWith('# '))
                      return `<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">${line.substring(2)}</h2>`;
                    if (line.startsWith('## '))
                      return `<h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">${line.substring(3)}</h3>`;
                    if (line.startsWith('### '))
                      return `<h4 class="text-xl font-bold text-gray-900 mt-6 mb-3">${line.substring(4)}</h4>`;
                    if (line.startsWith('- '))
                      return `<li class="ml-6">${line.substring(2)}</li>`;
                    if (line.startsWith('**') && line.endsWith('**'))
                      return `<p class="font-bold text-gray-900">${line.slice(2, -2)}</p>`;
                    return `<p class="text-gray-700 leading-relaxed">${line}</p>`;
                  })
                  .join(''),
              }}
            />
          </div>

          {/* Contact urgence pour les articles urgents */}
          {post.priority === 'urgent' && (
            <div className="mt-12 bg-red-50 border-2 border-red-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-3">
                <FiPhone size={28} />
                Besoin d'aide ?
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border border-red-200">
                  <h4 className="font-bold text-lg mb-2">Numéro d'urgence</h4>
                  <p className="text-2xl font-bold text-red-600">
                    +212 XXX XXX XXX
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Disponible 24h/24 - 7j/7
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg border border-red-200">
                  <h4 className="font-bold text-lg mb-2">Email</h4>
                  <a
                    href="mailto:urgence@ambassade.ma"
                    className="text-xl font-bold text-red-600 hover:underline"
                  >
                    urgence@ambassade.ma
                  </a>
                  <p className="text-sm text-gray-600 mt-2">Réponse sous 24h</p>
                </div>
              </div>
            </div>
          )}

          {/* Informations de mise à jour */}
          {post.updatedAt && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Dernière mise à jour :</strong>{' '}
                {new Date(post.updatedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}

          {/* Articles similaires */}
          <div className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Articles similaires
            </h2>
            <RelatedPostsSection currentPost={post} />
          </div>
        </div>
      </article>
    </main>
  );
}
