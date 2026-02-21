import { ReactNode } from 'react';

export const metadata = {
  title: 'Gestion des Couvertures - Ambassade Du Mali Au Maroc',
  description: 'Panneau d\'administration pour suivre et gérer les couvertures et demandes.',
  robots: 'noindex,nofollow',
  icons: {
    icon: '/favicon.png',
  },
};

export default function CouverturesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="icon" type="image/png" href="/favicon.png" />
      {children}
    </>
  );
}
