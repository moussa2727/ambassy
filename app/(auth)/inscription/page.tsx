import { Suspense } from 'react';
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
