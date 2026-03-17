export type Video = {
  id: string;
  sectionId: string;
  title: string;
  youtubeUrl: string;
  duration: number;
  section?: Section;
};

export type Section = {
  id: string;
  subjectId: string;
  title: string;
  videos: Video[];
};

export type Subject = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  instructorName?: string | null;
  level?: string | null;
  rating?: number | null;
  sections: Section[];
};

export type VideoProgressMap = Record<
  string,
  { lastPosition: number; isCompleted: boolean }
>;
