'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import VideoPlayer from '@/components/VideoPlayer';
import type { Video } from '@/types/lms';

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const videoId = params.videoId as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [progress, setProgress] = useState<{ lastPosition: number; isCompleted: boolean }>({
    lastPosition: 0,
    isCompleted: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadVideo = useCallback(() => {
    return api.get<Video>(`/videos/${videoId}`).then((res) => res.data);
  }, [videoId]);

  const loadProgress = useCallback(() => {
    return api
      .get<{ lastPosition: number; isCompleted: boolean }>(`/progress/${videoId}`)
      .then((res) => res.data);
  }, [videoId]);

  useEffect(() => {
    Promise.all([loadVideo(), loadProgress()])
      .then(([v, p]) => {
        setVideo(v);
        setProgress(p);
      })
      .catch(() => setError('Failed to load video'))
      .finally(() => setLoading(false));
  }, [loadVideo, loadProgress]);

  const handleCompleted = useCallback(() => {
    setProgress((prev) => ({ ...prev, isCompleted: true }));
    // Notify layout to refetch progress so sidebar updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lms:progress-updated'));
    }
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[40vh]">
        <span className="text-gray-500">Loading video...</span>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded">{error || 'Video not found'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-semibold text-udemy-dark mb-4">{video.title}</h1>
      <VideoPlayer
        video={video}
        initialPosition={progress.lastPosition}
        initialCompleted={progress.isCompleted}
        onCompleted={handleCompleted}
      />
    </div>
  );
}
