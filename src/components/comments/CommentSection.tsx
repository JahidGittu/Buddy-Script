'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { CommentProvider, useCommentContext } from '@/contexts/CommentContext'
import CommentList from './CommentList'
import { PostType, CommentType } from '@/types/post'

// Define the interface
interface CommentSectionProps {
  post: PostType
  showAllComments: boolean
  setShowAllComments: (show: boolean) => void
  onCommentAdded?: () => void
}

// Inner component that uses the context
function CommentSectionContent({
  post,
  showAllComments,
  setShowAllComments,
  onCommentAdded
}: CommentSectionProps) {
  const { data: session } = useSession()
  const [commentText, setCommentText] = useState('')
  const { addOptimisticComment, updateOptimisticComment, removeOptimisticComment } = useCommentContext()

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !session?.user) return

    // OPTIMISTIC UPDATE: Create temporary comment
    const tempId = `temp-comment-${Date.now()}`
    const optimisticComment: CommentType = {
      _id: tempId,
      content: commentText,
      user: {
        id: session.user.id,
        name: session.user.name || 'User',
        avatar: session.user.image || '/default-avatar.png',
        email: session.user.email || 'user@example.com',
      },
      reactions: {
        likes: [], loves: [], hahas: [], wows: [], sads: [], angrys: []
      },
      replies: [],
      createdAt: new Date().toISOString(),
    }

    // IMMEDIATE UI UPDATE: Add to UI instantly
    addOptimisticComment(optimisticComment)

    // Clear input
    const previousText = commentText
    setCommentText('')

    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: previousText }),
      })

      if (!response.ok) {
        throw new Error('Failed to add comment')
      }

      const result = await response.json()
      
      // REPLACE WITH REAL DATA: Update the temporary comment with real server data
      updateOptimisticComment(tempId, result.comment)
      
      // Notify parent that comment was added successfully
      if (onCommentAdded) {
        onCommentAdded()
      }

    } catch (error) {
      console.error('Error adding comment:', error)
      // REVERT ON ERROR: Remove the temporary comment if there's an error
      removeOptimisticComment(tempId)
      // Restore the text
      setCommentText(previousText)
      alert('Failed to add comment. Please try again.')
    }
  }

  // Handle reply added from context
  const handleReplyAdded = useCallback(() => {
    if (onCommentAdded) {
      onCommentAdded()
    }
  }, [onCommentAdded])

  return (
    <div className="p-6">
      {/* Main Comment Input */}
      <div className="mb-6">
        <div className="bg-muted rounded-2xl p-2">
          <form onSubmit={handleCommentSubmit} className="flex items-center">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 mr-3">
                <img
                  src={session?.user?.image || '/default-avatar.png'}
                  alt="Your profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-sm text-foreground placeholder-foreground-muted"
                  rows={1}
                  aria-label="Write a comment"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="ml-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Post comment"
            >
              ⮞
            </button>
          </form>
        </div>
      </div>

      {/* Comments List */}
      <CommentList
        showAllComments={showAllComments}
        onReplyAdded={handleReplyAdded}
        onShowMoreComments={() => setShowAllComments(true)}
      />
    </div>
  )
}

// Outer wrapper component that provides context
export default function CommentSection({
  post,
  showAllComments,
  setShowAllComments,
  onCommentAdded
}: CommentSectionProps) {
  return (
    <CommentProvider 
      postId={post._id || ''} 
      onReplyAdded={onCommentAdded}
      initialComments={post.comments}
    >
      <CommentSectionContent
        post={post}
        showAllComments={showAllComments}
        setShowAllComments={setShowAllComments}
        onCommentAdded={onCommentAdded}
      />
    </CommentProvider>
  )
}