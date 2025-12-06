import { ToastService } from "@/services/toastService";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CourseFormState } from "../types";
import { CourseService } from "./courseService";

export function useCourseSubmit(
  formState: CourseFormState,
  isValid: boolean,
  setIsSubmitting: (value: boolean) => void,
  setError: (error: string | null) => void,
  apolloClient: ApolloClient<NormalizedCacheObject>,
  videoSectionRef: React.RefObject<{ uploadVideo: () => Promise<unknown> }>
) {
  const router = useRouter();
  const [uploadStep, setUploadStep] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError("Please fill all required fields");
      ToastService.error("Please fill all required fields");
      return;
    }

    if (!formState.videoFile) {
      setError("Please select a video for the course");
      ToastService.error("Please select a video for the course");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      setUploadStep("Uploading video...");
      ToastService.info("Starting video upload");
      type VideoMetadata = {
        id: string;
        title: string;
        url: string;
        duration: number;
      };

      let videoMetadata: VideoMetadata | null = null;
      if (videoSectionRef.current) {
        videoMetadata =
          (await videoSectionRef.current.uploadVideo()) as VideoMetadata;
        if (
          !videoMetadata ||
          typeof videoMetadata.id !== "string" ||
          typeof videoMetadata.title !== "string" ||
          typeof videoMetadata.url !== "string" ||
          typeof videoMetadata.duration !== "number"
        ) {
          throw new Error("Video upload failed or returned invalid metadata");
        }
        setUploadStep("Video uploaded successfully");
      } else {
        throw new Error("Video section reference not available");
      }

      setUploadStep("Creating course...");
      ToastService.info("Creating your course");
      const courseService = new CourseService(apolloClient);
      const result = await courseService.createCourse(formState, videoMetadata);

      setUploadStep("Course created successfully!");
      ToastService.success("Course created successfully!");

      setTimeout(() => {
        router.push(`/formateur/mes-formations/${result.courseId}`);
      }, 1500);
    } catch (err) {
      console.error("Error creating course:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while creating the course";
      setError(errorMessage);
      ToastService.error(errorMessage);
      setUploadStep("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    uploadStep,
  };
}
