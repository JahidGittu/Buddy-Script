// src/app/api/posts/[id]/reaction/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const startTime = Date.now();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId } = await params;
    const { reaction } = await request.json();

    // Allow empty string to remove reaction, or valid reaction types
    if (reaction === undefined || (reaction !== '' && !['like', 'love', 'haha', 'wow', 'sad', 'angry'].includes(reaction))) {
      return NextResponse.json(
        { error: 'Valid reaction type is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Prepare user reaction data from session (no need to fetch User)
    const userReactionData = {
      userId: session.user.id,
      email: session.user.email || '',
      name: session.user.name || 'User',
      avatar: session.user.image || '/default-avatar.png',
      reactedAt: new Date()
    };

    // Remove user from all reaction arrays
    const reactionTypes = ['likes', 'loves', 'hahas', 'wows', 'sads', 'angrys'] as const;
    
    reactionTypes.forEach(type => {
      post.reactions[type] = post.reactions[type].filter(
        (reaction: any) => reaction.userId.toString() !== session.user.id
      );
    });

    // Add user to the selected reaction type if a reaction is provided (not empty string)
    if (reaction) {
      switch (reaction) {
        case 'like':
          post.reactions.likes.push(userReactionData);
          break;
        case 'love':
          post.reactions.loves.push(userReactionData);
          break;
        case 'haha':
          post.reactions.hahas.push(userReactionData);
          break;
        case 'wow':
          post.reactions.wows.push(userReactionData);
          break;
        case 'sad':
          post.reactions.sads.push(userReactionData);
          break;
        case 'angry':
          post.reactions.angrys.push(userReactionData);
          break;
      }
    }

    await post.save();

    const endTime = Date.now();
    console.log(`Reaction API completed in ${endTime - startTime}ms`);

    return NextResponse.json({
      message: 'Reaction updated successfully',
      reactions: post.reactions
    });

  } catch (error) {
    console.error('Error updating reaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}