// components/Blog.tsx
'use client'

import { useState } from 'react'
import { Calendar, Clock, ArrowRight, ArrowLeft, Mail, Eye, Search, ChevronRight } from 'lucide-react'
import { blogPosts, BlogPost } from '@/types/blog'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  { label: 'Tous les articles', value: 'all' },
  { label: 'Canada', value: 'Canada' },
  { label: 'France', value: 'France' },
  { label: 'Bourses', value: 'Bourses' },
  { label: 'Conseils pratiques', value: 'Conseils' },
  { label: 'Visa & Administration', value: 'Visa' },
  { label: 'Témoignages', value: 'Témoignages' },
  { label: 'Actualités', value: 'Actualités' }
]

const getCategoryClass = (category: string): string => {
  const classMap: Record<string, string> = {
    'Canada': 'bg-blue-600',
    'France': 'bg-red-600',
    'Bourses': 'bg-purple-600',
    'Conseils': 'bg-green-600',
    'Visa': 'bg-orange-600',
    'Témoignages': 'bg-pink-600',
    'Actualités': 'bg-indigo-600'
  }
  
  return classMap[category] || 'bg-gray-600'
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [email, setEmail] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = blogPosts.filter(article => {
    if (selectedCategory !== 'all' && article.category !== selectedCategory) {
      return false
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  const formatDate = (dateString: string): string => {
    return dateString
  }

  const subscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert(`Merci pour votre inscription avec l'adresse : ${email}`)
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
    

      {/* Main Content */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none focus:border-green-500 text-gray-900 placeholder-gray-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Effacer la recherche"
                >
                  ×
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} trouvé{filteredArticles.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Categories Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`
                    px-6 py-3 rounded-full font-medium transition-all duration-200 whitespace-nowrap cursor-pointer
                    ${selectedCategory === category.value
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200 hover:border-green-200'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 group"
                >
                  <Link href={`/blog/${article.id}`} className="block">
                    {/* Article Image */}
                    <div className="relative overflow-hidden h-56">
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={400}
                        height={224}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md ${getCategoryClass(article.category)}`}
                        >
                          {article.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Article Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(article.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.readTime}
                          </span>
                        </div>
                        <span className="text-green-600 font-medium group-hover:text-green-700 transition-colors">
                          Lire l'article →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            /* No Results */
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Aucun article ne correspond à votre recherche. Essayez une autre catégorie ou un autre mot-clé.
              </p>
              <button 
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                Voir tous les articles
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}