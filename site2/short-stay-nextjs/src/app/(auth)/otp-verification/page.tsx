'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';

export default function OTPVerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('verifyEmail');
    if (!storedEmail) {
      router.push('/register');
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        sessionStorage.removeItem('verifyEmail');
        setSuccess('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setResending(true);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSuccess('OTP resent successfully!');
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setResending(false);
    }
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
        <h1 className="text-2xl font-bold text-dark">Verify Your Email</h1>
        <p className="text-gray mt-2">
          We&apos;ve sent a verification code to{' '}
          <span className="font-medium text-dark">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          label="Verify"
          className="w-full"
          loading={loading}
          disabled={loading}
        />

        <p className="text-center text-gray mt-4">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-primary font-semibold hover:underline disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend'}
          </button>
        </p>
      </form>
    </div>
  );
}
