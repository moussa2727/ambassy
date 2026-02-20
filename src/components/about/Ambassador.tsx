'use client';

import { FiMapPin, FiUsers, FiMessageCircle } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import Image from 'next/image';
import { useMemo } from 'react';

export interface AmbassadorData {
  nom: string;
  pays: string;
  ville: string;
  description: string;
  domainesExpertise: string[];
  realisations: string;
  image: string;
  citation: string;
}

interface AmbassadorProps {
  ambassador?: AmbassadorData;
}

const getCountryCode = (pays: string) => {
  const codes: { [key: string]: string } = {
    Maroc: 'MAR',
    France: 'FRA',
    Canada: 'CAN',
    Belgique: 'BEL',
    Suisse: 'CHE',
    Mali: 'MLI',
  };
  return codes[pays] || pays.substring(0, 3).toUpperCase();
};

export default function Ambassador({ ambassador }: AmbassadorProps) {
  const defaultAmbassador: AmbassadorData = {
    nom: 'M. Sidibé Aliou',
    pays: 'Maroc',
    ville: 'Rabat',
    description:
      "Diplômé en Relations Internationales avec une spécialisation en Coopération Éducative, Aliou accompagne les étudiants marocains et africains francophones dans leurs projets d'études à l'étranger depuis plus de 7 ans. Son expertise couvre un large éventail de destinations : France, Canada, Belgique, Suisse et pays du Golfe.",
    domainesExpertise: [
      "Procédures d'admission internationales",
      "Bourses et financements d'études",
      'Équivalence des diplômes',
      'Préparation aux entretiens visa',
    ],
    realisations:
      "En 2023, Aliou a accompagné avec succès plus de 150 étudiants marocains vers des universités prestigieuses en Europe et en Amérique du Nord. Il a également développé des partenariats exclusifs avec 12 établissements d'enseignement supérieur à travers le monde, facilitant ainsi l'accès à des programmes d'études adaptés aux profils africains.",
    image: '/images/ambassador.webp',
    citation:
      "Mon engagement est de transformer le rêve d'études à l'étranger en réalité tangible pour chaque étudiant. La réussite de nos jeunes est la plus belle des récompenses.",
  };

  // Optimiser la récupération des données avec useMemo
  const data = useMemo(() => {
    // Vérifier si des données sont stockées dans localStorage
    const storedData =
      typeof window !== 'undefined'
        ? localStorage.getItem('ambassadorData')
        : null;
    const parsedStoredData = storedData ? JSON.parse(storedData) : null;
    return ambassador || parsedStoredData || defaultAmbassador;
  }, [ambassador]);

  // Optimiser le code pays avec useMemo
  const countryCode = useMemo(() => getCountryCode(data.pays), [data.pays]);

  // Optimiser l'alt text avec useMemo
  const imageAlt = useMemo(
    () => `${data.nom} - Ambassadeur ${data.pays}`,
    [data.nom, data.pays]
  );

  return (
    <section className="py-8 px-4 sm:py-12 sm:px-6 lg:px-8 bg-green-50/25">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile First */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-2">
            Notre Représentant Officiel
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Ambassadeur <span className="text-green-600">{data.pays}</span>
          </h2>
        </div>

        {/* Card Container - Responsive Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 bg-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          {/* Content Section - First on Mobile, Left on Desktop */}
          <div className="w-full lg:flex-1 order-2 lg:order-1">
            <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-900 mb-2">
              {data.nom}
            </h3>

            <p className="text-green-600 font-medium mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
              <FiMapPin className="h-4 w-4 shrink-0" />
              {data.ville}, {data.pays}
            </p>

            <p className="text-gray-600 mb-4 sm:mb-5 leading-relaxed text-sm sm:text-base">
              {data.description}
            </p>

            {/* Domaines d'expertise */}
            <div className="mb-4 sm:mb-5">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                <FaGraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0" />
                Domaines d'expertise
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                {data.domainesExpertise.map(
                  (domaine: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full mt-1.5 sm:mt-2 shrink-0"></div>
                      <span className="text-gray-700 text-xs sm:text-sm">
                        {domaine}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Réalisations marquantes */}
            <div className="mb-4 sm:mb-5">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                <FiUsers className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0" />
                Réalisations marquantes
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {data.realisations}
              </p>
            </div>
          </div>

          {/* Image Section - Top on Mobile, Right on Desktop */}
          <div className="w-full lg:flex-1 order-1 lg:order-2 max-w-xs sm:max-w-sm lg:max-w-none mx-auto">
            <div className="relative">
              {/* Profile Image with responsive sizing */}
              <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 rounded-xl overflow-hidden shadow-lg border-4 border-green-500">
                <Image
                  src={`${data.image}`}
                  alt={imageAlt}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  fill
                  className="object-cover"
                  priority
                  loading="eager"
                />
              </div>

              {/* Country Badge - Responsive positioning */}
              <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-md sm:shadow-lg px-3 sm:px-4 py-1.5 sm:py-2 border border-green-200">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl">{countryCode}</span>
                  <span className="text-xs sm:text-sm font-semibold text-green-600">
                    {data.pays}
                  </span>
                </div>
              </div>
            </div>

            {/* Quote - Responsive spacing */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-green-500">
              <div className="flex items-start gap-2 sm:gap-3">
                <FiMessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5 sm:mt-1 shrink-0" />
                <div>
                  <p className="text-gray-600 italic text-xs sm:text-sm">
                    "{data.citation}"
                  </p>
                  <p className="text-green-600 text-xs font-medium mt-1.5 sm:mt-2">
                    — {data.nom}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
