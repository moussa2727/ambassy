// src/app/blog/page.tsx
import Blog from '@/components/blog/Blog'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'
import { Metadata } from 'next'

export default function BlogPage() {
  return (
    <div>
      {/* Header avec le même style que dans ton Blog.tsx */}
      <header className="bg-linear-to-r from-green-600 to-emerald-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-green-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l'accueil
            </Link>
          </div>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Blog Études à l'Étranger
            </h1>
            <p className="text-green-100 text-lg max-w-3xl mx-auto">
              Guides complets, conseils pratiques et actualités pour réussir votre projet d'études internationales
            </p>
          </div>
        </div>
      </header>
      
      {/* Utilise ton composant Blog existant */}
      <Blog />
      
   
    </div>
  )
}
export const metadata: Metadata = {
  title: 'Blog - Ambassade Du Mali Au Maroc',
  description: 'Découvrez nos guides, conseils et actualités sur l\'étude à l\'étranger.',
   icons: {
    icon: '/favicon.png',
  },
}