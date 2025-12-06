import type { VideoQuality } from "@/services/videoStreamingService";

interface QualityControlsProps {
  availableQualities: VideoQuality[];
  currentQuality: VideoQuality;
  onQualityChange: (quality: VideoQuality) => void;
}

export function QualityControls({
  availableQualities,
  currentQuality,
  onQualityChange,
}: QualityControlsProps) {
  return (
    <div className="absolute top-2 left-2 z-10 flex gap-2">
      {availableQualities.map((quality) => (
        <button
          key={quality}
          onClick={() => onQualityChange(quality)}
          className={`px-3 py-1 rounded text-xs font-medium transition-all ${
            currentQuality === quality
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-black bg-opacity-60 text-gray-300 hover:bg-opacity-80"
          }`}
        >
          {quality === "auto" ? "🔄 Auto" : quality}
        </button>
      ))}
    </div>
  );
}

interface MethodBadgeProps {
  method: string | null;
  currentQuality: VideoQuality;
  supportsHLS: boolean;
}

export function MethodBadge({
  method,
  currentQuality,
  supportsHLS,
}: MethodBadgeProps) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
      {method?.toUpperCase()} | {currentQuality}
      {!supportsHLS && " (No HLS)"}
    </div>
  );
}
