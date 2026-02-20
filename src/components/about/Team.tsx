// components/About/Team.tsx
'use client';

import { useState, useEffect } from 'react';
import { Crown, GraduationCap, Building2, Users, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  credentials: string;
  roleIcon: React.ReactNode;
  bio: string;
  photo: string;
}

export default function Team() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const leadershipTeam: TeamMember[] = [
    {
      id: 1,
      name: 'M. Sidibé Aliou',
      position: 'Ambassadeur',
      credentials: 'Ancien Directeur des Affaires Africaines',
      roleIcon: <Crown className="w-5 h-5 text-emerald-600" />,
      bio: "Diplomate de carrière avec plus de 25 ans d'expérience dans les relations internationales et la négociation diplomatique au service du Mali.",
      photo: '/images/ambassador.webp', // Utilise l'image existante
    },
    {
      id: 2,
      name: 'Dr. Fatoumata Keita',
      position: 'Conseillère Diplomatique',
      credentials: 'Docteur en Relations Internationales',
      roleIcon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
      bio: "Spécialiste des questions géopolitiques et des négociations multilatérales, ancienne professeure à l'Université de Bamako.",
      photo: '/images/ambassador.webp', // Utilise l'image existante
    },
    {
      id: 3,
      name: 'M. Boubacar Traoré',
      position: 'Directeur Administratif',
      credentials: 'Expert en gestion publique',
      roleIcon: <Building2 className="w-5 h-5 text-emerald-600" />,
      bio: 'Gestionnaire expérimenté avec une expertise en administration publique et gestion de projets internationaux pour le développement.',
      photo: '/images/ambassador.webp', // Utilise l'image existante
    },
  ];

  // Fonction pour obtenir les images de fallback (à utiliser si vous n'avez pas vos propres images)
  const getFallbackImage = (id: number) => {
    const fallbacks = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    ];
    return fallbacks[id - 1] || fallbacks[0];
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de section - Mobile First */}
        <div
          className={`text-center mb-10 sm:mb-14 lg:mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Badge d'identification */}
          <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm sm:shadow-lg">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
          </div>

          {/* Titre principal */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Notre Équipe Diplomatique
          </h1>

          {/* Sous-titre */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Rencontrez les membres dévoués de notre ambassade qui œuvrent
            quotidiennement au renforcement des relations entre le Mali et le
            Maroc
          </p>
        </div>

        {/* Équipe de direction - Responsive Grid */}
        <div className="mb-10 sm:mb-14 lg:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {leadershipTeam.map((member, index) => (
              <div
                key={member.id}
                className={`bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Section photo avec effet hover */}
                <div className="relative overflow-hidden h-48 sm:h-56 lg:h-64">
                  {/* Image de profil */}
                  <div className="relative w-full h-full">
                    <Image
                      src={
                        member.photo.startsWith('http')
                          ? member.photo
                          : getFallbackImage(member.id)
                      }
                      alt={`Portrait de ${member.name}`}
                      width={800}
                      height={400}
                      className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                      onError={e => {
                        // Fallback vers une image Unsplash en cas d'erreur
                        const target = e.target as HTMLImageElement;
                        target.src = getFallbackImage(member.id);
                      }}
                    />
                  </div>
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white text-xs sm:text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-3 h-3" />
                        <span>Ambassade du Mali au Maroc</span>
                      </div>
                    </div>
                  </div>

                  {/* Badge de rôle */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                    <div className="flex items-center gap-1">
                      {member.roleIcon}
                      <span className="text-xs font-medium text-emerald-700">
                        {member.position}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contenu de la carte */}
                <div className="p-4 sm:p-6">
                  {/* En-tête avec icône et informations */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {/* Icône du rôle */}
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                      {member.roleIcon}
                    </div>

                    {/* Informations du membre */}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-emerald-600 font-medium text-sm sm:text-base">
                        {member.position}
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        {member.credentials}
                      </p>
                    </div>
                  </div>

                  {/* Biographie */}
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-4 sm:mb-5">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div
          className={`mt-10 sm:mt-12 lg:mt-16 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Une équipe à votre service
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
              Notre équipe diplomatique est à votre disposition pour répondre à
              toutes vos questions et vous accompagner dans vos démarches.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/rendez-vous"
                className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base"
              >
                Prendre rendez-vous
              </Link>
              <Link
                href="/services"
                className="px-6 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-lg hover:bg-emerald-50 transition-colors text-sm sm:text-base"
              >
                Voir tous les services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
