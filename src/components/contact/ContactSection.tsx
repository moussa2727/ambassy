'use client';

import { useState, useRef } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building,
} from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
}

interface FormErrors {
  email?: string;
  message?: string;
  submit?: string;
}

export default function ContactSection() {
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation selon le schéma MessageCreateSchema
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format d'email invalide";
    } else if (form.email.length > 100) {
      newErrors.email = "L'email ne doit pas dépasser 100 caractères";
    }

    if (!form.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (form.message.trim().length < 5) {
      newErrors.message = 'Le message doit contenir au moins 5 caractères';
    } else if (form.message.trim().length > 2000) {
      newErrors.message = 'Le message ne doit pas dépasser 2000 caractères';
    }

    // Validation optionnelle pour le téléphone
    if (form.phone && form.phone.trim()) {
      const cleanPhone = form.phone.replace(/\s+/g, ''); // Remove spaces for validation
      if (!/^\+?[1-9]\d{1,14}$/.test(cleanPhone)) {
        newErrors.submit =
          'Format de téléphone invalide. Utilisez le format international (ex: +212612345678)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur lorsque l'utilisateur commence à taper
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSuccess('');

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.replace(/\s+/g, ''),
        email: form.email.trim().toLowerCase(),
        message: form.message.trim(),
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log('Server response:', {
        status: res.status,
        ok: res.ok,
      });

      if (res.ok) {
        setSuccess(
          ' Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
        );
        setForm({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          message: '',
        });

        // Réinitialiser le message de succès après 5 secondes
        setTimeout(() => setSuccess(''), 5000);

        // Faire défiler vers le haut du formulaire
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Gérer les erreurs de validation Zod du backend
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors: FormErrors = {};
          data.errors.forEach((error: any) => {
            if (error.field === 'email') backendErrors.email = error.message;
            if (error.field === 'message')
              backendErrors.message = error.message;
            if (error.field === 'phone') backendErrors.submit = error.message;
          });
          setErrors(backendErrors);
        } else {
          setErrors({
            submit: data.message || "Une erreur est survenue lors de l'envoi",
          });
        }
      }
    } catch (error) {
      console.error('Erreur de soumission:', error);
      setErrors({
        submit:
          'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction utilitaire pour formater le numéro de téléphone
  const formatPhoneNumber = (value: string) => {
    // Retirer tous les caractères non numériques sauf le +
    const cleaned = value.replace(/[^\d+]/g, '');

    // Formater selon le pattern international
    if (cleaned.startsWith('+')) {
      // Format international: +212 6XX XX XX XX
      const countryCode = cleaned.substring(0, 4); // +212
      const rest = cleaned.substring(4).replace(/(\d{2})(?=\d)/g, '$1 ');
      return countryCode + ' ' + rest;
    } else if (cleaned.startsWith('0')) {
      // Format local: 06 XX XX XX XX
      const rest = cleaned.substring(1).replace(/(\d{2})(?=\d)/g, '$1 ');
      return '0' + rest;
    }

    return value;
  };

  // Gestion spécifique pour le téléphone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s+/g, '');
    const formatted = formatPhoneNumber(rawValue);
    setForm(prev => ({ ...prev, phone: formatted }));

    if (errors.submit?.includes('téléphone')) {
      setErrors(prev => ({ ...prev, submit: undefined }));
    }
  };

  return (
    <section
      id="contact"
      className="py-12 md:py-20 bg-linear-to-b from-green-50 to-white"
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full mb-6">
            <Building className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
          </div>
          <h1
            id="contact-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-900 mb-4"
          >
            Contactez-nous
          </h1>
          <p className="text-lg md:text-xl text-green-700">
            Ambassade du Mali au Maroc — Votre liaison officielle à Rabat
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Colonne de gauche - Informations */}
          <div className="space-y-8">
            {/* Carte interactive */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-200">
              <div className="aspect-4/3 md:aspect-3/2 w-full bg-green-100 relative">
                <iframe
                  title="Localisation de l'Ambassade du Mali à Rabat"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.0421647991386!2d-6.839901923642309!3d33.96937187315975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76c91c1c5f185%3A0x8a4f8a8c8c8c8c8c!2sAmbassade%20du%20Mali%20%C3%A0%20Rabat!5e0!3m2!1sfr!2sma!4v1698765432107!5m2!1sfr!2sma"
                  className="absolute inset-0"
                />
              </div>
              <div className="p-4 md:p-6 bg-white">
                <p className="text-sm md:text-base text-green-800 font-medium">
                  Quartier des Ambassades, Avenue de France, Rabat, Maroc
                </p>
              </div>
            </div>

            {/* Cartes d'informations de contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Téléphone */}
              <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      Téléphone
                    </h3>
                    <div className="space-y-1">
                      <a
                        href="tel:+212537759121"
                        className="block text-green-700 hover:text-green-900 transition-colors"
                      >
                        +212 537 75 91 21
                      </a>
                      <a
                        href="tel:+212537759125"
                        className="block text-green-700 hover:text-green-900 transition-colors"
                      >
                        +212 537 75 91 25
                      </a>
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                      Urgences consulaires
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      Email officiel
                    </h3>
                    <a
                      href="mailto:ambamalirabat@gmail.com"
                      className="text-green-700 hover:text-green-900 transition-colors break-all"
                    >
                      ambamalirabat@gmail.com
                    </a>
                    <p className="text-sm text-green-600 mt-2">
                      Réponse sous 48h ouvrables
                    </p>
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      Adresse postale
                    </h3>
                    <p className="text-green-700">
                      Angle Avenue Moulay Youssef et Avenue de France
                      <br />
                      Quartier des Ambassades
                      <br />
                      Rabat 10000, Maroc
                    </p>
                  </div>
                </div>
              </div>

              {/* Horaires */}
              <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border border-green-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      Horaires d'ouverture
                    </h3>
                    <p className="text-green-700">
                      Lundi - Jeudi
                      <br />
                      8h30 - 16h30
                    </p>
                    <p className="text-green-700 mt-1">
                      Vendredi
                      <br />
                      8h30 - 12h30
                    </p>
                    <p className="text-sm text-green-600 mt-2">
                      Fermé le week-end et jours fériés
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne de droite - Formulaire */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 lg:p-10 border border-green-200">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-green-900 mb-3">
                Formulaire de contact
              </h2>
              <p className="text-green-700">
                Tous les champs marqués d'un astérisque (
                <span className="text-red-500">*</span>) sont obligatoires.
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
            >
              {/* Champs nom/prénom (optionnels) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-green-800 mb-2"
                  >
                    Prénom{' '}
                    <span className="text-green-600 text-sm">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-green-500">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInputChange}
                      type="text"
                      autoComplete="given-name"
                      maxLength={50}
                      className="w-full pl-11 pr-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <p className="mt-1 text-xs text-green-500">
                    Maximum 50 caractères
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-green-800 mb-2"
                  >
                    Nom{' '}
                    <span className="text-green-600 text-sm">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-green-500">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      type="text"
                      autoComplete="family-name"
                      maxLength={50}
                      className="w-full pl-11 pr-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="Votre nom de famille"
                    />
                  </div>
                  <p className="mt-1 text-xs text-green-500">
                    Maximum 50 caractères
                  </p>
                </div>
              </div>

              {/* Téléphone (optionnel) */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-green-800 mb-2"
                >
                  Téléphone{' '}
                  <span className="text-green-600 text-sm">(optionnel)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-green-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handlePhoneChange}
                    type="tel"
                    autoComplete="tel"
                    maxLength={20}
                    className="w-full pl-11 pr-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="+212 612 34 56 78"
                    pattern="^\+?[1-9]\d{1,14}$"
                  />
                </div>
                <p className="mt-1 text-xs text-green-500">
                  Format international recommandé (ex: +212612345678)
                </p>
              </div>

              {/* Email (obligatoire) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-green-800 mb-2"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-green-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={100}
                    className={`w-full pl-11 pr-4 py-3 bg-green-50 border ${errors.email ? 'border-red-300' : 'border-green-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                    placeholder="votre.email@exemple.com"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
                <p className="mt-1 text-xs text-green-500">
                  Nous utiliserons cet email pour vous répondre
                </p>
              </div>

              {/* Message (obligatoire) */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-green-800 mb-2"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-green-500">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    maxLength={2000}
                    minLength={5}
                    className={`w-full pl-11 pr-4 py-3 bg-green-50 border ${errors.message ? 'border-red-300' : 'border-green-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none`}
                    placeholder="Décrivez votre demande en détail..."
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? 'message-error' : undefined
                    }
                  />
                </div>
                {errors.message && (
                  <p
                    id="message-error"
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.message}
                  </p>
                )}
                <div className="mt-2 text-sm text-green-600 flex justify-between">
                  <span
                    className={form.message.length < 5 ? 'text-red-500' : ''}
                  >
                    Minimum 5 caractères
                    {form.message.length > 0 &&
                      form.message.length < 5 &&
                      ` (${5 - form.message.length} restant)`}
                  </span>
                  <span
                    className={
                      form.message.length > 1800
                        ? 'text-yellow-500'
                        : form.message.length > 1900
                          ? 'text-red-500'
                          : ''
                    }
                  >
                    {form.message.length}/2000
                  </span>
                </div>
              </div>

              {/* Bouton de soumission */}
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
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Envoyer le message</span>
                  </>
                )}
              </button>

              {/* Messages d'erreur/succès */}
              {errors.submit && (
                <div
                  className="p-4 bg-red-50 border border-red-200 rounded-xl"
                  role="alert"
                  aria-live="assertive"
                >
                  <p className="text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {errors.submit}
                  </p>
                </div>
              )}

              {success && (
                <div
                  className="p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn"
                  role="status"
                  aria-live="polite"
                >
                  <p className="text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    {success}
                  </p>
                  <p className="mt-2 text-sm text-green-600">
                    Votre message a été enregistré sous la référence #
                    {
                      // Générer un ID fictif basé sur le timestamp
                      Math.floor(Date.now() / 1000)
                        .toString(36)
                        .toUpperCase()
                    }
                  </p>
                </div>
              )}

              {/* Informations légales */}
              <div className="pt-4 border-t border-green-200">
                <p className="text-xs text-green-600">
                  <strong>Note importante :</strong> Ce formulaire est destiné
                  aux demandes non urgentes. Pour les urgences consulaires
                  (passeports, rapatriements, etc.), appelez directement les
                  numéros indiqués.
                </p>
                <p className="mt-2 text-xs text-green-600">
                  En soumettant ce formulaire, vous acceptez que vos données
                  soient traitées conformément à notre{' '}
                  <a
                    href="/politique-confidentialite"
                    className="text-green-700 hover:text-green-900 underline font-medium"
                  >
                    politique de confidentialité
                  </a>
                  . Vos informations ne seront jamais partagées avec des tiers.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
