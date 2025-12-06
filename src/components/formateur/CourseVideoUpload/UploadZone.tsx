import React, { useRef } from "react";

interface UploadZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function UploadZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  className = "",
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-900/20"
            : "border-gray-600 hover:border-blue-500"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={onFileSelect}
        />
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-300">
              <span className="text-blue-400 hover:text-blue-300">
                Upload a video
              </span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-400 mt-1">
              MP4, WebM ou MOV (max. 100MB)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
