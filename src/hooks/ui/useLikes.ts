import { TOGGLE_LIKE_MUTATION } from "@/graphql/mutations/likes";
import { IS_COURSE_LIKED_QUERY } from "@/graphql/queries/likes";
import { logger } from "@/services/logger";
import { ToastService } from "@/services/toastService";
import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";

interface UseLikesProps {
  courseId: string;
  initialLiked?: boolean;
  initialCount?: number;
}

export function useLikes({
  courseId,
  initialLiked = false,
  initialCount = 0,
}: UseLikesProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);

  // Query pour vérifier si le cours est liké
  useQuery(IS_COURSE_LIKED_QUERY, {
    variables: { courseId },
    skip: initialLiked !== undefined,
    onCompleted: (data) => {
      if (data?.isCourseLiked !== undefined) {
        setIsLiked(data.isCourseLiked);
      }
    },
  });

  const [toggleLike, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    onCompleted: (data) => {
      if (data?.toggleLike?.success) {
        setIsLiked(data.toggleLike.isLiked);
        setLikesCount(data.toggleLike.course.likesCount);

        ToastService.success(
          data.toggleLike.isLiked
            ? "❤️ Ajouté aux favoris"
            : "Retiré des favoris"
        );
      }
    },
    onError: (error) => {
      logger.error("Erreur toggle like", error, "useLikes");
      ToastService.error("Erreur lors de la mise à jour");
      // Rollback optimistic update
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
    },
  });

  const handleToggleLike = useCallback(async () => {
    if (loading) return;

    // Optimistic update
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likesCount + 1 : likesCount - 1;

    setIsLiked(newIsLiked);
    setLikesCount(newCount);
    setIsAnimating(true);

    setTimeout(() => setIsAnimating(false), 600);

    try {
      await toggleLike({
        variables: { courseId },
        optimisticResponse: {
          toggleLike: {
            __typename: "ToggleLikeResponse",
            success: true,
            message: newIsLiked ? "Liked" : "Unliked",
            isLiked: newIsLiked,
            course: {
              __typename: "Course",
              id: courseId,
              likesCount: newCount,
              isLikedByUser: newIsLiked,
            },
          },
        },
      });
    } catch {
      // Error handled in onError
    }
  }, [courseId, isLiked, likesCount, loading, toggleLike]);

  return {
    isLiked,
    likesCount,
    isAnimating,
    loading,
    toggleLike: handleToggleLike,
  };
}
