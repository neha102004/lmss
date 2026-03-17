'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import CourseSidebar from '@/components/CourseSidebar';
import type { Subject } from '@/types/lms';
import type { VideoProgressMap } from '@/types/lms';

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const subjectId = params.subjectId as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [progress, setProgress] = useState<VideoProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSubject = useCallback(() => {
    return api.get<Subject>(`/subjects/${subjectId}`).then((res) => res.data);
  }, [subjectId]);

  const loadProgress = useCallback(() => {
    return api.get<VideoProgressMap>('/progress').then((res) => res.data);
  }, []);

  useEffect(() => {
    Promise.all([loadSubject(), loadProgress()])
      .then(([subj, prog]) => {
        setSubject(subj);
        setProgress(prog);
      })
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false));
  }, [loadSubject, loadProgress]);

  // Refetch progress when pathname changes or when a video is completed
  useEffect(() => {
    if (!subject) return;
    loadProgress().then(setProgress).catch(() => {});
  }, [pathname, subject, loadProgress]);

  useEffect(() => {
    const onProgressUpdate = () => loadProgress().then(setProgress).catch(() => {});
    window.addEventListener('lms:progress-updated', onProgressUpdate);
    return () => window.removeEventListener('lms:progress-updated', onProgressUpdate);
  }, [loadProgress]);

  const currentVideoId = pathname?.includes('/v/')
    ? pathname.split('/v/')[1]?.split('/')[0] || null
    : null;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (error || !subject) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded">{error || 'Course not found'}</div>
        <Link href="/dashboard" className="mt-4 inline-block text-udemy-purple hover:underline">
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-52px)]">
      <CourseSidebar
        subject={subject}
        progress={progress}
        currentVideoId={currentVideoId}
        subjectId={subjectId}
      />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
