// components/Faq.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'visa' | 'consulaire' | 'urgence' | 'general';
  isNew?: boolean;
  details?: string[];
  contactInfo?: {
    title: string;
    text: string;
    link?: {
      text: string;
      url: string;
    };
  };
  links?: Array<{
    text: string;
    url: string;
    icon: string;
  }>;
}

const faqItems: FAQItem[] = [
  {
    id: 1,
    question: 'Comment obtenir un visa pour le Mali depuis le Maroc ?',
    answer:
      "Pour obtenir un visa pour le Mali, vous devez soumettre une demande à l'ambassade avec les documents requis. Le traitement prend généralement 5 à 7 jours ouvrables.",
    category: 'visa',
    isNew: true,
    details: [
      'Passeport valide minimum 6 mois',
      'Formulaire de demande complété',
      "2 photos d'identité récentes",
      'Justificatif de résidence au Maroc',
      "Billet d'avion aller-retour",
    ],
    links: [
      {
        text: 'Télécharger formulaire',
        url: '/documents/visa-form.pdf',
        icon: 'download',
      },
      { text: 'Tarifs visa', url: '/services/visa-fees', icon: 'banknotes' },
    ],
  },
  {
    id: 2,
    question: 'Quelle est la procédure pour légaliser des documents ?',
    answer:
      "La légalisation des documents se fait en deux étapes : certification par les autorités marocaines, puis légalisation par l'ambassade. Le processus complet prend 2 à 3 jours.",
    category: 'consulaire',
    details: [
      'Document original à légaliser',
      'Copie certifiée conforme',
      "Pièce d'identité du demandeur",
      'Formulaire de demande spécifique',
    ],
  },
  {
    id: 3,
    question: 'Que faire en cas de perte de passeport au Maroc ?',
    answer:
      "En cas de perte ou vol de passeport, vous devez immédiatement déclarer la perte à la police locale, puis vous présenter à l'ambassade pour obtenir un laissez-passer ou un nouveau passeport.",
    category: 'urgence',
    contactInfo: {
      title: 'Urgence 24/7',
      text: "Composez le +212 537 75 91 21 en cas d'urgence",
      link: {
        text: "Voir tous les contacts d'urgence",
        url: '/contact/urgence',
      },
    },
  },
  {
    id: 4,
    question:
      'Comment obtenir un acte de naissance pour un enfant né au Maroc ?',
    answer:
      "Pour les enfants nés au Maroc de parents maliens, l'ambassade peut établir un acte de naissance consulaire. Vous devez fournir l'acte de naissance marocain et les documents d'identité des parents.",
    category: 'consulaire',
  },
  {
    id: 5,
    question: "Quels sont les horaires d'ouverture de l'ambassade ?",
    answer:
      "L'ambassade est ouverte du lundi au vendredi de 9h00 à 17h00, et le samedi de 9h00 à 13h00. Les services consulaires sont assurés sur rendez-vous.",
    category: 'general',
    details: [
      'Lundi à Vendredi : 9h00 - 17h00',
      'Samedi : 9h00 - 13h00',
      'Fermé les dimanches et jours fériés',
    ],
  },
  {
    id: 6,
    question:
      "Comment renouveler une carte d'identité malienne depuis le Maroc ?",
    answer:
      "Le renouvellement de la carte d'identité malienne se fait sur présentation de l'ancienne carte (ou déclaration de perte), 2 photos d'identité, et le formulaire de demande. Le délai est d'environ 4 semaines.",
    category: 'consulaire',
  },
  {
    id: 7,
    question: "Quelle assistance en cas d'arrestation ou de détention ?",
    answer:
      "L'ambassade peut fournir une assistance consulaire aux citoyens maliens arrêtés ou détenus, y compris des visites en prison, l'aide pour obtenir un avocat, et le contact avec la famille.",
    category: 'urgence',
    contactInfo: {
      title: "Assistance consulaire d'urgence",
      text: 'Service disponible 24h/24 pour les citoyens maliens en détresse',
      link: {
        text: "Consulter nos services d'urgence",
        url: '/services/urgence',
      },
    },
  },
  {
    id: 8,
    question: 'Comment fonctionne le service de rapatriement ?',
    answer:
      "En cas de nécessité (maladie grave, décès, crise), l'ambassade peut assister pour le rapatriement. Les frais sont généralement à la charge du citoyen ou de sa famille.",
    category: 'urgence',
  },
  {
    id: 9,
    question: 'Comment obtenir un extrait de casier judiciaire ?',
    answer:
      "L'extrait de casier judiciaire peut être demandé à l'ambassade. Il faut fournir une copie de la carte d'identité, une photo d'identité et remplir le formulaire dédié.",
    category: 'consulaire',
  },
];

const getCategoryClass = (category: string) => {
  const classes: Record<string, string> = {
    visa: 'bg-blue-100 text-blue-800',
    consulaire: 'bg-green-100 text-green-800',
    urgence: 'bg-red-100 text-red-800',
    general: 'bg-gray-100 text-gray-800',
  };
  return classes[category] || classes.general;
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    visa: 'Visa',
    consulaire: 'Service consulaire',
    urgence: 'Urgence',
    general: 'Général',
  };
  return labels[category] || 'Général';
};

export default function Faq() {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQs = faqItems.filter(faq => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    return (
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      getCategoryLabel(faq.category).toLowerCase().includes(query)
    );
  });

  const currentFAQ = filteredFAQs[currentIndex];

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = '';
  };

  const navigateModal = (direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < filteredFAQs.length) {
      setCurrentIndex(newIndex);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!showModal) return;

      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        navigateModal(-1);
      } else if (
        e.key === 'ArrowRight' &&
        currentIndex < filteredFAQs.length - 1
      ) {
        navigateModal(1);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [showModal, currentIndex, filteredFAQs.length]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
            <div className="h-5 w-5 flex items-center justify-center">
              <span>?</span>
            </div>
            <span className="text-sm font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Trouvez rapidement des réponses aux questions les plus courantes
            concernant nos services consulaires.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-green-400 focus:ring-4 focus:ring-green-100 focus:outline-none focus:border-green-500 text-gray-900 placeholder-gray-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 ml-1">
              {filteredFAQs.length} question
              {filteredFAQs.length !== 1 ? 's' : ''} trouvée
              {filteredFAQs.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* FAQ Cards */}
            {filteredFAQs.map((faq, index) => (
              <div
                key={faq.id}
                className="group cursor-pointer"
                onClick={() => openModal(index)}
              >
                <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-2xl overflow-hidden h-full hover:border-green-300 hover:scale-[1.02] transition-all duration-300">
                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                        <span className="text-lg font-bold">?</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700">
                          {faq.question}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryClass(faq.category)}`}
                          >
                            {getCategoryLabel(faq.category)}
                          </span>
                          {faq.isNew && (
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                              Nouveau
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Answer Preview */}
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {faq.answer}
                    </p>

                    {/* Click Indicator */}
                    <div className="flex items-center text-green-600 font-semibold text-sm group-hover:text-green-700">
                      <span>Voir la réponse complète</span>
                      <ChevronRight className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-16 col-span-1 sm:col-span-2 lg:col-span-3">
              <div className="w-24 h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucune question trouvée
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8 text-lg">
                Essayez avec d'autres mots-clés ou consultez nos catégories.
              </p>
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-6 py-3 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="h-5 w-5 mr-3 rotate-180">
                  <ChevronRight className="h-5 w-5" />
                </div>
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && currentFAQ && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/60" onClick={closeModal}></div>

          {/* Modal Content */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative transform overflow-hidden rounded-3xl bg-white shadow-2xl w-full max-w-4xl">
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b-2 border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                      <span className="text-xl font-bold">?</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentFAQ.question}
                      </h2>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${getCategoryClass(currentFAQ.category)}`}
                        >
                          {getCategoryLabel(currentFAQ.category)}
                        </span>
                        {currentFAQ.isNew && (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                            <Sparkles className="h-4 w-4 mr-1.5" />
                            Nouveau
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    aria-label="Fermer"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-7">
                <div className="space-y-6">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {currentFAQ.answer}
                  </p>

                  {/* Additional Details */}
                  {currentFAQ.details && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-gray-900">
                        Documents requis :
                      </h4>
                      <ul className="space-y-3">
                        {currentFAQ.details.map((detail, i) => (
                          <li key={i} className="flex items-start">
                            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center mr-4 mt-0.5 shrink-0">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="text-gray-700 text-lg">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Contact Info */}
                  {currentFAQ.contactInfo && (
                    <div className="p-6 bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                          <Info className="h-7 w-7 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-green-900 text-lg mb-2">
                            {currentFAQ.contactInfo.title}
                          </h4>
                          <p className="text-green-800/90 text-lg mb-3">
                            {currentFAQ.contactInfo.text}
                          </p>
                          {currentFAQ.contactInfo.link && (
                            <a
                              href={currentFAQ.contactInfo.link.url}
                              className="inline-flex items-center text-green-700 hover:text-green-800 font-semibold text-lg"
                            >
                              {currentFAQ.contactInfo.link.text}
                              <ChevronRight className="h-5 w-5 ml-2" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Useful Links */}
                  {currentFAQ.links && currentFAQ.links.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-gray-900">
                        Liens utiles :
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {currentFAQ.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url}
                            className="inline-flex items-center px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-lg font-semibold transition-colors"
                          >
                            <span className="mr-3">
                              {link.icon === 'download' ? '📥' : '💰'}
                            </span>
                            {link.text}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t-2 border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateModal(-1)}
                    disabled={currentIndex === 0}
                    className={`inline-flex items-center px-5 py-3 text-lg font-semibold rounded-xl transition-colors ${
                      currentIndex === 0
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5 mr-3" />
                    Précédent
                  </button>

                  <div className="text-lg text-gray-500 font-semibold">
                    Question {currentIndex + 1} sur {filteredFAQs.length}
                  </div>

                  <button
                    onClick={() => navigateModal(1)}
                    disabled={currentIndex === filteredFAQs.length - 1}
                    className={`inline-flex items-center px-5 py-3 text-lg font-semibold rounded-xl transition-colors ${
                      currentIndex === filteredFAQs.length - 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Suivant
                    <ChevronRight className="h-5 w-5 ml-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
