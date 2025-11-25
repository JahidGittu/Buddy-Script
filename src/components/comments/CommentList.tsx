// src/components/comments/CommentList.tsx
'use client'

import Comment from './Comment'
import { CommentType } from '@/types/post'

interface CommentListProps {
  postId: string
  comments: CommentType[]
  showAllComments: boolean
  replyingTo: string | null
  replyText: string
  setReplyText: (text: string) => void
  handleReplySubmit: (e: React.FormEvent, commentId: string) => void
  toggleReply: (commentId: string) => void
  onReplyAdded?: () => void
}

export default function CommentList({
  postId,
  comments,
  showAllComments,
  replyingTo,
  replyText,
  setReplyText,
  handleReplySubmit,
  toggleReply,
  onReplyAdded
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
          postId={postId}
          replyingTo={replyingTo}
          replyText={replyText}
          setReplyText={setReplyText}
          handleReplySubmit={handleReplySubmit}
          toggleReply={toggleReply}
          onReplyAdded={onReplyAdded}
        />
      ))}
      
      {/* Show "Load more comments" if there are more to display */}
      {!showAllComments && comments.length > 2 && (
        <div className="text-center pt-4">
          <button 
            onClick={() => {/* This will be handled by parent */}}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            View {comments.length - 2} more comments
          </button>
        </div>
      )}
    </div>
  )
}