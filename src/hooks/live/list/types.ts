/**
 * Types pour la gestion de la liste des lives
 */

export interface LiveStream {
  streamId: string;
  title?: string;
  description?: string;
  streamerUsername?: string;
  streamerId?: number;
  isActive: boolean;
  viewerCount: number;
  startedAt?: string;
}
