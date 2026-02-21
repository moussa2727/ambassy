import { ReactNode } from 'react';

export const metadata = {
  title: 'Gestion des Ambassadeurs - Ambassade Du Mali Au Maroc',
  description: 'Gestionnaire des ambassadeurs diplomatiques et éducatifs de l\'ambassade du Mali',
  robots: 'noindex,nofollow',
  icons: {
    icon: '/favicon.png',
  },
};

export default function AmbassadeurLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="icon" type="image/png" href="/favicon.png" />
      {children}
    </>
  );
}
