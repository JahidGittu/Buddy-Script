'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface CommentReactionButtonsProps {
  activeReaction: string
  setActiveReaction: (reaction: string) => void
  commentId: string
  postId: string
  isReply?: boolean
  parentCommentId?: string
  parentReplyId?: string
  onReactionUpdate?: (data: { totalReactions: number; currentUserReaction: string }) => void
}

export default function CommentReactionButtons({
  activeReaction,
  setActiveReaction,
  commentId,
  postId,
  isReply = false,
  parentCommentId,
  parentReplyId,
  onReactionUpdate
}: CommentReactionButtonsProps) {
  const { data: session } = useSession()
  const [showReactions, setShowReactions] = useState(false)
  const reactionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const reactions = [
    { type: 'like', emoji: '👍', label: 'Like', color: 'text-blue-600' },
    { type: 'love', emoji: '❤️', label: 'Love', color: 'text-red-600' },
    { type: 'haha', emoji: '😂', label: 'Haha', color: 'text-yellow-600' },
    { type: 'wow', emoji: '😮', label: 'Wow', color: 'text-yellow-600' },
    { type: 'sad', emoji: '😢', label: 'Sad', color: 'text-yellow-600' },
    { type: 'angry', emoji: '😠', label: 'Angry', color: 'text-red-600' }
  ]

  // Close reactions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowReactions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (reactionTimeoutRef.current) {
        clearTimeout(reactionTimeoutRef.current)
      }
    }
  }, [])

  const updateReaction = useCallback(async (reactionType: string) => {
    if (!session?.user?.id) {
      return;
    }

    const finalReaction = activeReaction === reactionType ? '' : reactionType;

    // Optimistic UI update
    const previousReaction = activeReaction;
    setActiveReaction(finalReaction);

    try {
      const apiUrl = `/api/posts/${postId}/comments/${commentId}/reaction`;
      const bodyData = {
        reaction: finalReaction,
        isReply: isReply,
        ...(isReply && parentCommentId && { parentCommentId }),
        ...(parentReplyId && { parentReplyId })
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, ${errorText}`);
      }

      const result = await response.json();

      // Update parent component with server data
      if (result.updatedData && onReactionUpdate) {
        onReactionUpdate(result.updatedData);
      }

    } catch (error) {
      console.error('❌ Error updating reaction:', error);
      // Revert optimistic update
      setActiveReaction(previousReaction);
    }
  }, [activeReaction, commentId, postId, isReply, parentCommentId, parentReplyId, session?.user?.id, setActiveReaction, onReactionUpdate]);

  const handleReactionClick = (reactionType: string) => {
    updateReaction(reactionType)
    setShowReactions(false)
  }

  const handleMouseEnter = () => {
    if (reactionTimeoutRef.current) {
      clearTimeout(reactionTimeoutRef.current)
      reactionTimeoutRef.current = null
    }
    setShowReactions(true)
  }

  const handleMouseLeave = () => {
    reactionTimeoutRef.current = setTimeout(() => {
      setShowReactions(false)
    }, 500)
  }

  const getButtonLabel = () => {
    if (activeReaction) {
      const reaction = reactions.find(r => r.type === activeReaction)
      return reaction ? reaction.label : 'Like'
    }
    return 'Like'
  }

  const hasReaction = Boolean(activeReaction)

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        className={`text-xs font-semibold transition-colors ${hasReaction
          ? 'text-blue-600'
          : 'text-gray-600 hover:text-blue-600'
          }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => updateReaction('like')}
        aria-label={getButtonLabel()}
      >
        {getButtonLabel()}
      </button>

      {/* Reaction Picker - Facebook style */}
      {showReactions && (
        <div
          className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 p-2 flex space-x-1 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {reactions.map((reaction) => (
            <button
              key={reaction.type}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all duration-200 hover:scale-125 transform ${activeReaction === reaction.type
                ? 'scale-110 border-2 border-blue-500 bg-blue-50'
                : 'hover:bg-gray-100'
                }`}
              onClick={(e) => {
                e.stopPropagation()
                handleReactionClick(reaction.type)
              }}
              title={reaction.label}
              aria-label={`React with ${reaction.label}`}
            >
              <span className="filter drop-shadow-sm">{reaction.emoji}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}