'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-linear-to-b from-green-50 via-white to-green-50 flex flex-col">
        {/* Header */}
        <header className="h-[30vh] bg-linear-to-b from-green-600 to-green-500 flex items-center justify-center relative overflow-hidden mb-5">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="text-center text-white z-10 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ambassade du Mali
            </h1>
            <p className="text-xl md:text-2xl text-green-100">Email envoyé</p>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 pb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-green-200 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Email envoyé avec succès
              </h2>

              <p className="text-gray-600 mb-6">
                Un email a été envoyé à <strong>{email}</strong> avec les
                instructions pour réinitialiser votre mot de passe.
              </p>

              <p className="text-sm text-gray-500 mb-8">
                Vérifiez votre boîte de réception et vos spams. Le lien expirera
                dans 24 heures.
              </p>

              <Link
                href="/connexion"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          </motion.div>
        </main>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-green-50 via-white to-green-50 flex flex-col">
      {/* Header */}
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
            Mot de passe oublié
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-green-200 overflow-hidden">
            {/* En-tête */}
            <div className="bg-linear-to-r from-green-600 to-green-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Réinitialisation</h2>
                  <p className="text-green-100 text-sm mt-1">
                    Recevez un lien de réinitialisation
                  </p>
                </div>
                <Link href="/connexion" className="bg-white/20 p-2 rounded-lg">
                  <ArrowLeft className="w-6 h-6" />
                </Link>
              </div>
            </div>

            {/* Formulaire */}
            <div className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Message d'information */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    Entrez votre adresse email et nous vous enverrons un lien
                    pour réinitialiser votre mot de passe.
                  </p>
                </div>

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
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                    isSubmitting
                      ? 'bg-green-300 cursor-not-allowed'
                      : 'bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                  } text-white shadow-lg hover:shadow-xl`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      <span>Envoyer le lien</span>
                    </>
                  )}
                </button>
              </form>

              {/* Lien retour */}
              <div className="mt-6 text-center">
                <Link
                  href="/connexion"
                  className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </main>
  );
}
