export interface VideoChapter {
  id: string;
  title: string;
  timestamp: number;
  description?: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  price: string;
  published: boolean;
  coverImage: File | null;
  videoFile: File | null;
  videoId: string | null;
  videoUrl: string | null;
  videoDuration: number;
  chapters: VideoChapter[];
}

export interface VideoUploadState {
  file: File | null;
  id: string | null;
  url: string | null;
  duration: number;
  uploading: boolean;
  progress: number;
  error: string | null;
}
