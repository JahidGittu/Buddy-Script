// src/app/api/posts/get/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/posts/get called');
    
    const session = await getServerSession(authOptions);
    console.log('📋 Session:', session ? 'Exists' : 'No session');
    
    if (!session) {
      console.log('❌ Unauthorized - No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    console.log('✅ Database connected');

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    console.log(`📄 Fetching posts - Page: ${page}, Limit: ${limit}`);

    // Get posts with user data
    const posts = await Post.find({
      $or: [
        { privacy: 'public' },
        { 'user.id': session.user.id }
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`✅ Found ${posts.length} posts`);

    const totalPosts = await Post.countDocuments({
      $or: [
        { privacy: 'public' },
        { 'user.id': session.user.id }
      ]
    });

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNext: page < Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}