'use client'

import Comment from './Comment'
import { CommentType } from '@/types/post'

interface CommentListProps {
  comments: CommentType[]
  showAllComments: boolean
  onReplyAdded?: () => void
  onShowMoreComments?: () => void // Add this prop
}

export default function CommentList({
  comments,
  showAllComments,
  onReplyAdded,
  onShowMoreComments
}: CommentListProps) {
  const displayedComments = showAllComments ? comments : comments.slice(0, 2)

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No comments yet. Be the first to comment!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {displayedComments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onReplyAdded={onReplyAdded}
        />
      ))}
      
      {/* Show "Load more comments" if there are more to display */}
      {!showAllComments && comments.length > 2 && (
        <div className="text-center pt-4">
          <button 
            onClick={onShowMoreComments}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            View {comments.length - 2} more comments
          </button>
        </div>
      )}
    </div>
  )
}