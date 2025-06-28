import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useToast } from '@/providers/ToastProvider';
import { MediaCMSVideoUploader, VideoMetadata } from './MediaCMSVideoUploader';

export interface VideoPlayerMethods {
  play: () => Promise<void>;
  getCurrentTime: () => number;
}

interface CourseVideoUploadProps {
  videoFile: File | null;
  onVideoChange: (file: File) => void;
  onVideoUploaded?: () => void;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  className?: string;
  uploaderRef?: React.RefObject<{
    startUpload: () => Promise<VideoMetadata | undefined>;
  } | null>;
}

export const CourseVideoUpload = forwardRef<VideoPlayerMethods, CourseVideoUploadProps>(({
  videoFile,
  onVideoChange,
  onVideoUploaded,
  currentTime,
  onTimeUpdate,
  className = '',
  uploaderRef
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const { showToast } = useToast();


  useEffect(() => {
    console.log('[CourseVideoUpload] useEffect videoFile change:', videoFile?.name);
    if (videoFile) {
      console.log('[CourseVideoUpload] Creating URL for video');
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(prevUrl => {
        if (prevUrl) {
          console.log('[CourseVideoUpload] Revoking previous URL');
          URL.revokeObjectURL(prevUrl);
        }
        return url;
      });
      
      return () => {
        console.log('[CourseVideoUpload] Cleaning up URL');
        URL.revokeObjectURL(url);
      };
    } else {
      console.log('[CourseVideoUpload] No video file, URL cleared');
      setVideoUrl('');
    }
  }, [videoFile]);


  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }, [isDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  }, []);

  const validateAndSetFile = (file: File) => {
    console.log('[CourseVideoUpload] validateAndSetFile called with file:', file.name);
    

    if (!file.type.startsWith('video/')) {
      console.log('[CourseVideoUpload] Invalid file type:', file.type);
      showToast('Please select a valid video file', 'error');
      return;
    }
    

    if (file.size > 1024 * 1024 * 1024) {
      console.log('[CourseVideoUpload] File too large:', file.size);
      showToast('Video must not exceed 1 GB', 'error');
      return;
    }
    
    console.log('[CourseVideoUpload] Valid video file, calling onVideoChange');
    // Sélectionner le fichier sans déclencher l'upload immédiatement
    // L'upload se fera uniquement lors de l'enregistrement du formulaire
    onVideoChange(file);
    showToast('Video selected. Upload will occur when saving.', 'info');
    
    console.log('[CourseVideoUpload] IMPORTANT: No upload triggered here, only file selection');
    // Important: Ne pas déclencher l'upload ici
  };


  useImperativeHandle(ref, () => ({
    play: async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error('[CourseVideoUpload] Erreur lors de la lecture:', error);
          showToast('Impossible de lire la vidéo', 'error');
        }
      }
    },
    getCurrentTime: () => {
      console.log('[CourseVideoUpload] getCurrentTime appelé - AUCUN UPLOAD ne doit être déclenché');
      // Vérifier la stack trace pour déterminer si l'appel vient de handleAddChapter
      const stackTrace = new Error().stack || '';
      const isCalledFromAddChapter = stackTrace.includes('handleAddChapter');
      
      if (isCalledFromAddChapter) {
        console.log('[CourseVideoUpload] Appel depuis handleAddChapter détecté - AUCUN UPLOAD ne sera déclenché');
      }
      
      const time = videoRef.current?.currentTime || 0;
      console.log('[CourseVideoUpload] Temps actuel:', time);
      return time;
    }
  }));
  

  // pour éviter tout déclenchement automatique d'upload

  // Mettre à jour la position de lecture si elle change depuis l'extérieur
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.1) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (e.currentTarget) {
      onTimeUpdate(e.currentTarget.currentTime);
    }
  }, [onTimeUpdate]);

  if (videoFile && videoUrl) {
    return (
      <div 
        className={`relative bg-black rounded-lg overflow-hidden ${className}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain bg-black"
          controls
          onTimeUpdate={handleTimeUpdate}
          onClick={(e) => e.stopPropagation()}
        />
        
        {/* Bouton pour remplacer la vidéo en haut à droite */}
        <div 
          className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-2 cursor-pointer hover:bg-opacity-90 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          title="Replace video"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
        
        {/* Zone de dépôt pour le glisser-déposer */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            opacity: isDragging ? 1 : 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            transition: 'opacity 0.2s ease-in-out',
          }}
        >
          <div className="text-white text-center p-4">
            <p className="text-lg font-medium">Drop video here</p>
            <p className="text-sm text-gray-300">to replace current video</p>
          </div>
        </div>
        
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
        />
      </div>
    );
  }


  return (
    <div className={className}>

      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 hover:border-blue-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
        />
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              <span className="text-blue-400 hover:text-blue-300">Upload a video</span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              MP4, WebM ou MOV (max. 100MB)
            </p>
          </div>
        </div>
      </div>
      

      <div style={{ display: 'none' }}>
        <MediaCMSVideoUploader
          onUploadComplete={(videoData) => {
            console.log('[CourseVideoUpload] Upload complete with data:', videoData);
            if (onVideoUploaded) onVideoUploaded();
          }}
          uploaderRef={uploaderRef}
          videoFile={videoFile}
          className="hidden"
        />
      </div>
    </div>
  );
});

CourseVideoUpload.displayName = 'CourseVideoUpload';

export default CourseVideoUpload;
