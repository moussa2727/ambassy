import { Suspense } from 'react';
import { Metadata } from 'next';
import Login from '@/components/auth/Login';
import { Loader2 } from 'lucide-react';
export default function Connexion() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      }
    >
      <Login />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Connexion - Ambassade Du Mali Au Maroc',
  description: 'Page de connexion sécurisée pour les utilisateurs inscrits.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.png' },
};
