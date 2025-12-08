"use client";

import { ChatRoom } from "@/components/chat/ChatRoom";
import { LiveBroadcaster } from "@/components/live/LiveBroadcaster";
import { LiveStreamPlayer } from "@/components/live/LiveStreamPlayer";
import { ParticipantsList } from "@/components/live/ParticipantsList";
import { useAuth } from "@/providers/AuthProvider";
import { use, useCallback, useMemo, useState } from "react";

// Salons disponibles pour le live
// Ces salons seront créés automatiquement de façon éphémère lors de la première connexion
// et supprimés automatiquement quand le dernier participant se déconnecte
const LIVE_ROOMS = [
  {
    id: "general",
    name: "Général",
    description: "Discussion générale du live",
  },
  {
    id: "questions",
    name: "Questions",
    description: "Posez vos questions au formateur",
  },
  {
    id: "technical",
    name: "Support Technique",
    description: "Aide technique pendant le live",
  },
];

export default function LiveStreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, token, isAuthenticated, isLoading } = useAuth();

  console.log("🔴 LiveStreamPage - Auth state:", {
    hasUser: !!user,
    hasToken: !!token,
    isAuthenticated,
    isLoading,
    userId: user?.id,
  });

  const [isStreamActive, setIsStreamActive] = useState(false);
  const [streamUrl, setStreamUrl] = useState("websocket"); // Toujours en mode WebSocket pour les viewers
  const [selectedRoom, setSelectedRoom] = useState(LIVE_ROOMS[0].id);

  // Utiliser l'ID de la route directement comme streamId pour synchroniser broadcaster et viewers
  // L'ID vient de l'URL et doit être identique pour tous les participants
  const streamId = id;

  // Génération du room_id unique pour chaque salon
  // Format: live-{timestamp}-{salonId}
  // Les rooms sont éphémères et seront auto-créées/auto-supprimées
  const getRoomId = useCallback((salonId: string) => `${id}-${salonId}`, [id]);

  // Pour le formateur : démarrer un live
  const startStream = () => {
    console.log("🎬 Démarrage du live:", id);
    console.log(
      "📡 Rooms WebSocket qui seront auto-créées:",
      LIVE_ROOMS.map((r) => getRoomId(r.id))
    );
    setIsStreamActive(true);
    // Définir la méthode de streaming pour tous
    setStreamUrl("websocket");

    console.log("📹 Stream via WebSocket: ws://localhost:8000/live/ws");
  };

  // Pour le formateur : arrêter le live
  const stopStream = () => {
    // TODO: Appeler l'API pour arrêter le stream
    console.log("⏹️ Arrêt du live:", id);
    console.log(
      "🗑️ Les rooms WebSocket seront auto-supprimées quand tous les participants se déconnecteront"
    );
    setIsStreamActive(false);
    setStreamUrl("");
  };

  const isFormateur =
    user?.role === "formateur" ||
    user?.role === "admin" ||
    user?.role === "superadmin";

  // Pour les viewers (non-formateurs), on active automatiquement le player
  // Ils viennent forcément pour regarder un stream
  // TEMP: Toujours afficher le player pour debug
  const shouldShowPlayer = true; // !isFormateur || isStreamActive;

  console.log("🎯 Page Live Debug:", {
    id,
    streamId: id,
    userRole: user?.role,
    isFormateur,
    isStreamActive,
    shouldShowPlayer,
    streamUrl,
    hasToken: !!token,
  });

  const currentRoom = useMemo(
    () => LIVE_ROOMS.find((r) => r.id === selectedRoom),
    [selectedRoom]
  );

  // Mémoïser le currentRoomId pour éviter les re-renders inutiles du ChatRoom
  const currentRoomId = useMemo(
    () => getRoomId(selectedRoom),
    [selectedRoom, getRoomId]
  );

  // console.log("📍 Page render - currentRoomId:", currentRoomId);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-900">
      {/* Sidebar gauche - Liste des participants */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <ParticipantsList roomId={currentRoomId} />
      </div>

      {/* Zone centrale - Vidéo */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isStreamActive ? "🔴 Live en cours" : "📹 Live Stream"}
            </h1>
            <p className="text-sm text-gray-400">
              {isStreamActive
                ? "Le stream est actif"
                : "En attente du démarrage du live"}
            </p>
            <p className="text-xs text-gray-500">ID: {id}</p>
          </div>

          {/* Contrôles formateur */}
          {!isLoading && isFormateur && (
            <div className="flex gap-2">
              {!isStreamActive ? (
                <button
                  onClick={startStream}
                  className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
                >
                  <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                  Démarrer le Live
                </button>
              ) : (
                <button
                  onClick={stopStream}
                  className="px-6 py-2 font-semibold text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
                >
                  ⏹️ Arrêter le Live
                </button>
              )}
            </div>
          )}
        </div>

        {/* Player vidéo + Broadcaster (formateur) */}
        <div className="flex flex-col flex-1 gap-4 p-4 bg-black">
          {/* Broadcaster (formateur uniquement) */}
          {isFormateur && (
            <div className="w-full">
              <h3 className="mb-2 text-sm font-semibold text-white">
                🎥 Contrôles Broadcaster
              </h3>
              <LiveBroadcaster
                streamId={streamId}
                token={token || undefined}
                onStreamStart={() => {
                  console.log("📹 Broadcast démarré");
                  setIsStreamActive(true);
                }}
                onStreamStop={() => {
                  console.log("⏹️ Broadcast arrêté");
                  setIsStreamActive(false);
                }}
              />
            </div>
          )}

          {/* Player (tout le monde) */}
          <div className="flex-1">
            <h3 className="mb-2 text-sm font-semibold text-white">
              📺 {isFormateur ? "Preview du Stream" : "Stream Live"}
            </h3>
            <LiveStreamPlayer
              useWebSocket={true}
              streamId={streamId}
              token={token || undefined}
            />
          </div>
        </div>

        {/* Barre d'info en bas */}
        <div className="flex items-center justify-between p-3 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>👥 Connectés: 0</span>
            <span>⏱️ Durée: 00:00</span>
          </div>
          <div className="flex items-center gap-2">
            {isStreamActive && (
              <span className="flex items-center gap-2 font-semibold text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                EN DIRECT
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar droite - Chat avec sélection de salon */}
      <div className="flex flex-col bg-gray-800 border-l border-gray-700 w-96">
        {/* Sélecteur de salons */}
        <div className="p-3 bg-gray-700 border-b border-gray-600">
          <h2 className="mb-2 font-semibold text-white">💬 Salons de chat</h2>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="w-full px-3 py-2 text-sm text-white transition-colors bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {LIVE_ROOMS.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-400">
            {currentRoom?.description}
          </p>
        </div>

        {/* Chat room - Room éphémère auto-créée à la connexion */}
        <div className="flex-1 overflow-hidden">
          <ChatRoom
            roomId={currentRoomId}
            roomName={currentRoom?.name}
            className="h-full bg-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
