'use client'

import { Post } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface PostCardProps {
  post: Post
  variant: 'featured' | 'regular'
  onOpenArticle?: (id: number) => void
}

export default function PostCard({ post, variant, onOpenArticle }: PostCardProps) {
  const router = useRouter()
  
  const handleClick = () => {
    if (onOpenArticle) {
      onOpenArticle(post.id)
    } else {
      router.push('/blog')
    }
  }

  if (variant === 'featured') {
    return (
      <div 
        className="group relative block h-[400px] overflow-hidden rounded-lg cursor-pointer"
        onClick={handleClick}
        data-aos="fade-up"
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
      </div>
    )
  }

  return (
    <div 
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleClick}
      data-aos="fade-up"
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
    </div>
  )
}
