'use client'

import Comment from './Comment'
import { useCommentContext } from '@/contexts/CommentContext'

interface CommentListProps {
  showAllComments: boolean
  onReplyAdded?: () => void
  onShowMoreComments?: () => void
}

export default function CommentList({
  showAllComments,
  onReplyAdded,
  onShowMoreComments
}: CommentListProps) {
  const { optimisticComments } = useCommentContext()
  const displayedComments = showAllComments ? optimisticComments : optimisticComments.slice(0, 2)

  if (optimisticComments.length === 0) {
    return (
      <div className="text-center py-8 text-foreground-muted text-sm">
        No comments yet. Be the first to comment!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Show "Load more comments" ABOVE the comments, left-aligned */}
      {!showAllComments && optimisticComments.length > 2 && (
        <div className="pt-2">
          <button 
            onClick={onShowMoreComments}
            className="text-foreground-muted text-sm font-semibold hover:underline"
          >
            View {optimisticComments.length - 2} more comments
          </button>
        </div>
      )}

      {displayedComments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onReplyAdded={onReplyAdded}
        />
      ))}
    </div>
  )
}