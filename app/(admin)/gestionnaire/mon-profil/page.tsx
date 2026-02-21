"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit3,
  FiSave,
  FiX,
  FiCamera,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { useAuth } from '@/lib/auth/AuthContext';
import LoadingSpinner from '@/components/admin/shared/LoadingSpinner';

export default function MonProfilPage() {
  const { user, isAuthenticated, loading, me } = useAuth();
  const router = useRouter();

  // Vérifier l'authentification et le rôle
  React.useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/connexion');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, loading, router]);

  // Mettre à jour le formulaire quand les données utilisateur changent
  React.useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
      });
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Utilisateur non connecté');
      return;
    }
    
    // Validation des mots de passe
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const response = await fetch('/api/auth/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: user._id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du mot de passe');
      }

      // Réinitialiser les champs
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Afficher un message de succès
      alert('Mot de passe mis à jour avec succès');
    } catch (error: any) {
      console.error('Erreur mise à jour mot de passe:', error);
      alert(error.message || 'Erreur lors de la mise à jour du mot de passe');
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('Utilisateur non connecté');
      return;
    }
    
    try {
      const response = await fetch('/api/auth/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: user._id,
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }

      // Mettre à jour les données utilisateur dans le contexte
      await me();
      setIsEditing(false);
      
      // Afficher un message de succès
      alert('Profil mis à jour avec succès');
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      alert(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleCancel = () => {
    // Remettre les données originales depuis l'utilisateur
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Mon Profil
              </h1>
              <p className="text-gray-600 mt-1">
                Gérez vos informations personnelles
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isEditing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isEditing ? <FiX size={18} /> : <FiEdit3 size={18} />}
              <span className="hidden sm:inline">
                {isEditing ? 'Annuler' : 'Modifier'}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Photo de profil et informations de base */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col items-center space-y-4">
                {/* Photo de profil */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FiUser size={48} className="text-emerald-600" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors">
                      <FiCamera size={16} />
                    </button>
                  )}
                </div>

                {/* Nom et fonction */}
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {formData.prenom} {formData.nom}
                  </h2>
                </div>

                {/* Statut */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Actif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail
                      size={18}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <FiPhone
                      size={18}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Changement de mot de passe */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Sécurité
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="email"
                  name="username"
                  value={user?.email || ''}
                  readOnly
                  hidden
                  aria-hidden="true"
                  tabIndex={-1}
                  autoComplete="username"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <FiLock
                      size={18}
                      className="absolute left-3 top-3 text-gray-400"
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Mettre à jour le mot de passe
                </button>
              </form>
            </div>

            {/* Boutons de sauvegarde */}
            {isEditing && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <FiSave size={18} />
                  <span>Sauvegarder</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  <FiX size={18} />
                  <span>Annuler</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
