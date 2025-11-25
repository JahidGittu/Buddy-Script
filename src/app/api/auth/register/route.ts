// import { NextRequest, NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { connectToDatabase } from '@/lib/mongodb';
// import { User } from '@/models/User';

// export async function POST(request: NextRequest) {
//   try {
//     const { firstName, lastName, email, password } = await request.json();

//     // Validate required fields
//     if (!firstName || !lastName || !email || !password) {
//       return NextResponse.json(
//         { error: 'All fields are required' },
//         { status: 400 }
//       );
//     }

//     // Validate password length
//     if (password.length < 6) {
//       return NextResponse.json(
//         { error: 'Password must be at least 6 characters long' },
//         { status: 400 }
//       );
//     }

//     const { db } = await connectToDatabase();

//     // Normalize email and check if user already exists
//     const normalizedEmail = email.toLowerCase().trim();
//     const existingUser = await db.collection<User>('users').findOne({ 
//       email: normalizedEmail 
//     });
    
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'User already exists with this email' },
//         { status: 409 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // Create user
//     const newUser: User = {
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       email: normalizedEmail,
//       password: hashedPassword,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const result = await db.collection<User>('users').insertOne(newUser);

//     // Return user without password
//     const { password: _, ...userWithoutPassword } = newUser;

//     return NextResponse.json(
//       { 
//         message: 'User created successfully',
//         user: { ...userWithoutPassword, _id: result.insertedId }
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }







import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User'; 
import { generateOTP, storeOTP } from '@/utils/otp';
import { sendOTPEmail } from '@/utils/email';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connectToDatabase(); // Connect to database

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ 
      email: normalizedEmail 
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with isVerified: false
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newUser.save();

    // Generate and send OTP
    const otp = generateOTP();
    await storeOTP(normalizedEmail, otp, 'registration');
    await sendOTPEmail(normalizedEmail, otp, 'registration');

    // Return success without user data
    return NextResponse.json(
      { 
        message: 'Registration successful. Please check your email for verification code.',
        userId: newUser._id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}