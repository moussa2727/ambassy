import { ReactNode } from 'react';

export const metadata = {
  title: 'Gestion du Blog - Ambassade Du Mali Au Maroc',
  description: 'Panneau d\'administration pour gérer les articles du blog.',
  robots: 'noindex,nofollow',
  icons: {
    icon: '/favicon.png',
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="icon" type="image/png" href="/favicon.png" />
      {children}
    </>
  );
}
