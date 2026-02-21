import { ReactNode } from 'react';

export const metadata = {
  title: 'Tableau de bord des statistiques - Ambassade Du Mali Au Maroc',
  description: 'Tableau de bord administrateur avec statistiques et indicateurs clés.',
  robots: 'noindex,nofollow',
  icons: {
    icon: '/favicon.png',
  },
};

export default function StatistiquesLayout({ children }: { children: ReactNode }) {
  return children;
}
