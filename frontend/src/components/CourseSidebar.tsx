'use client';

import Link from 'next/link';
import type { Subject, VideoProgressMap } from '@/types/lms';

type Props = {
  subject: Subject;
  progress: VideoProgressMap;
  currentVideoId: string | null;
  subjectId: string;
};

/**
 * Returns ordered list of video ids (first in each section, then second, etc. by section order)
 */
function orderedVideoIds(subject: Subject): string[] {
  const ids: string[] = [];
  for (const section of subject.sections) {
    for (const v of section.videos) ids.push(v.id);
  }
  return ids;
}

function isUnlocked(
  videoId: string,
  progress: VideoProgressMap,
  orderedIds: string[]
): boolean {
  const idx = orderedIds.indexOf(videoId);
  if (idx <= 0) return true;
  const prevId = orderedIds[idx - 1];
  return progress[prevId]?.isCompleted ?? false;
}

export default function CourseSidebar({
  subject,
  progress,
  currentVideoId,
  subjectId,
}: Props) {
  const orderedIds = orderedVideoIds(subject);

  return (
    <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-3 border-b border-gray-200">
        <h2 className="font-semibold text-udemy-dark truncate">{subject.title}</h2>
      </div>
      <div className="py-2">
        {subject.sections.map((section) => (
          <div key={section.id} className="mb-2">
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {section.title}
            </div>
            <ul>
              {section.videos.map((video) => {
                const unlocked = isUnlocked(video.id, progress, orderedIds);
                const completed = progress[video.id]?.isCompleted ?? false;
                const isActive = currentVideoId === video.id;

                return (
                  <li key={video.id}>
                    <Link
                      href={unlocked ? `/dashboard/subjects/${subjectId}/v/${video.id}` : '#'}
                      className={`flex items-center gap-2 px-3 py-2 text-sm border-l-2 transition ${
                        !unlocked
                          ? 'cursor-not-allowed text-gray-400 border-transparent'
                          : isActive
                            ? 'bg-purple-50 text-udemy-purple border-udemy-purple font-medium'
                            : 'border-transparent hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={(e) => !unlocked && e.preventDefault()}
                    >
                      {completed ? (
                        <span className="text-green-600" title="Completed">
                          ✓
                        </span>
                      ) : !unlocked ? (
                        <span className="text-gray-400">🔒</span>
                      ) : null}
                      <span className="truncate">{video.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
