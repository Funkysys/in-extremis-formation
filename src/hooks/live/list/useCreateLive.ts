"use client";
import { useRouter } from "next/navigation";

/**
 * Hook pour créer un nouveau live
 */
export function useCreateLive() {
  const router = useRouter();

  const handleCreateLive = () => {
    const timestamp = Date.now();
    const newLiveId = `live-${timestamp}`;
    console.log("🎬 Création d'un nouveau live:", newLiveId);
    router.push(`/formation/live/${newLiveId}`);
  };

  return { handleCreateLive };
}
