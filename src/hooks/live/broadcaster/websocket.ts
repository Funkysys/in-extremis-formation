/**
 * Crée et connecte le WebSocket pour le broadcast
 */
export async function connectWebSocket(
  streamId: string,
  token?: string
): Promise<WebSocket> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const wsUrl = `${baseUrl.replace(
    "http",
    "ws"
  )}/live/ws/stream/${streamId}?role=streamer&token=${token}`;

  console.log("🔌 Connexion à:", wsUrl);

  const ws = new WebSocket(wsUrl);

  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.error("⏱️ WebSocket timeout après 10s");
      reject(new Error("WebSocket connection timeout (10s)"));
    }, 10000);

    ws.onopen = () => {
      clearTimeout(timeout);
      console.log("✅ WS ouvert !");
      resolve();
    };

    ws.onerror = (err) => {
      clearTimeout(timeout);
      console.error("❌ WS error:", err);
      reject(err);
    };
  });

  return ws;
}

/**
 * Envoie les métadonnées du broadcast au serveur
 */
export function sendBroadcastMetadata(ws: WebSocket, resolution: string): void {
  ws.send(
    JSON.stringify({
      type: "broadcast_start",
      data: { resolution, fps: 30, codec: "vp8" },
    })
  );
}
