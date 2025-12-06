"use client";
import React from "react";
import {
  CourseFormActions,
  CourseFormHeader,
  CourseTitleInput,
  CourseVideoSection,
} from "./";
import { useCreateCourse } from "./CreateCourseForm/useCreateCourse";
import { useCourseForm } from "./useCourseForm";

export const CreateCourseForm: React.FC = () => {
  const {
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
    isValid,
  } = useCourseForm();

  const { handleSubmit } = useCreateCourse(
    formData,
    isValid,
    setIsSubmitting,
    setError
  );

  const onSubmit = async (e: React.FormEvent) => {
    const videoId = null;
    await handleSubmit(e, videoId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-300">
      <CourseFormHeader title="Create a new course" error={error} />

      <form onSubmit={onSubmit} className="space-y-6">
        <CourseTitleInput
          value={formData.title}
          onChange={(value) => updateField("title", value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full p-2 border rounded bg-gray-700 text-white min-h-[100px]"
          />
        </div>

        <CourseVideoSection
          videoFile={formData.videoFile}
          onVideoChange={handleVideoChange}
          currentTime={currentTime}
          onTimeUpdate={setCurrentTime}
          chapters={formData.chapters}
          onAddChapter={addChapter}
          onUpdateChapter={updateChapter}
          onDeleteChapter={deleteChapter}
          className="mb-6"
          // sectionRef supprimé
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Cover image (optional)
          </label>
          <div className="mt-1 flex items-center">
            <label className="cursor-pointer bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
              Choose an image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleCoverImageChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>
            {formData.coverImage && (
              <span className="ml-3 text-sm text-gray-300">
                {formData.coverImage.name}
              </span>
            )}
          </div>
        </div>

        <CourseFormActions
          isSubmitting={isSubmitting}
          isPublished={formData.isPublished}
          onPublishToggle={togglePublish}
          isValid={isValid}
        />
      </form>
    </div>
  );
};
