import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-udemy-dark to-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-2">LMS</h1>
      <p className="text-gray-300 mb-8">Learn at your own pace</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 rounded bg-white text-udemy-dark font-medium hover:bg-gray-100"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 rounded border border-white font-medium hover:bg-white/10"
        >
          Sign up
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded bg-udemy-purple font-medium hover:bg-purple-700"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
