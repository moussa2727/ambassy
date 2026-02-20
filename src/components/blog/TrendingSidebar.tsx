import { Post } from '@/types'
import Image from 'next/image'

interface TrendingSidebarProps {
  posts: Post[]
  onOpenArticle: (id: number) => void
}

export default function TrendingSidebar({ posts, onOpenArticle }: TrendingSidebarProps) {

  return (
    <aside className="p-8">
      {/* Trending */}
      <div className="mb-10">
        <div className="font-serif-custom text-lg font-semibold tracking-wide text-[#0d2818] mb-5 pb-3 border-b-2 border-[#0d2818]">
          Tendances
        </div>
        <div>
          {posts.slice(0, 4).map((post) => (
            <div
              key={post.id}
              className="flex gap-4 py-4 border-b border-[#c8ddd0] last:border-b-0 cursor-pointer transition-all hover:pl-2 group"
              onClick={() => onOpenArticle(post.id)}
            >
              <div className="w-[72px] h-[72px] rounded overflow-hidden flex-shrink-0">
                <Image
                  src={post.img}
                  alt={post.title}
                  width={72}
                  height={72}
                  className="object-cover transition-transform duration-400 group-hover:scale-110"
                />
              </div>
              <div className="trending-info">
                <h4 className="font-serif-custom text-sm font-normal leading-tight mb-1 group-hover:text-[#4a9068] transition-colors">
                  {post.title}
                </h4>
                <span className="text-[0.7rem] text-[#5a7a64]">
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  )
}