"use client";

import { useLiveParticipants } from "@/hooks/useLiveParticipants";

interface ParticipantsListProps {
  roomId: string;
}

export function ParticipantsList({ roomId }: ParticipantsListProps) {
  const { participants, isConnected } = useLiveParticipants({
    roomId,
    enabled: true, // ✅ Se connecter pour écouter les participants
  });

  const getAvatarColor = (username: string) => {
    const colors = [
      "#ef4444",
      "#f59e0b",
      "#10b981",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
    ];
    const index =
      username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="flex items-center gap-2 font-semibold text-white">
          <span>👥</span>
          <span>Participants</span>
          <span className="ml-auto text-sm text-gray-400">
            {participants.length}
          </span>
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-xs text-gray-400">
            {isConnected ? "Connecté" : "Déconnecté"}
          </span>
        </div>
      </div>

      {/* Liste des participants */}
      <div className="flex-1 p-2 overflow-y-auto">
        {participants.length === 0 ? (
          <div className="py-8 text-sm text-center text-gray-500">
            <div className="mb-2 text-3xl">👻</div>
            <p>Aucun participant</p>
          </div>
        ) : (
          <div className="space-y-1">
            {participants.map((participant) => {
              const avatarColor =
                participant.avatarColor || getAvatarColor(participant.username);

              return (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-2 transition-colors rounded-lg hover:bg-gray-700"
                >
                  {/* Avatar */}
                  <div
                    className="flex items-center justify-center w-10 h-10 font-semibold text-white rounded-full"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {participant.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {participant.username}
                      </p>
                      {participant.isFormateur && (
                        <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-semibold">
                          FORMATEUR
                        </span>
                      )}
                    </div>

                    {participant.role && !participant.isFormateur && (
                      <p className="text-xs text-gray-500 capitalize">
                        {participant.role}
                      </p>
                    )}
                  </div>

                  {/* Statut vocal (future feature) */}
                  {/* <button className="text-gray-500 transition-colors hover:text-white">
                    🎤
                  </button> */}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer - Stats */}
      <div className="p-3 bg-gray-900 border-t border-gray-700">
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>👁️ Spectateurs:</span>
            <span className="font-semibold text-white">
              {participants.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>💬 Messages:</span>
            <span className="font-semibold text-white">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
