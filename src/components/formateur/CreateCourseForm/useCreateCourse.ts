import { CREATE_COURSE_MUTATION } from "@/graphql/mutations/course-mutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { CourseFormData } from "../types/create-course.types";

export function useCreateCourse(
  formData: CourseFormData,
  isValid: boolean,
  setIsSubmitting: (value: boolean) => void,
  setError: (error: string | null) => void
) {
  const router = useRouter();
  const [createCourse] = useMutation(CREATE_COURSE_MUTATION);

  const handleSubmit = async (e: React.FormEvent, videoId: string | null) => {
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

      console.log("Creating course with data:", {
        title: formData.title,
        description: formData.description || "",
        price: 0,
      });

      const { data } = await createCourse({
        variables: {
          title: formData.title,
          description: formData.description || "",
          price: 0,
        },
      });

      if (data?.createCourse?.course?.id) {
        const courseId = data.createCourse.course.id;
        console.log("Course created successfully. ID:", courseId);

        if (formData.chapters.length > 0) {
          await createChapters(
            courseId,
            formData.chapters.map((chapter) => ({
              title: chapter.title,
              timestamp: chapter.timestamp,
            })),
            videoId
          );
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

  return { handleSubmit };
}

async function createChapters(
  courseId: string,
  chapters: Array<{ title: string; timestamp: number }>,
  videoId: string | null
) {
  const chaptersToCreate =
    chapters.length > 0 ? chapters : [{ title: "Introduction", timestamp: 0 }];

  for (let i = 0; i < chaptersToCreate.length; i++) {
    const chapter = chaptersToCreate[i];
    const order = i;
    const chapterVideoId = i === 0 ? videoId : null;

    console.log("Creating chapter with data:", {
      title: chapter.title,
      timestamp: chapter.timestamp,
      order,
      courseId,
      videoId: chapterVideoId,
    });
  }
}
