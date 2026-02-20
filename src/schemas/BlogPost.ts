import mongoose, { Schema, Model, Document } from 'mongoose';

// Interface pour le document MongoDB
export interface IBlogPost extends Document {
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
  category?:
    | 'événement'
    | 'actualité'
    | 'urgence'
    | 'information'
    | 'communiqué';
  priority: 'urgent' | 'important' | 'normal';
  tags: string[];
  readingTime: number;
  featured: boolean;
  expiresAt: Date | null;
  publishedAt: Date;
  updatedAt: Date;
  createdAt: Date;
}

// Schéma pour l'auteur
const AuthorSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  { _id: false }
);

// Schéma principal pour les articles de blog
const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    author: {
      type: AuthorSchema,
      required: true,
    },
    category: {
      type: String,
      required: false,
      enum: ['événement', 'actualité', 'urgence', 'information', 'communiqué'],
      default: 'information',
    },
    priority: {
      type: String,
      required: true,
      enum: ['urgent', 'important', 'normal'],
      default: 'normal',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    readingTime: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    toJSON: {
      virtuals: true,
      transform: function (doc: any, ret: any) {
        if (ret._id) {
          ret.id = ret._id.toString();
          delete ret._id;
        }
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index composé pour les requêtes fréquentes
BlogPostSchema.index({ priority: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1, publishedAt: -1 });
BlogPostSchema.index({ featured: 1, priority: 1 });

// Middleware pour générer le slug avant la sauvegarde
BlogPostSchema.pre('save', function (this: any, next: any) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Middleware pour calculer le temps de lecture
BlogPostSchema.pre('save', function (this: any, next: any) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Méthode statique pour obtenir les articles actifs (non expirés)
BlogPostSchema.statics.getActivePosts = function () {
  return this.find({
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
  }).sort({ priority: 1, publishedAt: -1 });
};

// Méthode statique pour obtenir les articles par priorité
BlogPostSchema.statics.getByPriority = function (priority: string) {
  return this.find({ priority }).sort({ publishedAt: -1 });
};

// Méthode statique pour obtenir les articles par catégorie
BlogPostSchema.statics.getByCategory = function (category: string) {
  return this.find({ category }).sort({ publishedAt: -1 });
};

// Empêcher la réinitialisation du modèle lors du hot reload en développement
const BlogPostModel: Model<IBlogPost> =
  mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPostModel;
