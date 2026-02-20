'use client';

import { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Globe,
  Shield,
  Calendar,
} from 'lucide-react';

// INTERFACES - Définition des types
interface FormData {
  firstName: string;      // Optionnel
  lastName: string;       // Optionnel
  phone: string;          // Optionnel
  email: string;          // REQUIS
  message: string;        // REQUIS
}

interface FormErrors {
  email?: string;         // Optionnel
  message?: string;       // Optionnel
  submit?: string;        // Optionnel - erreur globale
}

export default function ContactSection() {
  // ÉTATS
  const [form, setForm] = useState<FormData>({
    firstName: '',        // Optionnel
    lastName: '',         // Optionnel
    phone: '',            // Optionnel
    email: '',            // REQUIS
    message: '',          // REQUIS
  });

  const [isSubmitting, setIsSubmitting] = useState(false);        // Interne
  const [success, setSuccess] = useState('');                     // Optionnel (message)
  const [errors, setErrors] = useState<FormErrors>({});           // Optionnel
  const [expandedCard, setExpandedCard] = useState<string | null>(null); // Optionnel
  const [mounted, setMounted] = useState(false);                   // Interne (hydration)
  const formRef = useRef<HTMLFormElement>(null);                   // Référence

  // Effet pour gérer l'hydratation (évite les erreurs window is not defined)
  useEffect(() => {
    setMounted(true);
  }, []);

  // CONTACT CARDS - Configuration (toutes les infos sont REQUISES pour l'affichage)
  const contactCards = [
    {
      id: 'phone',                                         // REQUIS
      icon: <Phone className="w-5 h-5 md:w-6 md:h-6 text-[#4a9068]" />, // REQUIS
      title: 'Téléphone',                                   // REQUIS
      bgColor: 'bg-[#e8f2ec]',                              // REQUIS
      iconBg: 'bg-[#4a9068]/10',                            // REQUIS
      content: (                                            // REQUIS - contenu JSX
        <div className="space-y-3">
          {/* Numéro standard 1 - REQUIS */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#4a9068]/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#4a9068]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0d2818]">Standard</p>
              <a href="tel:+212537759121" className="text-sm text-[#4a9068] hover:underline">
                +212 537 75 91 21
              </a>
            </div>
          </div>
          
          {/* Numéro standard 2 - REQUIS */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#4a9068]/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#4a9068]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0d2818]">Standard</p>
              <a href="tel:+212537759125" className="text-sm text-[#4a9068] hover:underline">
                +212 537 75 91 25
              </a>
            </div>
          </div>
          
          {/* Urgences consulaires - REQUIS */}
          <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">
              <span className="font-semibold">Urgences consulaires :</span> +212 6XX XX XX XX
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'email',                                          // REQUIS
      icon: <Mail className="w-5 h-5 md:w-6 md:h-6 text-[#4a9068]" />, // REQUIS
      title: 'Email',                                        // REQUIS
      bgColor: 'bg-[#e8f2ec]',                               // REQUIS
      iconBg: 'bg-[#4a9068]/10',                             // REQUIS
      content: (                                             // REQUIS
        <div className="space-y-3">
          {/* Email officiel - REQUIS */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#4a9068]/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-[#4a9068]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0d2818]">Email officiel</p>
              <a href="mailto:ambamalirabat@gmail.com" className="text-sm text-[#4a9068] hover:underline break-all">
                ambamalirabat@gmail.com
              </a>
            </div>
          </div>
          
          {/* Délai de réponse - REQUIS */}
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-700">
              Réponse sous 48h ouvrables
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'address',                                        // REQUIS
      icon: <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#4a9068]" />, // REQUIS
      title: 'Adresse',                                      // REQUIS
      bgColor: 'bg-[#e8f2ec]',                               // REQUIS
      iconBg: 'bg-[#4a9068]/10',                             // REQUIS
      content: (                                             // REQUIS
        <div className="space-y-3">
          {/* Adresse postale - REQUIS */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#4a9068]/10 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4 text-[#4a9068]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0d2818]">Adresse postale</p>
              <p className="text-sm text-[#5a7a64]">
                24, Avenue Moulay Youssef
                <br />
                Quartier des Ambassades
                <br />
                Rabat 10000, Maroc
              </p>
            </div>
          </div>
          
          {/* Localisation - REQUIS */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#4a9068]/10 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#4a9068]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#0d2818]">Quartier des Ambassades</p>
              <p className="text-sm text-[#5a7a64]">
                Avenue de France, Rabat, Maroc
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'hours',                                          // REQUIS
      icon: <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#4a9068]" />, // REQUIS
      title: 'Horaires',                                     // REQUIS
      bgColor: 'bg-[#e8f2ec]',                               // REQUIS
      iconBg: 'bg-[#4a9068]/10',                             // REQUIS
      content: (                                             // REQUIS
        <div className="space-y-3">
          {/* Lundi - Jeudi - REQUIS */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#4a9068]/10 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#4a9068]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#0d2818]">Lundi - Jeudi</p>
              <p className="text-sm text-[#5a7a64]">8h30 - 16h30</p>
            </div>
          </div>
          
          {/* Vendredi - REQUIS */}
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#4a9068]/10 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#4a9068]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#0d2818]">Vendredi</p>
              <p className="text-sm text-[#5a7a64]">8h30 - 12h30</p>
            </div>
          </div>
          
          {/* Fermeture - REQUIS */}
          <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <p className="text-xs text-red-700">
              Fermé le week-end et jours fériés
            </p>
          </div>
        </div>
      ),
    },
  ];

  // VALIDATION - Retourne un boolean, les erreurs sont optionnelles
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email - REQUIS
    if (!form.email.trim()) {
      newErrors.email = "L'email est requis";                     // Message REQUIS si erreur
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format d'email invalide";                // Message REQUIS si erreur
    } else if (form.email.length > 100) {
      newErrors.email = "L'email ne doit pas dépasser 100 caractères"; // Message REQUIS si erreur
    }

    // Message - REQUIS
    if (!form.message.trim()) {
      newErrors.message = 'Le message est requis';                // Message REQUIS si erreur
    } else if (form.message.trim().length < 5) {
      newErrors.message = 'Le message doit contenir au moins 5 caractères'; // Message REQUIS si erreur
    } else if (form.message.trim().length > 2000) {
      newErrors.message = 'Le message ne doit pas dépasser 2000 caractères'; // Message REQUIS si erreur
    }

    // Téléphone - OPTIONNEL (validation seulement si présent)
    if (form.phone && form.phone.trim()) {
      const cleanPhone = form.phone.replace(/\s+/g, '');
      if (!/^\+?[1-9]\d{1,14}$/.test(cleanPhone)) {
        newErrors.submit =                                      // Erreur globale OPTIONNELLE
          'Format de téléphone invalide. Utilisez le format international (ex: +212612345678)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // GESTIONNAIRES D'ÉVÉNEMENTS
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));

    // Effacer l'erreur lorsque l'utilisateur commence à taper (OPTIONNEL)
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;                                                  // Arrêt si validation échoue
    }

    setIsSubmitting(true);                                     // REQUIS pour UI
    setErrors({});                                             // Réinitialisation
    setSuccess('');                                            // Réinitialisation

    try {
      const payload = {
        firstName: form.firstName.trim(),                      // Optionnel
        lastName: form.lastName.trim(),                        // Optionnel
        phone: form.phone.replace(/\s+/g, ''),                 // Optionnel
        email: form.email.trim().toLowerCase(),                // REQUIS
        message: form.message.trim(),                           // REQUIS
      };

      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(                                            // Message de succès (OPTIONNEL)
          '✓ Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
        );
        // Réinitialisation du formulaire (OPTIONNEL - bonne pratique)
        setForm({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          message: '',
        });

        // Timer pour effacer le message (OPTIONNEL)
        setTimeout(() => setSuccess(''), 5000);

        // Scroll vers le formulaire (OPTIONNEL)
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Gestion des erreurs backend (OPTIONNEL)
        if (data.errors && Array.isArray(data.errors)) {
          const backendErrors: FormErrors = {};
          data.errors.forEach((error: any) => {
            if (error.field === 'email') backendErrors.email = error.message;
            if (error.field === 'message') backendErrors.message = error.message;
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
      setIsSubmitting(false);                                  // REQUIS - remet l'état à false
    }
  };

  // Formatage téléphone (OPTIONNEL - amélioration UX)
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('+')) {
      const countryCode = cleaned.substring(0, 4);
      const rest = cleaned.substring(4).replace(/(\d{2})(?=\d)/g, '$1 ');
      return countryCode + ' ' + rest;
    } else if (cleaned.startsWith('0')) {
      const rest = cleaned.substring(1).replace(/(\d{2})(?=\d)/g, '$1 ');
      return '0' + rest;
    }

    return value;
  };

  // Gestion spécifique téléphone (OPTIONNEL)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s+/g, '');
    const formatted = formatPhoneNumber(rawValue);
    setForm(prev => ({ ...prev, phone: formatted }));

    if (errors.submit?.includes('téléphone')) {
      setErrors(prev => ({ ...prev, submit: undefined }));
    }
  };

  // Toggle pour mobile (OPTIONNEL)
  const toggleCard = (card: string) => {
    setExpandedCard(expandedCard === card ? null : card);
  };

  // Rendu conditionnel pour éviter les erreurs d'hydratation (REQUIS pour window)
  if (!mounted) {
    return null; // Version SSR sans animations
  }

  // RENDU PRINCIPAL
  return (
    <section className="w-full bg-[#f4f8f5] py-8 md:py-16 px-4" ref={formRef}>
      <div className="max-w-7xl mx-auto">
        {/* HEADER - REQUIS pour l'identité visuelle */}
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block text-[0.65rem] font-bold tracking-widest uppercase bg-[#4a9068]/10 text-[#4a9068] px-3 py-1 rounded-sm mb-4">
            Contact
          </span>
          <h1 className="font-serif-custom text-3xl md:text-4xl lg:text-5xl font-light text-[#0d2818] mb-4">
            Prenez <span className="text-[#4a9068] italic">rendez-vous</span>
          </h1>
          <p className="text-sm md:text-base text-[#5a7a64] max-w-2xl mx-auto">
            Pour toute demande d'information, de rendez-vous ou d'assistance consulaire, 
            n'hésitez pas à nous contacter via le formulaire ci-dessous.
          </p>
        </div>

        {/* MESSAGE DE SUCCÈS - OPTIONNEL (affiché seulement si présent) */}
        {success && (
          <div className="mb-6 md:mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-[slideUp_0.3s_ease]">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* MESSAGE D'ERREUR GLOBAL - OPTIONNEL (affiché seulement si présent) */}
        {errors.submit && (
          <div className="mb-6 md:mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-[slideUp_0.3s_ease]">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{errors.submit}</p>
          </div>
        )}

        {/* CONTACT CARDS - REQUIS pour l'information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {contactCards.map((card) => (
            <div
              key={card.id}
              className={`${card.bgColor} rounded-xl overflow-hidden border border-[#c8ddd0] transition-all duration-300 hover:shadow-md`}
            >
              {/* Version mobile avec accordéon - OPTIONNEL (amélioration UX mobile) */}
              <button
                onClick={() => toggleCard(card.id)}
                className="w-full flex items-center justify-between p-4 md:cursor-default lg:hidden"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  <span className="font-serif-custom text-base font-medium text-[#0d2818]">
                    {card.title}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[#4a9068] transition-transform duration-300 ${
                    expandedCard === card.id ? 'rotate-180' : ''
                  } lg:hidden`}
                />
              </button>

              {/* Version desktop header - REQUIS */}
              <div className="hidden lg:flex items-center gap-3 p-4 border-b border-[#c8ddd0]">
                <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center`}>
                  {card.icon}
                </div>
                <span className="font-serif-custom text-base font-medium text-[#0d2818]">
                  {card.title}
                </span>
              </div>

              {/* CONTENU DE LA CARTE - REQUIS */}
              <div
                className={`px-4 pb-4 md:px-4 md:pb-4 ${
                  expandedCard === card.id || mounted && window.innerWidth >= 1024
                    ? 'block'
                    : 'hidden lg:block'
                }`}
              >
                {card.content}
              </div>
            </div>
          ))}
        </div>

        {/* GRILLE PRINCIPALE: FORMULAIRE + CARTE - REQUIS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* FORMULAIRE DE CONTACT - REQUIS */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#c8ddd0]">
            <div className="p-6 md:p-8">
              <h2 className="font-serif-custom text-2xl font-normal text-[#0d2818] mb-6">
                Envoyez-nous un <span className="text-[#4a9068] italic">message</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Champs Prénom/Nom - OPTIONNELS */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#5a7a64] mb-1.5">
                      Prénom <span className="text-[#8ab89a]">(optionnel)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab89a]" />
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleInputChange}
                        autoComplete="given-name"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#f4f8f5] border border-[#c8ddd0] rounded-lg focus:ring-none hover:border-green-500 focus:outline-none focus:border-green-600 transition-colors"
                        placeholder="Jean"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5a7a64] mb-1.5">
                      Nom <span className="text-[#8ab89a]">(optionnel)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab89a]" />
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleInputChange}
                        autoComplete="family-name"
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#f4f8f5] border border-[#c8ddd0] rounded-lg focus:ring-none hover:border-green-500 focus:outline-none focus:border-green-600 transition-colors"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>
                </div>

                {/* Téléphone - OPTIONNEL */}
                <div>
                  <label className="block text-xs font-medium text-[#5a7a64] mb-1.5">
                    Téléphone <span className="text-[#8ab89a]">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab89a]" />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      autoComplete="tel"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#f4f8f5] border border-[#c8ddd0] rounded-lg focus:ring-none hover:border-green-500 focus:outline-none focus:border-green-600 transition-colors"
                      placeholder="+212 6XX XX XX XX"
                    />
                  </div>
                </div>

                {/* Email - REQUIS */}
                <div>
                  <label className="block text-xs font-medium text-[#5a7a64] mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8ab89a]" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      autoComplete="email"
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-[#f4f8f5] border rounded-lg focus:ring-none hover:border-green-500 focus:outline-none focus:border-green-600 transition-colors ${
                        errors.email ? 'border-red-300' : 'border-[#c8ddd0]'
                      }`}
                      placeholder="votre@email.com"
                    />
                  </div>
                  {/* Message d'erreur email - OPTIONNEL (affiché seulement si erreur) */}
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message - REQUIS */}
                <div>
                  <label className="block text-xs font-medium text-[#5a7a64] mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#8ab89a]" />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm bg-[#f4f8f5] border rounded-lg focus:ring-none hover:border-green-500 focus:outline-none focus:border-green-600 transition-colors resize-none ${
                        errors.message ? 'border-red-300' : 'border-[#c8ddd0]'
                      }`}
                      placeholder="Votre message..."
                    />
                  </div>
                  {/* Message d'erreur message - OPTIONNEL (affiché seulement si erreur) */}
                  {errors.message && (
                    <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Bouton de soumission - REQUIS */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#4a9068] text-white py-3 px-4 rounded-lg text-sm font-medium tracking-wider uppercase hover:bg-[#2d6147] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* CARTE GOOGLE MAPS - REQUIS */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#c8ddd0] h-full">
            <div className="aspect-4/3 md:aspect-video lg:aspect-4/3 w-full bg-[#e8f2ec] relative">
              <iframe
                title="Ambassade du Mali à Rabat, Maroc"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4039198.448667231!2d-13.20700388879403!3d31.325194541018675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b58c31acae1%3A0xbad3a00a7a2c2b43!2sEmbassy%20of%20Mali!5e0!3m2!1sen!2sma!4v1771524056656!5m2!1sen!2sma"
                className="absolute inset-0"
              />
            </div>
            <div className="p-4 md:p-6 bg-white">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#4a9068] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm md:text-base text-[#0d2818] font-medium">
                    Ambassade de la République du Mali
                  </p>
                  <p className="text-xs md:text-sm text-[#5a7a64] mt-1">
                    24, Avenue Moulay Youssef, Quartier des Ambassades<br />
                    Rabat 10000, Maroc
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-[#5a7a64]">
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>Ambassade officielle</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span>Services consulaires</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}