/**
 * Hook pour gérer les participants d'un live
 * Se connecte au WebSocket du chat pour écouter les arrivées/départs
 */

import { useWebSocketChat } from "@/hooks/chat";
import { useEffect, useState } from "react";

export interface Participant {
  id: string;
  username: string;
  role?: string;
  isFormateur?: boolean;
  avatarColor?: string;
}

interface UseLiveParticipantsOptions {
  roomId: string;
  enabled?: boolean;
}

export function useLiveParticipants({
  roomId,
  enabled = true,
}: UseLiveParticipantsOptions) {
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Se connecter au WebSocket pour écouter les événements
  const { messages, isConnected } = useWebSocketChat({
    roomId,
    autoConnect: enabled,
  });

  useEffect(() => {
    // Écouter les messages WebSocket pour détecter les arrivées/départs
    messages.forEach((msg) => {
      if (msg.type === "user_joined" && msg.user_id && msg.username) {
        // Ajouter le participant s'il n'existe pas déjà
        setParticipants((prev) => {
          const exists = prev.some((p) => p.id === String(msg.user_id));
          if (exists) return prev;

          const newParticipant: Participant = {
            id: String(msg.user_id),
            username: msg.username || msg.user_name || "Utilisateur",
            role: msg.role || "user",
            isFormateur:
              msg.role === "formateur" ||
              msg.role === "admin" ||
              msg.role === "superadmin",
          };

          console.log("✅ Participant ajouté:", newParticipant);
          return [...prev, newParticipant];
        });
      } else if (msg.type === "user_left" && msg.user_id) {
        // Retirer le participant
        setParticipants((prev) => {
          const filtered = prev.filter((p) => p.id !== String(msg.user_id));
          console.log("❌ Participant retiré:", msg.user_id);
          return filtered;
        });
      } else if (msg.type === "room_joined") {
        // Quand on rejoint une room, on peut recevoir la liste des participants déjà présents
        console.log("🏠 Room rejointe:", msg.room_id);
        // Note: Le serveur devrait envoyer la liste des participants existants
      }
    });
  }, [messages]);

  return {
    participants,
    participantCount: participants.length,
    isConnected,
  };
}
