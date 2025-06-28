interface TimeDisplayProps {
  currentTime: number;
  duration: number;
  className?: string;
}

export function TimeDisplay({ currentTime, duration, className = '' }: TimeDisplayProps) {
  return (
    <div className={`text-sm text-gray-300 font-mono ${className}`}>
      <span>{formatTime(currentTime)}</span>
      <span> / </span>
      <span>{formatTime(duration)}</span>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
