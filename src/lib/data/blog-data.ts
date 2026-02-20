import { BlogPost } from '@/types/blog';

// Base de données simulée en mémoire
let blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'alerte-securite-manifestations',
    title: '🚨 Alerte Sécurité : Manifestations prévues ce week-end',
    excerpt:
      "En raison de manifestations prévues dans le centre-ville ce week-end, nous recommandons à tous les ressortissants d'éviter les zones concernées.",
    content: `
# Alerte Sécurité : Manifestations

Chers compatriotes,

L'ambassade a été informée de manifestations prévues ce samedi 17 février dans le centre-ville entre 14h et 20h.

## Zones à éviter
- Place de la République
- Avenue principale
- Quartier gouvernemental

## Recommandations
- Évitez les rassemblements
- Restez informés via les médias locaux
- Ayez vos documents d'identité sur vous
- En cas d'urgence, contactez l'ambassade au +212 XXX XXX XXX

Restez vigilants et prenez soin de vous.
    `,
    coverImage: '/images/ambassador.webp',
    author: {
      id: '1',
      name: 'Service Consulaire',
      role: 'Consul Général',
    },
    publishedAt: '2026-02-15T10:00:00Z',
    category: 'urgence',
    priority: 'urgent',
    tags: ['Sécurité', 'Alerte', 'Manifestation'],
    readingTime: 3,
    featured: true,
    expiresAt: '2026-02-18T00:00:00Z',
  },
  {
    id: '2',
    slug: 'celebration-fete-nationale',
    title: 'Célébration de la Fête Nationale - 14 Mars 2026',
    excerpt:
      "L'ambassade vous invite à célébrer la Fête Nationale le samedi 14 mars 2026 dans les jardins de l'ambassade.",
    content: `
# Célébration de la Fête Nationale

L'ambassade a le plaisir de vous inviter à célébrer notre Fête Nationale.

## Détails de l'événement
- **Date** : Samedi 14 mars 2026
- **Heure** : 18h00 - 23h00
- **Lieu** : Jardins de l'ambassade

## Programme
- 18h00 : Accueil et cocktail
- 19h00 : Discours de l'Ambassadeur
- 19h30 : Spectacle culturel
- 20h30 : Dîner buffet
- 22h00 : Musique et danse

## Inscription
Inscription obligatoire avant le 10 mars via notre site web ou par téléphone.

Au plaisir de vous voir nombreux !
    `,
    coverImage: '/images/ambassador.webp',
    author: {
      id: '2',
      name: 'Mme. Sophie Laurent',
      role: 'Ambassadrice',
    },
    publishedAt: '2026-02-10T14:30:00Z',
    category: 'événement',
    priority: 'important',
    tags: ['Événement', 'Fête Nationale', 'Célébration'],
    readingTime: 4,
    featured: false,
  },
  {
    id: '3',
    slug: 'nouveaux-horaires-service-visa',
    title: 'Nouveaux horaires du service des visas',
    excerpt:
      'À compter du 1er mars 2026, le service des visas sera ouvert selon de nouveaux horaires pour mieux vous servir.',
    content: `
# Nouveaux horaires du service des visas

À compter du 1er mars 2026, le service des visas modifie ses horaires d'ouverture.

## Nouveaux horaires
- **Lundi à Jeudi** : 8h30 - 15h30 (sans interruption)
- **Vendredi** : 8h30 - 12h30
- **Samedi et Dimanche** : Fermé

## Prise de rendez-vous
La prise de rendez-vous en ligne reste obligatoire via notre plateforme dédiée.

## Contact
- Email : visas@ambassade.ma
- Téléphone : +212 XXX XXX XXX
- Site web : www.ambassade.ma/visas

Ces nouveaux horaires permettront un meilleur service et des délais de traitement réduits.
    `,
    coverImage: '/images/ambassador.webp',
    author: {
      id: '3',
      name: 'Service des Visas',
      role: 'Chef du Service Consulaire',
    },
    publishedAt: '2026-02-08T09:15:00Z',
    category: 'information',
    priority: 'important',
    tags: ['Visa', 'Horaires', 'Service Consulaire'],
    readingTime: 2,
    featured: false,
  },
  {
    id: '4',
    slug: 'visite-officielle-ministre',
    title: 'Visite officielle du Ministre des Affaires Étrangères',
    excerpt:
      'Le Ministre des Affaires Étrangères effectuera une visite officielle du 20 au 22 février 2026.',
    content: `
# Visite officielle du Ministre des Affaires Étrangères

Le Ministre des Affaires Étrangères effectuera une visite officielle au Maroc du 20 au 22 février 2026.

## Programme de la visite
- **20 février** : Arrivée et rencontre avec l'Ambassadeur
- **21 février** : Réunions bilatérales avec les autorités marocaines
- **22 février** : Visite d'entreprises et départ

## Opportunités
Cette visite renforcera les liens diplomatiques et économiques entre nos deux pays.

Des opportunités de rencontres professionnelles seront organisées pour la communauté d'affaires.

## Contact presse
Pour toute demande média : presse@ambassade.ma
    `,
    coverImage: '/images/ambassador.webp',
    author: {
      id: '2',
      name: 'Mme. Sophie Laurent',
      role: 'Ambassadrice',
    },
    publishedAt: '2026-02-05T16:45:00Z',
    category: 'actualité',
    priority: 'important',
    tags: ['Visite Officielle', 'Diplomatie', 'Relations Bilatérales'],
    readingTime: 3,
    featured: false,
  },
  {
    id: '5',
    slug: 'programme-bourses-etudes-2026',
    title: "Programme de bourses d'études 2026-2027",
    excerpt:
      "Ouverture des candidatures pour le programme de bourses d'études pour l'année académique 2026-2027.",
    content: `
# Programme de bourses d'études 2026-2027

L'ambassade est heureuse d'annoncer l'ouverture des candidatures pour le programme de bourses d'études.

## Bourses disponibles
- Bourses de Master
- Bourses de Doctorat
- Bourses de recherche post-doctorale

## Critères d'éligibilité
- Nationalité marocaine
- Excellent dossier académique
- Projet d'études cohérent
- Niveau de langue requis

## Date limite
**30 avril 2026**

## Documents requis
- CV détaillé
- Relevés de notes
- Lettres de recommandation
- Projet d'études

## Comment postuler
Dossier complet à soumettre via notre portail en ligne : bourses.ambassade.ma

Pour plus d'informations : education@ambassade.ma
    `,
    coverImage: '/images/ambassador.webp',
    author: {
      id: '4',
      name: 'Service de Coopération',
      role: 'Attaché de Coopération Universitaire',
    },
    publishedAt: '2026-02-01T11:20:00Z',
    category: 'information',
    priority: 'normal',
    tags: ['Bourses', 'Études', 'Éducation'],
    readingTime: 4,
    featured: false,
  },
  {
    id: '6',
    slug: 'communique-fermeture-exceptionnelle',
    title: 'Communiqué : Fermeture exceptionnelle du 25 février',
    excerpt:
      "L'ambassade sera exceptionnellement fermée le mardi 25 février 2026 pour inventaire annuel.",
    content: `
# Fermeture exceptionnelle

L'ambassade informe le public qu'elle sera **exceptionnellement fermée le mardi 25 février 2026** pour inventaire annuel.

## Services concernés
- Service consulaire
- Service des visas
- Accueil du public

## Réouverture
L'ambassade réouvrira ses portes le **mercredi 26 février à 8h30**.

## Urgences
En cas d'urgence consulaire, contactez le numéro d'urgence :
**+212 XXX XXX XXX** (disponible 24h/24)

Nous vous remercions de votre compréhension.
    `,
    coverImage: '/images/ambassador.webp',
    author: {
      id: '1',
      name: 'Service Consulaire',
      role: 'Consul Général',
    },
    publishedAt: '2026-01-28T13:00:00Z',
    category: 'communiqué',
    priority: 'important',
    tags: ['Fermeture', 'Horaires', 'Information'],
    readingTime: 2,
    featured: false,
  },
];

// Fonction pour calculer le temps de lecture
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Fonction pour générer un slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Obtenir tous les articles
export function getAllPosts(): BlogPost[] {
  return blogPosts
    .filter(post => !post.expiresAt || new Date(post.expiresAt) > new Date())
    .sort((a, b) => {
      // Tri par priorité puis par date
      const priorityOrder = { urgent: 0, important: 1, normal: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });
}

// Obtenir un article par slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// Obtenir un article par ID
export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}

// Obtenir les articles par catégorie
export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(post => post.category === category);
}

// Obtenir les articles par priorité
export function getPostsByPriority(priority: string): BlogPost[] {
  return getAllPosts().filter(post => post.priority === priority);
}

// Obtenir les articles par tag
export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// Créer un nouvel article
export function createPost(
  postData: Omit<BlogPost, 'id' | 'slug' | 'publishedAt' | 'readingTime'>
): BlogPost {
  const newPost: BlogPost = {
    ...postData,
    id: Date.now().toString(),
    slug: generateSlug(postData.title),
    publishedAt: new Date().toISOString(),
    readingTime: calculateReadingTime(postData.content),
  };

  blogPosts.push(newPost);
  return newPost;
}

// Mettre à jour un article
export function updatePost(
  id: string,
  updates: Partial<BlogPost>
): BlogPost | null {
  const index = blogPosts.findIndex(post => post.id === id);

  if (index === -1) {
    return null;
  }

  const updatedPost = {
    ...blogPosts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    readingTime: updates.content
      ? calculateReadingTime(updates.content)
      : blogPosts[index].readingTime,
  };

  // Régénérer le slug si le titre change
  if (updates.title && updates.title !== blogPosts[index].title) {
    updatedPost.slug = generateSlug(updates.title);
  }

  blogPosts[index] = updatedPost;
  return updatedPost;
}

// Supprimer un article
export function deletePost(id: string): boolean {
  const index = blogPosts.findIndex(post => post.id === id);

  if (index === -1) {
    return false;
  }

  blogPosts.splice(index, 1);
  return true;
}

// Obtenir les statistiques
export function getStats() {
  return {
    total: blogPosts.length,
    byCategory: {
      événement: blogPosts.filter(p => p.category === 'événement').length,
      actualité: blogPosts.filter(p => p.category === 'actualité').length,
      urgence: blogPosts.filter(p => p.category === 'urgence').length,
      information: blogPosts.filter(p => p.category === 'information').length,
      communiqué: blogPosts.filter(p => p.category === 'communiqué').length,
    },
    byPriority: {
      urgent: blogPosts.filter(p => p.priority === 'urgent').length,
      important: blogPosts.filter(p => p.priority === 'important').length,
      normal: blogPosts.filter(p => p.priority === 'normal').length,
    },
  };
}
