import { useState, useCallback } from 'react';
import { VideoChapter, CourseFormData } from './types/create-course.types';
import { uploadMedia } from '@/services/mediaService';

export const useCourseForm = (initialData: Partial<CourseFormData> = {}) => {
  const [formData, setFormData] = useState<CourseFormData>({
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

  const updateField = useCallback(<K extends keyof CourseFormData>(
    field: K,
    value: CourseFormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleVideoChange = useCallback((file: File) => {
    updateField('videoFile', file);
  }, [updateField]);

  const handleCoverImageChange = useCallback((file: File) => {
    updateField('coverImage', file);
  }, [updateField]);

  const addChapter = useCallback((title: string, timestamp: number) => {
    const newChapter: VideoChapter = {
      id: Date.now().toString(),
      title,
      timestamp,
    };
    
    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  }, []);

  const updateChapter = useCallback((id: string, title: string) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map(chapter => 
        chapter.id === id ? { ...chapter, title } : chapter
      )
    }));
  }, []);

  const deleteChapter = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter(chapter => chapter.id !== id)
    }));
  }, []);

  const togglePublish = useCallback((isPublished: boolean) => {
    updateField('isPublished', isPublished);
  }, [updateField]);

  const isValid = useCallback(() => {
    return (
      formData.title.trim() !== '' &&
      formData.videoFile !== null
      // Chapters are optional
    );
  }, [formData.title, formData.videoFile]);


  const getVideoId = useCallback(async (file: File | null): Promise<string> => {
    if (!file) return '';
    
    try {
      setIsSubmitting(true);
      setError(null);
      

      const response = await uploadMedia(file);
      
      if (!response || !response.id) {
        throw new Error("Error uploading video");
      }
      
      return response.id;
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while uploading the video');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [setError, setIsSubmitting]);

  return {
    formData,
    currentTime,
    setCurrentTime,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    updateField,
    handleVideoChange,
    handleCoverImageChange,
    addChapter,
    updateChapter,
    deleteChapter,
    togglePublish,
    isValid: isValid(),
    getVideoId,
  };
};
