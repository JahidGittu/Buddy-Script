
'use client'

import { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCommentContext } from '@/contexts/CommentContext'
import CommentReactionButtons from '../ui/CommentReactionButtons'
import Reply from './Reply'
import { CommentType, UserReactionType } from '@/types/post'

interface CommentProps {
  comment: CommentType
  onReplyAdded?: () => void
}

export default function Comment({ comment, onReplyAdded }: CommentProps) {
  const { data: session } = useSession()
  const {
    postId,
    replyingTo,
    replyText,
    setReplyText,
    handleReplySubmit,
    toggleReply
  } = useCommentContext()

  // Add local state for reactions
  const [localReactionData, setLocalReactionData] = useState({
    totalReactions: 0,
    currentUserReaction: ''
  });

  // FIXED: Consistent currentUserReaction with local state
  const currentUserReaction = useMemo(() => {
    if (localReactionData.currentUserReaction) {
      return localReactionData.currentUserReaction;
    }

    if (!session?.user?.id) return '';

    const userId = session.user.id;

    // Always use new reactions structure
    if (comment.reactions) {
      const reactionTypes = ['likes', 'loves', 'hahas', 'wows', 'sads', 'angrys'] as const;

      for (const type of reactionTypes) {
        const reactions = comment.reactions[type] || [];
        if (reactions.some((reaction: UserReactionType) => reaction.userId === userId)) {
          return type.replace('s', '');
        }
      }
    }

    return '';
  }, [comment.reactions, session?.user?.id, localReactionData.currentUserReaction]);

  // FIXED: Consistent reaction counting with local state
  const totalReactions = useMemo(() => {
    if (localReactionData.totalReactions > 0) {
      return localReactionData.totalReactions;
    }

    // Always use new reactions structure only
    if (comment.reactions) {
      const total = Object.values(comment.reactions).reduce((total: number, reactionArray: any) => {
        const count = Array.isArray(reactionArray) ? reactionArray.length : 0;
        return total + count;
      }, 0);
      return total;
    }

    return 0;
  }, [comment.reactions, localReactionData.totalReactions]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const totalReplies = comment.replies?.length || 0;

  // Get reaction emoji based on current reaction
  const getReactionEmoji = () => {
    switch (currentUserReaction) {
      case 'like': return '👍';
      case 'love': return '❤️';
      case 'haha': return '😂';
      case 'wow': return '😮';
      case 'sad': return '😢';
      case 'angry': return '😠';
      default: return '👍';
    }
  };

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
          {totalReactions > 0 && (
            <div className="absolute right-3 -bottom-2 bg-white shadow-lg rounded-full px-2 py-1 flex items-center space-x-1 border border-gray-200">
              <div className="flex items-center space-x-1">
                <span className="text-xs">{getReactionEmoji()}</span>
              </div>
              <span className="text-gray-900 text-xs font-semibold">
                {totalReactions}
              </span>
            </div>
          )}

          {/* Comment Actions */}
          <div className="mt-3">
            <ul className="flex items-center space-x-4 text-xs">
              <li>
                <CommentReactionButtons
                  activeReaction={currentUserReaction}
                  setActiveReaction={(reaction) => {
                    setLocalReactionData(prev => ({
                      ...prev,
                      currentUserReaction: reaction
                    }));
                  }}
                  commentId={comment._id || ''}
                  postId={postId}
                  onReactionUpdate={(data) => {
                    setLocalReactionData({
                      totalReactions: data.totalReactions,
                      currentUserReaction: data.currentUserReaction
                    });
                  }}
                />
              </li>
              <li>
                <button
                  onClick={() => toggleReply(comment._id || '')}
                  className="text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                  aria-label={`Reply to ${comment.user.name}'s comment`}
                  aria-expanded={replyingTo === comment._id}
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
                      alt="Your profile"
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
                      aria-label="Write a reply"
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

        {/* Nested Replies */}
        {totalReplies > 0 && (
          <div className="ml-4 mt-3 space-y-4">
            {comment.replies.map((reply) => (
              <Reply
                key={reply._id}
                reply={reply}
                commentId={comment._id || ''}
                onReplyAdded={onReplyAdded}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}