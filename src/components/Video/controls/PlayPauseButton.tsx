interface PlayPauseButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  className?: string;
}

export function PlayPauseButton({ isPlaying, onToggle, className = '' }: PlayPauseButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`p-2 text-white hover:text-gray-300 transition-colors ${className}`}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
