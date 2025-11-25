'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { CommentType, UserReactionType } from '@/types/post'

interface CommentContextType {
  postId: string
  replyingTo: string | null
  replyText: string
  setReplyText: (text: string) => void
  toggleReply: (commentId: string, replyId?: string) => void
  handleReplySubmit: (e: React.FormEvent, commentId: string, replyId?: string) => Promise<void>
  optimisticComments: CommentType[]
  updateCommentReactions: (commentId: string, data: { totalReactions: number; currentUserReaction: string }) => void
  updateReplyReactions: (commentId: string, replyId: string, data: { totalReactions: number; currentUserReaction: string }) => void
  updateNestedReplyReactions: (commentId: string, parentReplyId: string, nestedReplyId: string, data: { totalReactions: number; currentUserReaction: string }) => void
  addOptimisticComment: (comment: CommentType) => void
  updateOptimisticComment: (tempId: string, realComment: CommentType) => void
  removeOptimisticComment: (tempId: string) => void
}

const CommentContext = createContext<CommentContextType | undefined>(undefined)

interface CommentProviderProps {
  children: ReactNode
  postId: string
  onReplyAdded?: () => void
  initialComments?: CommentType[]
}

// Define proper type for reactions
interface ReactionsObject {
  likes: UserReactionType[];
  loves: UserReactionType[];
  hahas: UserReactionType[];
  wows: UserReactionType[];
  sads: UserReactionType[];
  angrys: UserReactionType[];
}

export function CommentProvider({ 
  children, 
  postId, 
  onReplyAdded,
  initialComments = [] 
}: CommentProviderProps) {
  const { data: session } = useSession()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [optimisticComments, setOptimisticComments] = useState<CommentType[]>(initialComments)

  const toggleReply = useCallback((commentId: string, replyId?: string) => {
    const key = replyId ? `${commentId}-${replyId}` : commentId
    setReplyingTo(prev => prev === key ? null : key)
    setReplyText('')
  }, [])

  // Add optimistic comment (for main comments)
  const addOptimisticComment = useCallback((comment: CommentType) => {
    setOptimisticComments(prev => [comment, ...prev])
  }, [])

  // Update optimistic comment with real data
  const updateOptimisticComment = useCallback((tempId: string, realComment: CommentType) => {
    setOptimisticComments(prev =>
      prev.map(comment =>
        comment._id === tempId ? realComment : comment
      )
    )
  }, [])

  // Remove optimistic comment on error
  const removeOptimisticComment = useCallback((tempId: string) => {
    setOptimisticComments(prev =>
      prev.filter(comment => comment._id !== tempId)
    )
  }, [])

  // OPTIMISTIC UPDATE: Handle reply submission
  const handleReplySubmit = useCallback(async (e: React.FormEvent, commentId: string, replyId?: string) => {
    e.preventDefault()
    if (!replyText.trim() || !session?.user) return

    const tempId = `temp-reply-${Date.now()}`
    const newReply = {
      _id: tempId,
      content: replyText,
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

    // OPTIMISTIC UPDATE - Immediately add to UI
    setOptimisticComments(prev => 
      prev.map(comment => {
        if (comment._id === commentId) {
          if (replyId) {
            // This is a reply to a reply (nested reply)
            const updatedReplies = comment.replies.map(reply => {
              if (reply._id === replyId) {
                return {
                  ...reply,
                  replies: [...reply.replies, newReply]
                }
              }
              return reply
            })
            return { ...comment, replies: updatedReplies }
          } else {
            // This is a direct reply to comment
            return {
              ...comment,
              replies: [...comment.replies, newReply]
            }
          }
        }
        return comment
      })
    )

    const previousComments = [...optimisticComments]
    const previousReplyText = replyText
    setReplyText('')
    setReplyingTo(null)

    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: previousReplyText,
          parentReplyId: replyId 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add reply')
      }

      const result = await response.json()
      
      // Replace optimistic reply with real one
      setOptimisticComments(prev =>
        prev.map(comment => {
          if (comment._id === commentId) {
            if (replyId) {
              // Update nested reply
              const updatedReplies = comment.replies.map(reply => {
                if (reply._id === replyId) {
                  const updatedNestedReplies = reply.replies.map(nestedReply =>
                    nestedReply._id === tempId ? result.reply : nestedReply
                  )
                  return { ...reply, replies: updatedNestedReplies }
                }
                return reply
              })
              return { ...comment, replies: updatedReplies }
            } else {
              // Update direct reply
              const updatedReplies = comment.replies.map(reply =>
                reply._id === tempId ? result.reply : reply
              )
              return { ...comment, replies: updatedReplies }
            }
          }
          return comment
        })
      )

      if (onReplyAdded) {
        onReplyAdded()
      }

    } catch (error) {
      console.error('Error adding reply:', error)
      // Revert optimistic update on error
      setOptimisticComments(previousComments)
      setReplyText(previousReplyText)
      alert('Failed to add reply. Please try again.')
    }
  }, [replyText, session, postId, onReplyAdded, optimisticComments])

  // Helper function to create updated reactions
  const createUpdatedReactions = useCallback((currentUserReaction: string): ReactionsObject => {
    const updatedReactions: ReactionsObject = {
      likes: [],
      loves: [],
      hahas: [],
      wows: [],
      sads: [],
      angrys: []
    };

    // Set the current user reaction
    if (currentUserReaction && session?.user) {
      const reactionField = `${currentUserReaction}s` as keyof ReactionsObject;
      
      const userReaction: UserReactionType = {
        userId: session.user.id,
        email: session.user.email || 'temp@example.com',
        name: session.user.name || 'User',
        avatar: session.user.image || '/default-avatar.png',
        reactedAt: new Date().toISOString()
      };

      updatedReactions[reactionField] = [userReaction];
    }

    return updatedReactions;
  }, [session]);

  // FIXED: Optimistic update for comment reactions
  const updateCommentReactions = useCallback((commentId: string, data: { totalReactions: number; currentUserReaction: string }) => {
    setOptimisticComments(prev =>
      prev.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            reactions: createUpdatedReactions(data.currentUserReaction)
          };
        }
        return comment
      })
    )
  }, [createUpdatedReactions])

  // FIXED: Optimistic update for reply reactions
  const updateReplyReactions = useCallback((commentId: string, replyId: string, data: { totalReactions: number; currentUserReaction: string }) => {
    setOptimisticComments(prev =>
      prev.map(comment => {
        if (comment._id === commentId) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply._id === replyId) {
              return {
                ...reply,
                reactions: createUpdatedReactions(data.currentUserReaction)
              };
            }
            return reply
          })
          return { ...comment, replies: updatedReplies }
        }
        return comment
      })
    )
  }, [createUpdatedReactions])

  // FIXED: Optimistic update for nested reply reactions
  const updateNestedReplyReactions = useCallback((commentId: string, parentReplyId: string, nestedReplyId: string, data: { totalReactions: number; currentUserReaction: string }) => {
    setOptimisticComments(prev =>
      prev.map(comment => {
        if (comment._id === commentId) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply._id === parentReplyId) {
              const updatedNestedReplies = reply.replies.map(nestedReply => {
                if (nestedReply._id === nestedReplyId) {
                  return {
                    ...nestedReply,
                    reactions: createUpdatedReactions(data.currentUserReaction)
                  };
                }
                return nestedReply
              })
              return { ...reply, replies: updatedNestedReplies }
            }
            return reply
          })
          return { ...comment, replies: updatedReplies }
        }
        return comment
      })
    )
  }, [createUpdatedReactions])

  const value: CommentContextType = {
    postId,
    replyingTo,
    replyText,
    setReplyText,
    toggleReply,
    handleReplySubmit,
    optimisticComments,
    updateCommentReactions,
    updateReplyReactions,
    updateNestedReplyReactions,
    addOptimisticComment,
    updateOptimisticComment,
    removeOptimisticComment,
  }

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  )
}

export function useCommentContext() {
  const context = useContext(CommentContext)
  if (context === undefined) {
    throw new Error('useCommentContext must be used within a CommentProvider')
  }
  return context
}