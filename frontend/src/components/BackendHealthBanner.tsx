'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function BackendHealthBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !API_URL || API_URL.includes('localhost')) return;

    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/health`, { method: 'GET' });
        if (res.ok) setShow(false);
        else setShow(true);
      } catch {
        setShow(true);
      }
    };

    check();
  }, []);

  if (!show) return null;

  return (
    <div className="bg-amber-500 text-black text-center py-2 px-4 text-sm">
      Cannot reach the backend. Check that <code className="bg-black/10 px-1 rounded">{API_URL}</code> is correct and the backend is running. See DEPLOYMENT.md in the repo.
    </div>
  );
}
