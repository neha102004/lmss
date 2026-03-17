'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import type { Subject } from '@/types/lms';
import type { VideoProgressMap } from '@/types/lms';

export default function SubjectLandingPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;

  useEffect(() => {
    api
      .get<Subject>(`/subjects/${subjectId}`)
      .then((res) => {
        const subject = res.data;
        const firstVideo = subject.sections?.[0]?.videos?.[0];
        if (firstVideo) {
          router.replace(`/dashboard/subjects/${subjectId}/v/${firstVideo.id}`);
        }
      })
      .catch(() => {});
  }, [subjectId, router]);

  return (
    <div className="p-6 flex items-center justify-center min-h-[40vh]">
      <p className="text-gray-500">Redirecting to first video...</p>
    </div>
  );
}
