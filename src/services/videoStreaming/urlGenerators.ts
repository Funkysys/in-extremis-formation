import type { VideoQuality } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Génère l'URL du manifest HLS
 */
export function getHLSUrl(
  videoId: string,
  token: string,
  quality?: VideoQuality
): string {
  const url = new URL(`${BASE_URL}/stream/video/${videoId}/manifest.m3u8`);
  url.searchParams.set("token", token);

  if (quality && quality !== "auto") {
    url.searchParams.set("quality", quality);
  }

  return url.toString();
}

/**
 * Génère l'URL de streaming direct
 */
export function getDirectUrl(
  videoId: string,
  token: string,
  quality?: VideoQuality
): string {
  const endpoint =
    quality && quality !== "auto"
      ? `/stream/video/${videoId}/quality/${quality}`
      : `/stream/video/${videoId}`;

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("token", token);

  return url.toString();
}

/**
 * Teste si une URL de streaming est accessible
 */
export async function testStreamUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        Range: "bytes=0-0",
      },
    });

    return response.ok || response.status === 206;
  } catch (error) {
    console.error("Erreur test stream URL:", error);
    return false;
  }
}

/**
 * Récupère les qualités disponibles pour une vidéo
 */
export async function getAvailableQualities(
  videoId: string,
  token: string
): Promise<VideoQuality[]> {
  try {
    const url = new URL(`${BASE_URL}/api/video/${videoId}/qualities`);
    url.searchParams.set("token", token);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return ["auto", "1080p", "720p", "480p", "360p"];
    }

    const data = await response.json();
    return data.qualities || ["auto", "1080p", "720p", "480p", "360p"];
  } catch (error) {
    console.error("Erreur récupération qualités:", error);
    return ["auto", "1080p", "720p", "480p", "360p"];
  }
}
