'use client';

import Link from 'next/link';
import {
  FaUsers,
  FaHandshake,
  FaBriefcase,
  FaGraduationCap,
  FaBullhorn,
  FaEnvelope,
  FaBookOpen,
} from 'react-icons/fa';

interface Mission {
  id: number;
  icone: React.ReactNode;
  titre: string;
  description: string;
  services: string[];
}

export default function Mission() {
  const missions: Mission[] = [
    {
      id: 1,
      icone: <FaUsers size={24} />,
      titre: 'Protection des citoyens',
      description:
        "Assistance et protection des ressortissants maliens résidant au Maroc, y compris l'aide consulaire en cas de besoin.",
      services: [
        'Assistance aux citoyens en difficulté',
        "Émission de documents d'identité et de voyage",
        'Soutien juridique et administratif',
      ],
    },
    {
      id: 2,
      icone: <FaHandshake size={24} />,
      titre: 'Relations bilatérales',
      description:
        'Renforcement des relations politiques, économiques et culturelles entre le Mali et le Royaume du Maroc.',
      services: [
        'Facilitation des échanges diplomatiques',
        'Organisation de visites officielles',
        'Promotion de la coopération bilatérale',
      ],
    },
    {
      id: 3,
      icone: <FaBriefcase size={24} />,
      titre: 'Promotion économique',
      description:
        "Soutien aux entreprises maliennes et promotion des opportunités d'investissement entre les deux pays.",
      services: [
        'Information sur les opportunités commerciales',
        'Organisation de forums économiques',
        'Soutien aux investisseurs maliens',
      ],
    },
    {
      id: 4,
      icone: <FaGraduationCap size={24} />,
      titre: 'Coopération culturelle',
      description:
        'Promotion de la culture malienne au Maroc et facilitation des échanges éducatifs et culturels.',
      services: [
        "Organisation d'événements culturels",
        'Facilitation des échanges universitaires',
        'Promotion du patrimoine culturel malien',
      ],
    },
    {
      id: 5,
      icone: <FaBookOpen size={24} />,
      titre: 'Services consulaires',
      description:
        'Délivrance de visas, légalisation de documents et autres services administratifs pour les citoyens.',
      services: [
        'Délivrance de visas pour le Mali',
        'Légalisation de documents officiels',
        'Certificats de nationalité et autres actes',
      ],
    },
    {
      id: 6,
      icone: <FaBullhorn size={24} />,
      titre: 'Représentation officielle',
      description:
        'Représentation du gouvernement malien auprès des autorités marocaines et des organisations internationales.',
      services: [
        'Participation aux réunions officielles',
        'Représentation dans les organisations internationales',
        'Communication des positions officielles',
      ],
    },
  ];

  return (
    <section
      id="missions-ambassade"
      className="py-8 md:py-12 lg:py-16 bg-white -mt-3"
      aria-labelledby="missions-titre"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            id="missions-titre"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 mb-4"
          >
            Missions de l'Ambassade
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
            Découvrez les principales missions et responsabilités de l'Ambassade
            du Mali au Royaume du Maroc
          </p>
        </div>

        {/* Grille des missions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {missions.map(mission => (
            <article
              key={mission.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col"
            >
              {/* Icône et titre */}
              <div className="p-6 pb-4 flex flex-col items-start text-start">
                <div
                  className="shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3 text-green-600"
                  aria-hidden="true"
                >
                  {mission.icone}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                  {mission.titre}
                </h3>
              </div>

              {/* Description */}
              <div className="px-6 pb-6 grow">
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {mission.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Section d'information complémentaire */}
        <div className="mt-12 md:mt-16 bg-green-100 rounded-lg p-6 md:p-8 border border-green-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
                Une ambassade au service des citoyens maliens
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                L'Ambassade du Mali au Maroc travaille sans relâche pour
                renforcer les relations bilatérales entre les deux pays et
                assister les citoyens maliens résidant au Maroc.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Link
                href="/contact"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center text-sm md:text-base"
              >
                <FaEnvelope size={20} className="mr-2" />
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
