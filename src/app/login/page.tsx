// 'use client';
// import Link from 'next/link';
// import React, { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { useRouter, useSearchParams } from 'next/navigation';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const message = searchParams.get('message');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const result = await signIn('credentials', {
//         email: email.trim().toLowerCase(),
//         password: password,
//         redirect: false,
//       });

//       if (result?.error) {
//         setError('Invalid email or password');
//       } else {
//         router.push('/');
//       }
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setError(error.message || 'Something went wrong. Please try again.');
//       } else {
//         setError('Something went wrong. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       setError('');
//       await signIn('google', { callbackUrl: '/' });
//     } catch (error: unknown) {
//       setError('Google sign in failed. Please try again.');
//     }
//   };

//   return (
//     <section className="min-h-screen bg-[#F0F2F5] relative overflow-hidden py-25 dark:bg-[#232e42]">
     
     
//       {/* Background Shapes */}
//       <div className="absolute top-0 left-0 z-0">
//         <img src="/assets/images/shape1.svg" alt="" className="block dark:hidden" />
//         <img src="/assets/images/dark_shape.svg" alt="" className="hidden dark:block" />
//       </div>
//       <div className="absolute top-0 right-5 z-0">
//         <img src="/assets/images/shape2.svg" alt="" className="block dark:hidden" />
//         <img src="/assets/images/dark_shape1.svg" alt="" className="hidden dark:block opacity-5" />
//       </div>
//       <div className="absolute bottom-0 right-80 z-0">
//         <img src="/assets/images/shape3.svg" alt="" className="block dark:hidden" />
//         <img src="/assets/images/dark_shape2.svg" alt="" className="hidden dark:block opacity-5" />
//       </div>

//       <div className="container mx-auto px-4 relative z-10">
//         <div className="flex flex-wrap items-center">
//           {/* Left Side - Image */}
//           <div className="w-full lg:w-8/12 xl:w-8/12 px-4">
//             <div className="text-center lg:text-left">
//               <img src="/assets/images/login.png" alt="Login" className="mx-auto lg:mx-0 max-w-[633px]" />
//             </div>
//           </div>

//           {/* Right Side - Form */}
//           <div className="w-full lg:w-4/12 xl:w-4/12 px-4">
//             <div className="bg-white rounded-lg shadow-lg p-12 dark:bg-[#112032]">
//               {/* Logo */}
//               <div className="text-center mb-7">
//                 <img src="/assets/images/logo.svg" alt="Buddy Script" className="mx-auto w-40" />
//               </div>

//               {/* Header Text */}
//               <p className="text-center text-[#2D3748] dark:text-white mb-2">Welcome back</p>
//               <h4 className="text-2xl font-medium text-center text-[#312000] dark:text-white mb-12">Login to your account</h4>

//               {/* Success Message from Registration */}
//               {message && (
//                 <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm dark:bg-green-900 dark:border-green-700 dark:text-green-200">
//                   {message}
//                 </div>
//               )}

//               {/* Error Message */}
//               {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm dark:bg-red-900 dark:border-red-700 dark:text-red-200">
//                   {error}
//                 </div>
//               )}

//               {/* Google Sign In Button */}
//               <button 
//                 onClick={handleGoogleSignIn}
//                 disabled={loading}
//                 className="w-full border border-[#F0F2F5] bg-white rounded-lg py-3 px-15 mb-10 flex items-center justify-center hover:shadow-lg transition-shadow dark:bg-[#112032] dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <img src="/assets/images/google.svg" alt="Google" className="w-5 h-5 mr-2" />
//                 <span className="text-[#312000] font-medium dark:text-white">Sign-in with google</span>
//               </button>

//               {/* Divider */}
//               <div className="relative text-center mb-10">
//                 <div className="absolute left-0 top-1/2 w-28 h-0.5 border border-[#DFDFDF] rounded-lg dark:border-gray-600"></div>
//                 <span className="text-[#C4C4C4] text-sm px-4 bg-white dark:bg-[#112032]">Or</span>
//                 <div className="absolute right-0 top-1/2 w-28 h-0.5 border border-[#DFDFDF] rounded-lg dark:border-gray-600"></div>
//               </div>

//               {/* Login Form */}
//               <form className="space-y-4" onSubmit={handleSubmit}>
//                 {/* Email Field */}
//                 <div>
//                   <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Email</label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
//                     placeholder="Enter your email"
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 {/* Password Field */}
//                 <div>
//                   <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Password</label>
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
//                     placeholder="Enter your password"
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="pt-10 pb-15">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-[#1890FF] text-white rounded-lg py-3 font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Signing in...' : 'Login now'}
//                   </button>
//                 </div>
//               </form>

//               {/* Bottom Text */}
//               <div className="text-center">
//                 <p className="text-sm text-[#2D3748] dark:text-white">
//                   Don't have an account?{' '}
//                   <Link 
//                     href="/register" 
//                     className="text-[#1890FF] hover:underline"
//                     onClick={(e) => loading && e.preventDefault()}
//                   >
//                     Create New Account
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Login;










'use client';

// app/login/page.tsx
import Link from 'next/link';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ForgotPassword from '@/components/authentication/ForgotPassword';
import VerifyOtp from '@/components/authentication/VerifyOtp';

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const LoginPage = ({ searchParams }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtpVerify, setShowOtpVerify] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpType, setOtpType] = useState<'registration' | 'reset_password'>('reset_password');
  
  const router = useRouter();
  
  // Use React.use() to unwrap the searchParams Promise
  const resolvedSearchParams = React.use(searchParams);
  
  // Safely get message from searchParams
  const message = Array.isArray(resolvedSearchParams.message) 
    ? resolvedSearchParams.message[0] 
    : resolvedSearchParams.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password: password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Something went wrong. Please try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signIn('google', { callbackUrl: '/' });
    } catch (error: unknown) {
      setError('Google sign in failed. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowOtpVerify(false);
    setOtpEmail('');
    setError('');
  };

  const handleOtpVerify = (verifiedEmail: string) => {
    setOtpEmail(verifiedEmail);
    setShowOtpVerify(false);
  };

  const handleOtpResend = () => {
    // OTP resend logic if needed
  };

  // If Forgot Password is shown
  if (showForgotPassword) {
    return (
      <section className="min-h-screen bg-[#F0F2F5] relative overflow-hidden py-25 dark:bg-[#232e42]">
        {/* Background Shapes */}
        <div className="absolute top-0 left-0 z-0">
          <img src="/assets/images/shape1.svg" alt="" className="block dark:hidden" />
          <img src="/assets/images/dark_shape.svg" alt="" className="hidden dark:block" />
        </div>
        <div className="absolute top-0 right-5 z-0">
          <img src="/assets/images/shape2.svg" alt="" className="block dark:hidden" />
          <img src="/assets/images/dark_shape1.svg" alt="" className="hidden dark:block opacity-5" />
        </div>
        <div className="absolute bottom-0 right-80 z-0">
          <img src="/assets/images/shape3.svg" alt="" className="block dark:hidden" />
          <img src="/assets/images/dark_shape2.svg" alt="" className="hidden dark:block opacity-5" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center justify-center">
            <div className="w-full lg:w-6/12 xl:w-5/12 px-4">
              <ForgotPassword onBackToLogin={handleBackToLogin} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If OTP Verify is shown
  if (showOtpVerify) {
    return (
      <section className="min-h-screen bg-[#F0F2F5] relative overflow-hidden py-25 dark:bg-[#232e42]">
        {/* Background Shapes */}
        <div className="absolute top-0 left-0 z-0">
          <img src="/assets/images/shape1.svg" alt="" className="block dark:hidden" />
          <img src="/assets/images/dark_shape.svg" alt="" className="hidden dark:block" />
        </div>
        <div className="absolute top-0 right-5 z-0">
          <img src="/assets/images/shape2.svg" alt="" className="block dark:hidden" />
          <img src="/assets/images/dark_shape1.svg" alt="" className="hidden dark:block opacity-5" />
        </div>
        <div className="absolute bottom-0 right-80 z-0">
          <img src="/assets/images/shape3.svg" alt="" className="block dark:hidden" />
          <img src="/assets/images/dark_shape2.svg" alt="" className="hidden dark:block opacity-5" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap items-center justify-center">
            <div className="w-full lg:w-6/12 xl:w-5/12 px-4">
              <VerifyOtp
                email={otpEmail}
                type={otpType}
                onVerify={handleOtpVerify}
                onResend={handleOtpResend}
                onBack={handleBackToLogin}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main Login Form
  return (
    <section className="min-h-screen bg-[#F0F2F5] relative overflow-hidden py-25 dark:bg-[#232e42]">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 z-0">
        <img src="/assets/images/shape1.svg" alt="" className="block dark:hidden" />
        <img src="/assets/images/dark_shape.svg" alt="" className="hidden dark:block" />
      </div>
      <div className="absolute top-0 right-5 z-0">
        <img src="/assets/images/shape2.svg" alt="" className="block dark:hidden" />
        <img src="/assets/images/dark_shape1.svg" alt="" className="hidden dark:block opacity-5" />
      </div>
      <div className="absolute bottom-0 right-80 z-0">
        <img src="/assets/images/shape3.svg" alt="" className="block dark:hidden" />
        <img src="/assets/images/dark_shape2.svg" alt="" className="hidden dark:block opacity-5" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap items-center">
          {/* Left Side - Image */}
          <div className="w-full lg:w-8/12 xl:w-8/12 px-4">
            <div className="text-center lg:text-left">
              <img src="/assets/images/login.png" alt="Login" className="mx-auto lg:mx-0 max-w-[633px]" />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-4/12 xl:w-4/12 px-4">
            <div className="bg-white rounded-lg shadow-lg p-12 dark:bg-[#112032]">
              {/* Logo */}
              <div className="text-center mb-7">
                <img src="/assets/images/logo.svg" alt="Buddy Script" className="mx-auto w-40" />
              </div>

              {/* Header Text */}
              <p className="text-center text-[#2D3748] dark:text-white mb-2">Welcome back</p>
              <h4 className="text-2xl font-medium text-center text-[#312000] dark:text-white mb-12">Login to your account</h4>

              {/* Success Message from Registration */}
              {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm dark:bg-green-900 dark:border-green-700 dark:text-green-200">
                  {message}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm dark:bg-red-900 dark:border-red-700 dark:text-red-200">
                  {error}
                </div>
              )}

              {/* Google Sign In Button */}
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full border border-[#F0F2F5] bg-white rounded-lg py-3 px-15 mb-10 flex items-center justify-center hover:shadow-lg transition-shadow dark:bg-[#112032] dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src="/assets/images/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                <span className="text-[#312000] font-medium dark:text-white">Sign-in with google</span>
              </button>

              {/* Divider */}
              <div className="relative text-center mb-10">
                <div className="absolute left-0 top-1/2 w-28 h-0.5 border border-[#DFDFDF] rounded-lg dark:border-gray-600"></div>
                <span className="text-[#C4C4C4] text-sm px-4 bg-white dark:bg-[#112032]">Or</span>
                <div className="absolute right-0 top-1/2 w-28 h-0.5 border border-[#DFDFDF] rounded-lg dark:border-gray-600"></div>
              </div>

              {/* Login Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div>
                  <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[#1890FF] hover:underline text-sm font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Button */}
                <div className="pt-10 pb-15">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1890FF] text-white rounded-lg py-3 font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Signing in...' : 'Login now'}
                  </button>
                </div>
              </form>

              {/* Bottom Text */}
              <div className="text-center">
                <p className="text-sm text-[#2D3748] dark:text-white">
                  Don't have an account?{' '}
                  <Link 
                    href="/register" 
                    className="text-[#1890FF] hover:underline"
                    onClick={(e) => loading && e.preventDefault()}
                  >
                    Create New Account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;