import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { verifyOTP, cleanExpiredOTPs } from '@/utils/otp';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, type } = await request.json();

    if (!email || !otp || !type) {
      return NextResponse.json(
        { error: 'Email, OTP, and type are required' },
        { status: 400 }
      );
    }

    // Clean expired OTPs first
    await cleanExpiredOTPs();

    // Verify OTP
    const isValid = await verifyOTP(email.toLowerCase().trim(), otp, type);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    if (type === 'registration') {
      // Update user verification status
      const result = await User.updateOne(
        { email: email.toLowerCase().trim() },
        { 
          $set: { 
            isVerified: true,
            emailVerified: new Date(),
            updatedAt: new Date()
          } 
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { 
        message: type === 'registration' 
          ? 'Email verified successfully! You can now login.' 
          : 'OTP verified successfully! You can now reset your password.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}