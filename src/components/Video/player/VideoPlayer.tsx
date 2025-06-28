import { useCallback, useRef } from 'react';
import { VideoPlayerProps } from '../types';
import { VideoControls } from '../controls/VideoControls';

export function VideoPlayer({
  src,
  currentTime,
  duration,
  isPlaying,
  chapters = [],
  onTimeUpdate,
  onPlay,
  onPause,
  onSeek,
  onChapterSelect,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    onTimeUpdate(e.currentTarget.currentTime);
  }, [onTimeUpdate]);

  const handlePlay = useCallback(() => {
    videoRef.current?.play().then(() => onPlay());
  }, [onPlay]);

  const handlePause = useCallback(() => {
    videoRef.current?.pause();
    onPause();
  }, [onPause]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePlay, handlePause]);

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      onSeek(time);
    }
  }, [onSeek]);

  const handleForward = useCallback((seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.min(videoRef.current.currentTime + seconds, duration);
      handleSeek(newTime);
    }
  }, [duration, handleSeek]);

  const handleBackward = useCallback((seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, videoRef.current.currentTime - seconds);
      handleSeek(newTime);
    }
  }, [handleSeek]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={(e) => onSeek(e.currentTarget.currentTime)}
      />
      
      <VideoControls
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        chapters={chapters}
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        onForward={handleForward}
        onBackward={handleBackward}
        onAddChapter={() => {
          // Gérer l'ajout de chapitre
        }}
        onChapterClick={(chapter) => {
          handleSeek(chapter.timestamp);
          onChapterSelect?.(chapter);
        }}
      />
    </div>
  );
}
