'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import type { Subject } from '@/types/lms';
import type { VideoProgressMap } from '@/types/lms';

function totalLectures(subject: Subject): number {
  return subject.sections.reduce((acc, s) => acc + s.videos.length, 0);
}

function totalDurationHours(subject: Subject): number {
  const secs = subject.sections.reduce(
    (acc, s) => acc + s.videos.reduce((a, v) => a + (v.duration ?? 0), 0),
    0
  );
  return Math.round((secs / 3600) * 10) / 10;
}

function courseProgress(subject: Subject, progress: VideoProgressMap): number {
  const total = totalLectures(subject);
  if (total === 0) return 0;
  const completed = subject.sections.reduce(
    (acc, s) =>
      acc + s.videos.filter((v) => progress[v.id]?.isCompleted).length,
    0
  );
  return Math.round((completed / total) * 100);
}

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<VideoProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get<Subject[]>('/subjects'),
      api.get<VideoProgressMap>('/progress').catch(() => ({})),
    ])
      .then(([subjRes, progRes]) => {
        setSubjects(subjRes.data);
        setProgress(progRes.data || {});
      })
      .catch(() => setError('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="text-gray-500">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-700 p-4 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-udemy-dark mb-6">My learning</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length === 0 ? (
          <p className="text-gray-500 col-span-full">No courses yet. Add some in the database.</p>
        ) : (
          subjects.map((subject) => {
            const lectures = totalLectures(subject);
            const hours = totalDurationHours(subject);
            const progressPct = courseProgress(subject, progress);
            return (
              <Link
                key={subject.id}
                href={`/dashboard/subjects/${subject.id}`}
                className="block bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition border border-gray-200"
              >
                <div className="relative aspect-video bg-gray-200">
                  {subject.imageUrl ? (
                    <img
                      src={subject.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-udemy-dark text-white text-sm font-medium">
                      {subject.title.slice(0, 30)}…
                    </div>
                  )}
                  {progressPct > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-300">
                      <div
                        className="h-full bg-udemy-purple"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-udemy-dark line-clamp-2 leading-snug">
                    {subject.title}
                  </h2>
                  {subject.instructorName && (
                    <p className="text-sm text-gray-600 mt-1">
                      {subject.instructorName}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {subject.rating != null && (
                      <span className="text-sm font-medium text-udemy-dark">
                        {subject.rating.toFixed(1)} ★
                      </span>
                    )}
                    {subject.level && (
                      <span className="text-xs text-gray-500">
                        {subject.level}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {lectures} lectures · {hours}h total
                  </p>
                  {progressPct > 0 && (
                    <p className="text-xs text-udemy-purple font-medium mt-1">
                      {progressPct}% complete
                    </p>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
