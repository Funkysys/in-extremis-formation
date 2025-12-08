/**
 * Point d'entrée centralisé pour tous les hooks de live streaming
 *
 * Structure:
 * - player/      : Hooks pour les viewers (regarder un stream)
 * - broadcaster/ : Hooks pour les formateurs (diffuser un stream)
 * - list/        : Hooks pour gérer la liste des lives
 * - participants/: Hooks pour gérer les participants d'un live
 */

// Player (Viewers)
export type { UseLiveStreamOptions, UseLiveStreamReturn } from "./player/types";
export { useLivePlayer } from "./player/useLivePlayer";
export { useStreamConnection } from "./player/useStreamConnection";

// Broadcaster (Formateurs)
export { useBroadcast } from "./broadcaster/useBroadcast";
export { useBroadcastRecorder } from "./broadcaster/useBroadcastRecorder";
export { useBroadcastStream } from "./broadcaster/useBroadcastStream";
export { useBroadcastWebSocket } from "./broadcaster/useBroadcastWebSocket";

// List & Creation
export type { LiveStream } from "./list/types";
export { useCreateLive } from "./list/useCreateLive";
export { useLiveList } from "./list/useLiveList";

// Participants
export { useLiveParticipants } from "./participants/useLiveParticipants";
export type { Participant } from "./participants/useLiveParticipants";
