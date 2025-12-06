# Debugging Live Streaming - Broadcaster & Viewer

## Problème : "Failed to execute 'appendBuffer'"

Cette erreur survient quand `MediaSource` reçoit des chunks vidéo sans avoir reçu l'**initialization segment** en premier.

## Solution Côté Broadcaster

### ✅ Configuration Correcte de MediaRecorder

```javascript
const mediaRecorder = new MediaRecorder(stream, {
  mimeType: "video/webm;codecs=vp8,opus",
  videoBitsPerSecond: 2500000,
});

// ❌ MAUVAIS : Intervalle trop long
// mediaRecorder.start(); // Un seul gros chunk

// ✅ BON : Chunks réguliers (100-500ms)
mediaRecorder.start(100); // Nouveaux chunks toutes les 100ms

mediaRecorder.ondataavailable = (event) => {
  if (event.data && event.data.size > 0) {
    console.log(`📦 Chunk généré: ${event.data.size} octets`);

    // Envoyer immédiatement au backend
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(event.data);
      console.log(`✅ Chunk envoyé au backend`);
    }
  }
};
```

### 🔍 Vérifications Broadcaster

**1. Le premier chunk contient l'initialization segment**

```javascript
let isFirstChunk = true;

mediaRecorder.ondataavailable = (event) => {
  if (event.data && event.data.size > 0) {
    if (isFirstChunk) {
      console.log(`🎬 PREMIER CHUNK (init segment): ${event.data.size} octets`);
      isFirstChunk = false;
    } else {
      console.log(`📦 Chunk data: ${event.data.size} octets`);
    }

    ws.send(event.data);
  }
};
```

**2. WebSocket envoie bien en mode binaire**

```javascript
ws.binaryType = "arraybuffer"; // Ou 'blob' (par défaut)

ws.onopen = () => {
  console.log("✅ WebSocket broadcaster connecté");
  console.log("Binary type:", ws.binaryType);
};
```

**3. Vérifier que tous les chunks sont envoyés**

```javascript
let chunkCount = 0;
let totalBytesSent = 0;

mediaRecorder.ondataavailable = (event) => {
  if (event.data && event.data.size > 0) {
    chunkCount++;
    totalBytesSent += event.data.size;

    console.log(
      `📊 Chunk #${chunkCount}: ${event.data.size} octets (total: ${totalBytesSent})`
    );

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(event.data);
    } else {
      console.error("❌ WebSocket fermé, chunk non envoyé!");
    }
  }
};
```

## Solution Côté Viewer

### ✅ Configuration Correcte de MediaSource

```javascript
const video = document.getElementById("videoPlayer");
const mediaSource = new MediaSource();

video.src = URL.createObjectURL(mediaSource);

let sourceBuffer = null;
let queue = [];
let isFirstChunk = true;

mediaSource.addEventListener("sourceopen", () => {
  console.log("✅ MediaSource ouvert");

  // Le codec DOIT correspondre au broadcaster
  const mimeCodec = 'video/webm; codecs="vp8, opus"';

  if (!MediaSource.isTypeSupported(mimeCodec)) {
    console.error("❌ Codec non supporté:", mimeCodec);
    return;
  }

  sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  console.log("✅ SourceBuffer créé avec codec:", mimeCodec);

  sourceBuffer.addEventListener("updateend", () => {
    // Traiter la file d'attente
    if (queue.length > 0 && !sourceBuffer.updating) {
      const nextChunk = queue.shift();
      console.log(
        `🔄 Traitement chunk depuis la queue: ${nextChunk.byteLength} octets (reste: ${queue.length})`
      );
      sourceBuffer.appendBuffer(nextChunk);
    }
  });

  sourceBuffer.addEventListener("error", (e) => {
    console.error("❌ Erreur SourceBuffer:", e);
  });
});

// Réception des chunks WebSocket
ws.onmessage = async (event) => {
  if (event.data instanceof Blob) {
    const chunk = await event.data.arrayBuffer();

    if (isFirstChunk) {
      console.log(`🎬 PREMIER CHUNK reçu: ${chunk.byteLength} octets`);
      isFirstChunk = false;
    } else {
      console.log(`📦 Chunk reçu: ${chunk.byteLength} octets`);
    }

    if (!sourceBuffer) {
      console.warn("⏳ SourceBuffer pas encore prêt, mise en queue");
      queue.push(chunk);
      return;
    }

    if (sourceBuffer.updating) {
      console.log("⏳ SourceBuffer en cours de mise à jour, mise en queue");
      queue.push(chunk);
    } else {
      try {
        console.log(`✅ Ajout au SourceBuffer: ${chunk.byteLength} octets`);
        sourceBuffer.appendBuffer(chunk);
      } catch (error) {
        console.error("❌ Erreur appendBuffer:", error);
        console.error("SourceBuffer state:", {
          updating: sourceBuffer.updating,
          buffered: sourceBuffer.buffered.length,
          mode: sourceBuffer.mode,
        });
      }
    }
  }
};
```

## ✅ Solution Implémentée : Buffering de l'Init Segment

Le backend **sauvegarde automatiquement** le premier chunk (initialization segment) et l'envoie aux nouveaux viewers qui arrivent en cours de stream.

### Comment ça marche :

1. **Capture automatique** : Le premier chunk > 10KB est détecté et sauvegardé
2. **Buffer en mémoire** : Stocké dans `stream["init_segment"]`
3. **Envoi immédiat** : Quand un viewer se connecte à un stream actif, il reçoit d'abord l'init segment
4. **Puis flux normal** : Suivi des chunks en temps réel

### Logs Backend à Surveiller

**Séquence normale (viewer arrive APRÈS le streamer) :**

```
🎥 Stream live-123: Streamer connecté, 0 viewer(s) en attente
🎬 Stream live-123: Init segment capturé (52341 octets)
📹 Stream live-123: Chunk #1 (52341 octets) → 0 viewer(s)
📹 Stream live-123: Chunk #2 (12456 octets) → 0 viewer(s)
👀 Stream live-123: Nouveau viewer connecté (total: 1)
✅ Viewer notifié: streamer actif sur live-123
🎬 Init segment envoyé au nouveau viewer (52341 octets)
📹 Stream live-123: Chunk #3 (15789 octets) → 1 viewer(s)
📹 Stream live-123: Chunk #4 (14123 octets) → 1 viewer(s)
```

**Séquence alternative (viewer arrive AVANT le streamer) :**

```
👀 Stream live-123: Nouveau viewer connecté (total: 1)
⏳ Viewer en attente: pas de streamer sur live-123
🎥 Stream live-123: Streamer connecté, 1 viewer(s) en attente
🎬 Stream live-123: Init segment capturé (52341 octets)
📹 Stream live-123: Chunk #1 (52341 octets) → 1 viewer(s)
```

## Checklist de Débogage

### Broadcaster

- [ ] `MediaRecorder.start(100)` avec intervalle court
- [ ] Premier chunk > 50KB (contient l'init segment)
- [ ] Chunks suivants plus petits (données vidéo)
- [ ] WebSocket ouvert avant l'envoi
- [ ] Pas d'erreurs dans la console

### Backend

- [ ] Logs montrent "🎬 Init segment capturé (X octets)"
- [ ] Logs montrent "📹 Chunk #N (X octets) → Y viewer(s)"
- [ ] Pour les nouveaux viewers : "🎬 Init segment envoyé au nouveau viewer"
- [ ] Pas de "❌ Erreur envoi vers viewer"
- [ ] Si pas d'init segment : "⚠️ Pas d'init segment disponible"

### Viewer

- [ ] MediaSource `sourceopen` déclenché
- [ ] SourceBuffer créé avec le bon codec
- [ ] Premier chunk reçu et traité
- [ ] Pas d'erreur "Failed to execute 'appendBuffer'"
- [ ] La vidéo démarre (event `canplay`)

## Ordre des Événements Correct

```
1. Broadcaster: MediaRecorder.start(100)
2. Broadcaster: ondataavailable → premier chunk (~50-100KB avec init segment)
3. Broadcaster: ws.send(chunk)
4. Backend: Reçu chunk → redistribue aux viewers
5. Viewer: ws.onmessage → reçoit le chunk
6. Viewer: MediaSource.sourceopen
7. Viewer: addSourceBuffer()
8. Viewer: sourceBuffer.appendBuffer(chunk) ← DOIT INCLURE L'INIT SEGMENT
9. Viewer: Video canplay → lecture démarre
```

## ✅ Problème Résolu : Init Segment Automatique

**Le backend implémente maintenant le buffering automatique de l'init segment (Option 1).**

### Avant (❌ Problème)

```
1. Viewer: Se connecte en premier
2. Viewer: MediaSource.sourceopen
3. Broadcaster: Démarre 5 secondes après
4. Broadcaster: Envoie les chunks
5. Viewer: Reçoit le chunk #3 (pas l'init segment) → ERREUR "Failed to execute 'appendBuffer'"!
```

### Après (✅ Résolu)

```
1. Viewer: Se connecte à un stream déjà en cours
2. Backend: Envoie automatiquement l'init segment sauvegardé
3. Backend: Puis envoie les chunks en temps réel
4. Viewer: Reçoit d'abord l'init segment, puis les chunks → ✅ Fonctionne !
```

### Structure de données backend

```python
active_streams[stream_id] = {
    "streamer": WebSocket,
    "viewers": Set[WebSocket],
    "init_segment": bytes | None,  # 🆕 Premier chunk sauvegardé
    "chunk_count": int              # 🆕 Compteur de chunks
}
```

### Détection automatique

- Le backend détecte le premier chunk > 10KB (typiquement 50-100KB)
- Ce chunk contient l'initialization segment WebM
- Il est sauvegardé dans `stream["init_segment"]`
- Envoyé immédiatement à chaque nouveau viewer

## Test Complet

```bash
# Terminal 1 : Surveiller les logs backend
docker logs -f fastapi_video_api

# Terminal 2 : Ouvrir le broadcaster
# http://localhost:3000/broadcast

# Terminal 3 : Ouvrir le viewer
# http://localhost:3000/watch

# Vérifier la séquence des logs
```

## Debugging avec Chrome DevTools

### Network Tab

- Filtrer "WS" pour voir les WebSocket
- Cliquer sur la connexion
- Onglet "Messages" → voir les chunks binaires
- Vérifier la taille du premier message (~50-100KB)

### Console

- Activer tous les console.log
- Vérifier l'ordre des événements
- Noter les tailles des chunks

### Media Tab (chrome://media-internals)

- Ouvrir dans un nouvel onglet
- Voir les détails de MediaRecorder et MediaSource
- Diagnostiquer les erreurs de codec
