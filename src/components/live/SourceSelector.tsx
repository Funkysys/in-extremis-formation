/**
 * Sélecteur de source de diffusion
 * Responsabilité : UI de sélection (caméra/écran/audio)
 */

interface SourceSelectorProps {
  sourceType: "camera" | "screen" | "audio";
  onSourceTypeChange: (type: "camera" | "screen" | "audio") => void;
}

export function SourceSelector({
  sourceType,
  onSourceTypeChange,
}: SourceSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        onClick={() => onSourceTypeChange("camera")}
        className={`px-3 py-2 rounded ${
          sourceType === "camera"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        📹 Caméra
      </button>
      <button
        onClick={() => onSourceTypeChange("screen")}
        className={`px-3 py-2 rounded ${
          sourceType === "screen"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        🖥️ Écran
      </button>
      <button
        onClick={() => onSourceTypeChange("audio")}
        className={`px-3 py-2 rounded ${
          sourceType === "audio"
            ? "bg-blue-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        🎤 Audio
      </button>
    </div>
  );
}
