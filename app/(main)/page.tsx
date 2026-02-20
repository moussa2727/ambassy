import Hero from '@/components/accueil/Hero';
import Mission from '@/components/shared/Mission';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/data/blog-data';
import BlogList from '@/components/blog/Bloglist';
import ContactSection from '@/components/contact/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <BlogList posts={getAllPosts()} />
      <ContactSection />
    </>
  );
}
export const metadata: Metadata = {
  title: 'Accueil - Ambassade Du Mali Au Maroc',
  description:
    "Bienvenue sur la page d'accueil de l'ambassade du Mali au Maroc. Découvrez nos missions, nos blog posts et contactez-nous.",
  icons: {
    icon: '/favicon.png',
  },
};
