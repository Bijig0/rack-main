'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { PrimaryButton } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        sessionStorage.setItem('resetEmail', email);
        setSuccess('OTP sent to your email!');
        setTimeout(() => {
          router.push('/reset-password');
        }, 1500);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-dark">Forgot Password?</h1>
        <p className="text-gray mt-2">
          Enter your email and we&apos;ll send you a code to reset your password.
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
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <PrimaryButton
          type="submit"
          label="Send Reset Code"
          className="w-full"
          loading={loading}
          disabled={loading}
        />

        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-primary font-medium hover:underline mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </form>
    </div>
  );
}
