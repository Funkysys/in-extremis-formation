interface CarouselNavigationProps {
  currentIndex: number;
  totalItems: number;
  onNavigate: (index: number) => void;
}

export function CarouselNavigation({
  currentIndex,
  totalItems,
  onNavigate,
}: CarouselNavigationProps) {
  if (totalItems <= 1) return null;

  const handlePrevious = () => {
    onNavigate((currentIndex - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    onNavigate((currentIndex + 1) % totalItems);
  };

  return (
    <>
      <button
        onClick={handlePrevious}
        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all hover:scale-110"
        style={{
          background: "var(--color-background-secondary)",
          color: "var(--color-foreground)",
        }}
        aria-label="Actualité précédente"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg transition-all hover:scale-110"
        style={{
          background: "var(--color-background-secondary)",
          color: "var(--color-foreground)",
        }}
        aria-label="Actualité suivante"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <div className="flex justify-center gap-2 py-4">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className="h-2 transition-all rounded-full"
            style={{
              width: index === currentIndex ? "2rem" : "0.5rem",
              background:
                index === currentIndex
                  ? "var(--color-primary)"
                  : "var(--color-muted)",
            }}
            aria-label={`Aller à l'actualité ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
