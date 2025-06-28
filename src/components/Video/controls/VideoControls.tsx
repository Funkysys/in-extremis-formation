import { VideoControlsProps } from '../types';
import { PlayPauseButton } from './PlayPauseButton';
import { SeekButton } from './SeekButton';
import { ProgressBar } from './ProgressBar';
import { TimeDisplay } from './TimeDisplay';

export function VideoControls({
  isPlaying,
  currentTime,
  duration,
  chapters = [],
  onPlayPause,
  onSeek,
  onForward,
  onBackward,
  onAddChapter,
  onChapterClick,
}: VideoControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
      <div className="mb-3">
        <ProgressBar 
          currentTime={currentTime}
          duration={duration}
          chapters={chapters}
          onSeek={onSeek}
          onChapterClick={onChapterClick}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <PlayPauseButton 
            isPlaying={isPlaying} 
            onToggle={onPlayPause} 
          />
          
          <SeekButton 
            direction="backward" 
            seconds={15} 
            onClick={onBackward} 
          />
          
          <SeekButton 
            direction="forward" 
            seconds={15} 
            onClick={onForward} 
          />
          
          <TimeDisplay 
            currentTime={currentTime} 
            duration={duration} 
          />
        </div>
        
        {onAddChapter && (
          <button 
            onClick={onAddChapter}
            className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            title="Ajouter un chapitre"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Chapitre
          </button>
        )}
      </div>
    </div>
  );
}
