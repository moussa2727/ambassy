import { ReactNode } from 'react';

export const metadata = {
  title: 'Espace de gestion des Messages - Ambassade Du Mali Au Maroc',
  description: 'Interface d\'administration pour consulter et répondre aux messages reçus.',
  robots: 'noindex,nofollow',
  icons: {
    icon: '/favicon.png',
  },
};

export default function MessagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="icon" href="/favicon.png" />
      {children}
    </>
  );
}
