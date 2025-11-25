'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface CommentContextType {
  postId: string;
  replyingTo: string | null;
  replyText: string;
  setReplyText: (text: string) => void;
  handleReplySubmit: (e: React.FormEvent, commentId: string, parentReplyId?: string) => Promise<void>;
  toggleReply: (commentId: string, parentReplyId?: string) => void;
  onReplyAdded?: () => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

interface CommentProviderProps {
  children: ReactNode;
  postId: string;
  onReplyAdded?: () => void;
}

export function CommentProvider({ children, postId, onReplyAdded }: CommentProviderProps) {
  const { data: session } = useSession();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const toggleReply = (commentId: string, parentReplyId?: string) => {
    const replyKey = parentReplyId ? `${commentId}-${parentReplyId}` : commentId;
    setReplyingTo(replyingTo === replyKey ? null : replyKey);
    setReplyText('');
  };

  const handleReplySubmit = async (e: React.FormEvent, commentId: string, parentReplyId?: string) => {
    e.preventDefault();
    if (!replyText.trim() || !session?.user) return;

    // Clear inputs immediately
    setReplyText('');
    setReplyingTo(null);
    
    // Refresh to show new reply
    if (onReplyAdded) {
      onReplyAdded();
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
          parentReplyId: parentReplyId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Failed to add reply. Please try again.');
    }
  };

  const value: CommentContextType = {
    postId,
    replyingTo,
    replyText,
    setReplyText,
    handleReplySubmit,
    toggleReply,
    onReplyAdded
  };

  return (
    <CommentContext.Provider value={value}>
      {children}
    </CommentContext.Provider>
  );
}

export function useCommentContext(): CommentContextType {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useCommentContext must be used within a CommentProvider');
  }
  return context;
}