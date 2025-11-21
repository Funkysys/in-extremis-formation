"use client";

import { ChatRoom } from "@/components/chat/ChatRoom";
import { useState } from "react";

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState("general");

  // Liste des salons de chat disponibles
  const chatRooms = [
    { id: "general", name: "Général", description: "Discussion générale" },
    {
      id: "formation",
      name: "Formation",
      description: "Questions sur les formations",
    },
    {
      id: "support",
      name: "Support",
      description: "Aide et support technique",
    },
    { id: "random", name: "Random", description: "Discussions libres" },
  ];

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-100px)]">
      <div className="flex gap-4 h-full">
        {/* Sidebar - Liste des salons */}
        <div className="w-64 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Salons de chat
          </h2>
          <div className="space-y-2">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedRoom === room.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                <div className="font-semibold">{room.name}</div>
                <div
                  className={`text-sm ${
                    selectedRoom === room.id ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {room.description}
                </div>
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              💡 À propos du chat
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Messages en temps réel</li>
              <li>✓ Indicateurs de frappe</li>
              <li>✓ Reconnexion automatique</li>
              <li>✓ Multi-salons</li>
            </ul>
          </div>
        </div>

        {/* Chat Room Principal */}
        <div className="flex-1">
          <ChatRoom
            roomId={selectedRoom}
            roomName={chatRooms.find((r) => r.id === selectedRoom)?.name}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
