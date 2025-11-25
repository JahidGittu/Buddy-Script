// src/app/api/posts/[id]/comments/[commentId]/reaction/route.ts
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
    const { reaction, isReply, parentCommentId } = await request.json();

    await connectToDatabase();

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Prepare user reaction data
    const userReactionData = {
      userId: session.user.id,
      email: session.user.email || '',
      name: session.user.name || 'User',
      avatar: session.user.image || '/default-avatar.png',
      reactedAt: new Date()
    };

    if (isReply && parentCommentId) {
      // Handle reply reaction
      const parentComment = post.comments.id(parentCommentId);
      if (!parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 });
      }

      const reply = parentComment.replies.id(commentId);
      if (!reply) {
        return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
      }

      // Remove user from existing reactions
      reply.likes = reply.likes.filter(
        (reaction: any) => reaction.userId.toString() !== session.user.id
      );

      // Add new reaction if provided
      if (reaction) {
        reply.likes.push(userReactionData);
      }
    } else {
      // Handle comment reaction
      const comment = post.comments.id(commentId);
      if (!comment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }

      // Remove user from existing reactions
      comment.likes = comment.likes.filter(
        (reaction: any) => reaction.userId.toString() !== session.user.id
      );

      // Add new reaction if provided
      if (reaction) {
        comment.likes.push(userReactionData);
      }
    }

    await post.save();

    return NextResponse.json({
      message: 'Comment reaction updated successfully',
      post: post
    });

  } catch (error) {
    console.error('Error updating comment reaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}