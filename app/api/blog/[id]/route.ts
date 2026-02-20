import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongo';
import BlogPostModel from '@/schemas/BlogPost';
import mongoose from 'mongoose';
import { getPostById as getStaticPostById } from '@/lib/data/blog-data';

// GET - Obtenir un article par ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not configured, using static data');
      const post = getStaticPostById(id);

      if (!post) {
        return NextResponse.json(
          {
            success: false,
            error: 'Article non trouvé',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: post,
      });
    }

    // Try to connect to MongoDB
    try {
      await connectDB();
    } catch (error) {
      console.warn('MongoDB connection failed, using static data:', error);
      const post = getStaticPostById(id);

      if (!post) {
        return NextResponse.json(
          {
            success: false,
            error: 'Article non trouvé',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: post,
      });
    }

    // Valider le format de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // If not a valid ObjectId, treat it as a slug and search by slug
      console.warn('Invalid ObjectId format, treating as slug:', id);

      // Try to find by slug in static data first
      const staticPost = getStaticPostById(id);
      if (staticPost) {
        return NextResponse.json({
          success: true,
          data: staticPost,
        });
      }

      // If not found in static data, try to find in MongoDB by slug
      try {
        const postBySlug = await BlogPostModel.findOne({ slug: id }).lean();
        if (postBySlug) {
          const transformedPost = {
            ...postBySlug,
            id: postBySlug._id.toString(),
            publishedAt: postBySlug.publishedAt,
            updatedAt: postBySlug.updatedAt,
            expiresAt: postBySlug.expiresAt,
            _id: undefined,
          };

          return NextResponse.json({
            success: true,
            data: transformedPost,
          });
        }
      } catch (slugError) {
        console.warn('Error searching by slug in MongoDB:', slugError);
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Article non trouvé',
        },
        { status: 404 }
      );
    }

    const post = await BlogPostModel.findById(id).lean();

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article non trouvé',
        },
        { status: 404 }
      );
    }

    // Transformer pour la réponse
    const transformedPost = {
      ...post,
      id: post._id.toString(),
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      expiresAt: post.expiresAt,
      _id: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedPost,
    });
  } catch (error: any) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération de l'article",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT/PATCH - Mettre à jour un article
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    // Valider le format de l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format d'ID invalide",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Vérifier que l'article existe
    const existingPost = await BlogPostModel.findById(id);
    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article non trouvé',
        },
        { status: 404 }
      );
    }

    // Validation de la catégorie si fournie
    if (body.category) {
      const validCategories = [
        'événement',
        'actualité',
        'urgence',
        'information',
        'communiqué',
      ];
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          {
            success: false,
            error: `Catégorie invalide. Valeurs acceptées: ${validCategories.join(', ')}`,
          },
          { status: 400 }
        );
      }
    }

    // Validation de la priorité si fournie
    if (body.priority) {
      const validPriorities = ['urgent', 'important', 'normal'];
      if (!validPriorities.includes(body.priority)) {
        return NextResponse.json(
          {
            success: false,
            error: `Priorité invalide. Valeurs acceptées: ${validPriorities.join(', ')}`,
          },
          { status: 400 }
        );
      }
    }

    // Validation des tags si fournis
    if (body.tags && (!Array.isArray(body.tags) || body.tags.length === 0)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Les tags doivent être un tableau non vide',
        },
        { status: 400 }
      );
    }

    // Validation de l'auteur si fourni
    if (
      body.author &&
      (!body.author.id || !body.author.name || !body.author.role)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Format auteur invalide. Requis: id, name, role',
        },
        { status: 400 }
      );
    }

    // Convertir expiresAt en Date si fourni
    if (body.expiresAt) {
      body.expiresAt = new Date(body.expiresAt);
    }

    // Mettre à jour l'article
    const updatedPost = await BlogPostModel.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          message: 'Article non trouvé',
        },
        { status: 404 }
      );
    }

    // Transformer pour la réponse
    const transformedPost = {
      ...updatedPost,
      id: updatedPost._id.toString(),
      publishedAt: updatedPost.publishedAt,
      updatedAt: updatedPost.updatedAt,
      expiresAt: updatedPost.expiresAt,
      _id: undefined,
    };

    return NextResponse.json({
      success: true,
      data: transformedPost,
      message: 'Article mis à jour avec succès',
    });
  } catch (error: any) {
    console.error('Error updating post:', error);

    // Gérer l'erreur de slug dupliqué
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Un article avec ce titre existe déjà',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la mise à jour de l'article",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH - Mise à jour partielle
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

// DELETE - Supprimer un article
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    // Valider le format de l'ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format d'ID invalide",
        },
        { status: 400 }
      );
    }

    const deletedPost = await BlogPostModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article non trouvé',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Article supprimé avec succès',
    });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression de l'article",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
