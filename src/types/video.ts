export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadedVideo {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}
export interface VideoMetadata {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoMarker {
  id: string;
  title: string;
  timestamp: number;
  description: string | null;
  videoId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVideoMarkerInput {
  videoId: string;
  title: string;
  timestamp: number;
  description?: string | null;
}

export interface UpdateVideoMarkerInput {
  id: string;
  title?: string;
  timestamp?: number;
  description?: string | null;
}

export interface ReorderVideoMarkersInput {
  videoId: string;
  markerIds: string[];
}

export interface VideoMarkersResponse {
  videoMarkers: VideoMarker[];
}

export interface VideoMarkerResponse {
  videoMarker: VideoMarker | null;
}

export interface CreateVideoMarkerResponse {
  createVideoMarker: {
    marker: VideoMarker | null;
    error: string | null;
  };
}

export interface UpdateVideoMarkerResponse {
  updateVideoMarker: {
    marker: VideoMarker | null;
    error: string | null;
  };
}

export interface DeleteVideoMarkerResponse {
  deleteVideoMarker: {
    success: boolean;
    error: string | null;
  };
}

export interface ReorderVideoMarkersResponse {
  reorderVideoMarkers: {
    success: boolean;
    error: string | null;
  };
}
