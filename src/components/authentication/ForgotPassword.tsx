'use client';

import { useState } from 'react';
import VerifyOtp from './VerifyOtp';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setSuccess(data.message);
      setStep('otp');
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = (verifiedEmail: string) => {
    setEmail(verifiedEmail);
    setStep('reset');
  };

  const handleOtpResend = () => {
    setSuccess('OTP sent successfully!');
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(data.message);
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <VerifyOtp
        email={email}
        type="reset_password"
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
        onBack={() => setStep('email')}
      />
    );
  }

  if (step === 'reset') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Reset Your Password
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('otp')}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                ← Back to OTP Verification
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Forgot Password
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              ← Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}