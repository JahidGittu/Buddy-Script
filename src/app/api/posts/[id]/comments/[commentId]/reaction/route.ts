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
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: postId, commentId } = await params;
    const { reaction, isReply, parentCommentId, parentReplyId } = await request.json();

    await connectToDatabase();

    // Find the post first
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    let targetFound = false;

    // Helper function to update reactions for any target
    const updateTargetReactions = (target: any) => {
      if (!target.reactions) {
        target.reactions = {
          likes: [], loves: [], hahas: [], wows: [], sads: [], angrys: []
        };
      }

      const userId = session.user.id;
      const reactionTypes = ['likes', 'loves', 'hahas', 'wows', 'sads', 'angrys'] as const;

      // Remove user from ALL reaction types first
      reactionTypes.forEach(type => {
        if (target.reactions[type]) {
          target.reactions[type] = target.reactions[type].filter(
            (r: any) => r.userId.toString() !== userId
          );
        }
      });

      // Add to specific reaction type if provided and not empty
      if (reaction && reaction !== '') {
        const reactionField = `${reaction}s` as string;
        if (!target.reactions[reactionField]) {
          target.reactions[reactionField] = [];
        }
        
        // Check if user already exists in this reaction type
        const existingIndex = target.reactions[reactionField].findIndex(
          (r: any) => r.userId.toString() === userId
        );
        
        if (existingIndex === -1) {
          target.reactions[reactionField].push({
            userId: session.user.id,
            email: session.user.email || '',
            name: session.user.name || 'User',
            avatar: session.user.image || '/default-avatar.png',
            reactedAt: new Date()
          });
        }
      }

      return target;
    };

    // Find and update the target
    if (isReply && parentReplyId) {
      // Nested reply (reply to reply)
      for (const comment of post.comments) {
        if (comment._id.toString() === parentCommentId) {
          for (const reply of comment.replies) {
            if (reply._id.toString() === parentReplyId && reply.replies) {
              for (const nestedReply of reply.replies) {
                if (nestedReply._id.toString() === commentId) {
                  updateTargetReactions(nestedReply);
                  targetFound = true;
                  break;
                }
              }
            }
          }
        }
      }
    } else if (isReply) {
      // Regular reply to comment
      for (const comment of post.comments) {
        if (comment._id.toString() === parentCommentId) {
          for (const reply of comment.replies) {
            if (reply._id.toString() === commentId) {
              updateTargetReactions(reply);
              targetFound = true;
              break;
            }
          }
        }
      }
    } else {
      // Main comment
      for (const comment of post.comments) {
        if (comment._id.toString() === commentId) {
          updateTargetReactions(comment);
          targetFound = true;
          break;
        }
      }
    }

    if (!targetFound) {
      return NextResponse.json({ error: 'Target not found' }, { status: 404 });
    }

    // Save the updated post
    await post.save();

    // Get fresh data after save
    const updatedPost = await Post.findById(postId);
    let updatedTarget = null;

    // Find the updated target in fresh data
    if (isReply && parentReplyId) {
      for (const comment of updatedPost.comments) {
        if (comment._id.toString() === parentCommentId) {
          for (const reply of comment.replies) {
            if (reply._id.toString() === parentReplyId && reply.replies) {
              updatedTarget = reply.replies.find((nr: any) => nr._id.toString() === commentId);
              break;
            }
          }
        }
      }
    } else if (isReply) {
      for (const comment of updatedPost.comments) {
        if (comment._id.toString() === parentCommentId) {
          updatedTarget = comment.replies.find((r: any) => r._id.toString() === commentId);
          break;
        }
      }
    } else {
      updatedTarget = updatedPost.comments.find((c: any) => c._id.toString() === commentId);
    }

    if (!updatedTarget) {
      return NextResponse.json({ error: 'Updated target not found' }, { status: 404 });
    }

    // Calculate total reactions - USING ONLY NEW STRUCTURE
    const totalReactions = calculateTotalReactions(updatedTarget);

    // Find current user reaction
    const currentUserReaction = findUserReaction(updatedTarget, session.user.id);

    return NextResponse.json({
      message: 'Reaction updated successfully',
      success: true,
      updatedData: {
        totalReactions,
        currentUserReaction,
        reactions: updatedTarget.reactions
      }
    });

  } catch (error) {
    console.error('❌ Error updating reaction:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate total reactions - FIXED VERSION
function calculateTotalReactions(target: any): number {
  // Always use new reactions structure only
  if (target.reactions) {
    const reactionTypes = ['likes', 'loves', 'hahas', 'wows', 'sads', 'angrys'] as const;
    let total = 0;

    reactionTypes.forEach(type => {
      const reactions = target.reactions[type] || [];
      total += reactions.length;
    });

    return total;
  }

  // If no reactions structure, return 0 (ignore old likes structure)
  return 0;
}

// Helper function to find user's current reaction
function findUserReaction(target: any, userId: string): string {
  // Always use new reactions structure only
  if (target.reactions) {
    const reactionTypes = ['likes', 'loves', 'hahas', 'wows', 'sads', 'angrys'] as const;
    
    for (const type of reactionTypes) {
      const reactions = target.reactions[type] || [];
      const userReaction = reactions.find((r: any) => r.userId.toString() === userId);
      if (userReaction) {
        return type.replace('s', '');
      }
    }
  }

  return '';
}