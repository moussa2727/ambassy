// app/(auth)/connexion/page.tsx
import { Suspense } from 'react';
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
