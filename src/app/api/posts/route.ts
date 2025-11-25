// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User'; // Fixed import

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get posts with user data, excluding private posts from other users
    const posts = await Post.find({
      $or: [
        { privacy: 'public' },
        { 'user.id': session.user.id } // user can see their own private posts
      ]
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


// src/app/api/posts/route.ts - POST function আপডেট করুন
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, image, privacy = 'public' } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get user data
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create avatar based on available data
    let userAvatar = '/assets/images/txt_img.png'; // default
    
    if (user.image) {
      // If user has profile image, use it
      userAvatar = user.image;
    } else if (user.firstName && user.lastName) {
      // Create avatar from first letters of first and last name
      const firstLetter = user.firstName.charAt(0).toUpperCase();
      const lastLetter = user.lastName.charAt(0).toUpperCase();
      // Generate avatar with initials
      userAvatar = `https://ui-avatars.com/api/?name=${firstLetter}+${lastLetter}&background=random&color=fff&size=128`;
    }

    // Create new post
    const post = new Post({
      content: content.trim(),
      image: image || null,
      privacy,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        avatar: userAvatar,
        email: user.email
      },
      reactions: {
        likes: [],
        loves: [],
        hahas: [],
        wows: [],
        sads: [],
        angrys: []
      },
      comments: [],
      shares: 0
    });

    await post.save();

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}