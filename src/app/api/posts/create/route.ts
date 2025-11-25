// src/app/api/posts/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/posts/create called');
    
    const session = await getServerSession(authOptions);
    console.log('👤 Session user:', session?.user?.email);
    
    if (!session) {
      console.log('❌ Unauthorized - No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📦 Request body:', { 
      content: body.content ? `${body.content.substring(0, 50)}...` : 'Empty',
      image: body.image ? 'Has image' : 'No image',
      privacy: body.privacy 
    });
    
    const { content, image, privacy = 'public' } = body;

    if (!content?.trim() && !image) {
      console.log('❌ No content or image provided');
      return NextResponse.json(
        { error: 'Content or image is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Database connected');

    // Get user data
    console.log(`👤 Finding user: ${session.user.id}`);
    const user = await User.findById(session.user.id);
    console.log('📋 User found:', user ? `${user.firstName} ${user.lastName}` : 'Not found');
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create avatar
    let userAvatar = '/assets/images/txt_img.png';
    if (user.image) {
      userAvatar = user.image;
      console.log('🖼️ Using user profile image');
    } else if (user.firstName && user.lastName) {
      const firstLetter = user.firstName.charAt(0).toUpperCase();
      const lastLetter = user.lastName.charAt(0).toUpperCase();
      userAvatar = `https://ui-avatars.com/api/?name=${firstLetter}+${lastLetter}&background=random&color=fff&size=128`;
      console.log('🖼️ Generated avatar from name');
    }

    console.log('📝 Creating new post...');
    // Create new post
    const post = new Post({
      content: content?.trim() || '',
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

    console.log('💾 Saving post...');
    await post.save();
    console.log(`✅ Post saved successfully with ID: ${post._id}`);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}