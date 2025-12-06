import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from "@apollo/client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { ChaptersList } from "./ChaptersList";
import { FormActions } from "./FormActions";
import { FormStatus } from "./FormStatus";
import { useCourseForm } from "./useCourseForm";
import { useCourseSubmit } from "./useCourseSubmit";
import { VideoSection, VideoSectionRef } from "./VideoSection";

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
    isValid,
  } = useCourseForm();

  const router = useRouter();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const videoSectionRef = useRef<VideoSectionRef>(null);

  const { handleSubmit, uploadStep } = useCourseSubmit(
    formState,
    isValid,
    setIsSubmitting,
    setError,
    apolloClient,
    videoSectionRef as React.RefObject<{ uploadVideo: () => Promise<unknown> }>
  );

  const handleChapterClick = (timestamp: number) => {
    videoSectionRef.current?.getCurrentTime();
    setCurrentTime(timestamp);
  };

  const handleAddChapter = (title: string) => {
    const timestamp = videoSectionRef.current?.getCurrentTime() || currentTime;
    addChapter(title, timestamp);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <FormStatus
        error={error}
        uploadStep={uploadStep}
        isSubmitting={isSubmitting}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Course Title</label>
          <input
            type="text"
            value={formState.title}
            onChange={(e) => updateField("title", e.target.value)}
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
            onChange={(e) => updateField("description", e.target.value)}
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
              <span className="ml-3 text-sm">{formState.coverImage.name}</span>
            )}
          </div>
        </div>

        <FormActions
          isSubmitting={isSubmitting}
          isPublished={formState.isPublished}
          isValid={isValid}
          onPublishToggle={setPublished}
          onCancel={() => router.back()}
        />
      </form>
    </div>
  );
}
