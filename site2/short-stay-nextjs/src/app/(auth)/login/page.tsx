'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Input, PasswordInput, Checkbox } from '@/components/ui/Input';
import { PrimaryButton, GoogleButton } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
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
        <h1 className="text-2xl font-bold text-dark">Welcome Back</h1>
        <p className="text-gray mt-2">Please sign in to your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember Me"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <Link
            href="/forgot-password"
            className="text-primary font-medium text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <PrimaryButton
          type="submit"
          label="Sign In"
          className="w-full"
          loading={loading}
          disabled={loading}
        />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray">Or</span>
          </div>
        </div>

        <GoogleButton label="Sign In with Google" className="w-full" />

        <p className="text-center text-dark mt-6">
          Don&apos;t have an Account?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
