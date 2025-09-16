"use client";
import { CREATE_COURSE_MUTATION } from "@/graphql/mutations/course-mutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import React from "react";
import {
  CourseFormActions,
  CourseFormHeader,
  CourseTitleInput,
  CourseVideoSection,
} from "./";
import { useCourseForm } from "./useCourseForm";

// interface VideoChapter {
//   id: string;
//   title: string;
//   timestamp: number;
// }

export const CreateCourseForm: React.FC = () => {
  const router = useRouter();
  const [createCourse] = useMutation(CREATE_COURSE_MUTATION);

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
    // getVideoId,
  } = useCourseForm();

  // const [isUploading, setIsUploading] = useState(false);

  // videoSectionRef supprimé (sectionRef n'existe plus)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError("Please fill in all required fields");
      return;
    }

    if (!formData.videoFile) {
      setError("Please select a video for the course");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

  const videoId = null;
      if (formData.videoFile) {
        // Bloc d'upload vidéo via videoSectionRef supprimé
      }

      console.log("Creating course with data:", {
        title: formData.title,
        description: formData.description || "",
        price: 0,
      });

      const { data } = await createCourse({
        variables: {
          title: formData.title,
          description: formData.description || "",
          price: 0, // Default price set to 0 for now
        },
      });

      if (data?.createCourse?.course?.id) {
        const courseId = data.createCourse.course.id;
        console.log("Course created successfully. ID:", courseId);

        if (formData.chapters.length > 0) {
          try {
            // const token = localStorage.getItem("token");

            // Si on a une vidéo mais pas de chapitre, on crée un chapitre par défaut
            const chaptersToCreate =
              formData.chapters.length > 0
                ? formData.chapters
                : [{ title: "Introduction", description: "" }];

            // Utilisation du client Apollo pour la mutation
            // const [createChapter] = useMutation(CREATE_CHAPTER_MUTATION);

            for (let i = 0; i < chaptersToCreate.length; i++) {
              const chapter = chaptersToCreate[i];
              const order = i;
              const chapterVideoId = i === 0 ? videoId : null; // Associate video only with the first chapter

              console.log("Creating chapter with data:", {
                title: chapter.title,
                order,
                courseId,
                videoId: chapterVideoId,
              });

              // try {
              //   const { data } = await createChapter({
              //     variables: {
              //       title: chapter.title,
              //       order: order,
              //       courseId: courseId,
              //       videoId: chapterVideoId,
              //     },
              //   });

              //   console.log("Chapter created successfully:", data);
              // } catch (error) {
              //   console.error("Error creating chapter:", error);
              //   throw new Error("Chapter creation failed");
              // }
            }

            console.log("All chapters created successfully");
          } catch (chapterError) {
            console.error("Error creating chapters:", chapterError);
          }
        }

        router.push(`/formateur/mes-cours/${courseId}`);
      } else {
        setError(data?.createCourse?.error || "Error creating course");
      }
    } catch (err) {
      console.error("Error creating course:", err);
      setError("An error occurred while creating the course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-300">
      <CourseFormHeader title="Create a new course" error={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
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
