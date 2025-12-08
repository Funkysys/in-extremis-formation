"use client";

import { useShare } from "@/hooks/utils";

interface ShareButtonProps {
  courseId: string;
  courseTitle: string;
  courseDescription?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

export default function ShareButton({
  courseId,
  courseTitle,
  courseDescription,
  size = "md",
  className = "",
}: ShareButtonProps) {
  const { share, isSharing, canShare } = useShare();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/formation/${courseId}`;

    await share({
      title: courseTitle,
      text: courseDescription || `Découvrez cette formation : ${courseTitle}`,
      url,
    });
  };

  const iconSize = iconSizes[size];

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        bg-white/80 backdrop-blur-sm
        hover:bg-white
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isSharing ? "scale-95" : "hover:scale-110"}
        ${className}
      `}
      title={canShare ? "Partager" : "Copier le lien"}
      aria-label={canShare ? "Partager cette formation" : "Copier le lien"}
    >
      {isSharing ? (
        <svg
          className="animate-spin"
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
        </svg>
      ) : (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {canShare ? (
            // Icône Share (mobile)
            <>
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </>
          ) : (
            // Icône Link (desktop)
            <>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </>
          )}
        </svg>
      )}
    </button>
  );
}
