"use client";

import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
// Composants UI remplacés par des éléments natifs avec Tailwind
// Icônes remplacées par des alternatives Tailwind/DaisyUI
import { useToast } from '@/providers/ToastProvider';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Types
type VideoMarker = {
  id: string;
  title: string;
  timestamp: number;
  description?: string | null;
};

// GraphQL Queries & Mutations
const GET_VIDEO_MARKERS = gql`
  query GetVideoMarkers($videoId: UUID!) {
    videoMarkers(videoId: $videoId) {
      id
      title
      timestamp
      description
    }
  }
`;

const CREATE_MARKER = gql`
  mutation CreateVideoMarker($input: CreateVideoMarkerInput!) {
    createVideoMarker(input: $input) {
      marker {
        id
        title
        timestamp
        description
      }
      error
    }
  }
`;

const UPDATE_MARKER = gql`
  mutation UpdateVideoMarker($input: UpdateVideoMarkerInput!) {
    updateVideoMarker(input: $input) {
      marker {
        id
        title
        timestamp
        description
      }
      error
    }
  }
`;

const DELETE_MARKER = gql`
  mutation DeleteVideoMarker($id: UUID!) {
    deleteVideoMarker(id: $id) {
      success
      error
    }
  }
`;

// Fonction utilitaire pour formater le temps (secondes en MM:SS)
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Composant SortableItem
function SortableItem({ marker, onEdit, onDelete }: { marker: VideoMarker; onEdit: (marker: VideoMarker) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: marker.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="flex items-center gap-2 p-2 border rounded-md bg-white hover:bg-gray-50"
    >
      <button 
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing flex flex-col justify-center"
      >
        <span className="block w-4 h-0.5 bg-gray-400 my-0.5"></span>
        <span className="block w-4 h-0.5 bg-gray-400 my-0.5"></span>
      </button>
      
      <div 
        className="flex-1 cursor-pointer" 
        onClick={() => onEdit(marker)}
      >
        <div className="font-medium">{marker.title}</div>
        <div className="text-sm text-gray-500">
          {formatTime(marker.timestamp)}
          {marker.description && ` • ${marker.description}`}
        </div>
      </div>
      
      <button
        type="button"
        className="p-1 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onDelete(marker.id);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

// Types pour les props du composant
interface VideoChapterEditorProps {
  videoId: string; // UUID format
  videoDuration: number;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
}

// Composant principal
export function VideoChapterEditor({ videoId, videoDuration, videoRef }: VideoChapterEditorProps) {
  const { showToast } = useToast();
  const [markers, setMarkers] = useState<VideoMarker[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentMarker, setCurrentMarker] = useState<Partial<VideoMarker> | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  
  // Utiliser la référence vidéo externe si fournie, sinon utiliser la référence interne
  const activeVideoRef = videoRef || internalVideoRef;
  
  // Vérifier si la référence vidéo est disponible
  const isVideoReady = activeVideoRef.current !== null;

  // Chargement des marqueurs existants
  const { loading, error, refetch } = useQuery(GET_VIDEO_MARKERS, {
    variables: { 
      videoId: videoId as string // On s'assure que c'est bien un string
    },
    skip: !videoId || videoId.startsWith('temp-'), // Ne pas exécuter si ID temporaire ou non défini
    onCompleted: (data) => {
      if (!activeVideoRef.current) {
        console.warn('Aucune référence vidéo disponible');
        return;
      }
      if (data?.videoMarkers) {
        console.log('Marqueurs chargés:', data.videoMarkers);
        setMarkers(data.videoMarkers);
      }
    },
    onError: (error) => {
      console.error('Erreur lors du chargement des marqueurs:', error);
      console.error('Détails de l\'erreur:', JSON.stringify({
        message: error.message,
        graphQLErrors: error.graphQLErrors,
        networkError: error.networkError
      }, null, 2));
    }
  });

  // Mutations
  const [createMarker] = useMutation(CREATE_MARKER);
  const [updateMarker] = useMutation(UPDATE_MARKER);
  const [deleteMarker] = useMutation(DELETE_MARKER);

  // Configuration du drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Mise à jour du temps actuel de la vidéo
  useEffect(() => {
    if (!activeVideoRef.current) return;
    
    const video = activeVideoRef.current;
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [activeVideoRef]);
  
  // Gestion du clic sur un marqueur
  const handleMarkerClick = (marker: VideoMarker) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeVideoRef.current) {
      activeVideoRef.current.currentTime = marker.timestamp;
      activeVideoRef.current.play().catch(error => {
        console.error('Erreur lors de la lecture de la vidéo:', error);
      });
    }
  };

  // Fonction utilitaire pour formater le temps (secondes en MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Fonction utilitaire pour trier les marqueurs par temps
  const sortMarkers = (a: VideoMarker, b: VideoMarker): number => {
    return a.timestamp - b.timestamp;
  };

  // Gestion du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMarker?.title || currentMarker.timestamp === undefined) return;

    try {
      const input = {
        videoId,
        title: currentMarker.title,
        timestamp: currentMarker.timestamp,
        description: currentMarker.description || '',
      };

      if (currentMarker.id) {
        // Mise à jour
        await updateMarker({
          variables: {
            input: {
              id: currentMarker.id,
              ...input,
            },
          },
        });
        showToast('Marqueur mis à jour avec succès', 'success');
      } else {
        // Création
        await createMarker({
          variables: { input },
          update: (cache, { data }) => {
            if (data?.createVideoMarker?.marker) {
              refetch();
            }
          },
        });
        showToast('Marqueur ajouté avec succès', 'success');
      }

      setCurrentMarker(null);
      setIsEditing(false);
      refetch();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde du marqueur:", err);
      showToast('Erreur lors de l\'ajout du marqueur', 'error');
    }
  };

  // Gestion de la suppression d'un marqueur
  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce marqueur ?")) return;

    try {
      const { data } = await deleteMarker({ variables: { id } });
      if (data?.deleteVideoMarker?.success) {
        setMarkers(markers.filter((m: VideoMarker) => m.id !== id));
        showToast('Marqueur supprimé avec succès', 'success');
      }
    } catch (err) {
      console.error("Erreur lors de la suppression du marqueur:", err);
      showToast('Erreur lors de la suppression du marqueur', 'error');
    }
  };

  // Gestion du réordonnancement
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = markers.findIndex((m: VideoMarker) => m.id === active.id);
    const newIndex = markers.findIndex((m: VideoMarker) => m.id === over.id);
    const newMarkers = arrayMove([...markers], oldIndex, newIndex);
    
    setMarkers(newMarkers as VideoMarker[]);

    // Mettre à jour l'ordre dans la base de données
    try {
      // Implémentez cette mutation si nécessaire
      // await reorderMarkers({
      //   variables: {
      //     videoId,
      //     markerIds: newMarkers.map(m => m.id)
      //   }
      // });
    } catch (err) {
      console.error("Erreur lors du réordonnancement des marqueurs:", err);
      showToast("Une erreur est survenue lors du réordonnancement des marqueurs.", "error");
      // Recharger les marqueurs depuis le serveur en cas d'erreur
      refetch();
    }
  };

  // Si en cours de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // En cas d'erreur
  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        Erreur lors du chargement des marqueurs: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Chapitres de la vidéo</h3>
        {!isEditing && (
          <button 
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            onClick={() => {
              setCurrentMarker({
                title: '',
                timestamp: currentTime,
                description: '',
              });
              setIsEditing(true);
            }}
          >
            <span className="mr-2">+</span>
            Ajouter un chapitre
          </button>
        )}
      </div>

      {/* Formulaire d'édition/création */}
      {isEditing && currentMarker && (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-gray-50">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titre du chapitre</label>
            <input
              type="text"
              id="title"
              value={currentMarker.title || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentMarker({ ...currentMarker, title: e.target.value })}
              placeholder="Ex: Introduction"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Temps</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={videoDuration}
                value={currentMarker.timestamp || 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentMarker({ ...currentMarker, timestamp: parseFloat(e.target.value) })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <span>secondes</span>
              <button 
                type="button"
                className="px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setCurrentMarker({ ...currentMarker, timestamp: currentTime })}
              >
                Utiliser le temps actuel
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Position actuelle: {formatTime(currentTime)}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
            <textarea
              id="description"
              value={currentMarker.description || ''}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCurrentMarker({ ...currentMarker, description: e.target.value })}
              placeholder="Description du chapitre"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button"
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                setIsEditing(false);
                setCurrentMarker(null);
              }}
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {currentMarker.id ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      )}

      {/* Liste des marqueurs */}
      {markers.length > 0 ? (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={markers}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {markers.sort(sortMarkers).map((marker) => (
                <SortableItem 
                  key={marker.id} 
                  marker={marker}
                  onEdit={(m: VideoMarker) => {
                    setCurrentMarker(m);
                    setIsEditing(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center p-8 border-2 border-dashed rounded-md text-gray-500">
          Aucun chapitre défini pour le moment.
        </div>
      )}
    </div>
  );
}
