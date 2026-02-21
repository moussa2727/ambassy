import { ReactNode } from 'react';

export const metadata = {
  title: 'Mon Profil administrateur - Ambassade Du Mali Au Maroc',
  description: 'Espace profil administrateur.',
  robots: 'noindex,nofollow',
   icons: {
    icon: '/favicon.png',
  },
};

export default function MonProfilLayout({ children }: { children: ReactNode }) {
  return children;
}
