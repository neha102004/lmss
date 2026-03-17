'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import api from '@/lib/api';
import type { Video } from '@/types/lms';

const TRACK_INTERVAL_MS = 5000; // Save progress every 5 seconds
const COMPLETE_THRESHOLD = 0.95; // Consider complete when 95% watched

type Props = {
  video: Video;
  initialPosition: number;
  initialCompleted: boolean;
  onCompleted: () => void;
};

function getYoutubeId(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  const beMatch = trimmed.match(/youtu\.be\/([^/?&]+)/);
  if (beMatch) return beMatch[1];
  const vMatch = trimmed.match(/[?&]v=([^&]+)/);
  return vMatch ? vMatch[1] : trimmed;
}

export default function VideoPlayer({
  video,
  initialPosition,
  initialCompleted,
  onCompleted,
}: Props) {
  const [ready, setReady] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playerRef = useRef<YT.Player | null>(null);

  const saveProgress = useCallback(
    async (currentTime: number, isCompleted: boolean) => {
      try {
        await api.post('/progress', {
          videoId: video.id,
          lastPosition: currentTime,
          isCompleted,
        });
      } catch (e) {
        console.error('Failed to save progress', e);
      }
    },
    [video.id]
  );

  const handleReady = useCallback(
    (e: YouTubeEvent<YT.Player>) => {
      playerRef.current = e.target;
      if (initialPosition > 0 && !initialCompleted) {
        e.target.seekTo(initialPosition, true);
      }
      setReady(true);
    },
    [initialPosition, initialCompleted]
  );

  useEffect(() => {
    if (!ready || !playerRef.current) return;

    intervalRef.current = setInterval(async () => {
      const player = playerRef.current;
      if (!player || typeof player.getCurrentTime !== 'function') return;
      const currentTime = player.getCurrentTime();
      const duration = video.duration || 1;
      const isComplete =
        duration > 0 && currentTime / duration >= COMPLETE_THRESHOLD;
      await saveProgress(currentTime, isComplete);
      if (isComplete) onCompleted();
    }, TRACK_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ready, video.duration, saveProgress, onCompleted]);

  const handleStateChange = useCallback(
    (e: YouTubeEvent<YT.Player>) => {
      if (e.data === 0) {
        saveProgress(video.duration || 0, true);
        onCompleted();
      }
    },
    [video.duration, saveProgress, onCompleted]
  );

  const opts: import('react-youtube').YouTubeProps['opts'] = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 0,
      start: Math.floor(initialPosition),
    },
  };

  const videoId = getYoutubeId(video.youtubeUrl);
  if (!videoId) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center text-white">
        Invalid YouTube URL
      </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
        className="w-full h-full"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}
