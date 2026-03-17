'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardNav() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-udemy-dark text-white px-4 py-3 flex items-center justify-between shadow">
      <Link href="/dashboard" className="font-bold text-lg">
        LMS
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/dashboard" className="hover:text-gray-300">
          Courses
        </Link>
        {user && (
          <>
            <span className="text-sm text-gray-400">{user.email}</span>
            <button
              onClick={() => logout()}
              className="text-sm text-gray-400 hover:text-white"
            >
              Log out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
