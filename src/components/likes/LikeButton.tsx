"use client";

import { useLikes } from "@/hooks/user";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  courseId: string;
  initialLiked?: boolean;
  initialCount?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function LikeButton({
  courseId,
  initialLiked = false,
  initialCount = 0,
  size = "md",
  showCount = true,
  className = "",
}: LikeButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { isLiked, likesCount, isAnimating, loading, toggleLike } = useLikes({
    courseId,
    initialLiked,
    initialCount,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    toggleLike();
  };

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        inline-flex items-center gap-2 px-3 py-2 rounded-lg
        transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-800
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <svg
        className={`
          ${sizeClasses[size]}
          transition-all duration-300
          ${
            isLiked ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"
          }
          ${isAnimating ? "scale-125" : "scale-100"}
        `}
        viewBox="0 0 24 24"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>

      {showCount && (
        <span
          className={`
            font-medium
            ${textSizeClasses[size]}
            ${isLiked ? "text-red-500" : "text-gray-600 dark:text-gray-400"}
          `}
        >
          {likesCount > 0 ? likesCount : ""}
        </span>
      )}
    </button>
  );
}
