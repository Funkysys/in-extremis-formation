import React, { useState, useCallback, forwardRef, useImperativeHandle, useContext } from 'react';
import { useApolloClient } from '@apollo/client';
import { VideoMetadata } from '../types';
import { MediaCMSService } from '@/services/mediaCMSService';
import { ToastService } from '@/services/toastService';
import { useAuth } from '@/providers/AuthProvider';
import { GET_UPLOAD_TOKEN_MUTATION } from '@/graphql/mutations/video-mutations';

interface VideoUploaderProps {
  videoFile: File | null;
  className?: string;
  onUploadComplete?: (metadata: VideoMetadata) => void;
}

export interface VideoUploaderRef {
  upload: () => Promise<VideoMetadata | undefined>;
}

export const VideoUploader = forwardRef<VideoUploaderRef, VideoUploaderProps>(
  ({ videoFile, className, onUploadComplete }, ref) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const apolloClient = useApolloClient();
    const mediaCMSService = new MediaCMSService(apolloClient);
    const { user, token } = useAuth();

    const upload = useCallback(async (): Promise<VideoMetadata | undefined> => {
      if (!videoFile) {
        console.error('Aucun fichier vidéo sélectionné');
        ToastService.error('Veuillez sélectionner une vidéo');
        return undefined;
      }

      if (isUploading) {
        console.log('Un téléversement est déjà en cours');
        ToastService.info('Un téléversement est déjà en cours');
        return undefined;
      }

      setIsUploading(true);
      setProgress(0);

      try {
        console.log('Début du processus d\'upload via le proxy Next.js');
        
        // Utilisation directe de la méthode uploadVideo qui gère déjà le token et l'upload
        const result = await mediaCMSService.uploadVideo(
          videoFile,
          videoFile.name.replace(/\.[^/.]+$/, ''),
          '',
          (progress) => setProgress(progress)
        );

        // Vérifier si l'upload a réussi
        if (!result || !result.id) {
          throw new Error('Échec de l\'upload de la vidéo');
        }


        const metadata: VideoMetadata = {
          id: result.id,
          title: result.title || videoFile.name,
          url: result.url || '',
          thumbnailUrl: result.thumbnailUrl,
          duration: result.duration || 0
        };

        console.log('Téléversement réussi', metadata);
        ToastService.success('Vidéo téléversée avec succès');
        onUploadComplete?.(metadata);

        return metadata;
      } catch (error) {
        console.error('Échec du téléversement:', error);
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
        ToastService.error(`Échec du téléversement: ${errorMessage}`);
        return undefined;
      } finally {
        setIsUploading(false);
      }
    }, [videoFile, isUploading, mediaCMSService, onUploadComplete]);

    useImperativeHandle(ref, () => ({
      upload
    }), [upload]);

    return (
      <div className={className}>
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Progression: {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    );
  }
);
