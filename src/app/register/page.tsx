// 'use client';
// import Link from 'next/link';
// import React, { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// interface FormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   agreeTerms: boolean;
// }

// const Register = () => {
//   const [formData, setFormData] = useState<FormData>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     agreeTerms: false
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     // Validation
//     if (formData.password.length < 6) {
//       setError('Password must be at least 6 characters long');
//       setLoading(false);
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     if (!formData.agreeTerms) {
//       setError('You must agree to the terms & conditions');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           firstName: formData.firstName.trim(),
//           lastName: formData.lastName.trim(),
//           email: formData.email.trim().toLowerCase(),
//           password: formData.password
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || 'Registration failed');
//       }

//       // Auto login after successful registration
//       const result = await signIn('credentials', {
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password,
//         redirect: false,
//       });

//       if (result?.error) {
//         // Redirect to login if auto-login fails
//         router.push('/login?message=Registration successful. Please login.');
//       } else {
//         // Redirect to home on successful login
//         router.push('/');
//       }
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setError(error.message || 'Something went wrong during registration');
//       } else {
//         setError('Something went wrong during registration');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleSignUp = async () => {
//     try {
//       setError('');
//       await signIn('google', { callbackUrl: '/' });
//     } catch (error: unknown) {
//       setError('Google sign up failed. Please try again.');
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
//               <div className="hidden dark:block">
//                 <img src="/assets/images/registration1.png" alt="Registration" className="mx-auto lg:mx-0 max-w-[633px]" />
//               </div>
//               <div className="block dark:hidden">
//                 <img src="/assets/images/registration.png" alt="Registration" className="mx-auto lg:mx-0 max-w-[633px]" />
//               </div>
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
//               <p className="text-center text-[#2D3748] dark:text-white mb-2">Get Started Now</p>
//               <h4 className="text-2xl font-medium text-center text-[#312000] dark:text-white mb-12">Registration</h4>

//               {/* Error Message */}
//               {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm dark:bg-red-900 dark:border-red-700 dark:text-red-200">
//                   {error}
//                 </div>
//               )}

//               {/* Google Sign Up Button */}
//               <button 
//                 onClick={handleGoogleSignUp}
//                 disabled={loading}
//                 className="w-full border border-[#F0F2F5] bg-white rounded-lg py-3 px-15 mb-10 flex items-center justify-center hover:shadow-lg transition-shadow dark:bg-[#112032] dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <img src="/assets/images/google.svg" alt="Google" className="w-5 h-5 mr-2" />
//                 <span className="text-[#312000] font-medium dark:text-white">Register with google</span>
//               </button>

//               {/* Divider */}
//               <div className="relative text-center mb-10">
//                 <div className="absolute left-0 top-1/2 w-28 h-0.5 border border-[#DFDFDF] rounded-lg dark:border-gray-600"></div>
//                 <span className="text-[#C4C4C4] text-sm px-4 bg-white dark:bg-[#112032]">Or</span>
//                 <div className="absolute right-0 top-1/2 w-28 h-0.5 border border-[#DFDFDF] rounded-lg dark:border-gray-600"></div>
//               </div>

//               {/* Registration Form */}
//               <form className="space-y-4" onSubmit={handleSubmit}>
//                 {/* First Name Field */}
//                 <div>
//                   <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">First Name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
//                     placeholder="Enter your first name"
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 {/* Last Name Field */}
//                 <div>
//                   <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Last Name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     value={formData.lastName}
//                     onChange={handleChange}
//                     className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
//                     placeholder="Enter your last name"
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 {/* Email Field */}
//                 <div>
//                   <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
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
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
//                     placeholder="Enter your password"
//                     required
//                     minLength={6}
//                     disabled={loading}
//                   />
//                 </div>

//                 {/* Repeat Password Field */}
//                 <div>
//                   <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Repeat Password</label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
//                     placeholder="Repeat your password"
//                     required
//                     disabled={loading}
//                   />
//                 </div>

//                 {/* Terms & Conditions */}
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     name="agreeTerms"
//                     checked={formData.agreeTerms}
//                     onChange={handleChange}
//                     className="w-4 h-4 text-[#1890FF] bg-gray-100 border-gray-300 rounded focus:ring-[#1890FF] focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                     required
//                     disabled={loading}
//                   />
//                   <label className="ml-2 text-sm text-[#2D3748] dark:text-gray-300">
//                     I agree to terms & conditions
//                   </label>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="pt-10 pb-15">
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-[#1890FF] text-white rounded-lg py-3 font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {loading ? 'Creating Account...' : 'Register Now'}
//                   </button>
//                 </div>
//               </form>

//               {/* Bottom Text */}
//               <div className="text-center">
//                 <p className="text-sm text-[#2D3748] dark:text-white">
//                   Already have account?{' '}
//                   <Link 
//                     href="/login" 
//                     className="text-[#1890FF] hover:underline"
//                     onClick={(e) => loading && e.preventDefault()}
//                   >
//                     Login
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

// export default Register;












'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import VerifyOtp from '@/components/authentication/VerifyOtp';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('You must agree to the terms & conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Registration successful! Please verify your email with the OTP sent to your inbox.');
      setStep('otp');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || 'Something went wrong during registration');
      } else {
        setError('Something went wrong during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (verifiedEmail: string) => {
    try {
      // Auto login after successful OTP verification
      const result = await signIn('credentials', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Redirect to login if auto-login fails
        router.push('/login?message=Registration successful. Please login.');
      } else {
        // Redirect to home on successful login
        router.push('/');
      }
    } catch (error: unknown) {
      setError('Auto login failed. Please login manually.');
      setStep('form');
    }
  };

  const handleOtpResend = () => {
    setSuccess('OTP sent successfully!');
  };

  const handleBackToForm = () => {
    setStep('form');
    setError('');
    setSuccess('');
  };

  const handleGoogleSignUp = async () => {
    try {
      setError('');
      await signIn('google', { callbackUrl: '/' });
    } catch (error: unknown) {
      setError('Google sign up failed. Please try again.');
    }
  };

  // OTP Verification Step
  if (step === 'otp') {
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
                email={formData.email}
                type="registration"
                onVerify={handleOtpVerify}
                onResend={handleOtpResend}
                onBack={handleBackToForm}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Registration Form Step
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
              <div className="hidden dark:block">
                <img src="/assets/images/registration1.png" alt="Registration" className="mx-auto lg:mx-0 max-w-[633px]" />
              </div>
              <div className="block dark:hidden">
                <img src="/assets/images/registration.png" alt="Registration" className="mx-auto lg:mx-0 max-w-[633px]" />
              </div>
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
              <p className="text-center text-[#2D3748] dark:text-white mb-2">Get Started Now</p>
              <h4 className="text-2xl font-medium text-center text-[#312000] dark:text-white mb-12">Registration</h4>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm dark:bg-red-900 dark:border-red-700 dark:text-red-200">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm dark:bg-green-900 dark:border-green-700 dark:text-green-200">
                  {success}
                </div>
              )}

              {/* Google Sign Up Button */}
              <button
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full border border-[#F0F2F5] bg-white rounded-lg py-3 px-15 mb-10 flex items-center justify-center hover:shadow-lg transition-shadow dark:bg-[#112032] dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src="/assets/images/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                <span className="text-[#312000] font-medium dark:text-white">Register with google</span>
              </button>

              {/* Divider */}
              <div className="relative text-center mb-10">
                <div className="absolute left-0 top-1/2 w-28 h-0.5 border border-[#DFDFDF] rounded-lg dark:border-gray-600"></div>
                <span className="text-[#C4C4C4] text-sm px-4 bg-white dark:bg-[#112032]">Or</span>
                <div className="absolute right-0 top-1/2 w-28 h-0.5 border border-[#DFDFDF] rounded-lg dark:border-gray-600"></div>
              </div>

              {/* Registration Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* First Name Field */}
                <div>
                  <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
                    placeholder="Enter your first name"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Last Name Field */}
                <div>
                  <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
                    placeholder="Enter your last name"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>

                {/* Repeat Password Field */}
                <div>
                  <label className="block text-[#4A5568] font-medium mb-2 dark:text-gray-300">Repeat Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white border border-[#F5F5F5] rounded-lg h-12 px-4 focus:outline-none focus:border-[#1890FF] transition-colors dark:bg-[#112032] dark:border-gray-700 dark:text-white"
                    placeholder="Repeat your password"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#1890FF] bg-gray-100 border-gray-300 rounded focus:ring-[#1890FF] focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    required
                    disabled={loading}
                  />
                  <label className="ml-2 text-sm text-[#2D3748] dark:text-gray-300">
                    I agree to terms & conditions
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-10 pb-15">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1890FF] text-white rounded-lg py-3 font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Creating Account...' : 'Register Now'}
                  </button>
                </div>
              </form>

              {/* Bottom Text */}
              <div className="text-center">
                <p className="text-sm text-[#2D3748] dark:text-white">
                  Already have account?{' '}
                  <Link
                    href="/login"
                    className="text-[#1890FF] hover:underline"
                    onClick={(e) => loading && e.preventDefault()}
                  >
                    Login
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

export default Register;