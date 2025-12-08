/**
 * Sélecteur de périphériques vidéo avec détection OBS
 */

import { VideoDeviceInfo } from "@/hooks/video/streaming/useVideoDevices";

interface DeviceSelectorProps {
  devices: VideoDeviceInfo[];
  isOpen: boolean;
  onToggle: () => void;
  onSelectDevice: (deviceId: string) => void;
}

export function DeviceSelector({
  devices,
  isOpen,
  onToggle,
  onSelectDevice,
}: DeviceSelectorProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm rounded-lg transition-colors"
      >
        {isOpen ? "▲ Masquer" : "▼ Choisir une source vidéo"} ({devices.length}{" "}
        disponible{devices.length > 1 ? "s" : ""})
      </button>

      {isOpen && devices.length > 0 && (
        <div className="bg-gray-600 rounded-lg p-3 max-h-48 overflow-y-auto">
          <div className="text-xs text-gray-300 mb-2 font-semibold">
            Sources vidéo disponibles :
          </div>
          <div className="space-y-2">
            {devices.map((device) => (
              <button
                key={device.deviceId}
                onClick={() => {
                  onSelectDevice(device.deviceId);
                  onToggle();
                }}
                className="w-full text-left px-3 py-2 bg-gray-700 hover:bg-gray-500 rounded text-sm transition-colors flex items-center gap-2"
              >
                <span className="text-lg">
                  {device.isOBS ? "🎥" : device.isExternal ? "📹" : "📷"}
                </span>
                <span className="flex-1 truncate">
                  {device.label || `Caméra ${device.deviceId.slice(0, 8)}`}
                </span>
                {device.isOBS && (
                  <span className="px-2 py-0.5 bg-purple-600 text-xs rounded">
                    OBS
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
