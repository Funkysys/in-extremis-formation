interface SeekButtonProps {
  direction: 'forward' | 'backward';
  seconds: number;
  onClick: (seconds: number) => void;
  className?: string;
}

export function SeekButton({ direction, seconds, onClick, className = '' }: SeekButtonProps) {
  const handleClick = () => {
    const seekAmount = direction === 'forward' ? seconds : -seconds;
    onClick(seekAmount);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 text-white hover:text-gray-300 transition-colors ${className}`}
      aria-label={`${direction === 'forward' ? 'Avancer' : 'Reculer'} de ${seconds} secondes`}
    >
      {direction === 'forward' ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
        </svg>
      )}
    </button>
  );
}
