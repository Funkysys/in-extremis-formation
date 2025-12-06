"use client";

import { useBroadcast } from "@/hooks/useBroadcast";
import { useVideoDevices } from "@/hooks/useVideoDevices";
import { useEffect, useRef, useState } from "react";
import { BroadcastPreview } from "./BroadcastPreview";
import { SourceSelector } from "./SourceSelector";

interface LiveBroadcasterProps {
  streamId: string;
  token?: string;
  onStreamStart?: () => void;
  onStreamStop?: () => void;
}

export function LiveBroadcaster({
  streamId,
  token,
  onStreamStart,
  onStreamStop,
}: LiveBroadcasterProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sourceType, setSourceType] = useState<"camera" | "screen" | "audio">(
    "camera"
  );
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  const { devices } = useVideoDevices();

  useEffect(() => {
    if (devices.length > 0 && !selectedDevice) {
      const obsDevice = devices.find((d) => d.isOBS);
      setSelectedDevice(obsDevice?.deviceId || devices[0].deviceId);
    }
  }, [devices, selectedDevice]);

  const bitrate =
    sourceType === "audio"
      ? 128000
      : sourceType === "screen" ||
        devices.find((d) => d.deviceId === selectedDevice)?.isOBS
      ? 5000000
      : 2500000;

  const broadcast = useBroadcast({
    streamId,
    token,
    selectedDevice,
    sourceType,
    bitrate,
  });

  const handleStart = async () => {
    try {
      const stream = await broadcast.start(videoRef.current);
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
      onStreamStart?.();
    } catch (err) {
      console.error("Erreur démarrage:", err);
    }
  };

  const handleStop = () => {
    broadcast.stop();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    onStreamStop?.();
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <BroadcastPreview
        videoRef={videoRef}
        isBroadcasting={broadcast.isBroadcasting}
        sourceType={sourceType}
      />

      {broadcast.error && (
        <div className="p-3 mb-4 text-red-200 rounded bg-red-900/50">
          {broadcast.error}
        </div>
      )}

      {!broadcast.isBroadcasting && (
        <div className="mb-4 space-y-3">
          <SourceSelector
            sourceType={sourceType}
            onSourceTypeChange={setSourceType}
          />

          {sourceType === "camera" && devices.length > 0 && (
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full px-3 py-2 text-white bg-gray-700 rounded"
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label} {device.isOBS && "⭐"}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {!broadcast.isBroadcasting ? (
        <button
          onClick={handleStart}
          className="w-full px-4 py-3 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          ▶️ Démarrer
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="w-full px-4 py-3 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700"
        >
          ⏹️ Arrêter
        </button>
      )}
    </div>
  );
}
