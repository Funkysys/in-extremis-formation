import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { UPLOAD_VIDEO_MUTATION } from '@/graphql/mutations/upload-mutations';
import { useToast } from '@/providers/ToastProvider';

interface UseVideoUploadOptions {
  onSuccess?: (video: any) => void;
  onError?: (error: Error) => void;
  maxSizeMB?: number;
}

export const useVideoUpload = (options: UseVideoUploadOptions = {}) => {
  const { onSuccess, onError, maxSizeMB = 100 } = options;
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadVideo] = useMutation(UPLOAD_VIDEO_MUTATION);
  const { showToast } = useToast();

  const upload = useCallback(async (file: File) => {
    if (!file) return;

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
      // Simulation de progression (à remplacer par une vraie implémentation si disponible)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + Math.random() * 10;
          return next > 90 ? 90 : next; // Ne pas dépasser 90% avant la fin
        });
      }, 200);

      const { data } = await uploadVideo({
        variables: {
          file,
          title: file.name,
          // La description n'est pas encore supportée par le serveur
          // description,
        },
        context: {
          headers: {
            'apollo-require-preflight': 'true',
          },
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (data?.uploadVideo?.error) {
        throw new Error(data.uploadVideo.error);
      }

      const video = data.uploadVideo.video;
      showToast('Vidéo téléversée avec succès', 'success');
      onSuccess?.(video);
      
      return video;
    } catch (error) {
      console.error('Erreur lors de l\'upload de la vidéo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
      showToast(errorMessage, 'error');
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      throw error;
    } finally {
      setIsUploading(false);
      // Réinitialiser la progression après un court délai
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [maxSizeMB, onError, onSuccess, showToast, uploadVideo]);

  return {
    upload,
    isUploading,
    uploadProgress,
    reset: () => setUploadProgress(0),
  };
};

// Type utilitaire pour les composants utilisant useVideoUpload
export type VideoUploadProps = ReturnType<typeof useVideoUpload>;
