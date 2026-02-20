'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Upload,
  X,
  Check,
  FileText,
  User,
  Briefcase,
  Eye,
  Phone,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface FormData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  age: string;
  lieuNaissance: string;
  nationaliteOrigine: string;
  lieuResidence: string;
  typeDemande: 'premiere' | 'renouvellement';
  photo: File;
  photoPreview: string;
  profession: string;
  lieuProfession: string;
  taille: string;
  teint: string;
  couleurYeux: string;
  signeParticulier: string;
  nomPere: string;
  nomMere: string;
  telephone: string;
  dureeSejour: string;
  urgenceNom: string;
  urgenceDomicile: string;
  urgenceTelephone: string;
  urgenceAdresse: string;
}

const inputBaseClasses =
  'w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm text-gray-800 transition-colors hover:border-green-500 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-offset-0 focus:border-green-500';
const textareaBaseClasses = `${inputBaseClasses} resize-none`;

const EmbassyCoverageForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    age: '',
    lieuNaissance: '',
    nationaliteOrigine: '',
    lieuResidence: '',
    typeDemande: 'premiere',
    photo: new File([], ''),
    photoPreview: '',
    profession: '',
    lieuProfession: '',
    taille: '',
    teint: '',
    couleurYeux: '',
    signeParticulier: '',
    nomPere: '',
    nomMere: '',
    telephone: '',
    dureeSejour: '',
    urgenceNom: '',
    urgenceDomicile: '',
    urgenceTelephone: '',
    urgenceAdresse: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [savedMessage, setSavedMessage] = useState('');
  const totalSteps = 6;

  const steps = [
    { number: 1, title: 'Infos Personnelles', icon: User },
    { number: 2, title: 'Type Demande', icon: FileText },
    { number: 3, title: 'Photo', icon: Upload },
    { number: 4, title: 'Profession', icon: Briefcase },
    { number: 5, title: 'Caractéristiques', icon: Eye },
    { number: 6, title: 'Contact', icon: Phone },
  ];

  const nextStep = () =>
    currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);
  const goToStep = (step: number) => setCurrentStep(step);

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.nom &&
          formData.prenom &&
          formData.dateNaissance &&
          formData.lieuNaissance &&
          formData.nationaliteOrigine &&
          formData.lieuResidence &&
          formData.age
        );
      case 2:
        return true;
      case 3:
        return !!(formData.photo && formData.photoPreview);
      case 4:
        return !!(formData.profession && formData.lieuProfession);
      case 5:
        return !!(
          formData.taille &&
          formData.teint &&
          formData.couleurYeux &&
          formData.signeParticulier
        );
      case 6:
        return !!(
          formData.telephone &&
          formData.dureeSejour &&
          formData.urgenceNom &&
          formData.urgenceDomicile &&
          formData.urgenceTelephone &&
          formData.urgenceAdresse &&
          formData.nomPere &&
          formData.nomMere
        );
      default:
        return false;
    }
  };

  const canProceed = () => isStepValid(currentStep);

  useEffect(() => {
    if (formData.dateNaissance) {
      const birthDate = new Date(formData.dateNaissance);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      )
        age--;
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dateNaissance]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      typeDemande: e.target.value as FormData['typeDemande'],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        setFormData(prev => ({ ...prev, photo: file, photoPreview: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        setFormData(prev => ({ ...prev, photo: file, photoPreview: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () =>
    setFormData(prev => ({
      ...prev,
      photo: new File([], ''),
      photoPreview: '',
    }));

  const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number): number =>
    new Date(year, month, 1).getDay();

  const selectDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const formattedDate = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, dateNaissance: formattedDate }));
    setShowDatePicker(false);
  };

  const monthNames = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'photo' || key === 'photoPreview') return;
      payload.append(key, String(value ?? ''));
    });

    if (formData.photo) payload.append('photo', formData.photo);

    try {
      const response = await fetch('/coverage', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) throw new Error('Erreur serveur');
      setSavedMessage('Demande envoyée avec succès');
    } catch (error) {
      console.error(error);
      setSavedMessage("Erreur lors de l'envoi");
    } finally {
      setTimeout(() => setSavedMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-[40vh] bg-white py-2 px-2 sm:px-4 lg:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-green-600 to-green-700 rounded-t-2xl shadow-2xl p-3 sm:p-4">
          <div className="text-center">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-white mb-2" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
              FORMULAIRE DE COUVERTURE
            </h1>
            <p className="text-green-50 text-xs sm:text-sm">
              Ambassade - Document Officiel
            </p>
          </div>
        </div>

        {/* Success Message */}
        {savedMessage && (
          <div className="mx-3 mt-2 bg-green-100 border-l-4 border-green-600 p-2 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              <p className="text-green-800 text-sm font-medium">
                {savedMessage}
              </p>
            </div>
          </div>
        )}

        {/* Progress Steps - Compact */}
        <div className="bg-white shadow-sm p-3 sm:p-4">
          <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isValid = isStepValid(step.number);

              return (
                <React.Fragment key={step.number}>
                  <button
                    type="button"
                    onClick={() => goToStep(step.number)}
                    className={`flex flex-col items-center p-1.5 rounded-lg transition-all min-w-[70px] ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : isCompleted
                          ? 'bg-green-50 text-green-600'
                          : isValid
                            ? 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!isValid && currentStep < step.number}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                        isActive
                          ? 'bg-green-600 text-white'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                            : isValid
                              ? 'bg-gray-300 text-white'
                              : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-center truncate w-full">
                      {step.title}
                    </span>
                  </button>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-6 h-0.5 mx-1 ${
                        isCompleted
                          ? 'bg-green-500'
                          : currentStep > step.number
                            ? 'bg-green-300'
                            : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white shadow-lg rounded-b-2xl">
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-4">
            {/* Step 1: Informations Personnelles */}
            {currentStep === 1 && (
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-green-800 mb-3 border-b border-green-600 pb-1.5">
                  I. INFORMATIONS PERSONNELLES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      NOM *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className={`${inputBaseClasses} uppercase`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      PRÉNOM(S) *
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      DATE DE NAISSANCE *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.dateNaissance}
                        readOnly
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className={`${inputBaseClasses} cursor-pointer`}
                        placeholder="Sélectionner une date"
                        required
                      />
                      <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-green-600 pointer-events-none" />
                    </div>
                    {showDatePicker && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 w-full max-w-sm border border-green-200">
                          <div className="flex justify-between items-center mb-4">
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentMonth(
                                  currentMonth === 0 ? 11 : currentMonth - 1
                                )
                              }
                              className="px-3 py-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-green-800 font-semibold transition-all text-sm"
                            >
                              ←
                            </button>
                            <div className="text-center">
                              <select
                                value={currentMonth}
                                onChange={e =>
                                  setCurrentMonth(
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                                className="px-2 py-1.5 border border-green-200 rounded-lg font-semibold text-green-800 focus:ring-1 focus:ring-green-500 text-sm"
                              >
                                {monthNames.map((month, idx) => (
                                  <option key={idx} value={idx}>
                                    {month}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={currentYear}
                                onChange={e =>
                                  setCurrentYear(
                                    parseInt(e.target.value, 10) ||
                                      new Date().getFullYear()
                                  )
                                }
                                className="ml-2 px-2 py-1.5 border border-green-200 rounded-lg font-semibold text-green-800 focus:ring-1 focus:ring-green-500 text-sm"
                              >
                                {Array.from(
                                  { length: 100 },
                                  (_, i) => new Date().getFullYear() - i
                                ).map(year => (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setCurrentMonth(
                                  currentMonth === 11 ? 0 : currentMonth + 1
                                )
                              }
                              className="px-3 py-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-green-800 font-semibold transition-all text-sm"
                            >
                              →
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(
                              (day, idx) => (
                                <div
                                  key={idx}
                                  className="text-center font-bold text-green-700 text-xs py-1"
                                >
                                  {day}
                                </div>
                              )
                            )}
                            {Array.from({
                              length: getFirstDayOfMonth(
                                currentYear,
                                currentMonth
                              ),
                            }).map((_, idx) => (
                              <div key={`empty-${idx}`} />
                            ))}
                            {Array.from(
                              {
                                length: getDaysInMonth(
                                  currentYear,
                                  currentMonth
                                ),
                              },
                              (_, i) => i + 1
                            ).map(day => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => selectDate(day)}
                                className="aspect-square flex items-center justify-center rounded-lg hover:bg-green-500 hover:text-white transition-all bg-green-50 hover:shadow-sm font-medium text-xs"
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowDatePicker(false)}
                            className="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all shadow text-sm"
                          >
                            Fermer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      ÂGE *
                    </label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      readOnly
                      className={`${inputBaseClasses} bg-green-50`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      LIEU DE NAISSANCE *
                    </label>
                    <input
                      type="text"
                      name="lieuNaissance"
                      value={formData.lieuNaissance}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      NATIONALITÉ D&apos;ORIGINE *
                    </label>
                    <input
                      type="text"
                      name="nationaliteOrigine"
                      value={formData.nationaliteOrigine}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      LIEU DE RÉSIDENCE *
                    </label>
                    <input
                      type="text"
                      name="lieuResidence"
                      value={formData.lieuResidence}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Type de Demande */}
            {currentStep === 2 && (
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-green-800 mb-3 border-b border-green-600 pb-1.5">
                  II. TYPE DE DEMANDE
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center p-3 border border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-all">
                    <input
                      type="radio"
                      name="typeDemande"
                      value="premiere"
                      checked={formData.typeDemande === 'premiere'}
                      onChange={handleTypeChange}
                      className="w-3.5 h-3.5 text-green-600 focus:outline-none focus:ring-0"
                    />
                    <span className="ml-2 font-semibold text-gray-700 text-sm">
                      PREMIÈRE DEMANDE
                    </span>
                  </label>
                  <label className="flex items-center p-3 border border-green-200 rounded-lg cursor-pointer hover:bg-green-50 transition-all">
                    <input
                      type="radio"
                      name="typeDemande"
                      value="renouvellement"
                      checked={formData.typeDemande === 'renouvellement'}
                      onChange={handleTypeChange}
                      className="w-3.5 h-3.5 text-green-600 focus:outline-none focus:ring-0"
                    />
                    <span className="ml-2 font-semibold text-gray-700 text-sm">
                      RENOUVELLEMENT
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Photo */}
            {currentStep === 3 && (
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-green-800 mb-3 border-b border-green-600 pb-1.5">
                  III. PHOTOGRAPHIE D&apos;IDENTITÉ
                </h3>
                <div
                  onDrop={handlePhotoDrop}
                  onDragOver={e => e.preventDefault()}
                  className="border-2 border-dashed border-green-300 rounded-xl p-4 sm:p-5 text-center hover:border-green-500 transition-all bg-linear-to-br from-white to-green-50"
                >
                  {formData.photoPreview ? (
                    <div className="relative inline-block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.photoPreview}
                        alt="Photo"
                        className="max-w-full h-24 sm:h-28 object-cover rounded-lg shadow border-2 border-green-200"
                      />
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 sm:w-9 sm:h-9 mx-auto text-green-600 mb-2" />
                      <p className="text-gray-700 font-semibold mb-1 text-xs sm:text-sm">
                        Glissez-déposez votre photo
                      </p>
                      <p className="text-gray-500 mb-2 text-xs">ou</p>
                      <label className="inline-block px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-all shadow font-semibold text-xs sm:text-sm focus:outline-none">
                        Parcourir
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Informations Professionnelles */}
            {currentStep === 4 && (
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-green-800 mb-3 border-b border-green-600 pb-1.5">
                  IV. INFORMATIONS PROFESSIONNELLES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      PROFESSION / ÉCOLE *
                    </label>
                    <input
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      LIEU DE PROFESSION *
                    </label>
                    <input
                      type="text"
                      name="lieuProfession"
                      value={formData.lieuProfession}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Caractéristiques Physiques */}
            {currentStep === 5 && (
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-bold text-green-800 mb-3 border-b border-green-600 pb-1.5">
                  V. CARACTÉRISTIQUES PHYSIQUES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      TAILLE (cm) *
                    </label>
                    <input
                      type="text"
                      name="taille"
                      value={formData.taille}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      placeholder="Ex: 175"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      TEINT *
                    </label>
                    <input
                      type="text"
                      name="teint"
                      value={formData.teint}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      placeholder="Ex: Clair"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      COULEUR DES YEUX *
                    </label>
                    <input
                      type="text"
                      name="couleurYeux"
                      value={formData.couleurYeux}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      placeholder="Ex: Marron"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      SIGNE PARTICULIER *
                    </label>
                    <input
                      type="text"
                      name="signeParticulier"
                      value={formData.signeParticulier}
                      onChange={handleInputChange}
                      className={inputBaseClasses}
                      placeholder="Ex: Cicatrice"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Filiation, Contact & Urgence */}
            {currentStep === 6 && (
              <>
                <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 sm:p-4 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-green-800 mb-3 border-b border-green-600 pb-1.5">
                    VI. FILIATION
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        NOM COMPLET DU PÈRE *
                      </label>
                      <input
                        type="text"
                        name="nomPere"
                        value={formData.nomPere}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        NOM COMPLET DE LA MÈRE *
                      </label>
                      <input
                        type="text"
                        name="nomMere"
                        value={formData.nomMere}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 sm:p-4 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-green-800 mb-3 border-b border-green-600 pb-1.5">
                    VII. CONTACT ET DURÉE DE SÉJOUR
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        NUMÉRO DE TÉLÉPHONE *
                      </label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                        placeholder="+212 XXX XXX XXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        DURÉE DE SÉJOUR *
                      </label>
                      <input
                        type="text"
                        name="dureeSejour"
                        value={formData.dureeSejour}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                        placeholder="Ex: 30 jours"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-3 sm:p-4 shadow-sm">
                  <h3 className="text-base sm:text-lg font-bold text-green-800 mb-3 border-b border-green-600 pb-1.5">
                    VIII. PERSONNE À CONTACTER EN CAS D&apos;URGENCE
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        NOM COMPLET *
                      </label>
                      <input
                        type="text"
                        name="urgenceNom"
                        value={formData.urgenceNom}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        DOMICILE *
                      </label>
                      <input
                        type="text"
                        name="urgenceDomicile"
                        value={formData.urgenceDomicile}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        NUMÉRO DE TÉLÉPHONE *
                      </label>
                      <input
                        type="tel"
                        name="urgenceTelephone"
                        value={formData.urgenceTelephone}
                        onChange={handleInputChange}
                        className={inputBaseClasses}
                        placeholder="+212 XXX XXX XXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        ADRESSE COMPLÈTE *
                      </label>
                      <textarea
                        name="urgenceAdresse"
                        value={formData.urgenceAdresse}
                        onChange={handleInputChange}
                        rows={2}
                        className={textareaBaseClasses}
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-bold transition-all shadow text-sm ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Précédent
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-bold transition-all shadow text-sm ${
                    canProceed()
                      ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Suivant <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold transition-all shadow hover:shadow text-sm"
                >
                  <Check className="w-4 h-4" /> Soumettre
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmbassyCoverageForm;
