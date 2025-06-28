import { useState, useCallback } from 'react';
import { Chapter, CourseFormState } from '../types';

export function useCourseForm(initialData: Partial<CourseFormState> = {}) {
  const [formState, setFormState] = useState<CourseFormState>({
    title: '',
    description: '',
    videoFile: null,
    coverImage: null,
    chapters: [],
    isPublished: false,
    ...initialData,
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = useCallback(<K extends keyof CourseFormState>(
    field: K,
    value: CourseFormState[K]
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const setVideoFile = useCallback((file: File | null) => {
    updateField('videoFile', file);
  }, [updateField]);

  const setCoverImage = useCallback((file: File | null) => {
    updateField('coverImage', file);
  }, [updateField]);

  const addChapter = useCallback((title: string, timestamp: number) => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title,
      timestamp,
    };
    
    setFormState(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  }, []);

  const updateChapter = useCallback((id: string, title: string) => {
    setFormState(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === id ? { ...chapter, title } : chapter
      )
    }));
  }, []);

  const deleteChapter = useCallback((id: string) => {
    setFormState(prev => ({
      ...prev,
      chapters: prev.chapters.filter(chapter => chapter.id !== id)
    }));
  }, []);

  const setPublished = useCallback((isPublished: boolean) => {
    updateField('isPublished', isPublished);
  }, [updateField]);

  const isValid = Boolean(
    formState.title.trim() && 
    formState.videoFile
  );

  return {
    formState,
    currentTime,
    setCurrentTime,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    updateField,
    setVideoFile,
    setCoverImage,
    addChapter,
    updateChapter,
    deleteChapter,
    setPublished,
    isValid,
  };
}
