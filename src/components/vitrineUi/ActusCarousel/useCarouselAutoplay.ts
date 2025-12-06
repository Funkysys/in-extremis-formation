import { useEffect, useState } from "react";

export function useCarouselAutoplay(
  totalItems: number,
  interval: number = 5000
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % totalItems),
      interval
    );
    return () => clearInterval(timer);
  }, [isAutoPlaying, totalItems, interval]);

  const navigate = (newIndex: number) => {
    setCurrentIndex(newIndex);
    setIsAutoPlaying(false);
  };

  return { currentIndex, navigate };
}
