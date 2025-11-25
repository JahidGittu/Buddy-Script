// src/components/ui/ReactionButtons.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface ReactionButtonsProps {
  activeReaction: string
  setActiveReaction: (reaction: string) => void
  postId: string
  currentUserReaction: string
}

export default function ReactionButtons({
  activeReaction,
  setActiveReaction,
  postId,
  currentUserReaction
}: ReactionButtonsProps) {
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

  const updateReaction = async (reactionType: string) => {
    if (!session?.user?.id) return

    const finalReaction = currentUserReaction === reactionType ? '' : reactionType
    
    // INSTANT UI UPDATE - No loading states
    setActiveReaction(finalReaction)

    // Background API call - no waiting
    fetch(`/api/posts/${postId}/reaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reaction: finalReaction
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update reaction')
      }
    })
    .catch(error => {
      console.error('Error updating reaction:', error)
      // Revert only on error
      setActiveReaction(currentUserReaction)
    })
  }

  const handleReactionClick = (reactionType: string) => {
    const finalReaction = currentUserReaction === reactionType ? '' : reactionType
    updateReaction(finalReaction)
    setShowReactions(false)
  }

  const handleMainButtonClick = () => {
    const finalReaction = currentUserReaction ? '' : 'like'
    updateReaction(finalReaction)
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

  const getButtonEmoji = () => {
    if (activeReaction) {
      const reaction = reactions.find(r => r.type === activeReaction)
      return reaction ? reaction.emoji : '👍'
    }
    return '👍'
  }

  const hasReaction = Boolean(activeReaction)

  return (
    <div ref={containerRef} className="px-6 py-2 border-b border-gray-100">
      <div className="flex items-center justify-between text-sm">
        {/* Like/Reaction Button */}
        <div className="relative flex-1">
          <button
            className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors w-full ${
              hasReaction 
                ? 'bg-blue-50 text-blue-600 font-semibold' 
                : 'text-gray-600 hover:bg-gray-100 font-normal'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleMainButtonClick}
          >
            <span className="text-lg">{getButtonEmoji()}</span>
            <span>{getButtonLabel()}</span>
          </button>

          {/* Reaction Picker */}
          {showReactions && (
            <div 
              className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg border border-gray-200 p-2 flex space-x-1 z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {reactions.map((reaction) => (
                <button
                  key={reaction.type}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-200 hover:scale-125 transform ${
                    activeReaction === reaction.type 
                      ? 'scale-110 border-2 border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReactionClick(reaction.type)
                  }}
                  title={reaction.label}
                >
                  <span className="filter drop-shadow-sm">{reaction.emoji}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment Button */}
        <button className="flex items-center justify-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 text-gray-600">
          <span className="text-lg">💬</span>
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button className="flex items-center justify-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-100 transition-colors flex-1 text-gray-600">
          <span className="text-lg">🔄</span>
          <span>Share</span>
        </button>
      </div>
    </div>
  )
}