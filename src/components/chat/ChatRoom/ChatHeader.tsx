interface ChatHeaderProps {
  roomName?: string;
  roomId: string;
  isConnected: boolean;
  isConnecting: boolean;
  onReconnect: () => void;
}

export function ChatHeader({
  roomName,
  roomId,
  isConnected,
  isConnecting,
  onReconnect,
}: ChatHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {roomName || `Salon ${roomId}`}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`}
            />
            <span className="text-sm">
              {isConnecting
                ? "Connexion..."
                : isConnected
                ? "En ligne"
                : "Déconnecté"}
            </span>
          </div>
        </div>
        {!isConnected && !isConnecting && (
          <button
            onClick={onReconnect}
            className="px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-blue-50"
          >
            Reconnecter
          </button>
        )}
      </div>
    </div>
  );
}
