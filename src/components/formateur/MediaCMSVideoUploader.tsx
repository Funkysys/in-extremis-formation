import React, { useState, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { useToast } from '@/providers/ToastProvider';
import { MediaCMSService } from '@/services/mediaCMSService';


export interface VideoMetadata {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration: number;
}


interface MediaCMSVideoUploaderProps {
  onUploadComplete: (videoData: VideoMetadata) => void;
  className?: string;
  videoFile?: File | null;
  uploaderRef?: React.RefObject<{ startUpload: () => Promise<VideoMetadata | undefined> } | null>;
}


export const MediaCMSVideoUploader = React.forwardRef<
  { startUpload: () => Promise<VideoMetadata | undefined> },
  MediaCMSVideoUploaderProps
>(({ onUploadComplete, className = '', videoFile }, ref) => {

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLock, setUploadLock] = useState(false);
  

  const { showToast } = useToast();
  const apolloClient = useApolloClient();
  const mediaCMSService = new MediaCMSService(apolloClient);


  const startUpload = useCallback(async (): Promise<VideoMetadata | undefined> => {
    console.log('MediaCMSVideoUploader: startUpload called');
    

    if (!videoFile) {
      showToast('No video file selected', 'error');
      return undefined;
    }
    

    if (uploadLock || isUploading) {
      console.log('MediaCMSVideoUploader: Upload already in progress');
      return undefined;
    }
    

    setUploadLock(true);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      console.log('MediaCMSVideoUploader: Starting upload to MediaCMS');
      

      const result = await mediaCMSService.uploadVideo(
        videoFile,
        videoFile.name.replace(/\.[^/.]+$/, ''),
        '',
        (progress) => setUploadProgress(progress)
      );


      const videoMetadata: VideoMetadata = {
        id: result.id,
        title: result.title,
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        duration: result.duration || 0
      };


      onUploadComplete(videoMetadata);
      showToast('Video uploaded successfully', 'success');
      console.log('MediaCMSVideoUploader: Upload completed successfully', videoMetadata);

      return videoMetadata;
    } catch (err) {
      console.error('MediaCMSVideoUploader: Upload error:', err);
      showToast('Video upload failed', 'error');
      return undefined;
    } finally {

      setUploadLock(false);
      setIsUploading(false);
    }
  }, [videoFile, uploadLock, isUploading, mediaCMSService, showToast, onUploadComplete]);
  

  React.useImperativeHandle(ref, () => ({
    startUpload
  }), [startUpload]);


  return (
    <div className={className}>
      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Upload in progress... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}
    </div>
  );
});
