'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    console.log('handleLogin function triggered');
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log('Login successful!');
      // router.push('/'); // REMOVED: Let middleware handle redirect based on session
      // router.refresh(); // Already commented out
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'An error occurred during login');
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
          <p className="text-airport-white mt-2">Airport Capacity Planning Tool</p>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 pr-10 bg-airport-gray text-airport-white border border-airport-gray rounded focus:outline-none focus:ring-2 focus:ring-airport-yellow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-airport-yellow focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            onClick={() => console.log('Submit button clicked')}
            className="w-full py-2 px-4 bg-airport-yellow text-airport-black rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-airport-yellow disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-airport-white">
            Don't have an account?{' '}
            <Link href="/signup" className="text-airport-yellow hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 