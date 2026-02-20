// components/ArticleView.tsx
'use client'

import { Post } from '@/types'
import Image from 'next/image'

interface ArticleViewProps {
  post: Post
  onBack: () => void
}

export default function ArticleView({ post, onBack }: ArticleViewProps) {
  return (
    <div className="animate-[slideUp_0.4s_ease]">
      <div className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src={post.img}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d2818]/85 via-[#0d2818]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[860px]">
          <span className="inline-block text-[0.6rem] font-bold tracking-widest uppercase bg-[#4a9068] text-white px-2 py-1 rounded-sm mb-4">
            {post.cat.toUpperCase()}
          </span>
          <h1 className="font-serif-custom text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex gap-8 text-[0.8rem] text-[#8ab89a] items-center">
            <span>{post.date}</span>
          </div>
        </div>
      </div>
      
      <div className="max-w-[720px] mx-auto px-4 md:px-8 py-12 md:py-16">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[0.72rem] font-semibold tracking-wider uppercase bg-none border-none text-[#5a7a64] cursor-pointer mb-8 transition-colors hover:text-[#4a9068]"
        >
          ← Retour aux articles
        </button>
        
        <div 
          className="text-base md:text-lg leading-relaxed text-[#1c2e22] font-light prose prose-green max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
    </div>
  )
}