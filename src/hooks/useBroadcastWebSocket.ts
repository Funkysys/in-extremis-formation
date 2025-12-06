/**
 * Hook simplifié pour la connexion WebSocket (version stable)
 */

import { useCallback, useRef, useState } from "react";

export function useBroadcastWebSocket() {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async (url: string): Promise<void> => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const ws = new WebSocket(url);
    wsRef.current = ws;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("WebSocket timeout"));
      }, 5000);

      ws.onopen = () => {
        clearTimeout(timeout);
        setIsConnected(true);
        console.log("✅ WS ouvert !");
        resolve();
      };

      ws.onerror = (err) => {
        clearTimeout(timeout);
        setIsConnected(false);
        reject(err);
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    });
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const send = useCallback((data: string | Blob) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  }, []);

  return { connect, disconnect, send, isConnected, wsRef };
}
