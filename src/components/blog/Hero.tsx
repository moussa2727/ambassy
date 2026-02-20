import { Post } from '@/types'
import Image from 'next/image'

interface HeroProps {
  posts: Post[]
  onOpenArticle: (id: number) => void
}

export default function Hero({ posts, onOpenArticle }: HeroProps) {
  const heroPost = posts[0]

  return (
    <div 
      className="relative h-[92vh] min-h-[600px] overflow-hidden cursor-pointer group"
      onClick={() => onOpenArticle(heroPost.id)}
    >
      <div className="absolute top-4 left-4 z-10">
        <a href="/" className="text-white text-sm">
          ← Accueil
        </a>
      </div>
      <Image
        src={heroPost.img}
        alt={heroPost.title}
        fill
        className="object-cover transition-transform duration-[8s] ease-in group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2818]/95 via-[#0d2818]/50 to-[#0d2818]/15" />
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[860px] animate-[slideUp_0.8s_ease_forwards]">
        <div className="inline-flex items-center gap-2 bg-[#c8a84b] text-[#0d2818] text-[0.65rem] font-bold tracking-widest uppercase px-3 py-1 mb-6">
          ✦ À la Une
        </div>
        <h1 className="font-serif-custom text-4xl md:text-5xl lg:text-7xl font-light text-white leading-tight tracking-tight mb-4">
          {heroPost.title}
        </h1>
        <p className="text-base md:text-lg font-light text-[#c8ddd0]/85 leading-relaxed mb-8 max-w-[600px]">
          {heroPost.excerpt}
        </p>
        <div className="flex items-center gap-8 flex-wrap">
          <div className="absolute bottom-8 left-8 flex items-center gap-4">
            <div className="text-white">
              <div className="font-serif-custom text-3xl font-normal leading-tight">
                {heroPost.title}
              </div>
            </div>
          </div>
          <button 
            className="inline-flex items-center gap-2 bg-[#4a9068] text-white border-none font-sans text-[0.78rem] font-semibold tracking-wider uppercase px-8 py-3 cursor-pointer transition-all hover:bg-[#2d6147] hover:translate-x-1"
            onClick={(e) => {
              e.stopPropagation()
              onOpenArticle(heroPost.id)
            }}
          >
            Lire l'article →
          </button>
        </div>
      </div>
    </div>
  )
}