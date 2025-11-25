'use client'

import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { CommentProvider } from '@/contexts/CommentContext'
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
  const [optimisticComments, setOptimisticComments] = useState<CommentType[]>(post.comments)

  console.log(post.comments)

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !session?.user) return

    // OPTIMISTIC UPDATE
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
      reactions: {
        likes: [], loves: [], hahas: [], wows: [], sads: [], angrys: []
      },
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

      if (onCommentAdded) {
        onCommentAdded()
      }

    } catch (error) {
      console.error('Error adding comment:', error)
      setOptimisticComments(previousComments)
      alert('Failed to add comment. Please try again.')
    }
  }

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
                  alt="Your profile"
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
                  aria-label="Write a comment"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Post comment"
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
      <CommentList
        comments={optimisticComments}
        showAllComments={showAllComments}
        onReplyAdded={onCommentAdded}
        onShowMoreComments={() => setShowAllComments(true)} // Add this
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
    <CommentProvider postId={post._id || ''} onReplyAdded={onCommentAdded}>
      <CommentSectionContent
        post={post}
        showAllComments={showAllComments}
        setShowAllComments={setShowAllComments}
        onCommentAdded={onCommentAdded}
      />
    </CommentProvider>
  )
}