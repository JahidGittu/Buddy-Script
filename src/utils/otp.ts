import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(email: string, otp: string, type: 'registration' | 'reset_password'): Promise<void> {
  await connectToDatabase();

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await User.updateOne(
    { email: email.toLowerCase().trim() },
    { 
      $set: { 
        'otp.code': otp,
        'otp.type': type,
        'otp.expiresAt': expiresAt,
        'otp.attempts': 0,
        updatedAt: new Date()
      } 
    }
  );
}

export async function verifyOTP(email: string, otp: string, type: 'registration' | 'reset_password'): Promise<boolean> {
  await connectToDatabase();

  const user = await User.findOne({ 
    email: email.toLowerCase().trim(),
    'otp.code': otp,
    'otp.type': type,
    'otp.expiresAt': { $gt: new Date() }
  });

  if (!user) {
    // Increment attempts if OTP is wrong
    await User.updateOne(
      { email: email.toLowerCase().trim() },
      { 
        $inc: { 'otp.attempts': 1 },
        $set: { updatedAt: new Date() }
      }
    );
    return false;
  }

  // Clear OTP after successful verification
  await User.updateOne(
    { email: email.toLowerCase().trim() },
    { 
      $set: { 
        'otp.code': null,
        'otp.type': null,
        'otp.expiresAt': null,
        'otp.attempts': 0,
        updatedAt: new Date()
      } 
    }
  );

  return true;
}

export async function cleanExpiredOTPs(): Promise<void> {
  await connectToDatabase();
  
  // MongoDB TTL index will automatically remove expired OTPs
  // This function is kept for backward compatibility
  await User.updateMany(
    { 
      'otp.expiresAt': { $lt: new Date() }
    },
    { 
      $set: { 
        'otp.code': null,
        'otp.type': null,
        'otp.expiresAt': null,
        'otp.attempts': 0
      } 
    }
  );
}

export async function getOTPAttempts(email: string): Promise<number> {
  await connectToDatabase();
  
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  return user?.otp?.attempts || 0;
}