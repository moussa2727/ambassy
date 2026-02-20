'use client';

import Link from 'next/link';
import {
  FaFlag,
  FaCalendarAlt,
  FaClipboardList,
  FaCompass,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaArrowRight,
} from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden border-2 border-b-green-500">
      <div className="pt-16 sm:pt-20 md:pt-24">
        {/* Background avec video */}
        <div className="absolute inset-0">
          <video
            src="/videos/mali-heritage.mp4"
            title="Ambassade du Mali au Maroc"
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-linear-to-br from-green-900/85 via-green-800/80 to-emerald-700/75"></div>
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
          {/* Conteneur principal avec disposition responsive */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8">
            {/* Section Titre et Texte (toujours à gauche) */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-full px-3 py-1 mb-4">
                <FaFlag size={12} className="text-green-300" />
                <span className="text-green-300 text-xs font-medium">
                  Représentation Diplomatique
                </span>
              </div>

              {/* Titre principal */}
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 leading-tight">
                Ambassade du
                <span className="text-green-400 block">Mali</span>
              </h1>

              <p className="text-lg lg:text-xl text-green-300 font-semibold mb-4">
                au Royaume du Maroc
              </p>

              <p className="text-base lg:text-lg text-gray-100 mb-6 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
                Au service des{' '}
                <strong className="text-green-400">citoyens maliens</strong>{' '}
                résidant ou visitant le{' '}
                <strong className="text-green-400">Maroc</strong>, notre
                ambassade s'engage à fournir des informations fiables et un
                accompagnement personnalisé pour toutes vos démarches
                administratives, y compris les demandes de{' '}
                <strong className="text-green-400">visa</strong>, de{' '}
                <strong className="text-green-400">passeport</strong> et les
                services consulaires. Nous œuvrons également à renforcer les
                relations bilatérales entre le{' '}
                <strong className="text-green-400">Mali</strong> et le{' '}
                <strong className="text-green-400">Maroc</strong>, tout en
                garantissant la sécurité et le bien-être de nos citoyens à
                l'étranger. Notre équipe reste disponible pour répondre à vos
                questions, vous fournir des conseils pratiques et faciliter
                votre séjour ou vos démarches dans le respect des procédures
                officielles.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center lg:justify-start">
                <Link
                  href="/"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-sm flex items-center gap-2 justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 hover:scale-105"
                >
                  <FaCalendarAlt size={16} />
                  Rendez-Vous
                </Link>
                <Link
                  href="/services"
                  className="border border-green-500 text-green-400 hover:bg-green-500 hover:bg-opacity-10 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 text-sm flex items-center gap-2 justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
                >
                  <FaClipboardList size={16} />
                  Services
                </Link>
              </div>

              {/* Indicateurs */}
              <div className="flex flex-wrap gap-6 mt-6 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">24/7</div>
                  <div className="text-xs text-gray-300">Assistance</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">100%</div>
                  <div className="text-xs text-gray-300">Engagement</div>
                </div>
              </div>
            </div>

            {/* Section Informations Visa */}
            <div className="w-full lg:w-1/2 mt-8 lg:mt-25 order-last lg:order-0 flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Carte d'informations */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20 overflow-hidden">
                  {/* En-tête */}
                  <div className="bg-linear-to-r from-green-600 to-emerald-700 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <FaCompass size={16} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">
                          Informations Clées
                        </h3>
                        <p className="text-white/80 text-xs">
                          Règles et procédures
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-4 space-y-4">
                    {/* Alerte */}
                    <div className="bg-red-600/20 border border-red-500/50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <FaShieldAlt
                          size={16}
                          className="text-red-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <h4 className="font-semibold text-red-300 text-xs mb-1">
                            Important
                          </h4>
                          <p className="text-red-200 text-xs">
                            Aucun visa délivré à l'entrée ne dépasse 90 jours
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Types de visa */}
                    <div className="space-y-3">
                      {/* Visa à l'arrivée */}
                      <div className="flex items-start gap-2 p-2 bg-green-500/20 rounded-lg">
                        <FaCheckCircle
                          size={16}
                          className="text-green-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-white text-sm font-medium">
                            Visa à l'arrivée
                          </p>
                          <p className="text-gray-300 text-xs">
                            30 ou 90 jours, non renouvelable sur place
                          </p>
                        </div>
                      </div>

                      {/* Visa long séjour */}
                      <div className="flex items-start gap-2 p-2 bg-emerald-500/20 rounded-lg">
                        <FaCalendarAlt
                          size={16}
                          className="text-emerald-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-white text-sm font-medium">
                            Visa long séjour
                          </p>
                          <p className="text-gray-300 text-xs">
                            Sur demande préalable uniquement
                          </p>
                        </div>
                      </div>

                      {/* Carte de Séjour */}
                      <div className="flex items-start gap-2 p-2 bg-green-600/20 rounded-lg">
                        <FaClipboardList
                          size={16}
                          className="text-green-400 mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-white text-sm font-medium">
                            Carte de séjour
                          </p>
                          <p className="text-gray-300 text-xs">
                            À demander après entrée sur le territoire Marocain
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards - cachées sur mobile, visibles sur tablette et desktop */}
          <div className="mt-12 hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center shrink-0">
                  <FaArrowRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-green-700 dark:text-green-300 text-base mb-1">
                    Assistance
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Soutien et accompagnement pour les citoyens maliens au Maroc
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <FaClock
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <h3 className="font-semibold text-green-800 dark:text-green-300 text-base">
                  Horaires
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Lun - Ven : 9h00 - 17h00
                <br />
                Sam : 9h00 - 13h00
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <FiPhone
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <h3 className="font-semibold text-green-800 dark:text-green-300 text-base">
                  Contact
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                +212 537 75 91 21
                <br />
                +212 537 75 91 25
                <br />
                ambamalirabat@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
