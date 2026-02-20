import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongo';
import BlogPostModel from '@/schemas/BlogPost';
import { getAllPosts as getAllStaticPosts } from '@/lib/data/blog-data';

export async function GET(request: Request) {
  try {
    // Check if MongoDB is configured
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not configured, using static data');
      const posts = getAllStaticPosts();

      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const priority = searchParams.get('priority');
      const tag = searchParams.get('tag');
      const featured = searchParams.get('featured');
      const stats = searchParams.get('stats');

      // Handle stats request
      if (stats === 'true') {
        const total = posts.length;
        const byCategory = posts.reduce(
          (acc, post) => {
            acc[post.category] = (acc[post.category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );
        const byPriority = posts.reduce(
          (acc, post) => {
            acc[post.priority] = (acc[post.priority] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        return NextResponse.json({
          success: true,
          data: {
            total,
            byCategory,
            byPriority,
          },
        });
      }

      // Filter posts based on query params
      let filteredPosts = posts;

      if (category) {
        filteredPosts = filteredPosts.filter(
          post => post.category === category
        );
      }

      if (priority) {
        filteredPosts = filteredPosts.filter(
          post => post.priority === priority
        );
      }

      if (tag) {
        filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
      }

      if (featured === 'true') {
        filteredPosts = filteredPosts.filter(post => post.featured);
      }

      return NextResponse.json({
        success: true,
        data: filteredPosts,
        total: filteredPosts.length,
      });
    }

    // Try to connect to MongoDB
    try {
      await connectDB();
    } catch (error) {
      console.warn('MongoDB connection failed, using static data:', error);
      const posts = getAllStaticPosts();

      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const priority = searchParams.get('priority');
      const tag = searchParams.get('tag');
      const featured = searchParams.get('featured');
      const stats = searchParams.get('stats');

      // Handle stats request
      if (stats === 'true') {
        const total = posts.length;
        const byCategory = posts.reduce(
          (acc, post) => {
            acc[post.category] = (acc[post.category] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );
        const byPriority = posts.reduce(
          (acc, post) => {
            acc[post.priority] = (acc[post.priority] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        return NextResponse.json({
          success: true,
          data: {
            total,
            byCategory,
            byPriority,
          },
        });
      }

      // Filter posts based on query params
      let filteredPosts = posts;

      if (category) {
        filteredPosts = filteredPosts.filter(
          post => post.category === category
        );
      }

      if (priority) {
        filteredPosts = filteredPosts.filter(
          post => post.priority === priority
        );
      }

      if (tag) {
        filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
      }

      if (featured === 'true') {
        filteredPosts = filteredPosts.filter(post => post.featured);
      }

      return NextResponse.json({
        success: true,
        data: filteredPosts,
        total: filteredPosts.length,
      });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const stats = searchParams.get('stats');

    // Retourner les statistiques
    if (stats === 'true') {
      const total = await BlogPostModel.countDocuments();
      const byCategory = await BlogPostModel.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);
      const byPriority = await BlogPostModel.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]);

      return NextResponse.json({
        success: true,
        data: {
          total,
          byCategory: Object.fromEntries(
            byCategory.map((item: { _id: any; count: any }) => [
              item._id,
              item.count,
            ])
          ),
          byPriority: Object.fromEntries(
            byPriority.map((item: { _id: any; count: any }) => [
              item._id,
              item.count,
            ])
          ),
        },
      });
    }

    // Construire la requête
    let query: any = {
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    };

    if (category) {
      query.category = category;
    }

    if (priority) {
      query.priority = priority;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Exécuter la requête avec tri par priorité puis date
    const posts = await BlogPostModel.find(query)
      .sort({
        priority: 1, // urgent < important < normal
        publishedAt: -1,
      })
      .lean();

    // Transformer les données pour le frontend
    const transformedPosts = posts.map(post => ({
      ...post,
      id: post._id.toString(),
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      expiresAt: post.expiresAt,
      _id: undefined,
    }));

    return NextResponse.json({
      success: true,
      data: transformedPosts,
      total: transformedPosts.length,
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des articles',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
