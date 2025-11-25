// src/components/comments/Reply.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import CommentReactionButtons from '../ui/CommentReactionButtons'
import { ReplyType, UserReactionType, NestedReplyType } from '@/types/post'

interface ReplyProps {
  reply: ReplyType
  postId: string
  commentId: string
  onReplyAdded?: () => void
}

export default function Reply({ reply, postId, commentId, onReplyAdded }: ReplyProps) {
  const { data: session } = useSession()
  const [activeReaction, setActiveReaction] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showNestedReplies, setShowNestedReplies] = useState(false)

  const getCurrentUserReaction = () => {
    if (!session?.user?.id) return '';
    
    const userId = session.user.id;
    const hasLiked = reply.likes.some((reaction: UserReactionType) => reaction.userId === userId);
    
    return hasLiked ? 'like' : '';
  }

  useEffect(() => {
    const userReaction = getCurrentUserReaction()
    setActiveReaction(userReaction);
  }, [reply, session]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const totalLikes = reply.likes.length;
  const hasNestedReplies = reply.replies && reply.replies.length > 0;

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim() || !session?.user) return

    // OPTIMISTIC UPDATE: Add nested reply immediately
    const tempId = `temp-nested-${Date.now()}`
    const optimisticNestedReply: NestedReplyType = {
      _id: tempId,
      content: replyText,
      user: {
        id: session.user.id,
        name: session.user.name || 'User',
        avatar: session.user.image || '/default-avatar.png',
        email: session.user.email || 'user@example.com',
      },
      likes: [],
      createdAt: new Date().toISOString(),
    }

    // Clear inputs immediately
    setReplyText('')
    setShowReplyInput(false)
    
    // Refresh to show new reply (parent component will handle optimistic update)
    if (onReplyAdded) {
      onReplyAdded()
    }

    // Background API call
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: replyText,
          parentReplyId: reply._id
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add nested reply')
      }

      // Success - data will be refreshed by parent component

    } catch (error) {
      console.error('Error adding nested reply:', error)
      alert('Failed to add reply. Please try again.')
    }
  }

  const toggleReplyInput = () => {
    setShowReplyInput(!showReplyInput)
    setReplyText('')
  }

  return (
    <div className="flex space-x-3 mt-4 ml-4">
      <div className="flex-shrink-0">
        <img 
          src={reply.user.avatar} 
          alt={reply.user.name} 
          className="w-8 h-8 rounded-full border border-gray-300 object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 rounded-2xl p-3 relative">
          <div className="flex">
            <div className="flex-1 overflow-hidden">
              <h4 className="font-semibold text-gray-900 text-sm hover:underline cursor-pointer">
                {reply.user.name}
              </h4>
              <p className="text-gray-700 text-xs mt-1 leading-relaxed">
                {reply.content}
              </p>
            </div>
          </div>
          
          {/* Reply Reaction Badge */}
          {totalLikes > 0 && (
            <div className="absolute right-3 -bottom-2 bg-white shadow-lg rounded-full px-2 py-1 flex items-center space-x-1 border border-gray-200">
              <span className="text-blue-600 text-xs">👍</span>
              <span className="text-gray-900 text-xs font-semibold">
                {totalLikes}
              </span>
            </div>
          )}

          {/* Reply Actions */}
          <div className="mt-2">
            <ul className="flex items-center space-x-3 text-xs">
              <li>
                <CommentReactionButtons
                  activeReaction={activeReaction}
                  setActiveReaction={setActiveReaction}
                  commentId={reply._id || ''}
                  postId={postId}
                  isReply={true}
                  parentCommentId={commentId}
                />
              </li>
              
              <li>
                <button 
                  onClick={toggleReplyInput}
                  className="text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                >
                  Reply
                </button>
              </li>
              
              <li>
                <span className="text-gray-400">{formatTime(reply.createdAt)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Nested Reply Input */}
        {showReplyInput && (
          <div className="mt-3">
            <div className="bg-gray-100 rounded-2xl p-2">
              <form onSubmit={handleReplySubmit} className="flex items-center">
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

        {/* Show nested replies toggle */}
        {hasNestedReplies && (
          <div className="mt-2">
            <button 
              onClick={() => setShowNestedReplies(!showNestedReplies)}
              className="text-blue-600 text-xs font-semibold hover:underline flex items-center space-x-1"
            >
              <span>
                {showNestedReplies ? 'Hide' : 'View'} {reply.replies.length} {reply.replies.length === 1 ? 'reply' : 'replies'}
              </span>
              <span className={`transform transition-transform ${showNestedReplies ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
          </div>
        )}

        {/* Nested Replies */}
        {showNestedReplies && hasNestedReplies && (
          <div className="mt-3 space-y-3 ml-4">
            {reply.replies.map((nestedReply: NestedReplyType) => (
              <div key={nestedReply._id} className="flex space-x-3">
                <div className="flex-shrink-0">
                  <img 
                    src={nestedReply.user.avatar} 
                    alt={nestedReply.user.name} 
                    className="w-6 h-6 rounded-full border border-gray-300 object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-100 rounded-2xl p-2">
                    <div className="flex">
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-semibold text-gray-900 text-xs hover:underline cursor-pointer">
                          {nestedReply.user.name}
                        </h4>
                        <p className="text-gray-700 text-xs mt-1 leading-relaxed">
                          {nestedReply.content}
                        </p>
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-gray-400 text-xs">{formatTime(nestedReply.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}