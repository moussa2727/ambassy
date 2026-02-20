// app/page.tsx
'use client'

import { useState } from 'react'

import { Post, posts } from '@/lib/data/posts'
import Hero from '@/components/blog/Hero'
import ArticleView from '@/components/blog/ArticleView'
import FilterBar from '@/components/blog/FilterBar'
import MainContent from '@/components/blog/MainContent'
import Ticker from '@/components/blog/Ticker'

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [view, setView] = useState<'blog' | 'article'>('blog')

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
  }

  const handleOpenArticle = (postId: number) => {
    const post = posts.find(p => p.id === postId)
    if (post) {
      setSelectedPost(post)
      setView('article')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBackToBlog = () => {
    setView('blog')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      
      {view === 'blog' ? (
        <>
          <Hero posts={posts} onOpenArticle={handleOpenArticle} />
          <Ticker />
          <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
          <MainContent 
            posts={posts} 
            activeFilter={activeFilter} 
            onOpenArticle={handleOpenArticle}
          />
        </>
      ) : (
        selectedPost && (
          <ArticleView post={selectedPost} onBack={handleBackToBlog} />
        )
      )}
      
    </>
  )
}