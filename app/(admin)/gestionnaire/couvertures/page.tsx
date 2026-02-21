"use client";

import { useState, useEffect } from 'react';

import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiMoreVertical,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from 'react-icons/fi';

interface Couverture {
  id: number;
  titre: string;
  type: 'passeport' | 'visa' | 'etat-civil' | 'legalisation' | 'autre';
  statut: 'en cours' | 'terminé';
  region: string;
  dateCreation: string;
  dateExpiration: string;
  beneficiaires: number;
  description: string;
  // Champs personnels
  nomFamille: string;
  prenoms: string;
  dateNaissance: string;
  lieuNaissance: string;
  typeDemande: 'premiere' | 'renouvellement';
  dureeSejour: string;
  photoIdentite: string;
  profession: string;
  lieuProfession: string;
  lieuResidence: string;
  nomPere: string;
  nomMere: string;
  telephone: string;
  email: string;
  // Urgence
  nomUrgence: string;
  telephoneUrgence: string;
  adresseUrgence: string;
}

export default function CouverturesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('tous');
  const [filterStatut, setFilterStatut] = useState<string>('tous');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCouverture, setSelectedCouverture] =
    useState<Couverture | null>(null);

  // Données fictives pour les couvertures
  const [couvertures, setCouvertures] = useState<Couverture[]>([
    {
      id: 1,
      titre: 'Couverture Passeports - Région Nord',
      type: 'passeport',
      statut: 'en cours',
      region: 'Nord',
      dateCreation: '2024-01-15',
      dateExpiration: '2025-01-15',
      beneficiaires: 245,
      description:
        'Couverture complète pour les demandes de passeports dans la région nord',
      nomFamille: 'Diallo',
      prenoms: 'Amadou',
      dateNaissance: '1990-05-15',
      lieuNaissance: 'Bamako',
      typeDemande: 'premiere',
      dureeSejour: '90 jours',
      photoIdentite: 'photo1.jpg',
      profession: 'Ingénieur',
      lieuProfession: 'Bamako',
      lieuResidence: 'Bamako',
      nomPere: 'Diallo Papa',
      nomMere: 'Diallo Mama',
      telephone: '+223 70 00 00 00',
      email: 'amadou.diallo@example.com',
      nomUrgence: 'Diallo Fatou',
      telephoneUrgence: '+223 70 00 00 01',
      adresseUrgence: 'Bamako, Mali',
    },
    {
      id: 2,
      titre: 'Visa Schengen - Europe',
      type: 'visa',
      statut: 'en cours',
      region: 'Europe',
      dateCreation: '2024-02-01',
      dateExpiration: '2024-12-31',
      beneficiaires: 89,
      description:
        'Programme de visas Schengen pour les ressortissants maliens',
      nomFamille: 'Traoré',
      prenoms: 'Amina',
      dateNaissance: '1985-08-20',
      lieuNaissance: 'Sikasso',
      typeDemande: 'renouvellement',
      dureeSejour: '60 jours',
      photoIdentite: 'photo2.jpg',
      profession: 'Enseignante',
      lieuProfession: 'Sikasso',
      lieuResidence: 'Sikasso',
      nomPere: 'Traoré Baba',
      nomMere: 'Traoré Nana',
      telephone: '+223 70 00 00 02',
      email: 'amina.traore@example.com',
      nomUrgence: 'Traoré Oumar',
      telephoneUrgence: '+223 70 00 00 03',
      adresseUrgence: 'Sikasso, Mali',
    },
    {
      id: 3,
      titre: 'État Civil - Bamako',
      type: 'etat-civil',
      statut: 'terminé',
      region: 'Bamako',
      dateCreation: '2024-03-10',
      dateExpiration: '2025-03-10',
      beneficiaires: 156,
      description: "Services d'état civil pour la capitale",
      nomFamille: 'Konaté',
      prenoms: 'Moussa',
      dateNaissance: '1995-12-10',
      lieuNaissance: 'Kayes',
      typeDemande: 'premiere',
      dureeSejour: '30 jours',
      photoIdentite: 'photo3.jpg',
      profession: 'Étudiant',
      lieuProfession: 'Université de Bamako',
      lieuResidence: 'Bamako',
      nomPere: 'Konaté Père',
      nomMere: 'Konaté Mère',
      telephone: '+223 70 00 00 04',
      email: 'moussa.konate@example.com',
      nomUrgence: 'Konaté Sira',
      telephoneUrgence: '+223 70 00 00 05',
      adresseUrgence: 'Kayes, Mali',
    },
    {
      id: 4,
      titre: 'Légalisation Documents',
      type: 'legalisation',
      statut: 'en cours',
      region: 'National',
      dateCreation: '2023-06-01',
      dateExpiration: '2024-06-01',
      beneficiaires: 67,
      description: 'Service de légalisation des documents officiels',
      nomFamille: 'Coulibaly',
      prenoms: 'Fatoumata',
      dateNaissance: '1988-03-25',
      lieuNaissance: 'Mopti',
      typeDemande: 'renouvellement',
      dureeSejour: '45 jours',
      photoIdentite: 'photo4.jpg',
      profession: 'Commerçante',
      lieuProfession: 'Mopti',
      lieuResidence: 'Mopti',
      nomPere: 'Coulibaly Père',
      nomMere: 'Coulibaly Mère',
      telephone: '+223 70 00 00 06',
      email: 'fatoumata.coulibaly@example.com',
      nomUrgence: 'Coulibaly Adama',
      telephoneUrgence: '+223 70 00 00 07',
      adresseUrgence: 'Mopti, Mali',
    },
  ]);

  const filteredCouvertures = couvertures.filter(couverture => {
    const matchesSearch =
      couverture.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      couverture.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'tous' || couverture.type === filterType;
    const matchesStatut =
      filterStatut === 'tous' || couverture.statut === filterStatut;

    return matchesSearch && matchesType && matchesStatut;
  });

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'en cours':
        return <FiAlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'terminé':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'en cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'passeport':
        return 'bg-blue-100 text-blue-800';
      case 'visa':
        return 'bg-purple-100 text-purple-800';
      case 'etat-civil':
        return 'bg-green-100 text-green-800';
      case 'legalisation':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatType = (type: string) => {
    switch (type) {
      case 'passeport':
        return 'Passeport';
      case 'visa':
        return 'Visa';
      case 'etat-civil':
        return 'État Civil';
      case 'legalisation':
        return 'Légalisation';
      default:
        return type;
    }
  };

  const calculateAge = (dateNaissance: string) => {
    const birthDate = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleViewDetails = (couverture: Couverture) => {
    setSelectedCouverture(couverture);
    setShowDetailsModal(true);
  };

  return (
    <>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Couvertures
            </h1>
            <p className="text-gray-600 mt-1">
              Administrer les couvertures diplomatiques et consulaires
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <FiPlus size={18} />
            <span>Nouvelle Couverture</span>
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
                placeholder="Rechercher par titre ou région..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filtre par type */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-none focus:outline-none focus:border-emerald-500 appearance-none bg-white"
              >
                <option value="tous">Tous les types</option>
                <option value="passeport">Passeport</option>
                <option value="visa">Visa</option>
                <option value="etat-civil">État Civil</option>
                <option value="legalisation">Légalisation</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            {/* Filtre par statut */}
            <div className="relative">
              <select
                value={filterStatut}
                onChange={e => setFilterStatut(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
              >
                <option value="tous">Tous les statuts</option>
                <option value="en cours">En cours</option>
                <option value="terminé">Terminé</option>
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
                  Total Couvertures
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {couvertures.length}
                </p>
              </div>
              <FiFileText className="h-12 w-12 text-gray-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {couvertures.filter(c => c.statut === 'en cours').length}
                </p>
              </div>
              <FiAlertCircle className="h-12 w-12 text-yellow-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminé</p>
                <p className="text-3xl font-bold text-green-600">
                  {couvertures.filter(c => c.statut === 'terminé').length}
                </p>
              </div>
              <FiCheckCircle className="h-12 w-12 text-green-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Bénéficiaires
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {couvertures.reduce((sum, c) => sum + c.beneficiaires, 0)}
                </p>
              </div>
              <FiUsers className="h-12 w-12 text-blue-100" />
            </div>
          </div>
        </div>

        {/* Liste des couvertures */}
        {/* Vue mobile - Cartes */}
        <div className="block md:hidden space-y-4">
          {filteredCouvertures.map(couverture => (
            <div
              key={couverture.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(couverture.statut)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {couverture.titre}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {couverture.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => handleViewDetails(couverture)}
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
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(couverture.type)}`}
                  >
                    {formatType(couverture.type)}
                  </span>
                </div>
                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(couverture.statut)}`}
                  >
                    {couverture.statut === 'en cours' ? 'En cours' : 'Terminé'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <FiMapPin size={14} />
                  <span>{couverture.region}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers size={14} />
                  <span>{couverture.beneficiaires} bénéficiaires</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar size={14} />
                  <span>
                    Expire le{' '}
                    {new Date(couverture.dateExpiration).toLocaleDateString(
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
                  Couverture
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Région
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bénéficiaires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCouvertures.map(couverture => (
                <tr key={couverture.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="shrink-0">
                        {getStatusIcon(couverture.statut)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs">
                          {couverture.titre}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {couverture.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(couverture.type)}`}
                    >
                      {formatType(couverture.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(couverture.statut)}`}
                    >
                      {couverture.statut === 'en cours'
                        ? 'En cours'
                        : 'Terminé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiMapPin className="h-4 w-4 text-gray-400 mr-1" />
                      {couverture.region}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiUsers className="h-4 w-4 text-gray-400 mr-1" />
                      {couverture.beneficiaires}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <FiCalendar className="h-4 w-4 text-gray-400 mr-1" />
                      {new Date(couverture.dateExpiration).toLocaleDateString(
                        'fr-FR'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-emerald-600 hover:text-emerald-900 p-1"
                        onClick={() => handleViewDetails(couverture)}
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

        {filteredCouvertures.length === 0 && (
          <div className="text-center py-12">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucune couverture trouvée
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune couverture ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* Modal de détails */}
        {showDetailsModal && selectedCouverture && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Détails de la couverture
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Informations générales
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Titre
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedCouverture.titre}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Type
                        </label>
                        <p className="text-sm text-gray-900">
                          {formatType(selectedCouverture.type)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Statut
                        </label>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCouverture.statut)}`}
                        >
                          {selectedCouverture.statut === 'en cours'
                            ? 'En cours'
                            : 'Terminé'}
                        </span>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Région
                        </label>
                        <p className="text-sm text-gray-900">
                          {selectedCouverture.region}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Photo d'identité
                    </h3>
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <img
                        src={`/images/${selectedCouverture.photoIdentite}`}
                        alt="Photo d'identité"
                        className="w-32 h-32 rounded-lg object-cover mx-auto mb-2"
                        onError={e => {
                          e.currentTarget.src =
                            'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjggNjRDMTI4IDk5LjM0MjEgOTkuMzQyMSAxMjggNjQgMTI4QzI4LjY1NzkgMTI4IDAgOTkuMzQyMSAwIDY0QzAgMjguNjU3OSA5OS4zNDIxIDAgNjQgMEM5OS4zNDIxIDAgMTI4IDI4LjY1NzkgMTI4IDY0WiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTY0IDY0QzcwLjM4NDYgNjQgNzYgNTguMzg0NiA3NiA1MkM3NiA0NS42MTU0IDcwLjM4NDYgNDAgNjQgNDBDNDUuNjE1NCA0MCA0MCA0NS42MTU0IDQwIDUyQzQwIDU4LjM4NDYgNDUuNjE1NCA2NCA2NCA2NFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                      <p className="text-xs text-gray-500">
                        {selectedCouverture.photoIdentite}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations personnelles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informations personnelles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nom de famille *
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {selectedCouverture.nomFamille}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Prénom(s) *
                      </label>
                      <p className="text-sm text-gray-900 font-medium">
                        {selectedCouverture.prenoms}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Date de naissance *
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          selectedCouverture.dateNaissance
                        ).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Âge
                      </label>
                      <p className="text-sm text-gray-900">
                        {calculateAge(selectedCouverture.dateNaissance)} ans
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Lieu de naissance *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.lieuNaissance}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Type de demande *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.typeDemande === 'premiere'
                          ? 'Première'
                          : 'Renouvellement'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Durée de séjour prévue *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.dureeSejour}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Profession/Établissement scolaire
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.profession}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Lieu de profession/études
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.lieuProfession}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Lieu de résidence *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.lieuResidence}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Numéro de téléphone *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.telephone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Adresse email
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Informations familiales */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informations familiales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nom complet du père *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.nomPere}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nom complet de la mère *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.nomMere}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact d'urgence */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact d'urgence
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Nom complet (urgence) *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.nomUrgence}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Numéro de téléphone (urgence) *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.telephoneUrgence}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Adresse complète (urgence) *
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedCouverture.adresseUrgence}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Fermer
                </button>
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
