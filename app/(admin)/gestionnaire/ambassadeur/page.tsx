"use client";

import { useState } from 'react';
import Head from 'next/head';
import { AmbassadorData } from '@/components/about/Ambassador';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiUsers,
  FiCalendar,
  FiMoreVertical,
  FiEye,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';
import { FiMapPin } from 'react-icons/fi';

interface Ambassador {
  id: number;
  data: AmbassadorData;
  statut: 'actif' | 'inactif';
  dateNomination: string;
}

export default function AmbassadorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPays, setFilterPays] = useState<string>('tous');
  const [filterStatut, setFilterStatut] = useState<string>('tous');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAmbassador, setSelectedAmbassador] =
    useState<Ambassador | null>(null);

  // Données fictives pour les ambassadeurs
  const [ambassadeurs, setAmbassadeurs] = useState<Ambassador[]>([
    {
      id: 1,
      data: {
        nom: 'M. Sidibé Aliou',
        pays: 'Maroc',
        ville: 'Rabat',
        description:
          "Diplômé en Relations Internationales avec une spécialisation en Coopération Éducative, Aliou accompagne les étudiants marocains et africains francophones dans leurs projets d'études à l'étranger depuis plus de 7 ans.",
        domainesExpertise: [
          "Procédures d'admission internationales",
          "Bourses et financements d'études",
          'Équivalence des diplômes',
          'Préparation aux entretiens visa',
        ],
        realisations:
          'En 2023, Aliou a accompagné avec succès plus de 150 étudiants marocains vers des universités prestigieuses en Europe et en Amérique du Nord.',
        image: '/images/ambassador.webp',
        citation:
          "Mon engagement est de transformer le rêve d'études à l'étranger en réalité tangible pour chaque étudiant.",
      },
      statut: 'actif',
      dateNomination: '2020-01-15',
    },
  ]);

  const filteredAmbassadeurs = ambassadeurs.filter(ambassadeur => {
    const matchesSearch =
      ambassadeur.data.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambassadeur.data.pays.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambassadeur.data.ville.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPays =
      filterPays === 'tous' || ambassadeur.data.pays === filterPays;
    const matchesStatut =
      filterStatut === 'tous' || ambassadeur.statut === filterStatut;

    return matchesSearch && matchesPays && matchesStatut;
  });

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'actif':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'inactif':
        return <FiXCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'inactif':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaysColor = (pays: string) => {
    const colors: { [key: string]: string } = {
      Maroc: 'bg-red-100 text-red-800',
      France: 'bg-blue-100 text-blue-800',
      Canada: 'bg-red-100 text-red-800',
      Belgique: 'bg-yellow-100 text-yellow-800',
      Suisse: 'bg-red-100 text-red-800',
    };
    return colors[pays] || 'bg-gray-100 text-gray-800';
  };

  const applyAsDefault = (ambassadorData: AmbassadorData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ambassadorData', JSON.stringify(ambassadorData));
      alert(
        'Les données ont été appliquées comme données par défaut pour le composant Ambassador.'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Gestion des Ambassadeurs - Ambassade Du Mali Au Maroc</title>
        <meta
          name="description"
          content="Gestionnaire des ambassadeurs diplomatiques et éducatifs de l'ambassade du Mali"
        />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Ambassadeurs
            </h1>
            <p className="text-gray-600 mt-1">
              Administrer les représentants diplomatiques et éducatifs
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <FiPlus size={18} />
            <span>Nouvel Ambassadeur</span>
          </button>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, pays ou ville..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filtre par pays */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={filterPays}
                onChange={e => setFilterPays(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-none hover:border-emerald-500 focus:border-emerald-500 appearance-none bg-white"
              >
                <option value="tous">Tous les pays</option>
                <option value="Maroc">Maroc</option>
                <option value="France">France</option>
                <option value="Canada">Canada</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
              </select>
            </div>

            {/* Filtre par statut */}
            <div className="relative">
              <select
                value={filterStatut}
                onChange={e => setFilterStatut(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-none hover:border-emerald-500 focus:border-emerald-500 appearance-none bg-white"
              >
                <option value="tous">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Ambassadeurs
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {ambassadeurs.length}
                </p>
              </div>
              <FiUsers className="h-12 w-12 text-gray-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actifs</p>
                <p className="text-3xl font-bold text-green-600">
                  {ambassadeurs.filter(a => a.statut === 'actif').length}
                </p>
              </div>
              <FiCheckCircle className="h-12 w-12 text-green-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactifs</p>
                <p className="text-3xl font-bold text-red-600">
                  {ambassadeurs.filter(a => a.statut === 'inactif').length}
                </p>
              </div>
              <FiXCircle className="h-12 w-12 text-red-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pays représentés
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {new Set(ambassadeurs.map(a => a.data.pays)).size}
                </p>
              </div>
              <FiMapPin className="h-12 w-12 text-blue-100" />
            </div>
          </div>
        </div>

        {/* Liste des ambassadeurs */}
        {/* Vue mobile - Cartes */}
        <div className="block md:hidden space-y-4">
          {filteredAmbassadeurs.map(ambassadeur => (
            <div
              key={ambassadeur.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(ambassadeur.statut)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {ambassadeur.data.nom}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ambassadeur.data.pays} - {ambassadeur.data.ville}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => {
                      setSelectedAmbassador(ambassadeur);
                      setShowDetailsModal(true);
                    }}
                  >
                    <FiEye size={16} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    <FiMoreVertical size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaysColor(ambassadeur.data.pays)}`}
                  >
                    {ambassadeur.data.pays}
                  </span>
                </div>
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ambassadeur.statut)}`}
                  >
                    {ambassadeur.statut === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <FiCalendar size={14} />
                  <span>
                    Nommé le{' '}
                    {new Date(ambassadeur.dateNomination).toLocaleDateString(
                      'fr-FR'
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Vue desktop - Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ambassadeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date nomination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAmbassadeurs.map(ambassadeur => (
                <tr key={ambassadeur.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="shrink-0">
                        {getStatusIcon(ambassadeur.statut)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs">
                          {ambassadeur.data.nom}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {ambassadeur.data.description.substring(0, 100)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaysColor(ambassadeur.data.pays)}`}
                    >
                      {ambassadeur.data.pays}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ambassadeur.statut)}`}
                    >
                      {ambassadeur.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiMapPin className="h-4 w-4 text-gray-400 mr-1" />
                      {ambassadeur.data.ville}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiCalendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(ambassadeur.dateNomination).toLocaleDateString(
                        'fr-FR'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-emerald-600 hover:text-emerald-900 p-1"
                        onClick={() => {
                          setSelectedAmbassador(ambassadeur);
                          setShowDetailsModal(true);
                        }}
                      >
                        <FiEye size={16} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 p-1">
                        <FiEdit3 size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1">
                        <FiTrash2 size={16} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-1">
                        <FiMoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAmbassadeurs.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun ambassadeur trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun ambassadeur ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* Modal de détails */}
        {showDetailsModal && selectedAmbassador && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Détails de l'ambassadeur
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Informations générales
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nom complet
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedAmbassador.data.nom}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Pays représenté
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedAmbassador.data.pays}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ville
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedAmbassador.data.ville}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Date de nomination
                        </label>
                        <p className="text-sm text-gray-900">
                          {new Date(
                            selectedAmbassador.dateNomination
                          ).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Statut
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedAmbassador.statut === 'actif'
                            ? 'Actif'
                            : 'Inactif'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedAmbassador.data.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Expertise et réalisations
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Domaines d'expertise
                        </label>
                        <ul className="text-sm text-gray-900 list-disc list-inside">
                          {selectedAmbassador.data.domainesExpertise.map(
                            (domaine, index) => (
                              <li key={index}>{domaine}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Réalisations marquantes
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedAmbassador.data.realisations}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Citation
                        </label>
                        <p className="text-sm text-gray-900 italic">
                          "{selectedAmbassador.data.citation}"
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Image
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedAmbassador.data.image}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => applyAsDefault(selectedAmbassador.data)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Appliquer comme défaut
                  </button>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
