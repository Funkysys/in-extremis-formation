import { useMutation } from "@apollo/client";
import { 
  CREATE_COURSE_MUTATION,
  CREATE_CHAPTER_MUTATION 
} from "@/graphql/mutations/course-mutations";
import { useRouter } from "next/navigation";
import { VideoChapter } from "@/types/course";

export const useCourseMutation = () => {
  const router = useRouter();
  
  const [createCourseMutation, { loading: creatingCourse, error: courseError }] = useMutation(CREATE_COURSE_MUTATION);
  const [createChapterMutation, { loading: creatingChapter, error: chapterError }] = useMutation(CREATE_CHAPTER_MUTATION);

  const createCourse = async (options: {
    variables: {
      title: string;
      description: string;
      price: number;
      imageId?: string | null;
    };
    context?: {
      chapters?: VideoChapter[];
    };
  }) => {
    try {
      // 1. Création du cours
      const { data } = await createCourseMutation({
        variables: options.variables,
      });

      const course = data?.createCourse?.course;
      if (!course?.id) {
        throw new Error(data?.createCourse?.error || 'Erreur lors de la création du cours');
      }

      // 2. Ajout des chapitres si présents dans le contexte
      const chapters = options.context?.chapters;
      if (chapters && chapters.length > 0) {
        await Promise.all(
          chapters.map((chapter, index) =>
            createChapterMutation({
              variables: {
                title: chapter.title,
                description: chapter.description || null,
                order: index + 1,
                courseId: course.id,
              },
            })
          )
        );
      }

      // 3. Redirection vers la liste des cours
      router.push("/formateur/mes-cours");
      return { data: { createCourse: { course } } };
    } catch (error) {
      console.error("Erreur lors de la création du cours:", error);
      throw error;
    }
  };

  return {
    createCourse,
    loading: creatingCourse || creatingChapter,
    error: courseError || chapterError,
  };
};
