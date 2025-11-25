'use client'

import { useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCommentContext } from '@/contexts/CommentContext'
import CommentReactionButtons from '../ui/CommentReactionButtons'
import { ReplyType, UserReactionType, NestedReplyType } from '@/types/post'

interface ReplyProps {
  reply: ReplyType
  commentId: string
  onReplyAdded?: () => void
}

// Helper component for nested replies to avoid conditional hooks
function NestedReplyItem({
  nestedReply,
  postId,
  commentId,
  parentReplyId
}: {
  nestedReply: NestedReplyType;
  postId: string;
  commentId: string;
  parentReplyId?: string;
}) {
  const { data: session } = useSession()
  const { replyingTo, replyText, setReplyText, handleReplySubmit, toggleReply } = useCommentContext()

  // Add local state for reactions
  const [localReactionData, setLocalReactionData] = useState({
    totalReactions: 0,
    currentUserReaction: ''
  });

  // SAFE ACCESS: Handle both old 'likes' and new 'reactions' structure
  const currentUserReaction = useMemo(() => {
    if (localReactionData.currentUserReaction) {
      return localReactionData.currentUserReaction;
    }

    if (!session?.user?.id) return '';

    const userId = session.user.id;

    // Check if we have the new reactions structure
    if (nestedReply.reactions) {
      const reactionTypes = ['likes', 'loves', 'hahas', 'wows', 'sads', 'angrys'] as const;

      for (const type of reactionTypes) {
        if (nestedReply.reactions[type]?.some((reaction: UserReactionType) => reaction.userId === userId)) {
          return type.replace('s', '');
        }
      }
    }

    // Fallback to old 'likes' structure for backward compatibility
    if (nestedReply.likes?.some((reaction: UserReactionType) => reaction.userId === userId)) {
      return 'like';
    }

    return '';
  }, [nestedReply.reactions, nestedReply.likes, session?.user?.id, localReactionData.currentUserReaction])

  const totalReactions = useMemo(() => {
    if (localReactionData.totalReactions > 0) {
      return localReactionData.totalReactions;
    }

    // Handle new reactions structure
    if (nestedReply.reactions) {
      return Object.values(nestedReply.reactions).reduce((total: number, arr: any) => total + (arr?.length || 0), 0);
    }

    // Fallback to old likes structure
    return nestedReply.likes?.length || 0;
  }, [nestedReply.reactions, nestedReply.likes, localReactionData.totalReactions])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  // Get reaction emoji
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

  const nestedReplyKey = `${commentId}-${nestedReply._id}`;

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <img
          src={nestedReply.user.avatar}
          alt={nestedReply.user.name}
          className="w-6 h-6 rounded-full border border-gray-300 object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-100 rounded-2xl p-2 relative">
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

          {/* Reaction Badge */}
          {totalReactions > 0 && (
            <div className="absolute right-2 -bottom-2 bg-white shadow-lg rounded-full px-2 py-1 flex items-center space-x-1 border border-gray-200">
              <span className="text-xs">{getReactionEmoji()}</span>
              <span className="text-gray-900 text-xs font-semibold">
                {totalReactions}
              </span>
            </div>
          )}

          {/* Nested Reply Actions */}
          <div className="mt-2">
            <ul className="flex items-center space-x-3 text-xs">
              <li>
                <CommentReactionButtons
                  activeReaction={currentUserReaction}
                  setActiveReaction={(reaction) => {
                    setLocalReactionData(prev => ({
                      ...prev,
                      currentUserReaction: reaction
                    }));
                  }}
                  commentId={nestedReply._id || ''}
                  postId={postId}
                  isReply={true}
                  parentCommentId={commentId}
                  parentReplyId={parentReplyId}
                  onReactionUpdate={(data) => {
                    console.log('🔄 Nested reply reaction update:', data);
                    setLocalReactionData({
                      totalReactions: data.totalReactions,
                      currentUserReaction: data.currentUserReaction
                    });
                  }}
                />
              </li>

              <li>
                <button
                  onClick={() => toggleReply(commentId, nestedReply._id)}
                  className="text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                  aria-label={`Reply to ${nestedReply.user.name}'s reply`}
                >
                  Reply
                </button>
              </li>

              <li>
                <span className="text-gray-400">{formatTime(nestedReply.createdAt)}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Nested Reply Input for nested replies */}
        {replyingTo === nestedReplyKey && (
          <div className="mt-3">
            <div className="bg-gray-100 rounded-2xl p-2">
              <form onSubmit={(e) => handleReplySubmit(e, commentId, nestedReply._id)} className="flex items-center">
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
                      aria-label="Write a nested reply"
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
      </div>
    </div>
  )
}

export default function Reply({ reply, commentId, onReplyAdded }: ReplyProps) {
  const { data: session } = useSession()
  const {
    postId,
    replyingTo,
    replyText,
    setReplyText,
    handleReplySubmit,
    toggleReply
  } = useCommentContext()

  const [showNestedReplies, setShowNestedReplies] = useState(false)

  // Add local state for reactions
  const [localReactionData, setLocalReactionData] = useState({
    totalReactions: 0,
    currentUserReaction: ''
  });

  // SAFE ACCESS: Handle both old 'likes' and new 'reactions' structure
  const currentUserReaction = useMemo(() => {
    if (localReactionData.currentUserReaction) {
      return localReactionData.currentUserReaction;
    }

    if (!session?.user?.id) return '';

    const userId = session.user.id;

    // Check if we have the new reactions structure
    if (reply.reactions) {
      const reactionTypes = ['likes', 'loves', 'hahas', 'wows', 'sads', 'angrys'] as const;

      for (const type of reactionTypes) {
        if (reply.reactions[type]?.some((reaction: UserReactionType) => reaction.userId === userId)) {
          return type.replace('s', '');
        }
      }
    }

    // Fallback to old 'likes' structure for backward compatibility
    if (reply.likes?.some((reaction: UserReactionType) => reaction.userId === userId)) {
      return 'like';
    }

    return '';
  }, [reply.reactions, reply.likes, session?.user?.id, localReactionData.currentUserReaction])

  const totalReactions = useMemo(() => {
    if (localReactionData.totalReactions > 0) {
      return localReactionData.totalReactions;
    }

    // Handle new reactions structure
    if (reply.reactions) {
      return Object.values(reply.reactions).reduce((total: number, arr: any) => total + (arr?.length || 0), 0);
    }

    // Fallback to old likes structure
    return reply.likes?.length || 0;
  }, [reply.reactions, reply.likes, localReactionData.totalReactions])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  // Get reaction emoji
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

  const hasNestedReplies = reply.replies && reply.replies.length > 0;
  const replyKey = `${commentId}-${reply._id}`;

  // Debug info
  console.log('🔍 Reply Component Debug:', {
    replyId: reply._id,
    commentId,
    postId,
    currentUserReaction,
    totalReactions,
    hasNestedReplies: reply.replies?.length
  });

  return (
    <div className="flex space-x-3">
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
          {totalReactions > 0 && (
            <div className="absolute right-3 -bottom-2 bg-white shadow-lg rounded-full px-2 py-1 flex items-center space-x-1 border border-gray-200">
              <span className="text-xs">{getReactionEmoji()}</span>
              <span className="text-gray-900 text-xs font-semibold">
                {totalReactions}
              </span>
            </div>
          )}

          {/* Reply Actions */}
          <div className="mt-2">
            <ul className="flex items-center space-x-3 text-xs">
              <li>
                <CommentReactionButtons
                  activeReaction={currentUserReaction}
                  setActiveReaction={(reaction) => {
                    setLocalReactionData(prev => ({
                      ...prev,
                      currentUserReaction: reaction
                    }));
                  }}
                  commentId={reply._id || ''}
                  postId={postId}
                  isReply={true}
                  parentCommentId={commentId}
                  onReactionUpdate={(data) => {
                    console.log('🔄 Reply reaction update:', data);
                    setLocalReactionData({
                      totalReactions: data.totalReactions,
                      currentUserReaction: data.currentUserReaction
                    });
                  }}
                />
              </li>

              <li>
                <button
                  onClick={() => {
                    console.log('Toggle reply for:', reply._id);
                    toggleReply(commentId, reply._id);
                  }}
                  className="text-gray-600 hover:text-blue-600 font-semibold transition-colors"
                  aria-label={`Reply to ${reply.user.name}'s reply`}
                  aria-expanded={replyingTo === replyKey}
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
        {replyingTo === replyKey && (
          <div className="mt-3">
            <div className="bg-gray-100 rounded-2xl p-2">
              <form onSubmit={(e) => {
                console.log('Submitting nested reply to:', reply._id);
                handleReplySubmit(e, commentId, reply._id);
              }} className="flex items-center">
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
                      aria-label="Write a nested reply"
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
              onClick={() => {
                console.log('Toggle nested replies for reply:', reply._id);
                setShowNestedReplies(!showNestedReplies);
              }}
              className="text-blue-600 text-xs font-semibold hover:underline flex items-center space-x-1"
              aria-expanded={showNestedReplies}
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

        {/* Nested Replies with FULL FUNCTIONALITY */}
        {showNestedReplies && hasNestedReplies && (
          <div className="mt-3 space-y-3 ml-4">
            {reply.replies.map((nestedReply: NestedReplyType) => (
              <NestedReplyItem
                key={nestedReply._id}
                nestedReply={nestedReply}
                postId={postId}
                commentId={commentId}
                parentReplyId={reply._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}