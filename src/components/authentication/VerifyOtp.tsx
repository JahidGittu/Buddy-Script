'use client';

import { useState, useRef, useEffect } from 'react';

interface VerifyOtpProps {
  email: string;
  type: 'registration' | 'reset_password';
  onVerify: (email: string) => void;
  onResend: () => void;
  onBack?: () => void;
}

export default function VerifyOtp({ email, type, onVerify, onResend, onBack }: VerifyOtpProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedOtp = pastedData.slice(0, 6).split('');
    
    if (pastedOtp.every(char => /^\d*$/.test(char))) {
      const newOtp = [...otp];
      pastedOtp.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      
      // Focus the last input
      const lastFilledIndex = pastedOtp.findIndex(char => !char) - 1;
      const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : Math.min(5, pastedOtp.length - 1);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpString,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setSuccess(data.message);
      onVerify(email);
    } catch (error: any) {
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      setSuccess('OTP sent successfully!');
      setCountdown(60);
      onResend();
    } catch (error: any) {
      setError(error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Verify Your Email
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          We sent a 6-digit verification code to <strong>{email}</strong>
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

        <form onSubmit={handleVerify} className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                required
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{' '}
              {countdown > 0 ? (
                <span className="text-gray-500">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </p>
          </div>

          {/* Back Button */}
          {onBack && (
            <div className="text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                ← Back to {type === 'registration' ? 'Registration' : 'Forgot Password'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}