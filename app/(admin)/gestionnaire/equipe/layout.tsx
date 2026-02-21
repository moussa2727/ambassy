import { ReactNode } from 'react';

export const metadata = {
  title: 'Gestion de l\'équipe - Ambassade Du Mali Au Maroc',
  description: 'Panneau d\'administration pour gérer les membres de l\'équipe et leurs rôles.',
  robots: 'noindex,nofollow',
  icons: {
    icon: '/favicon.png',
  },
};

export default function EquipeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="icon" type="image/png" href="/favicon.png" />
      {children}
    </>
  );
}
