// src/components/post/PostsList.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Post from './Post'
import { PostType, UserReactionType, CommentType } from '@/types/post'
import { useSession } from 'next-auth/react'

interface PostsListProps {
  refreshTrigger?: number;
}

export default function PostsList({ refreshTrigger = 0 }: PostsListProps) {
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const { data: session } = useSession()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/posts')
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      
      const data = await response.json()
      setPosts(data.posts)
    } catch (err) {
      setError('Failed to load posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [refreshTrigger])

  // INSTANT REACTION UPDATE - No delays, no loading states
  const updatePostReaction = useCallback((postId: string, reaction: string) => {
    if (!session?.user) return;

    // Immediate UI update - fire and forget
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post._id === postId) {
          const updatedPost = { ...post }; // Shallow clone is enough
          const reactionTypes = ['likes', 'loves', 'hahas', 'wows', 'sads', 'angrys'] as const;
          
          // Simple user reaction data
          const userReactionData: UserReactionType = {
            userId: session.user.id,
            email: session.user.email || 'user@example.com',
            name: session.user.name || 'User',
            avatar: session.user.image || '/default-avatar.png',
            reactedAt: new Date().toISOString()
          };

          // Remove user from all reaction types
          reactionTypes.forEach(type => {
            updatedPost.reactions[type] = updatedPost.reactions[type].filter(
              (userReaction: UserReactionType) => userReaction.userId !== session.user.id
            );
          });

          // Add to new reaction if provided
          if (reaction) {
            const reactionMap = {
              'like': 'likes',
              'love': 'loves', 
              'haha': 'hahas',
              'wow': 'wows',
              'sad': 'sads',
              'angry': 'angrys'
            } as const;
            
            const reactionField = reactionMap[reaction as keyof typeof reactionMap];
            if (reactionField) {
              updatedPost.reactions[reactionField].push(userReactionData);
            }
          }

          return updatedPost;
        }
        return post;
      })
    );
  }, [session]);

  // OPTIMISTIC COMMENT UPDATE - Add comment instantly to UI
  const handleCommentAdded = useCallback((postId: string, newComment: CommentType) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [newComment, ...post.comments]
          };
        }
        return post;
      })
    );
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        {error}
        <button 
          onClick={fetchPosts}
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts yet. Be the first to share something!
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <Post 
          key={post._id} 
          post={post} 
          onReactionUpdate={updatePostReaction}
          onCommentAdded={() => {
            // This will trigger the optimistic update in CommentSection
            console.log('Comment added to post:', post._id);
          }}
        />
      ))}
    </div>
  )
}