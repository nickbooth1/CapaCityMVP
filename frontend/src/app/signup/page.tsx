'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { api } from '@/utils/api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Sign up with Supabase Auth - this part still uses direct Supabase calls
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If successful, create user profile using backend API
      if (data?.user) {
        // Using the API instead of direct Supabase call
        await api.users.createOrUpdateProfile({
          id: data.user.id,
          email: email,
          name: name,
          role: 'user', // Default role
          airport_id: null // Set airport_id to null on initial signup
        });

        setSuccess('Account created successfully! You can now login.');
        // Redirect after a short delay to show the success message
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-airport-gray">
      <div className="w-full max-w-md p-8 bg-airport-black rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-airport-white">
            <span className="text-airport-yellow">Capa</span>City
          </h1>
          <p className="text-airport-white mt-2">Create an Account</p>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900 text-white p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-airport-white mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
            />
          </div>
          
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-airport-white mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-airport-white mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
            />
            <p className="text-xs text-gray-400 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-airport-yellow text-airport-black rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airport-yellow disabled:opacity-50 mt-6"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-airport-white">
            Already have an account?{' '}
            <Link href="/login" className="text-airport-yellow hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 