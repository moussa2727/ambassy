// data/posts.ts
export interface Post {
  id: number
  cat: string
  featured: boolean
  title: string
  excerpt: string
  date: string
  img: string
  body: string
}

export const posts: Post[] = [
  {
    id: 0,
    cat: 'tech',
    featured: true,
    title: "Astro 5 : l'avenir du web statique est arrivé",
    excerpt: "Islands Architecture, Zero JS par défaut, Server Actions — une révolution silencieuse qui change tout pour les développeurs front-end.",
    date: '15 Fév 2026',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&auto=format&fit=crop',
    body: `<p>Depuis sa première version, Astro a toujours su se démarquer avec une promesse radicale : envoyer zéro JavaScript au navigateur par défaut. Avec la version 5, ce principe atteint sa maturité.</p>
    <h2>L'Islands Architecture expliquée</h2>
    <p>Imaginez une plage. La majeure partie est du sable statique — du HTML pur, rapide, efficace. Les "îles" sont ces petits composants interactifs qui nécessitent du JavaScript. Astro les isole soigneusement, les charge paresseusement, et préserve la performance globale de votre site.</p>
    <blockquote>« Le futur du web n'est pas moins de JavaScript — c'est du JavaScript au bon endroit, au bon moment. »</blockquote>
    <p>Les Server Actions introduits en v5 permettent désormais de gérer des mutations de données directement depuis les composants Astro, sans API intermédiaire. Une simplification radicale du stack pour les petits et moyens projets.</p>
    <h2>Intégration avec Next.js</h2>
    <p>Pour les équipes déjà sur Next.js, Astro peut coexister dans un monorepo Turborepo. L'idée : utiliser Astro pour les pages de contenu statique (blog, docs, landing pages) et Next.js pour l'application principale avec authentification et mutations. Les deux partagent un design system commun via un package local.</p>
    <p>Les benchmarks sont éloquents : un site Astro typique charge 40% plus vite qu'un équivalent Next.js, avec un Lighthouse score moyen de 98/100 sans optimisation particulière.</p>`
  },
  {
    id: 1,
    cat: 'tech',
    featured: true,
    title: 'Tailwind CSS v5 : Oxide Engine et nouveau paradigme',
    excerpt: 'Le moteur CSS réécrit en Rust réduit les temps de build de 12x. Voici ce qui change vraiment.',
    date: '12 Fév 2026',
    img: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80&auto=format&fit=crop',
    body: `<p>Tailwind CSS version 5 marque un tournant avec son moteur Oxide, réécrit en Rust. Les temps de compilation passent de secondes à millisecondes.</p>
    <h2>Ce qui change en pratique</h2>
    <p>Sur un projet de 15 000 classes, le build passe de 2,3s à 180ms. L'API de configuration migre vers du CSS natif pur — fini le fichier JS de configuration. Et la configuration CSS native est plus lisible, plus maintenable, et mieux intégrée aux outils modernes.</p>
    <blockquote>« Quand les outils s'effacent, la créativité prend toute la place. »</blockquote>
    <p>La compatibilité avec les plugins existants atteint 95%, et un script de migration automatique est fourni. Pour la plupart des équipes, la transition devrait prendre moins d'une journée.</p>`
  },
  {
    id: 2,
    cat: 'design',
    featured: false,
    title: "Le minimalisme radical dans le design d'interface",
    excerpt: "Moins de bruit, plus de sens. Comment les meilleurs designers communiquent davantage avec moins.",
    date: '10 Fév 2026',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
    body: `<p>Le minimalisme mal compris devient du vide. Le minimalisme bien exécuté devient de la clarté. La distinction est subtile mais fondamentale.</p>
    <h2>Supprimer vs. clarifier</h2>
    <p>Un bouton n'est pas minimaliste parce qu'il manque d'ombre ou de bordure. Il est minimaliste quand chaque pixel présent est là pour une raison précise, et que chaque pixel absent aurait dilué ce propos.</p>
    <blockquote>« La perfection est atteinte non quand il n'y a plus rien à ajouter, mais quand il n'y a plus rien à retrancher. »</blockquote>
    <p>Les interfaces qui durent respectent l'attention de l'utilisateur. Dans un monde saturé d'information, la retenue devient un acte généreux.</p>`
  },
  {
    id: 3,
    cat: 'nature',
    featured: false,
    title: 'Forêts de données : quand l\'écologie inspire l\'architecture logicielle',
    excerpt: 'Les systèmes naturels sont des maîtres en résilience et efficacité. Ce que nos codebases peuvent en apprendre.',
    date: '8 Fév 2026',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80&auto=format&fit=crop',
    body: `<p>Une forêt ancienne n'a pas de point de défaillance unique. Si un arbre tombe, la canopée se referme. Si un réseau mycorhizien est coupé, les arbres voisins prennent le relais. C'est une architecture distribuée à la perfection.</p>
    <h2>Microservices et rhizomes</h2>
    <p>Les architectures microservices les plus robustes s'inspirent intuitivement de ces principes. Chaque service est autonome mais interconnecté. La défaillance est locale et isolée. La communication passe par des canaux multiples et redondants.</p>
    <blockquote>« La résilience naît de la diversité et de la redondance, pas de la centralisation et du contrôle. »</blockquote>
    <p>Les écosystèmes naturels ont 3,8 milliards d'années d'optimisation. Il serait présomptueux de ne pas s'en inspirer.</p>`
  },
  {
    id: 4,
    cat: 'culture',
    featured: false,
    title: "IA générative et droits d'auteur : état des lieux 2026",
    excerpt: 'Deux ans après les premières plaintes, le cadre légal se précise. Ce que les créateurs doivent savoir.',
    date: '6 Fév 2026',
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80&auto=format&fit=crop',
    body: `<p>Le droit à l'ère de l'intelligence artificielle générative avance à tâtons, mais un consensus commence à émerger dans les grandes juridictions mondiales.</p>
    <h2>La jurisprudence s'installe</h2>
    <p>Aux États-Unis, plusieurs décisions récentes ont établi que l'entraînement sur des œuvres protégées peut constituer une violation si les œuvres sont mémorisées et reproductibles. En Europe, le cadre est différent avec l'exception de text and data mining.</p>
    <blockquote>« La technologie évolue vite. Le droit évolue lentement. L'espace entre les deux est le terrain de jeu des avocats. »</blockquote>
    <p>Pour les créateurs, la recommandation pratique est claire : documentez tout. Chaque prompt, chaque output, chaque modification manuelle. Cette traçabilité sera votre meilleure protection.</p>`
  },
  {
    id: 5,
    cat: 'science',
    featured: false,
    title: "Les neurones miroirs et l'apprentissage du code",
    excerpt: 'La neuroscience éclaire pourquoi lire le code des autres est si efficace — et comment en tirer le maximum.',
    date: '3 Fév 2026',
    img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80&auto=format&fit=crop',
    body: `<p>Quand vous lisez du code écrit par quelqu'un d'autre, votre cerveau n'est pas passif. Les neurones miroirs s'activent comme si vous écriviez vous-même ce code.</p>
    <h2>L'implication pour les développeurs</h2>
    <p>La relecture de code n'est pas une simple vérification — c'est une forme de pratique neuronale. Chaque code review est une session d'entraînement déguisée.</p>
    <blockquote>« Nous apprenons beaucoup plus par imitation que nous ne voulons bien l'admettre. »</blockquote>
    <p>Pratique recommandée : 20 minutes par jour à lire du code admirable. Open source, projets reconnus, grandes codebases. Votre cerveau fera le reste.</p>`
  }
]