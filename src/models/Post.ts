// src/models/Post.ts
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
  }
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
  likes: [UserReactionSchema],
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
  likes: [UserReactionSchema],
  replies: [NestedReplySchema], // Add nested replies support
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
  likes: [UserReactionSchema],
  replies: [ReplySchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
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
  reactions: {
    likes: [UserReactionSchema],
    loves: [UserReactionSchema],
    hahas: [UserReactionSchema],
    wows: [UserReactionSchema],
    sads: [UserReactionSchema],
    angrys: [UserReactionSchema]
  },
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