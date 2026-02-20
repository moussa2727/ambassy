import { NextResponse } from 'next/server';
import { createPost } from '@/lib/data/blog-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation des champs requis
    const requiredFields = [
      'title',
      'excerpt',
      'content',
      'coverImage',
      'author',
      'category',
      'priority',
      'tags',
    ];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Champs manquants: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Validation du format de l'auteur
    if (!body.author.id || !body.author.name || !body.author.role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Format auteur invalide. Requis: id, name, role',
        },
        { status: 400 }
      );
    }

    // Validation de la catégorie
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

    // Validation de la priorité
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

    // Validation des tags
    if (!Array.isArray(body.tags) || body.tags.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Les tags doivent être un tableau non vide',
        },
        { status: 400 }
      );
    }

    // Créer l'article
    const newPost = createPost({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage,
      author: body.author,
      category: body.category,
      priority: body.priority,
      tags: body.tags,
      featured: body.featured || false,
      expiresAt: body.expiresAt,
      updatedAt: body.updatedAt,
    });

    return NextResponse.json(
      {
        success: true,
        data: newPost,
        message: 'Article créé avec succès',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création de l'article",
      },
      { status: 500 }
    );
  }
}
