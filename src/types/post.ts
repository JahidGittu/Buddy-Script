// // src/types/post.ts
// export interface UserReactionType {
//   userId: string;
//   email: string;
//   name: string;
//   avatar: string;
//   reactedAt: string;
// }

// export interface UserType {
//   id: string;
//   name: string;
//   avatar: string;
//   email: string;
//   time?: string;
//   privacy?: string;
// }

// // Define NestedReplyType first
// export interface NestedReplyType {
//   _id?: string;
//   content: string;
//   user: UserType;
//   likes: UserReactionType[];
//   createdAt: string;
// }

// // Main ReplyType with nested replies
// export interface ReplyType {
//   _id?: string;
//   content: string;
//   user: UserType;
//   likes: UserReactionType[];
//   replies: NestedReplyType[]; // Use NestedReplyType instead of ReplyType
//   createdAt: string;
// }

// export interface CommentType {
//   _id?: string;
//   content: string;
//   user: UserType;
//   likes: UserReactionType[];
//   replies: ReplyType[];
//   createdAt: string;
// }

// export interface ReactionsType {
//   likes: UserReactionType[];
//   loves: UserReactionType[];
//   hahas: UserReactionType[];
//   wows: UserReactionType[];
//   sads: UserReactionType[];
//   angrys: UserReactionType[];
// }

// export interface PostType {
//   _id?: string;
//   content: string;
//   image?: string;
//   user: UserType;
//   createdAt: string;
//   updatedAt: string;
//   privacy: 'public' | 'private';
//   reactions: ReactionsType;
//   comments: CommentType[];
//   shares: number;
// }






export interface UserReactionType {
  userId: string;
  email: string;
  name: string;
  avatar: string;
  reactedAt: string;
  reactionType?: string;
}

export interface UserType {
  id: string;
  name: string;
  avatar: string;
  email: string;
  time?: string;
  privacy?: string;
}

// Reactions for Posts
export interface ReactionsType {
  likes: UserReactionType[];
  loves: UserReactionType[];
  hahas: UserReactionType[];
  wows: UserReactionType[];
  sads: UserReactionType[];
  angrys: UserReactionType[];
}

// Reactions for Comments and Replies (with backward compatibility)
export interface CommentReactionsType {
  likes: UserReactionType[];
  loves: UserReactionType[];
  hahas: UserReactionType[];
  wows: UserReactionType[];
  sads: UserReactionType[];
  angrys: UserReactionType[];
}

// Base interface for all comment-like entities with backward compatibility
interface BaseCommentEntity {
  _id?: string;
  content: string;
  user: UserType;
  // Support both old 'likes' and new 'reactions' structure during transition
  reactions?: CommentReactionsType;
  likes?: UserReactionType[]; // Keep for backward compatibility
  createdAt: string;
}

export interface NestedReplyType extends BaseCommentEntity {
  // No nested replies for nested replies (limit depth)
}

export interface ReplyType extends BaseCommentEntity {
  replies: NestedReplyType[];
}

export interface CommentType extends BaseCommentEntity {
  replies: ReplyType[];
}

export interface PostType {
  _id?: string;
  content: string;
  image?: string;
  user: UserType;
  createdAt: string;
  updatedAt: string;
  privacy: 'public' | 'private';
  reactions: ReactionsType;
  comments: CommentType[];
  shares: number;
}