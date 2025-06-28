import React, { useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useCourseForm } from './useCourseForm';
import { VideoSection, VideoSectionRef } from './VideoSection';
import { ChaptersList } from './ChaptersList';
import { CourseService } from './courseService';
import { ToastService } from '@/services/toastService';

export function CourseForm() {
  const {
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
    isValid
  } = useCourseForm();

  const router = useRouter();
  const apolloClient = useApolloClient();
  const videoSectionRef = useRef<VideoSectionRef>(null);

  const handleChapterClick = (timestamp: number) => {
    videoSectionRef.current?.getCurrentTime();
    setCurrentTime(timestamp);
  };

  const handleAddChapter = (title: string) => {
    const timestamp = videoSectionRef.current?.getCurrentTime() || currentTime;
    addChapter(title, timestamp);
  };

  const [uploadStep, setUploadStep] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) {
      setError('Please fill all required fields');
      ToastService.error('Please fill all required fields');
      return;
    }

    if (!formState.videoFile) {
      setError('Please select a video for the course');
      ToastService.error('Please select a video for the course');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Upload video
      setUploadStep('Uploading video...');
      ToastService.info('Starting video upload');
      let videoMetadata;
      if (videoSectionRef.current) {
        videoMetadata = await videoSectionRef.current.uploadVideo();
        if (!videoMetadata) {
          throw new Error('Video upload failed');
        }
        setUploadStep('Video uploaded successfully');
      } else {
        throw new Error('Video section reference not available');
      }

      // Create course and chapters
      setUploadStep('Creating course...');
      ToastService.info('Creating your course');
      const courseService = new CourseService(apolloClient);
      const result = await courseService.createCourse(formState, videoMetadata);
      
      setUploadStep('Course created successfully!');
      ToastService.success('Course created successfully!');
      
      // Redirect to course page
      setTimeout(() => {
        router.push(`/formateur/mes-formations/${result.courseId}`);
      }, 1500); // Short delay to show success message
    } catch (err) {
      console.error('Error creating course:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the course';
      setError(errorMessage);
      ToastService.error(errorMessage);
      setUploadStep('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-white p-4 rounded mb-6">
          {error}
        </div>
      )}
      
      {uploadStep && (
        <div className="bg-blue-900/50 border border-blue-500 text-white p-4 rounded mb-6">
          <div className="flex items-center">
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-3"></div>
            )}
            <p>{uploadStep}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Course Title
          </label>
          <input
            type="text"
            value={formState.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white"
            placeholder="Enter course title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description (optional)
          </label>
          <textarea
            value={formState.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white min-h-[100px]"
            placeholder="Enter course description"
          />
        </div>

        <VideoSection
          ref={videoSectionRef}
          videoFile={formState.videoFile}
          onVideoChange={setVideoFile}
          currentTime={currentTime}
          onTimeUpdate={setCurrentTime}
          className="mb-6"
        />

        <ChaptersList
          chapters={formState.chapters}
          currentTime={currentTime}
          onAddChapter={handleAddChapter}
          onUpdateChapter={updateChapter}
          onDeleteChapter={deleteChapter}
          onChapterClick={handleChapterClick}
        />

        <div>
          <label className="block text-sm font-medium mb-1">
            Cover Image (optional)
          </label>
          <div className="mt-1 flex items-center">
            <label className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setCoverImage(file);
                }}
                className="hidden"
              />
            </label>
            {formState.coverImage && (
              <span className="ml-3 text-sm">
                {formState.coverImage.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="publish"
              checked={formState.isPublished}
              onChange={(e) => setPublished(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="publish">Publish immediately</label>
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`px-6 py-2 rounded text-white ${
                isSubmitting || !isValid
                  ? 'bg-blue-800 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
