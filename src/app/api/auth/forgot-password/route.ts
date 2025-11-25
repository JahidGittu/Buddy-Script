import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP, storeOTP } from '@/utils/otp';
import { sendOTPEmail } from '@/utils/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const user = await User.findOne({ 
      email: normalizedEmail 
    });
    
    // Always return the same message regardless of user existence
    // This prevents email enumeration attacks
    if (user) {
      // Generate and send OTP only if user exists
      const otp = generateOTP();
      await storeOTP(normalizedEmail, otp, 'reset_password');
      await sendOTPEmail(normalizedEmail, otp, 'reset_password');
    }

    return NextResponse.json(
      { 
        message: 'If the email exists, you will receive an OTP shortly.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}