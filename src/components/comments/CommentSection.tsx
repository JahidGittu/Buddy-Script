// src/components/comments/CommentSection.tsx
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Comment from './Comment'
import { PostType, CommentType } from '@/types/post'

interface CommentSectionProps {
  post: PostType
  showAllComments: boolean
  setShowAllComments: (show: boolean) => void
  onCommentAdded?: () => void
}

export default function CommentSection({
  post,
  showAllComments,
  setShowAllComments,
  onCommentAdded
}: CommentSectionProps) {
  const { data: session } = useSession()
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [optimisticComments, setOptimisticComments] = useState<CommentType[]>(post.comments)

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !session?.user) return

    // OPTIMISTIC UPDATE: Add comment immediately to UI
    const tempId = `temp-${Date.now()}`
    const optimisticComment: CommentType = {
      _id: tempId,
      content: commentText,
      user: {
        id: session.user.id,
        name: session.user.name || 'User',
        avatar: session.user.image || '/default-avatar.png',
        email: session.user.email || 'user@example.com',
      },
      likes: [],
      replies: [],
      createdAt: new Date().toISOString(),
    }

    setOptimisticComments(prev => [optimisticComment, ...prev])
    const previousComments = optimisticComments
    setCommentText('')

    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentText }),
      })

      if (!response.ok) {
        throw new Error('Failed to add comment')
      }

      // Refresh to get the real comment data
      if (onCommentAdded) {
        onCommentAdded()
      }

    } catch (error) {
      console.error('Error adding comment:', error)
      // Revert optimistic update on error
      setOptimisticComments(previousComments)
      alert('Failed to add comment. Please try again.')
    }
  }

  const handleReplySubmit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault()
    if (!replyText.trim() || !session?.user) return

    // OPTIMISTIC UPDATE: Add reply immediately to UI
    const tempId = `temp-reply-${Date.now()}`
    const optimisticReply = {
      _id: tempId,
      content: replyText,
      user: {
        id: session.user.id,
        name: session.user.name || 'User',
        avatar: session.user.image || '/default-avatar.png',
        email: session.user.email || 'user@example.com',
      },
      likes: [],
      replies: [],
      createdAt: new Date().toISOString(),
    }

    // Update local state optimistically
    setOptimisticComments(prev => 
      prev.map(comment => 
        comment._id === commentId 
          ? { 
              ...comment, 
              replies: [...comment.replies, optimisticReply] 
            }
          : comment
      )
    )

    const previousComments = [...optimisticComments]
    setReplyText('')
    setReplyingTo(null)

    try {
      const response = await fetch(`/api/posts/${post._id}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyText }),
      })

      if (!response.ok) {
        throw new Error('Failed to add reply')
      }

      if (onCommentAdded) {
        onCommentAdded()
      }

    } catch (error) {
      console.error('Error adding reply:', error)
      // Revert optimistic update on error
      setOptimisticComments(previousComments)
      alert('Failed to add reply. Please try again.')
    }
  }

  const toggleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId)
    setReplyText('')
  }

  const displayedComments = showAllComments 
    ? optimisticComments 
    : optimisticComments.slice(0, 2)

  return (
    <div className="p-6">
      {/* Main Comment Input */}
      <div className="mb-6">
        <div className="bg-gray-100 rounded-2xl p-2">
          <form onSubmit={handleCommentSubmit} className="flex items-center">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 mr-3">
                <img 
                  src={session?.user?.image || '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-sm text-gray-700 placeholder-gray-500"
                  rows={1}
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={!commentText.trim()}
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⮞
            </button>
          </form>
        </div>
      </div>

      {/* Previous Comments Button */}
      {!showAllComments && optimisticComments.length > 2 && (
        <div className="mb-4">
          <button 
            onClick={() => setShowAllComments(true)}
            className="text-gray-500 text-sm hover:text-blue-600 transition-colors"
          >
            View {optimisticComments.length - 2} more comments
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {displayedComments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            postId={post._id || ''}
            replyingTo={replyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
            handleReplySubmit={handleReplySubmit}
            toggleReply={toggleReply}
            onReplyAdded={onCommentAdded}
          />
        ))}
      </div>
    </div>
  )
}