// src/components/comments/Comment.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import CommentReactionButtons from '../ui/CommentReactionButtons'
import Reply from './Reply'
import { CommentType, UserReactionType } from '@/types/post'

interface CommentProps {
  comment: CommentType
  postId: string
  replyingTo: string | null
  replyText: string
  setReplyText: (text: string) => void
  handleReplySubmit: (e: React.FormEvent, commentId: string) => void
  toggleReply: (commentId: string) => void
  onReplyAdded?: () => void
}

export default function Comment({
  comment,
  postId,
  replyingTo,
  replyText,
  setReplyText,
  handleReplySubmit,
  toggleReply,
  onReplyAdded
}: CommentProps) {
  const { data: session } = useSession()
  const [activeReaction, setActiveReaction] = useState('')
  const [showAllReplies, setShowAllReplies] = useState(false)

  const getCurrentUserReaction = () => {
    if (!session?.user?.id) return '';
    
    const userId = session.user.id;
    const hasLiked = comment.likes.some(
      (reaction: UserReactionType) => reaction.userId === userId
    );
    
    return hasLiked ? 'like' : '';
  }

  useEffect(() => {
    const userReaction = getCurrentUserReaction()
    setActiveReaction(userReaction);
  }, [comment, session]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const totalLikes = comment.likes.length;
  const totalReplies = comment.replies.length;
  const displayedReplies = showAllReplies ? comment.replies : comment.replies.slice(0, 2);

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <img 
          src={comment.user.avatar} 
          alt={comment.user.name} 
          className="w-10 h-10 rounded-full border border-gray-300 object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        {/* Comment Bubble */}
        <div className="bg-gray-100 rounded-2xl p-4 relative mb-3">
          <div className="flex">
            <div className="flex-1 overflow-hidden">
              <h4 className="font-semibold text-gray-900 text-sm hover:underline cursor-pointer">
                {comment.user.name}
              </h4>
              <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
          
          {/* Reaction Badge */}
          {totalLikes > 0 && (
            <div className="absolute right-3 -bottom-2 bg-white shadow-lg rounded-full px-2 py-1 flex items-center space-x-1 border border-gray-200">
              <div className="flex items-center space-x-1">
                <span className="text-blue-600 text-xs">👍</span>
                {comment.likes.some((reaction: UserReactionType) => reaction.userId === session?.user?.id) && (
                  <span className="text-red-500 text-xs">❤️</span>
                )}
              </div>
              <span className="text-gray-900 text-xs font-semibold">
                {totalLikes}
              </span>
            </div>
          )}

          {/* Comment Actions */}
          <div className="mt-3">
            <ul className="flex items-center space-x-4 text-xs">
              <li>
                <CommentReactionButtons
                  activeReaction={activeReaction}
                  setActiveReaction={setActiveReaction}
                  commentId={comment._id || ''}
                  postId={postId}
                />
              </li>
              <li>
                <button 
                  onClick={() => toggleReply(comment._id || '')}
                  className="text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                >
                  Reply
                </button>
              </li>
              <li>
                <span className="text-gray-400">{formatTime(comment.createdAt)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Reply Input (direct reply to comment) */}
        {replyingTo === comment._id && (
          <div className="ml-4 mt-3">
            <div className="bg-gray-100 rounded-2xl p-2">
              <form onSubmit={(e) => handleReplySubmit(e, comment._id || '')} className="flex items-center">
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0 mr-3">
                    <img 
                      src={session?.user?.image || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-sm text-gray-700 placeholder-gray-500"
                      rows={1}
                      autoFocus
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={!replyText.trim()}
                  className="ml-2 bg-blue-600 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reply
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Show replies count and toggle */}
        {totalReplies > 0 && (
          <div className="ml-4 mt-2">
            <button 
              onClick={() => setShowAllReplies(!showAllReplies)}
              className="text-blue-600 text-xs font-semibold hover:underline flex items-center space-x-1"
            >
              <span>
                {showAllReplies ? 'Hide' : 'View'} {totalReplies} {totalReplies === 1 ? 'reply' : 'replies'}
              </span>
              <span className={`transform transition-transform ${showAllReplies ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
        )}

        {/* Nested Replies */}
        {displayedReplies.map((reply) => (
          <Reply
            key={reply._id}
            reply={reply}
            postId={postId}
            commentId={comment._id || ''}
            onReplyAdded={onReplyAdded}
          />
        ))}

        {/* Show "Load more replies" if there are more */}
        {!showAllReplies && totalReplies > 2 && (
          <div className="ml-4 mt-2">
            <button 
              onClick={() => setShowAllReplies(true)}
              className="text-blue-600 text-xs font-semibold hover:underline"
            >
              View {totalReplies - 2} more replies
            </button>
          </div>
        )}
      </div>
    </div>
  )
}