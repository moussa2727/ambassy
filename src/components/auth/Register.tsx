'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiUserPlus,
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiEyeOff,
  FiEye,
  FiHome,
} from 'react-icons/fi';
import { useAuth } from '@/lib/auth/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    pass: '',
    confirmPass: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');

  // Redirection si déjà connecté
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (fieldErrors[e.target.name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
    // Effacer l'erreur générale lors de la saisie
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitError('');

    // Validation des mots de passe
    if (formData.pass !== formData.confirmPass) {
      setFieldErrors({ confirmPass: 'Les mots de passe ne correspondent pas' });
      return;
    }

    // Validation du mot de passe
    if (formData.pass.length < 8) {
      setFieldErrors({
        pass: 'Le mot de passe doit contenir au moins 8 caractères',
      });
      return;
    }

    try {
      await register({
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        telephone: formData.telephone.trim(),
        pass: formData.pass,
      });
      // Redirection vers la page de connexion avec un message de succès
      router.push('/connexion?registered=true');
    } catch (err: any) {
      console.error('Erreur inscription:', err);
      setSubmitError(
        err.message || "Une erreur est survenue lors de l'inscription"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="h-[30vh] bg-linear-to-b from-green-600 to-green-500 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="text-center text-white z-10 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Ambassade du Mali
          </h1>
          <p className="text-lg md:text-xl text-green-100">
            Créez votre compte personnel
          </p>
        </div>
      </header>

      {/* Formulaire d'inscription */}
      <div className="max-w-[97%] md:max-w-[453px] mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-xl border border-green-200 overflow-hidden">
          {/* En-tête de la carte */}
          <div className="bg-linear-to-r from-green-500 to-green-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Inscription</h2>
                <p className="text-green-100 text-xs mt-1">
                  Créez votre espace personnel
                </p>
              </div>
              <Link
                href="/"
                className="bg-white/20 p-2 rounded-lg hover:bg-white/30 transition-colors"
              >
                <FiHome className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Formulaire */}
          <div className="p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Champ Nom */}
              <div>
                <label
                  htmlFor="nom"
                  className="block text-sm font-medium text-green-800 mb-1"
                >
                  Nom
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className="w-full pl-9 pr-3 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              {/* Champ Prénom */}
              <div>
                <label
                  htmlFor="prenom"
                  className="block text-sm font-medium text-green-800 mb-1"
                >
                  Prénom
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    autoComplete="given-name"
                    className="w-full pl-9 pr-3 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>

              {/* Champ Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-green-800 mb-1"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="w-full pl-9 pr-3 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="exemple@ambassade.ml"
                  />
                </div>
              </div>

              {/* Champ Téléphone */}
              <div>
                <label
                  htmlFor="telephone"
                  className="block text-sm font-medium text-green-800 mb-1"
                >
                  Téléphone
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    required
                    value={formData.telephone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="w-full pl-9 pr-3 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="+212612345678"
                  />
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div>
                <label
                  htmlFor="pass"
                  className="block text-sm font-medium text-green-800 mb-1"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input
                    id="pass"
                    name="pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.pass}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="w-full pl-9 pr-10 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="Min 8 caractères"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Champ Confirmation mot de passe */}
              <div>
                <label
                  htmlFor="confirmPass"
                  className="block text-sm font-medium text-green-800 mb-1"
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  <input
                    id="confirmPass"
                    name="confirmPass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPass}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className="w-full pl-9 pr-10 py-2 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-700"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Message d'erreur général */}
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm flex items-start gap-2">
                    <FiLock className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </p>
                </div>
              )}

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 active:scale-[0.98] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiUserPlus className="w-4 h-4" />
                <span>
                  {loading ? 'Inscription en cours...' : "S'inscrire"}
                </span>
              </button>
            </form>

            {/* Lien vers connexion */}
            <div className="mt-4 text-center">
              <p className="text-sm text-green-700">
                Déjà un compte ?{' '}
                <Link
                  href="/connexion"
                  className="text-green-600 hover:text-green-800 font-medium transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
