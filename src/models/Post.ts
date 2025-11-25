import mongoose from 'mongoose';

const UserReactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: null
  },
  reactedAt: {
    type: Date,
    default: Date.now
  },
  reactionType: {
    type: String,
    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
    default: 'like'
  }
});

// Comment Reactions Schema (unified for all reaction types)
const CommentReactionsSchema = new mongoose.Schema({
  likes: [UserReactionSchema],
  loves: [UserReactionSchema],
  hahas: [UserReactionSchema],
  wows: [UserReactionSchema],
  sads: [UserReactionSchema],
  angrys: [UserReactionSchema]
});

// Define NestedReplySchema first
const NestedReplySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  reactions: CommentReactionsSchema, // Changed from 'likes' to 'reactions'
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Main ReplySchema with nested replies support
const ReplySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  reactions: CommentReactionsSchema, // Changed from 'likes' to 'reactions'
  replies: [NestedReplySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  reactions: CommentReactionsSchema, // Changed from 'likes' to 'reactions'
  replies: [ReplySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Post Reactions Schema (keep existing for posts)
const PostReactionsSchema = new mongoose.Schema({
  likes: [UserReactionSchema],
  loves: [UserReactionSchema],
  hahas: [UserReactionSchema],
  wows: [UserReactionSchema],
  sads: [UserReactionSchema],
  angrys: [UserReactionSchema]
});

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  privacy: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  reactions: PostReactionsSchema, // Keep existing post reactions
  comments: [CommentSchema],
  shares: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);