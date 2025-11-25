// src/app/api/posts/[id]/comments/[commentId]/replies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId, commentId } = await params;
    const { content, parentReplyId } = await request.json(); // Add parentReplyId back

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Reply content is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Find the comment
    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Create new reply
    const newReply = {
      content: content.trim(),
      user: {
        id: session.user.id,
        name: session.user.name || 'User',
        avatar: session.user.image || '/default-avatar.png',
        email: session.user.email || '',
      },
      likes: [],
      createdAt: new Date(),
    };

    if (parentReplyId) {
      console.log('🔍 Looking for parent reply:', parentReplyId);
      
      // Find the parent reply in the comment's replies
      const parentReply = comment.replies.id(parentReplyId);
      if (!parentReply) {
        console.log('❌ Parent reply not found:', parentReplyId);
        return NextResponse.json({ error: 'Parent reply not found' }, { status: 404 });
      }

      console.log('✅ Found parent reply:', parentReply.content);

      // Initialize replies array if it doesn't exist
      if (!parentReply.replies) {
        parentReply.replies = [];
        console.log('📝 Initialized empty replies array for parent reply');
      }

      // Add the nested reply to parent reply's replies
      parentReply.replies.push(newReply);
      console.log('✅ Nested reply added to parent reply');
    } else {
      console.log('💬 Adding direct reply to comment');
      // This is a direct reply to the comment
      comment.replies.push(newReply);
    }

    // Save the post
    await post.save();
    console.log('💾 Post saved successfully');

    return NextResponse.json({
      message: 'Reply added successfully',
      success: true
    });

  } catch (error) {
    console.error('❌ Error adding reply:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}