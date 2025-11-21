// Hook pour gérer l'effet de fade out au scroll

import { useEffect, useState } from "react";

export function useFadeOutScroll() {
  const [fadeOut, setFadeOut] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const sectionHeight = window.innerHeight;

      if (scrollY < sectionHeight) {
        setFadeOut(1 - scrollY / (sectionHeight / 3));
      } else if (scrollY >= sectionHeight / 3) {
        setFadeOut(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return fadeOut;
}
