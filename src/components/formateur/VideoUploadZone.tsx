import React, { useCallback, useState } from 'react';
import { useToast } from '@/providers/ToastProvider';

interface VideoUploadZoneProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export const VideoUploadZone: React.FC<VideoUploadZoneProps> = ({
  onUpload,
  isUploading,
  uploadProgress,
  accept = 'video/*',
  maxSizeMB = 100, // 100MB par défaut
  className = '',
}) => {
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  // La description est désactivée temporairement car non supportée par le serveur
  // const [description, setDescription] = useState('');

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('video/')) {
      return { 
        isValid: false, 
        error: 'Le fichier doit être une vidéo (MP4, WebM, MOV, etc.)' 
      };
    }

    // Vérifier la taille du fichier
    const maxSize = maxSizeMB * 1024 * 1024; // Convertir en octets
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: `Le fichier est trop volumineux (max ${maxSizeMB}MB)` 
      };
    }

    return { isValid: true };
  }, [maxSizeMB]);

  const handleFileChange = useCallback(async (file: File | null) => {
    if (!file) return;

    const { isValid, error } = validateFile(file);
    if (!isValid) {
      showToast(error || 'Fichier invalide', 'error');
      return;
    }
    
    try {
      await onUpload(file);
      showToast('Vidéo téléversée avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors du téléversement de la vidéo :', error);
      showToast(
        error instanceof Error ? error.message : 'Une erreur est survenue',
        'error'
      );
    }
  }, [onUpload, showToast, validateFile]);

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
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div 
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <svg
            className={`mx-auto h-12 w-12 ${isDragging ? 'text-primary' : 'text-gray-400'}`}
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            {/* Champ de description désactivé pour le moment
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optionnel)
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Description de la vidéo"
                disabled={isUploading}
              />
            </div>
            */}
            <div className="flex justify-center text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
              >
                <span>Glissez-déposez ou</span>
                <span className="ml-1 underline">parcourir</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept={accept}
                  disabled={isUploading}
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </label>
              <p className="pl-1">pour téléverser une vidéo</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {`MP4, WebM ou MOV (max ${maxSizeMB}MB)`}
            </p>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Téléversement en cours...</span>
            <span className="font-medium">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-300 ease-out" 
              style={{ 
                width: `${uploadProgress}%`,
                transitionProperty: 'width',
                transitionDuration: '300ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
