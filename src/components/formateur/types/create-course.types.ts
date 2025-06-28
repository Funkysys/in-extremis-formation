export interface VideoChapter {
  id: string;
  title: string;
  timestamp: number;
}

export interface CourseFormData {
  title: string;
  description: string;
  videoFile: File | null;
  coverImage: File | null;
  chapters: VideoChapter[];
  isPublished: boolean;
}

export interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: Omit<CourseFormData, 'videoFile' | 'coverImage'>) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}
