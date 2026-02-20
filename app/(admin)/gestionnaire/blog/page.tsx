'use client';

import { useState } from 'react';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiUser,
  FiTag,
  FiFileText,
  FiHeart,
  FiMessageCircle,
  FiShare2,
} from 'react-icons/fi';

interface Article {
  id: number;
  titre: string;
  contenu: string;
  auteur: string;
  categorie: string;
  statut: 'publie' | 'brouillon' | 'archive';
  dateCreation: string;
  datePublication?: string;
  vues: number;
  likes: number;
  commentaires: number;
  tags: string[];
  imageCouverture?: string;
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState<string>('tous');
  const [filterStatut, setFilterStatut] = useState<string>('tous');
  const [showAddModal, setShowAddModal] = useState(false);

  // Données fictives pour les articles
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      titre:
        'Les démarches administratives pour les étudiants maliens en France',
      contenu:
        'Guide complet des procédures administratives pour les étudiants maliens souhaitant étudier en France...',
      auteur: 'Marie Diallo',
      categorie: 'Études',
      statut: 'publie',
      dateCreation: '2024-01-15',
      datePublication: '2024-01-20',
      vues: 1250,
      likes: 45,
      commentaires: 12,
      tags: ['études', 'france', 'visa étudiant'],
    },
    {
      id: 2,
      titre: 'Nouvelles réformes du consulat 2024',
      contenu:
        'Découvrez les dernières réformes apportées aux services consulaires pour mieux servir notre communauté...',
      auteur: 'Ahmed Traoré',
      categorie: 'Actualités',
      statut: 'publie',
      dateCreation: '2024-02-01',
      datePublication: '2024-02-05',
      vues: 890,
      likes: 32,
      commentaires: 8,
      tags: ['consulat', 'réformes', 'services'],
    },
    {
      id: 3,
      titre: "Programme d'échange culturel Mali-France",
      contenu:
        "Le nouveau programme d'échange culturel entre le Mali et la France offre de nombreuses opportunités...",
      auteur: 'Fatoumata Konaté',
      categorie: 'Culture',
      statut: 'brouillon',
      dateCreation: '2024-02-10',
      vues: 0,
      likes: 0,
      commentaires: 0,
      tags: ['culture', 'échange', 'france'],
    },
    {
      id: 4,
      titre: 'Guide des vaccinations pour voyager',
      contenu:
        'Liste complète des vaccinations recommandées et obligatoires pour voyager au Mali...',
      auteur: 'Dr. Ibrahim Sidibé',
      categorie: 'Santé',
      statut: 'archive',
      dateCreation: '2023-06-15',
      datePublication: '2023-07-01',
      vues: 2100,
      likes: 78,
      commentaires: 25,
      tags: ['santé', 'vaccinations', 'voyage'],
    },
  ]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch =
      article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesCategorie =
      filterCategorie === 'tous' || article.categorie === filterCategorie;
    const matchesStatut =
      filterStatut === 'tous' || article.statut === filterStatut;

    return matchesSearch && matchesCategorie && matchesStatut;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'publie':
        return 'bg-green-100 text-green-800';
      case 'brouillon':
        return 'bg-yellow-100 text-yellow-800';
      case 'archive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategorieColor = (categorie: string) => {
    switch (categorie) {
      case 'Études':
        return 'bg-blue-100 text-blue-800';
      case 'Actualités':
        return 'bg-red-100 text-red-800';
      case 'Culture':
        return 'bg-purple-100 text-purple-800';
      case 'Santé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatut = (statut: string) => {
    switch (statut) {
      case 'publie':
        return 'Publié';
      case 'brouillon':
        return 'Brouillon';
      case 'archive':
        return 'Archivé';
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
              Gestion du Blog
            </h1>
            <p className="text-gray-600 mt-1">
              Administrer les articles et publications
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <FiPlus size={18} />
            <span>Nouvel Article</span>
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
                placeholder="Rechercher par titre, auteur ou tags..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Filtre par catégorie */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={filterCategorie}
                onChange={e => setFilterCategorie(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none bg-white"
              >
                <option value="tous">Toutes les catégories</option>
                <option value="Études">Études</option>
                <option value="Actualités">Actualités</option>
                <option value="Culture">Culture</option>
                <option value="Santé">Santé</option>
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
                <option value="publie">Publié</option>
                <option value="brouillon">Brouillon</option>
                <option value="archive">Archivé</option>
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
                  Total Articles
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {articles.length}
                </p>
              </div>
              <FiFileText className="h-12 w-12 text-gray-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Publiés</p>
                <p className="text-3xl font-bold text-green-600">
                  {articles.filter(a => a.statut === 'publie').length}
                </p>
              </div>
              <FiEye className="h-12 w-12 text-green-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Vues Totales
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {articles
                    .reduce((sum, a) => sum + a.vues, 0)
                    .toLocaleString()}
                </p>
              </div>
              <FiUser className="h-12 w-12 text-blue-100" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-3xl font-bold text-purple-600">
                  {articles.reduce(
                    (sum, a) => sum + a.likes + a.commentaires,
                    0
                  )}
                </p>
              </div>
              <FiHeart className="h-12 w-12 text-purple-100" />
            </div>
          </div>
        </div>

        {/* Grille des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(article => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="space-y-4">
                {/* Image de couverture */}
                <div className="aspect-video bg-linear-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                  <FiFileText className="h-12 w-12 text-emerald-600" />
                </div>

                {/* Titre et statut */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                      {article.titre}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full shrink-0 ${getStatusColor(article.statut)}`}
                    >
                      {formatStatut(article.statut)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {article.contenu}
                  </p>
                </div>

                {/* Métadonnées */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <FiUser className="h-4 w-4 mr-1" />
                    <span>{article.auteur}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiCalendar className="h-4 w-4 mr-1" />
                    <span>
                      {article.datePublication
                        ? `Publié le ${new Date(article.datePublication).toLocaleDateString('fr-FR')}`
                        : `Créé le ${new Date(article.dateCreation).toLocaleDateString('fr-FR')}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategorieColor(article.categorie)}`}
                    >
                      {article.categorie}
                    </span>
                    <div className="flex items-center space-x-3 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiEye className="h-3 w-3" />
                        <span className="text-xs">{article.vues}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiHeart className="h-3 w-3" />
                        <span className="text-xs">{article.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiMessageCircle className="h-3 w-3" />
                        <span className="text-xs">{article.commentaires}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      <FiTag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      +{article.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <FiEye size={16} />
                    </button>
                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                      <FiEdit3 size={16} />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <FiShare2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Aucun article trouvé
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun article ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
