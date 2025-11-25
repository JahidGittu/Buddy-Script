import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP, storeOTP } from '@/utils/otp';
import { sendOTPEmail } from '@/utils/email';

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: 'Email and type are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists for registration type
    if (type === 'registration') {
      const user = await User.findOne({ 
        email: normalizedEmail 
      });
      
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      if (user.isVerified) {
        return NextResponse.json(
          { error: 'Email is already verified' },
          { status: 400 }
        );
      }
    }

    // Generate and send new OTP
    const otp = generateOTP();
    await storeOTP(normalizedEmail, otp, type);
    await sendOTPEmail(normalizedEmail, otp, type);

    return NextResponse.json(
      { 
        message: 'OTP sent successfully. Please check your email.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}