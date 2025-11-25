import NextAuth, { AuthOptions, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User'; // Import the model

interface CustomUser extends NextAuthUser {
  firstName: string;
  lastName: string;
  isVerified?: boolean;
}

interface GoogleProfile {
  email: string;
  name?: string;
  picture?: string;
  sub: string;
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          await connectToDatabase(); // Connect to database

          const normalizedEmail = credentials.email.toLowerCase().trim();
          const user = await User.findOne({ 
            email: normalizedEmail 
          });

          if (!user) {
            throw new Error('No user found with this email');
          }

          // Check if email is verified for credentials login
          if (!user.isVerified) {
            throw new Error('Please verify your email before logging in. Check your email for verification code.');
          }

          if (!user.password) {
            throw new Error('Account was created with a social provider. Please use Google sign-in.');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user._id?.toString() || '',
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            isVerified: user.isVerified,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        const customUser = user as CustomUser;
        token.firstName = customUser.firstName;
        token.lastName = customUser.lastName;
        token.isVerified = customUser.isVerified;
        
        // Handle Google provider
        if (account?.provider === 'google' && profile) {
          const googleProfile = profile as GoogleProfile;
          await connectToDatabase();
          
          // Check if user exists in database
          const existingUser = await User.findOne({ 
            email: googleProfile.email 
          });

          if (!existingUser) {
            // Create new user for Google sign-in with isVerified: true
            const names = googleProfile.name?.split(' ') || ['', ''];
            const newUser = new User({
              firstName: names[0],
              lastName: names[1] || '',
              email: googleProfile.email,
              password: '', // No password for social login
              isVerified: true, // Google users are automatically verified
              image: googleProfile.picture || null,
              emailVerified: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            await newUser.save();
            token.id = newUser._id.toString();
            token.firstName = newUser.firstName;
            token.lastName = newUser.lastName;
            token.isVerified = newUser.isVerified;
          } else {
            token.id = existingUser._id?.toString();
            token.firstName = existingUser.firstName;
            token.lastName = existingUser.lastName;
            token.isVerified = existingUser.isVerified;
            
            // Ensure Google users are always verified
            if (!existingUser.isVerified) {
              await User.updateOne(
                { email: googleProfile.email },
                { 
                  $set: { 
                    isVerified: true,
                    emailVerified: new Date(),
                    updatedAt: new Date()
                  } 
                }
              );
              token.isVerified = true;
            }
          }
        } else {
          // For credentials login
          token.id = user.id;
          token.isVerified = customUser.isVerified || false;
        }
      }

      // If no user but we have token, check verification status from database
      if (!user && token.email && typeof token.email === 'string') {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ 
            email: token.email.toLowerCase().trim()
          });
          if (dbUser) {
            token.isVerified = dbUser.isVerified;
          }
        } catch (error) {
          console.error('Error checking user verification status:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle Google sign-in
      if (account?.provider === 'google' && profile) {
        try {
          const googleProfile = profile as GoogleProfile;
          await connectToDatabase();
          
          // Check if user exists
          const existingUser = await User.findOne({ 
            email: googleProfile.email 
          });

          if (existingUser) {
            // Update user with Google info and ensure they are verified
            await User.updateOne(
              { email: googleProfile.email },
              { 
                $set: { 
                  image: googleProfile.picture || null,
                  isVerified: true, // Always set to true for Google users
                  emailVerified: new Date(),
                  updatedAt: new Date()
                } 
              }
            );
          }
          
          return true;
        } catch (error) {
          console.error('Error in Google sign-in:', error);
          return false;
        }
      }
      
      // For credentials login, check if user is verified
      if (account?.provider === 'credentials' && user.email) {
        try {
          await connectToDatabase();
          const dbUser = await User.findOne({ 
            email: user.email.toLowerCase().trim()
          });
          
          if (!dbUser?.isVerified) {
            console.log('User not verified:', user.email);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error('Error checking user verification:', error);
          return false;
        }
      }
      
      return true;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', 
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };