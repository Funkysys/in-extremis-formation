import { useState, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { MediaCMSService } from '@/services/mediaCMSService';
import { useToast } from '@/providers/ToastProvider';
import { apolloClient } from '@/lib/apollo-client';

interface UseMediaCMSVideoUploadOptions {
  onSuccess?: (video: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
  maxSizeMB?: number;
}

export const useMediaCMSVideoUpload = (options: UseMediaCMSVideoUploadOptions = {}) => {
  const { onSuccess, onError, onProgress, maxSizeMB = 500 } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showToast } = useToast();
  
  // Initialiser le service MediaCMS
  const mediaCMSService = new MediaCMSService(apolloClient);

  const uploadVideo = useCallback(async (file: File, title: string, description: string = '', authToken: string) => {
    if (!file) {
      const error = new Error('Aucun fichier sélectionné');
      showToast(error.message, 'error');
      throw error;
    }

    // Validation du fichier
    if (!file.type.startsWith('video/')) {
      const error = new Error('Le fichier doit être une vidéo');
      showToast(error.message, 'error');
      onError?.(error);
      throw error;
    }

    const maxSize = maxSizeMB * 1024 * 1024; // Convertir en octets
    if (file.size > maxSize) {
      const error = new Error(`Le fichier est trop volumineux (max ${maxSizeMB}MB)`);
      showToast(error.message, 'error');
      onError?.(error);
      throw error;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const handleProgress = (progress: number) => {
        setUploadProgress(progress);
        onProgress?.(progress);
      };

      const result = await mediaCMSService.uploadVideoDirect(
        file,
        title,
        description,
        authToken,
        handleProgress
      );

      showToast('Vidéo téléversée avec succès vers MediaCMS', 'success');
      onSuccess?.(result);
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'upload vers MediaCMS:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      showToast(`Échec de l'upload: ${errorMessage}`, 'error');
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      throw error;
    } finally {
      setIsUploading(false);
      // Réinitialiser la progression après un court délai
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [maxSizeMB, onError, onSuccess, onProgress, showToast]);

  return {
    uploadVideo,
    isUploading,
    uploadProgress,
    reset: () => setUploadProgress(0),
  };
};

export type MediaCMSVideoUploadProps = ReturnType<typeof useMediaCMSVideoUpload>;
