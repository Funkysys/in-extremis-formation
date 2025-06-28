export interface Chapter {
  id: string;
  title: string;
  timestamp: number;
}

export interface VideoMetadata {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration: number;
}

export interface CourseFormState {
  title: string;
  description: string;
  videoFile: File | null;
  coverImage: File | null;
  chapters: Chapter[];
  isPublished: boolean;
}

export interface CourseCreationResult {
  courseId: string;
  videoId?: string;
  chapters: { id: string; title: string }[];
}
