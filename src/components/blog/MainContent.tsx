// components/MainContent.tsx
import { Post } from '@/types'
import Image from 'next/image'
import TrendingSidebar from './TrendingSidebar'

interface MainContentProps {
  posts: Post[]
  activeFilter: string
  onOpenArticle: (id: number) => void
}

export default function MainContent({ posts, activeFilter, onOpenArticle }: MainContentProps) {
  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(p => p.cat === activeFilter)
  
  const featuredPosts = filteredPosts.filter(p => p.featured).slice(0, 2)
  const regularPosts = filteredPosts.filter(p => !p.featured)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] max-w-[1400px] mx-auto">
      <div className="posts-section lg:border-r border-[#c8ddd0]">
        {/* Featured Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#c8ddd0]">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post) => (
              <div
                key={post.id}
                className="relative overflow-hidden cursor-pointer h-[340px] border-r border-[#c8ddd0] last:border-r-0 group"
                onClick={() => onOpenArticle(post.id)}
              >
                <Image
                  src={post.img}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-106"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d2818]/92 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-block text-[0.6rem] font-bold tracking-widest uppercase bg-[#4a9068] text-white px-2 py-1 rounded-sm mb-3">
                    {post.cat}
                  </span>
                  <h3 className="font-serif-custom text-2xl font-normal text-white leading-tight mb-2">
                    {post.title}
                  </h3>
                 
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-[#5a7a64] text-[0.85rem] col-span-2">
              Aucun article vedette dans cette catégorie.
            </div>
          )}
        </div>

        {/* Post List */}
        <div className="post-list">
          {regularPosts.length > 0 ? (
            regularPosts.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-1 md:grid-cols-[200px_1fr] border-b border-[#c8ddd0] cursor-pointer transition-colors hover:bg-[#e8f2ec] group"
                onClick={() => onOpenArticle(post.id)}
              >
                <div className="h-[200px] md:h-[160px] overflow-hidden relative">
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex gap-4 items-center mb-3">
                    <span className="text-[0.6rem] font-bold tracking-widest uppercase text-[#4a9068]">
                      {post.cat}
                    </span>
                    <span className="text-[0.72rem] text-[#5a7a64]">
                      {post.date}
                    </span>
                  </div>
                  <h3 className="font-serif-custom text-xl md:text-2xl font-normal leading-tight mb-2 group-hover:text-[#4a9068] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[0.83rem] leading-relaxed text-[#5a7a64] font-light line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-[#5a7a64] text-[0.85rem]">
              Aucun article dans cette catégorie.
            </div>
          )}
        </div>
      </div>

      <TrendingSidebar posts={posts} onOpenArticle={onOpenArticle} />
    </div>
  )
}