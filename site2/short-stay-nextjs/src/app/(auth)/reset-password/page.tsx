'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input, PasswordInput } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      router.push('/forgot-password');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setStep('reset');
        setSuccess('OTP verified. Please set your new password.');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        sessionStorage.removeItem('resetEmail');
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <Link href="/">
          <Image
            src="/images/logo-dark.svg"
            alt="Short Stay"
            width={150}
            height={40}
            className="mx-auto mb-6"
            onError={(e) => {
              e.currentTarget.src = '/images/logo.svg';
            }}
          />
        </Link>
        <h1 className="text-2xl font-bold text-dark">
          {step === 'verify' ? 'Verify OTP' : 'Reset Password'}
        </h1>
        <p className="text-gray mt-2">
          {step === 'verify'
            ? `Enter the code sent to ${email}`
            : 'Create a new password for your account'}
        </p>
      </div>

      {step === 'verify' ? (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Verification Code"
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
          />

          <PrimaryButton
            type="submit"
            label="Verify OTP"
            className="w-full"
            loading={loading}
            disabled={loading}
          />
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <PasswordInput
            label="New Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />

          <PasswordInput
            label="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />

          <PrimaryButton
            type="submit"
            label="Reset Password"
            className="w-full"
            loading={loading}
            disabled={loading}
          />
        </form>
      )}
    </div>
  );
}
