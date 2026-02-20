export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: {
    id: string;
    name: string;
    role: string;
  };
  publishedAt: string;
  category:
    | 'événement'
    | 'actualité'
    | 'urgence'
    | 'information'
    | 'communiqué';
  priority: 'urgent' | 'important' | 'normal';
  tags: string[];
  readingTime: number;
  featured: boolean;
  expiresAt?: string | null;
  updatedAt?: string;
  createdAt?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'les-meilleures-universites-canadiennes-en-2024',
    title: 'Les meilleures universités canadiennes en 2024',
    excerpt:
      'Découvrez notre classement des universités les plus prisées par les étudiants internationaux.',
    content: `Le Canada continue d'attirer des milliers d'étudiants internationaux chaque année grâce à la qualité de son système éducatif et son environnement multiculturel.

## Les universités de premier plan

**1. Université de Toronto**
L'Université de Toronto se distingue par ses programmes de recherche de renommée mondiale et sa diversité culturelle exceptionnelle. Elle offre plus de 700 programmes de premier cycle et 200 programmes de cycles supérieurs.

**2. Université McGill**
Située à Montréal, McGill est reconnue pour son excellence académique et son campus bilingue. Elle attire des étudiants de plus de 150 pays.

**3. Université de la Colombie-Britannique**
UBC offre un cadre naturel exceptionnel à Vancouver et des programmes innovants dans les domaines des sciences, de l'ingénierie et des arts.

## Critères de sélection

Lors du choix de votre université, considérez :
- Les programmes offerts dans votre domaine
- Les possibilités de bourses
- Le coût de la vie dans la ville
- Les opportunités de stages et d'emploi

## Processus d'admission

Les admissions pour l'automne 2025 ouvrent généralement en septembre 2024. Préparez vos documents tôt pour maximiser vos chances.`,
    coverImage:
      'https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=400&fit=crop',
    author: {
      id: '1',
      name: 'Service Éducatif',
      role: "Conseiller d'études",
    },
    publishedAt: '2024-12-02T10:00:00Z',
    category: 'information',
    priority: 'normal',
    tags: ['Éducation', 'Canada', 'Universités'],
    readingTime: 5,
    featured: false,
  },
  {
    id: '2',
    slug: 'comment-obtenir-visa-etudiant-france',
    title: 'Comment obtenir un visa étudiant pour la France',
    excerpt:
      'Guide complet des démarches administratives pour votre demande de visa étudiant.',
    content: `Obtenir un visa étudiant pour la France nécessite une préparation minutieuse. Voici notre guide complet pour vous accompagner dans cette démarche.

## Types de visas étudiants

**Visa de long séjour étudiant (VLS-TS)**
Ce visa est valable pour les séjours de plus de 3 mois. Il fait office de titre de séjour la première année.

**Visa de court séjour**
Pour les formations de moins de 3 mois, un visa Schengen peut suffire.

## Documents requis

- Passeport valide (6 mois minimum)
- Formulaire de demande de visa
- Photos d'identité récentes
- Attestation d'inscription ou de pré-inscription
- Justificatif de ressources financières
- Attestation d'hébergement
- Assurance maladie

## Étapes de la procédure

1. **Créer un compte Campus France** - Obligatoire pour la plupart des nationalités
2. **Compléter votre dossier** - Renseignez vos informations académiques
3. **Payer les frais** - Environ 99€ pour le traitement
4. **Entretien Campus France** - Préparez-vous à présenter votre projet
5. **Rendez-vous au consulat** - Pour la biométrie et le dépôt final

## Délais à prévoir

Commencez vos démarches au moins 3 mois avant la date de départ prévue.`,
    coverImage:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=400&fit=crop',
    author: {
      id: '2',
      name: 'Service Consulaire',
      role: 'Attaché consulaire',
    },
    publishedAt: '2024-12-01T14:30:00Z',
    category: 'information',
    priority: 'important',
    tags: ['Visa', 'France', 'Études'],
    readingTime: 8,
    featured: true,
  },
];
