/**
 * Hooks vidéo - Player, Gestion, Streaming
 */

// Player
export { useAdvancedHlsPlayer } from "./player/useAdvancedHlsPlayer";
export { useAdvancedVideoControls } from "./player/useAdvancedVideoControls";
export { useHlsPlayer } from "./player/useHlsPlayer";
export { useVideoControls } from "./player/useVideoControls";
export { useVideoDebugLogger } from "./player/useVideoDebugLogger";

// Management
export { useVideoMutations } from "./management/useVideoMutations";
export {
  useAllVideos,
  useMyVideos,
  usePremiumVideos,
  usePublicVideos,
  useVideo,
} from "./management/useVideos";
export { useVideosPagination } from "./management/useVideosPagination";
export { useVideoUpload } from "./management/useVideoUpload";

// Streaming
export { useMediaCapture } from "./streaming/useMediaCapture";
export { useMediaRecorder } from "./streaming/useMediaRecorder";
export { useMediaStream } from "./streaming/useMediaStream";
export { useVideoDevices } from "./streaming/useVideoDevices";
export { useVideoStreaming } from "./streaming/useVideoStreaming";
