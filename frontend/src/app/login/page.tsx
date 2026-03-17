'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const axErr = err as { response?: { data?: { error?: string }; status?: number }; message?: string; code?: string };
      const msg = axErr.response?.data?.error;
      const isNetwork = !axErr.response && (axErr.message === 'Network Error' || axErr.code === 'ERR_NETWORK');
      setError(
        msg ||
          (isNetwork
            ? 'Cannot connect to server. Is the backend running at ' + (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '?'
            : 'Login failed')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-udemy-dark px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Log in</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded p-6 shadow-lg space-y-4"
        >
          {error && (
            <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-udemy-purple focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-udemy-purple focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded bg-udemy-purple text-white font-medium hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-udemy-purple hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
