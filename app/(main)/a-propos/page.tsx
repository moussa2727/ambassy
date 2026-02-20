import Ambassador from '@/components/about/Ambassador';
import Team from '@/components/about/Team';
import Mission from '@/components/shared/Mission';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A Propos - Ambassade Du Mali Au Maroc',
  description:
    "Découvrez l'ambassade du Mali et son équipe dévouée au service de la démocratie.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function AProposPage() {
  return (
    <main className="mt-25">
      <Ambassador />
      <Team />
      <Mission />
    </main>
  );
}
