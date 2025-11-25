import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  code: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ['registration', 'reset_password'],
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  attempts: {
    type: Number,
    default: 0
  }
});

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    // Remove required: true and add default: null
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Date,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  otp: OTPSchema,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for OTP expiration
UserSchema.index({ 'otp.expiresAt': 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.User || mongoose.model('User', UserSchema);