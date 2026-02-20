'use client';

import { useState } from 'react';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMoreVertical,
  FiUser,
  FiAward,
  FiShield,
  FiUsers,
} from 'react-icons/fi';

interface Membre {
  id: number;
  nom: string;
  prenom: string;
  poste: string;
  departement: string;
  email: string;
  telephone: string;
  statut: 'actif' | 'inactif' | 'conge';
  role: 'admin' | 'manager' | 'employe';
  dateEmbauche: string;
  avatar?: string;
}

export default function EquipePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartement, setFilterDepartement] = useState<string>('tous');
  const [filterStatut, setFilterStatut] = useState<string>('tous');
  const [showAddModal, setShowAddModal] = useState(false);

  // Données fictives pour l'équipe
  const [membres, setMembres] = useState<Membre[]>([
    {
      id: 1,
      nom: 'Diallo',
      prenom: 'Amadou',
      poste: 'Ambassadeur',
      departement: 'Direction',
      email: 'ambassadeur@ambassademali.ma',
      telephone: '+223 20 22 11 00',
      statut: 'actif',
      role: 'admin',
      dateEmbauche: '2018-03-15',
    },
    {
      id: 2,
      nom: 'Traoré',
      prenom: 'Fatoumata',
      poste: 'Consul Général',
      departement: 'Consulat',
      email: 'consul@ambassademali.ma',
      telephone: '+223 20 22 11 01',
      statut: 'actif',
      role: 'manager',
      dateEmbauche: '2019-07-01',
    },
    {
      id: 3,
      nom: 'Konaté',
      prenom: 'Ibrahim',
      poste: 'Attaché Commercial',
      departement: 'Commerce',
      email: 'commerce@ambassademali.ma',
      telephone: '+223 20 22 11 02',
      statut: 'actif',
      role: 'manager',
      dateEmbauche: '2020-01-15',
    },
    {
      id: 4,
      nom: 'Coulibaly',
      prenom: 'Aminata',
      poste: 'Secrétaire Administrative',
      departement: 'Administration',
      email: 'admin@ambassademali.ma',
      telephone: '+223 20 22 11 03',
      statut: 'actif',
      role: 'employe',
      dateEmbauche: '2021-05-10',
    },
    {
      id: 5,
      nom: 'Dembélé',
      prenom: 'Moussa',
      poste: 'Agent de Sécurité',
      departement: 'Sécurité',
      email: 'securite@ambassademali.ma',
      telephone: '+223 20 22 11 04',
      statut: 'actif',
      role: 'employe',
      dateEmbauche: '2022-02-20',
    },
    {
      id: 6,
      nom: 'Sidibé',
      prenom: 'Kadiatou',
      poste: 'Attachée Culturelle',
      departement: 'Culture',
      email: 'culture@ambassademali.ma',
      telephone: '+223 20 22 11 05',
      statut: 'conge',
      role: 'employe',
      dateEmbauche: '2020-09-01',
    },
  ]);

  const filteredMembres = membres.filter(membre => {
    const matchesSearch =
      `${membre.prenom} ${membre.nom}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      membre.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartement =
      filterDepartement === 'tous' || membre.departement === filterDepartement;
    const matchesStatut =
      filterStatut === 'tous' || membre.statut === filterStatut;

    return matchesSearch && matchesDepartement && matchesStatut;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <FiAward className="h-4 w-4 text-yellow-500" />;
      case 'manager':
        return <FiShield className="h-4 w-4 text-blue-500" />;
      case 'employe':
        return <FiUser className="h-4 w-4 text-gray-500" />;
      default:
        return <FiUser className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'employe':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'inactif':
        return 'bg-red-100 text-red-800';
      case 'conge':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'manager':
        return 'Manager';
      case 'employe':
        return 'Employé';
      default:
        return role;
    }
  };

  const formatStatut = (statut: string) => {
    switch (statut) {
      case 'actif':
        return 'Actif';
      case 'inactif':
        return 'Inactif';
      case 'conge':
        return 'En congé';
      default:
        return statut;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion de l'Équipe
            </h1>
            <p className="text-gray-600 mt-1">
              Administrer les membres du personnel
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <FiPlus size={18} />
            <span>Ajouter un membre</span>
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
                placeholder="Rechercher par nom, poste ou email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filtre par département */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={filterDepartement}
                onChange={e => setFilterDepartement(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
              >
                <option value="tous">Tous les départements</option>
                <option value="Direction">Direction</option>
                <option value="Consulat">Consulat</option>
                <option value="Commerce">Commerce</option>
                <option value="Administration">Administration</option>
                <option value="Sécurité">Sécurité</option>
                <option value="Culture">Culture</option>
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
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="conge">En congé</option>
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
                  Total Membres
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {membres.length}
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
                  {membres.filter(m => m.statut === 'actif').length}
                </p>
              </div>
              <FiUser className="h-12 w-12 text-green-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Administrateurs
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {membres.filter(m => m.role === 'admin').length}
                </p>
              </div>
              <FiAward className="h-12 w-12 text-yellow-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En congé</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {membres.filter(m => m.statut === 'conge').length}
                </p>
              </div>
              <FiCalendar className="h-12 w-12 text-yellow-100" />
            </div>
          </div>
        </div>

        {/* Grille des membres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembres.map(membre => (
            <div
              key={membre.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-emerald-600">
                      {membre.prenom[0]}
                      {membre.nom[0]}
                    </span>
                  </div>
                  <div className="absolute -top-1 -right-1">
                    {getRoleIcon(membre.role)}
                  </div>
                </div>

                {/* Informations principales */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {membre.prenom} {membre.nom}
                  </h3>
                  <p className="text-emerald-600 font-medium">{membre.poste}</p>
                  <p className="text-sm text-gray-500">{membre.departement}</p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(membre.role)}`}
                  >
                    {formatRole(membre.role)}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(membre.statut)}`}
                  >
                    {formatStatut(membre.statut)}
                  </span>
                </div>

                {/* Contact */}
                <div className="w-full space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <FiMail size={14} />
                    <span className="truncate">{membre.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <FiPhone size={14} />
                    <span>{membre.telephone}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <FiCalendar size={14} />
                    <span>
                      Depuis {new Date(membre.dateEmbauche).getFullYear()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-100 w-full justify-center">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <FiEdit3 size={16} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <FiMoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembres.length === 0 && (
          <div className="text-center py-12">
            <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun membre trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun membre ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
