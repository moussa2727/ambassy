'use client';

import { useState, useCallback } from 'react';
import {
  BookOpen,
  IdCard,
  Baby,
  Plane,
  Clock,
  DollarSign,
  AlertTriangle,
  ListChecks,
  RefreshCw,
  Download,
} from 'lucide-react';
import jsPDF from 'jspdf';

interface ChecklistItem {
  name: string;
  description: string;
  checked: boolean;
  note?: string;
}

interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fullDescription: string;
  processingTime: string;
  fees: string;
  checklist: ChecklistItem[];
}

const convertCFAtoMAD = (cfa: number): number => {
  return Math.round(cfa / 61);
};

const documentTypes: DocumentType[] = [
  {
    id: 'passport',
    name: 'Passeport',
    description: 'Document de voyage officiel pour citoyens maliens',
    icon: <BookOpen size={20} />,
    fullDescription:
      'Passeport malien biométrique - Renouvellement et première demande',
    processingTime: '10-15 jours',
    fees: `50,000 FCFA / ${convertCFAtoMAD(50000)} MAD`,
    checklist: [
      {
        name: 'Formulaire de demande',
        description: 'Formulaire officiel dûment rempli et signé',
        checked: false,
      },
      {
        name: 'Ancien passeport',
        description: 'Passeport précédent en cas de renouvellement',
        checked: false,
      },
      {
        name: 'Acte de naissance',
        description: "Extrait d'acte de naissance original",
        checked: false,
      },
      {
        name: "Carte nationale d'identité",
        description: 'Original et photocopie recto-verso',
        checked: false,
      },
      {
        name: "Photos d'identité",
        description:
          '4 photographies récentes format 4,5x3,5 cm sur fond blanc',
        checked: false,
      },
      {
        name: 'Timbre fiscal',
        description: 'Timbre de la valeur requise selon le type de passeport',
        checked: false,
      },
      {
        name: 'Quittance de paiement',
        description: 'Preuve de paiement des frais consulaires',
        checked: false,
      },
      {
        name: 'Justificatif de résidence',
        description: 'Attestation de résidence au Maroc',
        checked: false,
        note: "Titre de séjour ou facture d'électricité/téléphone de moins de 3 mois",
      },
    ],
  },
  {
    id: 'id-card',
    name: 'Carte nationale',
    description: "Pièce d'identité officielle malienne",
    icon: <IdCard size={20} />,
    fullDescription: "Carte nationale d'identité - Édition et renouvellement",
    processingTime: '15-20 jours',
    fees: `5,000 FCFA / ${convertCFAtoMAD(5000)} MAD`,
    checklist: [
      {
        name: 'Formulaire de demande',
        description: 'Formulaire officiel complété et signé',
        checked: false,
      },
      {
        name: 'Acte de naissance',
        description: 'Original datant de moins de 3 mois',
        checked: false,
      },
      {
        name: "Ancienne carte d'identité",
        description: 'En cas de renouvellement ou perte',
        checked: false,
      },
      {
        name: "Photos d'identité",
        description: '2 photographies identiques format 3,5x4,5 cm',
        checked: false,
      },
      {
        name: 'Justificatif de résidence',
        description: "Document attestant de l'adresse actuelle",
        checked: false,
      },
      {
        name: 'Timbre fiscal',
        description: 'Timbre de la valeur réglementaire',
        checked: false,
      },
    ],
  },
  {
    id: 'birth-certificate',
    name: 'Acte de naissance',
    description: "Extrait d'acte de naissance officiel",
    icon: <Baby size={20} />,
    fullDescription:
      "Extrait d'acte de naissance - Copie intégrale ou extrait avec filiation",
    processingTime: '7-10 jours',
    fees: `3,000 FCFA / ${convertCFAtoMAD(3000)} MAD`,
    checklist: [
      {
        name: 'Formulaire de demande',
        description: 'Formulaire spécifique dûment rempli',
        checked: false,
      },
      {
        name: "Copie de la carte d'identité",
        description: 'Du demandeur ou du représentant légal',
        checked: false,
      },
      {
        name: 'Justificatif de parenté',
        description: 'Pour les demandes concernant des enfants mineurs',
        checked: false,
      },
      {
        name: 'Ancien extrait',
        description: 'Si disponible pour vérification',
        checked: false,
      },
    ],
  },
  {
    id: 'visa',
    name: 'Visa pour le Mali',
    description: "Autorisation d'entrée sur le territoire malien",
    icon: <Plane size={20} />,
    fullDescription: "Visa d'entrée - Tourisme, affaires ou visite familiale",
    processingTime: '5-7 jours',
    fees: 'Variable',
    checklist: [
      {
        name: 'Formulaire de demande de visa',
        description: 'Formulaire complété, daté et signé',
        checked: false,
      },
      {
        name: 'Passeport valide',
        description: 'Valable au moins 6 mois après la date de retour',
        checked: false,
      },
      {
        name: "Photos d'identité",
        description: '2 photographies récentes format 3,5x4,5 cm',
        checked: false,
      },
      {
        name: 'Réservation hôtelière',
        description: 'Couverture de toute la durée du séjour',
        checked: false,
      },
      {
        name: 'Billet aller-retour',
        description: 'Réservation confirmée ou billet émis',
        checked: false,
      },
      {
        name: 'Justificatif de ressources',
        description: 'Relevés bancaires des 3 derniers mois',
        checked: false,
      },
      {
        name: 'Assurance voyage',
        description: 'Couverture médicale valable pour la durée du séjour',
        checked: false,
      },
      {
        name: 'Certificat de vaccination',
        description: 'Vaccin contre la fièvre jaune',
        checked: false,
        note: 'Recommandé pour les voyages en zones à risque',
      },
    ],
  },
];

export default function DocumentCheckList() {
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    string | null
  >(() => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem('documentChecklist');
      if (saved) {
        const data = JSON.parse(saved);
        return data.selectedType || null;
      }
    } catch (e) {
      console.error('Error loading localStorage:', e);
    }
    return null;
  });
  const [currentChecklist, setCurrentChecklist] = useState<ChecklistItem[]>([]);
  const [isLoading, _setIsLoading] = useState(false);

  const completedCount = currentChecklist.filter(item => item.checked).length;
  const totalCount = currentChecklist.length;
  const progressPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getSelectedDocumentType = () => {
    return documentTypes.find(type => type.id === selectedDocumentType);
  };

  const selectDocumentType = useCallback(
    (typeId: string) => {
      // Si on clique sur le même service, le désélectionner
      if (selectedDocumentType === typeId) {
        setSelectedDocumentType(null);
        setCurrentChecklist([]);
        return;
      }

      setSelectedDocumentType(typeId);
      const docType = documentTypes.find(type => type.id === typeId);
      if (docType) {
        const savedData = localStorage.getItem('documentChecklist');
        let savedChecklist: boolean[] = [];

        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            if (data.selectedType === typeId && data.checklistState) {
              savedChecklist = data.checklistState;
            }
          } catch (e) {
            console.error('Error loading saved data:', e);
          }
        }

        const newChecklist = docType.checklist.map((item, index) => ({
          ...item,
          checked: savedChecklist[index] || false,
        }));

        setCurrentChecklist(newChecklist);
      }
    },
    [selectedDocumentType, setCurrentChecklist]
  );

  const handleCheckboxChange = (index: number) => {
    const updatedChecklist = [...currentChecklist];
    updatedChecklist[index].checked = !updatedChecklist[index].checked;
    setCurrentChecklist(updatedChecklist);
    saveToLocalStorage(updatedChecklist);
  };

  const resetChecklist = () => {
    const resetChecklist = currentChecklist.map(item => ({
      ...item,
      checked: false,
    }));
    setCurrentChecklist(resetChecklist);
    saveToLocalStorage(resetChecklist);
  };

  const saveToLocalStorage = (checklist: ChecklistItem[]) => {
    if (selectedDocumentType) {
      const checklistState = checklist.map(item => item.checked);
      const data = {
        selectedType: selectedDocumentType,
        checklistState,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('documentChecklist', JSON.stringify(data));
    }
  };

  const downloadChecklistPDF = () => {
    const docType = getSelectedDocumentType();
    if (!docType) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    const secondaryColor = [22, 163, 74] as const; // green-600
    const yellowColor = [234, 179, 8] as const; // yellow-500
    const accentColor = [220, 38, 38] as const; // rouge pour notes
    const lightGray = [243, 244, 246] as const; // gray-50
    const mediumGray = [107, 114, 128] as const; // gray-500

    // Nettoyer le texte pour éviter les caractères problématiques
    const cleanText = (text: string): string => {
      return text.replace(/[Ë%]/g, '');
    };

    // Tronquer la description si trop longue
    let typeDocText = docType.fullDescription;
    if (typeDocText.length > 60) {
      typeDocText = typeDocText.substring(0, 57) + '...';
    }
    // Nettoyer le texte pour éviter les caractères problématiques
    typeDocText = cleanText(typeDocText);
    pdf.text(typeDocText, margin + 45, yPosition + 8);

    // Ligne 2 - Date et progression
    pdf.setFont('helvetica', 'normal');
    pdf.text('Date de génération:', margin + 5, yPosition + 15);
    pdf.text(
      new Date().toLocaleDateString('fr-FR'),
      margin + 45,
      yPosition + 15
    );

    pdf.text('Progression:', pageWidth / 2, yPosition + 15);
    pdf.setFont('helvetica', 'bold');
    pdf.text(
      `${completedCount}/${totalCount} documents`,
      pageWidth / 2 + 30,
      yPosition + 15
    );

    // Ligne 3 - Délai et frais
    pdf.setFont('helvetica', 'normal');
    pdf.text('Délai de traitement:', margin + 5, yPosition + 22);
    pdf.setFont('helvetica', 'bold');
    pdf.text(docType.processingTime, margin + 45, yPosition + 22);

    pdf.setFont('helvetica', 'normal');
    pdf.text('Frais consulaires:', pageWidth / 2, yPosition + 22);
    pdf.setFont('helvetica', 'bold');
    pdf.text(docType.fees, pageWidth / 2 + 40, yPosition + 22);

    yPosition += 35;

    // === BARRE DE PROGRESSION VISUELLE ===
    const barWidth = pageWidth - 2 * margin;
    const filledWidth = (barWidth * progressPercentage) / 100;

    // Texte de progression en jaune
    pdf.setFontSize(10);
    pdf.setTextColor(yellowColor[0], yellowColor[1], yellowColor[2]);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PROGRESSION', margin, yPosition);
    yPosition += 5;

    // Barre de fond
    pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    pdf.rect(margin, yPosition, barWidth, 8, 'F');

    // Barre de progression
    pdf.setFillColor(...secondaryColor);
    pdf.rect(margin, yPosition, filledWidth, 8, 'F');

    // Texte de pourcentage en jaune
    pdf.setFontSize(9);
    pdf.setTextColor(yellowColor[0], yellowColor[1], yellowColor[2]);
    pdf.text(
      `${progressPercentage}% COMPLÉTÉ`,
      margin + barWidth / 2,
      yPosition + 5.5,
      { align: 'center' }
    );

    yPosition += 15;

    // === SECTION DOCUMENTS REQUIS ===
    pdf.setFontSize(14);
    pdf.setTextColor(...secondaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('LISTE DES DOCUMENTS REQUIS', margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(9);
    pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      'Cochez chaque document préparé et apportez cette liste lors de votre dépôt',
      margin,
      yPosition
    );
    yPosition += 10;

    // === TABLEAU DES DOCUMENTS ===
    const colPositions = [
      margin + 5, // N° - 10px de large
      margin + 20, // DOCUMENT - 20px de large
      margin + 105, // DESCRIPTION - 85px de large (décalé)
    ];

    // En-tête du tableau
    pdf.setFillColor(...secondaryColor);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');

    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');

    // Alignement CENTRAL pour tous les en-têtes
    pdf.text('N°', colPositions[0], yPosition + 5.5);
    pdf.text('DOCUMENT', colPositions[1], yPosition + 5.5);
    pdf.text('DESCRIPTION', colPositions[2], yPosition + 5.5);

    yPosition += 10;

    // Lignes des documents
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');

    // Fonction pour découper le texte en plusieurs lignes
    const splitTextIntoLines = (
      text: string,
      maxWidth: number,
      fontSize: number = 9
    ): string[] => {
      const lines: string[] = [];
      const words = text.split(' ');
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        // Estimation simplifiée de la largeur (1 caractère ≈ 1.5 unités à taille 9)
        const estimatedWidth = (testLine.length * 1.5 * fontSize) / 9;

        if (estimatedWidth <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) {
            lines.push(currentLine);
          }
          currentLine = word;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    currentChecklist.forEach((item, index) => {
      // Gestion des sauts de page
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
        // Répéter l'en-tête sur nouvelle page
        pdf.setFillColor(...secondaryColor);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.text('N°', colPositions[0], yPosition + 5.5);
        pdf.text('DOCUMENT', colPositions[1], yPosition + 5.5);
        pdf.text('DESCRIPTION', colPositions[2], yPosition + 5.5);
        yPosition += 10;
      }

      // Alternance de couleur des lignes
      if (index % 2 === 0) {
        pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.rect(margin, yPosition - 3, pageWidth - 2 * margin, 10, 'F');
      }

      // Numéro - centré verticalement
      pdf.setTextColor(0, 0, 0);
      pdf.text((index + 1).toString(), colPositions[0], yPosition + 0.5);

      // Nom du document - centré verticalement
      pdf.setTextColor(0, 0, 0);
      if (item.checked) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 100, 100);
      }
      let truncatedName =
        item.name.length > 35 ? item.name.substring(0, 32) + '...' : item.name;
      truncatedName = cleanText(truncatedName);
      pdf.text(truncatedName, colPositions[1], yPosition + 0.5);

      // Description avec retour à ligne automatique
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);

      const descriptionWidth = pageWidth - colPositions[2] - margin;
      const maxCharsPerLine = 50; // Environ la longueur de "Preuve de paiement des frais consulaires"

      let descriptionLines: string[];
      if (item.description.length > maxCharsPerLine) {
        descriptionLines = splitTextIntoLines(
          item.description,
          descriptionWidth
        );
      } else {
        descriptionLines = [item.description];
      }

      // Afficher la première ligne de description
      let firstLine =
        descriptionLines[0].length > 50
          ? descriptionLines[0].substring(0, 47) + '...'
          : descriptionLines[0];
      firstLine = cleanText(firstLine);
      pdf.text(firstLine, colPositions[2], yPosition + 0.5);

      // Réinitialiser les styles
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');

      // Si la description a plusieurs lignes, continuer sur les lignes suivantes
      let extraLinesHeight = 0;
      if (descriptionLines.length > 1) {
        for (let i = 1; i < descriptionLines.length; i++) {
          if (yPosition + extraLinesHeight + 8 > pageHeight - 40) {
            pdf.addPage();
            yPosition = margin;
            extraLinesHeight = 0;
          }

          const line = descriptionLines[i];
          const truncatedLine =
            line.length > 60 ? line.substring(0, 57) + '...' : line;
          pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
          pdf.text(
            cleanText(truncatedLine),
            colPositions[2],
            yPosition + extraLinesHeight + 8
          );
          extraLinesHeight += 5;
        }
      }

      yPosition += 8 + extraLinesHeight;

      // Ajouter la note en dessous si elle existe
      if (item.note) {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(8);
        pdf.setTextColor(...accentColor);
        pdf.setFont('helvetica', 'italic');

        // Ajuster la note pour qu'elle tienne sur une ligne
        const noteText = `Note: ${item.note}`;
        let displayNote = noteText;

        // Estimation simple de la longueur
        if (noteText.length > 70) {
          displayNote = noteText.substring(0, 67) + '...';
        }

        pdf.text(cleanText(displayNote), colPositions[1], yPosition + 0.5);

        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        yPosition += 6;
      }

      yPosition += 2;
    });

    yPosition += 10;

    // === RÉSUMÉ FINAL ===
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setTextColor(...secondaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RÉSUMÉ DE VOTRE DOSSIER', margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');

    const missingDocs = totalCount - completedCount;
    const statusColor = missingDocs === 0 ? secondaryColor : accentColor;
    let statusText = missingDocs === 0 ? 'COMPLET' : 'INCOMPLET';

    // Nettoyer le texte pour éviter les caractères problématiques
    statusText = cleanText(statusText);

    pdf.text('Statut: ', margin, yPosition);
    pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    pdf.text(statusText, margin + 20, yPosition);

    pdf.setTextColor(0, 0, 0);
    pdf.text('Documents manquants: ', pageWidth / 2, yPosition);
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.text(missingDocs.toString(), pageWidth / 2 + 45, yPosition);

    yPosition += 15;

    // === INSTRUCTIONS FINALES ===
    pdf.setFontSize(10);
    pdf.setTextColor(...secondaryColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('INSTRUCTIONS POUR LE DÉPÔT', margin, yPosition);
    yPosition += 7;

    const instructions = [
      '1. Présentez cette checklist avec votre dossier complet',
      '2. Apportez les originaux et 2 copies de chaque document',
      '3. Les photos doivent être récentes (moins de 6 mois)',
      '4. Tous les documents doivent être en français ou traduits',
      "5. Le paiement s'effectue sur place (espèces ou carte)",
    ];

    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');

    instructions.forEach(instruction => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(instruction, margin + 5, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // === PIED DE PAGE PROFESSIONNEL ===
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;

    // Colonne gauche : Informations ambassade
    pdf.setFontSize(8);
    pdf.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);

    pdf.setFont('helvetica', 'bold');
    pdf.text('AMBASSADE DU MALI AU MAROC', margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Avenue Mohammed VI, Rabat', margin, yPosition + 3);
    pdf.text('Tél: +212 5 37 27 40 00', margin, yPosition + 6);
    pdf.text('Email: consular@ambassademali.ma', margin, yPosition + 9);
    pdf.text('Site: www.ambassademali.ma', margin, yPosition + 12);

    // Colonne droite : Informations document
    const rightColumn = pageWidth - margin;

    pdf.text('Document officiel', rightColumn, yPosition, { align: 'right' });
    pdf.text(
      `Généré le: ${new Date().toLocaleDateString('fr-FR')}`,
      rightColumn,
      yPosition + 3,
      { align: 'right' }
    );
    pdf.text(
      `Réf: CONS-${docType.id.toUpperCase()}`,
      rightColumn,
      yPosition + 6,
      { align: 'right' }
    );
    pdf.text('Page 1/1', rightColumn, yPosition + 9, { align: 'right' });
    pdf.text(' Ambassade du Mali', rightColumn, yPosition + 12, {
      align: 'right',
    });

    // Code à barres simulé
    yPosition += 20;
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    pdf.line(margin, yPosition + 0.5, pageWidth - margin, yPosition + 0.5);

    pdf.setFontSize(6);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `CODE: ${docType.id.toUpperCase()}-${Date.now().toString().slice(-8)}-${completedCount}/${totalCount}`,
      pageWidth / 2,
      yPosition + 4,
      { align: 'center' }
    );

    // Sauvegarde du PDF
    const fileName = `Checklist_${docType.name}_Ambassade_Mali_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* En-tête */}
        <section className="mb-8 text-center">
          <h2
            id="missions-titre"
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 mb-4"
          >
            Bilan des documents réquis
          </h2>
          <p className="text-gray-600">
            Selectionnez votre service et suivez votre progression
          </p>
        </section>

        {/* Sélection des services */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Choisissez un service
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documentTypes.map(docType => (
              <button
                key={docType.id}
                onClick={() => selectDocumentType(docType.id)}
                className={`bg-white rounded-lg p-4 text-left border-2 transition-all ${
                  selectedDocumentType === docType.id
                    ? 'border-green-600 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedDocumentType === docType.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-green-600'
                    }`}
                  >
                    {docType.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {docType.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {docType.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Checklist */}
        {selectedDocumentType && (
          <section className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* En-tête de la checklist */}
            <div className="bg-green-600 text-white p-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {getSelectedDocumentType()?.name}
                  </h2>
                  <p className="text-green-100 text-sm">
                    {getSelectedDocumentType()?.fullDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Progression */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progression : {completedCount}/{totalCount}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {progressPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Informations */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Clock size={16} className="text-yellow-600" />
                  <div>
                    <span className="font-medium">Delai :</span>
                    <span className="text-gray-700 ml-1">
                      {getSelectedDocumentType()?.processingTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign size={16} className="text-green-600" />
                  <div>
                    <span className="font-medium">Frais :</span>
                    <span className="text-gray-700 ml-1">
                      {getSelectedDocumentType()?.fees}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des documents */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Documents requis :
              </h3>

              <div className="space-y-2">
                {currentChecklist.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-start p-3 border rounded-lg transition-colors ${
                      item.checked
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`item-${index}`}
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(index)}
                      className="mt-1 h-4 w-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <label htmlFor={`item-${index}`} className="ml-3 flex-1">
                      <span
                        className={`font-medium block text-sm ${
                          item.checked
                            ? 'text-green-700 line-through'
                            : 'text-gray-900'
                        }`}
                      >
                        {item.name}
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.description}
                      </p>
                      {item.note && (
                        <div className="mt-2 text-xs bg-red-50 p-2 rounded border border-red-200 text-red-700">
                          <div className="flex items-start space-x-1">
                            <AlertTriangle
                              size={12}
                              className="mt-0.5 shrink-0"
                            />
                            <span>
                              <strong>Note :</strong> {item.note}
                            </span>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={resetChecklist}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>Reinitialiser</span>
                </button>
                <button
                  onClick={downloadChecklistPDF}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center justify-center space-x-2"
                >
                  <Download size={16} />
                  <span>Telecharger PDF</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* État vide */}
        {!selectedDocumentType && (
          <section className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ListChecks size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Selectionnez un service
            </h3>
            <p className="text-gray-600 text-sm">
              Choisissez un service pour afficher la checklist correspondante
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
