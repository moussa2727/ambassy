// components/BlogCard.tsx
'use client'

import { Post } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

interface BlogCardProps {
  posts: Post[]  // Tableau de posts
  layout?: 'grid' | 'list' | 'compact' | 'featured' | 'masonry'
  columns?: 1 | 2 | 3 | 4
  title?: string
  showFilters?: boolean
  onFilterChange?: (filter: string) => void
  activeFilter?: string
}

export default function BlogCard({ 
  posts, 
  layout = 'grid',
  columns = 3,
  title,
  showFilters = false,
  onFilterChange,
  activeFilter = 'all'
}: BlogCardProps) {

  // Extraire les catégories uniques pour les filtres
  const categories = ['all', ...new Set(posts.map(p => p.cat))]

  // Filtrer les posts si nécessaire
  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(p => p.cat === activeFilter)

  // Configuration des colonnes pour le layout grid
  const getGridCols = () => {
    const cols = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }
    return cols[columns]
  }

  // Layout FEATURED - Grandes cards à la une
  if (layout === 'featured') {
    return (
      <section className="w-full">
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif-custom text-2xl font-semibold text-[#0d2818]">
              {title}
            </h2>
            {showFilters && onFilterChange && (
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onFilterChange(cat)}
                    className={`text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full transition-all ${
                      activeFilter === cat
                        ? 'bg-[#0d2818] text-white'
                        : 'text-[#5a7a64] hover:text-[#0d2818]'
                    }`}
                  >
                    {cat === 'all' ? 'Tous' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.filter(p => p.featured).slice(0, 2).map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group relative block h-[400px] overflow-hidden rounded-lg"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <Image
                src={post.img}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2818] via-[#0d2818]/50 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block text-[0.6rem] font-bold tracking-widest uppercase bg-[#4a9068] text-white px-2 py-1 rounded-sm mb-3">
                  {post.cat}
                </span>
                
                <h3 className="font-serif-custom text-2xl font-normal text-white mb-2 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-[0.8rem] text-[#c8ddd0] line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-3 text-[0.75rem] text-[#8ab89a]">
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )
  }

  // Layout GRID - Cards en grille (par défaut)
  if (layout === 'grid') {
    return (
      <section className="w-full">
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif-custom text-2xl font-semibold text-[#0d2818]">
              {title}
            </h2>
            {showFilters && onFilterChange && (
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onFilterChange(cat)}
                    className={`text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full transition-all ${
                      activeFilter === cat
                        ? 'bg-[#0d2818] text-white'
                        : 'text-[#5a7a64] hover:text-[#0d2818]'
                    }`}
                  >
                    {cat === 'all' ? 'Tous' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className={`grid ${getGridCols()} gap-6`}>
          {filteredPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.img}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-4 left-4 text-[0.6rem] font-bold tracking-widest uppercase bg-[#4a9068] text-white px-2 py-1 rounded-sm z-10">
                  {post.cat}
                </span>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-2 text-[0.7rem] text-[#5a7a64] mb-2">
                  <span>{post.date}</span>
                </div>
                
                <h3 className="font-serif-custom text-xl font-normal text-[#1c2e22] mb-2 line-clamp-2 group-hover:text-[#4a9068] transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-[0.8rem] text-[#5a7a64] line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  
                  <span className="text-[#4a9068] text-sm group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )
  }

  // Layout LIST - Liste verticale
  if (layout === 'list') {
    return (
      <section className="w-full">
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif-custom text-2xl font-semibold text-[#0d2818]">
              {title}
            </h2>
            {showFilters && onFilterChange && (
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onFilterChange(cat)}
                    className={`text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full transition-all ${
                      activeFilter === cat
                        ? 'bg-[#0d2818] text-white'
                        : 'text-[#5a7a64] hover:text-[#0d2818]'
                    }`}
                  >
                    {cat === 'all' ? 'Tous' : cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group flex gap-6 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden">
                <Image
                  src={post.img}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="flex-1 py-4 pr-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[0.6rem] font-bold tracking-widest uppercase text-[#4a9068]">
                    {post.cat}
                  </span>
                  <span className="text-[0.7rem] text-[#5a7a64]">{post.date}</span>
                </div>
                
                <h3 className="font-serif-custom text-lg font-normal text-[#1c2e22] mb-1 line-clamp-1 group-hover:text-[#4a9068] transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-[0.8rem] text-[#5a7a64] line-clamp-1 mb-2">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="text-[0.7rem] text-[#5a7a64] ml-auto"></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )
  }

  // Layout COMPACT - Pour sidebars
  if (layout === 'compact') {
    return (
      <div className="w-full">
        {title && (
          <h3 className="font-serif-custom text-lg font-semibold text-[#0d2818] mb-4">
            {title}
          </h3>
        )}
        <div className="divide-y divide-[#c8ddd0]">
          {filteredPosts.slice(0, 5).map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="flex gap-3 py-3 hover:pl-2 transition-all group"
              data-aos="fade-left"
              data-aos-delay={index * 50}
            >
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <Image
                  src={post.img}
                  alt={post.title}
                  width={64}
                  height={64}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              <div className="flex-1">
                <span className="text-[0.55rem] font-bold tracking-widest uppercase text-[#4a9068]">
                  {post.cat}
                </span>
                <h4 className="font-serif-custom text-sm font-normal leading-tight mb-1 group-hover:text-[#4a9068] transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 text-[0.65rem] text-[#5a7a64]">
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  // Layout MASONRY - Effet masonry
  if (layout === 'masonry') {
    return (
      <section className="w-full">
        {title && (
          <h2 className="font-serif-custom text-2xl font-semibold text-[#0d2818] mb-6">
            {title}
          </h2>
        )}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {filteredPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group block mb-6 break-inside-avoid"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 text-[0.6rem] font-bold tracking-widest uppercase bg-[#4a9068] text-white px-2 py-1 rounded-sm z-10">
                    {post.cat}
                  </span>
                </div>
                
                <div className="p-5">
                  <h3 className="font-serif-custom text-xl font-normal text-[#1c2e22] mb-2 line-clamp-2 group-hover:text-[#4a9068] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-[0.8rem] text-[#5a7a64] line-clamp-3 mb-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-[0.7rem] text-[#5a7a64]">
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )
  }

  return null
}