import { Suspense } from 'react';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import RegisterPage from '@/components/auth/Register';

export default function Inscription() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      }
    >
      <RegisterPage />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Inscription - Ambassade Du Mali Au Maroc',
  description: "Page d'inscription pour créer un compte utilisateur.",
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.png' },
};
