import ContactSection from '@/components/contact/ContactSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - Ambassade Du Mali Au Maroc',
  description:
    "Contactez l'ambassade du Mali pour toute question ou demande d'information.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function ContactPage() {
  return (
    <main className="flex flex-col mt-25">
      <ContactSection />
    </main>
  );
}
