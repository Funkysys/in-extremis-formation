'use client';

import { useEffect, useRef } from 'react';
import 'plyr/dist/plyr.css';

interface PlyrPlayerProps {
  source: string | File | null;
  options?: any;
  onReady?: (player: any) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
  className?: string;
}

export default function PlyrPlayer({
  source,
  options = {},
  onReady,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  className = '',
}: PlyrPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const sourceUrl = useRef<string | null>(null);

  // Initialisation du lecteur
  useEffect(() => {
    // Chargement dynamique de Plyr pour éviter les problèmes de SSR
    const initPlayer = async () => {
      if (!videoRef.current) return;

      try {
        // Nettoyer l'ancien lecteur s'il existe
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }

        // Charger Plyr uniquement côté client
        const Plyr = (await import('plyr')).default;
        
        // Créer une nouvelle instance Plyr
        playerRef.current = new Plyr(videoRef.current, {
          controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen',
          ],
          ...options,
        });

        // Gestion des événements
        if (onPlay) playerRef.current.on('play', onPlay);
        if (onPause) playerRef.current.on('pause', onPause);
        if (onEnded) playerRef.current.on('ended', onEnded);
        if (onTimeUpdate) {
          playerRef.current.on('timeupdate', () => {
            onTimeUpdate(playerRef.current.currentTime);
          });
        }

        // Prêt
        if (onReady) {
          playerRef.current.on('ready', () => onReady(playerRef.current));
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de Plyr:', error);
      }
    };

    initPlayer();

    // Nettoyage
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      if (sourceUrl.current) {
        URL.revokeObjectURL(sourceUrl.current);
        sourceUrl.current = null;
      }
    };
  }, [options]);

  // Mise à jour de la source
  useEffect(() => {
    if (!playerRef.current || !source) return;

    const updateSource = async () => {
      try {
        // Nettoyer l'ancienne URL si elle existe
        if (sourceUrl.current) {
          URL.revokeObjectURL(sourceUrl.current);
          sourceUrl.current = null;
        }

        let src: string;
        let type = 'video/mp4'; // Type par défaut

        if (typeof source === 'string') {
          src = source;
        } else {
          // Créer une URL pour le fichier
          src = URL.createObjectURL(source);
          sourceUrl.current = src;
          type = source.type || 'video/mp4';
        }

        // Mettre à jour la source de la vidéo
        if (videoRef.current) {
          videoRef.current.src = src;
          // Recharger la vidéo
          await videoRef.current.load();
          // Si le lecteur est prêt, on le met à jour
          if (playerRef.current) {
            playerRef.current.source = {
              type: 'video',
              sources: [
                {
                  src,
                  type,
                },
              ],
            };
          }
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la source:', error);
      }
    };

    updateSource();
  }, [source]);

  return (
    <div className={`plyr-player ${className}`}>
      <video
        ref={videoRef}
        playsInline
        controls
        className="w-full h-full"
      >
        {source && typeof source === 'string' && (
          <source src={source} type="video/mp4" />
        )}
        Votre navigateur ne prend pas en charge la lecture de vidéos.
      </video>
    </div>
  );
}
