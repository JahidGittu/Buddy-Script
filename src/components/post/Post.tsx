// src/components/post/Post.tsx
'use client'

import { useState, useEffect } from 'react'
import PostHeader from './PostHeader'
import PostContent from './PostContent'
import PostReactions from './PostReactions'
import CommentSection from '../comments/CommentSection'
import { PostType } from '@/types/post'
import { useSession } from 'next-auth/react'

interface PostProps {
  post: PostType
  onReactionUpdate?: (postId: string, reaction: string) => void
  onCommentAdded?: () => void
}

// Use the same type as in your PostReactions component
interface UserReactionType {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  reactedAt: string;
}

export default function Post({ post, onReactionUpdate, onCommentAdded }: PostProps) {
  const { data: session } = useSession()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [activeReaction, setActiveReaction] = useState('')

  // Get current user's reaction for this post
  const getCurrentUserReaction = (): string => {
    if (!session?.user?.id) return '';
    
    const userId = session.user.id;
    
    // Direct check without complex logic
    if (post.reactions.likes.some((reaction: UserReactionType) => reaction.userId === userId)) return 'like';
    if (post.reactions.loves.some((reaction: UserReactionType) => reaction.userId === userId)) return 'love';
    if (post.reactions.hahas.some((reaction: UserReactionType) => reaction.userId === userId)) return 'haha';
    if (post.reactions.wows.some((reaction: UserReactionType) => reaction.userId === userId)) return 'wow';
    if (post.reactions.sads.some((reaction: UserReactionType) => reaction.userId === userId)) return 'sad';
    if (post.reactions.angrys.some((reaction: UserReactionType) => reaction.userId === userId)) return 'angry';
    
    return '';
  }

  // Get total reactions count
  const getTotalReactions = (): number => {
    return (
      post.reactions.likes.length +
      post.reactions.loves.length +
      post.reactions.hahas.length +
      post.reactions.wows.length +
      post.reactions.sads.length +
      post.reactions.angrys.length
    );
  }

  // Get reaction avatars for display
  const getReactionAvatars = (): UserReactionType[] => {
    const allReactions: UserReactionType[] = [
      ...post.reactions.likes,
      ...post.reactions.loves,
      ...post.reactions.hahas,
      ...post.reactions.wows,
      ...post.reactions.sads,
      ...post.reactions.angrys
    ];

    // Remove duplicates by userId
    const uniqueReactions = allReactions.reduce((acc: UserReactionType[], current: UserReactionType) => {
      const exists = acc.find(item => item.userId === current.userId);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    return uniqueReactions.slice(0, 3);
  }

  // Get current user reaction
  const currentUserReaction = getCurrentUserReaction();

  useEffect(() => {
    // Set active reaction based on user's current reaction
    setActiveReaction(currentUserReaction);
  }, [post, session, currentUserReaction]);

  const handleReactionUpdate = (reaction: string) => {
    if (!session?.user?.id) return;
    
    // INSTANT UI UPDATE - No delays
    setActiveReaction(reaction);
    
    // Update parent state for instant UI update
    if (onReactionUpdate) {
      onReactionUpdate(post._id || '', reaction);
    }
  }

  // Handle when a comment is added - update parent component
  const handleCommentAdded = () => {
    if (onCommentAdded) {
      onCommentAdded();
    }
  }

  return (
    <div className="bg-white rounded-lg mb-4 border border-gray-200 shadow-sm">
      {/* Post Header */}
      <PostHeader 
        post={post}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
      />

      {/* Post Content */}
      <PostContent post={post} />

      {/* Reactions Stats */}
      <PostReactions 
        postId={post._id || ''}
        totalReactions={getTotalReactions()}
        reactionAvatars={getReactionAvatars()}
        commentsCount={post.comments.length} // Use original comments count
        sharesCount={post.shares}
        activeReaction={activeReaction}
        setActiveReaction={handleReactionUpdate}
        currentUserReaction={currentUserReaction}
      />

      {/* Comments Section */}
      <CommentSection
        post={post}
        showAllComments={showAllComments}
        setShowAllComments={setShowAllComments}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  )
}