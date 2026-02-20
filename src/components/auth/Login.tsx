'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LogIn,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Loader2,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading, isAuthenticated } = useAuth();
  const [form, setForm] = useState({
    email: '',
    pass: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirection différente selon le rôle
      if (user.role === 'admin') {
        router.push('/gestionnaire/statistiques');
      } else {
        router.push('/');
      }
    }
  }, [user, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.pass) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await login({
        email: form.email.trim(),
        pass: form.pass,
      });
      // La redirection sera gérée par le useEffect ci-dessus
    } catch (error: any) {
      setError(error.message || 'Email ou mot de passe incorrect');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher le chargement initial ou le formulaire
  if (authLoading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-900 mb-2">
              Ambassade du Mali
            </h1>
            <p className="text-green-700">Portail de connexion sécurisé</p>
          </div>
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-600">Vérification de votre session...</p>
        </div>
      </main>
    );
  }

  // Afficher le formulaire si pas en cours de chargement
  return (
    <>
      <header className="h-[30vh] bg-linear-to-b from-green-600 to-green-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="text-center text-white z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Ambassade du Mali
          </h1>
          <p className="text-xl md:text-2xl text-green-100">
            Portail de connexion sécurisée
          </p>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Carte de connexion */}
          <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
            {/* En-tête de la carte */}
            <div className="bg-linear-to-r from-green-500 to-green-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Connexion</h2>
                  <p className="text-green-100 text-sm mt-1">
                    {/* Message d'attention pour les administrateurs avec icons de panneau bloquant */}
                    <Shield className="w-4 h-4 inline mr-1" />  
                    Attention : espace réservé aux administrateurs !
                  </p>
                </div>
                <Link
                  href="/inscription"
                  className="bg-white/20 p-2 rounded-lg"
                >
                  <LogIn className="w-6 h-6" />
                </Link>
              </div>
            </div>

            {/* Formulaire */}
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Champ Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-green-800 mb-2"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-green-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={e =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="exemple@ambassade.ml"
                      required
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="pass"
                      className="block text-sm font-medium text-green-800"
                    >
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-sm text-green-600 hover:text-green-800 transition-colors"
                    >
                      {showPassword ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-green-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      id="pass"
                      type={showPassword ? 'text' : 'password'}
                      value={form.pass}
                      onChange={e => setForm({ ...form, pass: e.target.value })}
                      className="w-full pl-11 pr-12 py-3 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Votre mot de passe"
                      required
                      autoComplete="current-password"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-green-500 hover:text-green-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded border-green-300 focus:ring-green-500"
                      disabled={isSubmitting}
                    />
                    <span className="text-sm text-green-700">
                      Se souvenir de moi
                    </span>
                  </label>

                  <Link
                    href="/mot-de-passe-oublie"
                    className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                    <p className="text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </p>
                  </div>
                )}

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-green-300 cursor-not-allowed'
                      : 'bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-[0.98]'
                  } text-white shadow-lg hover:shadow-xl`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Se connecter</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
