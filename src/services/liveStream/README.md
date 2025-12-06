# Architecture LiveStream Service

Service de streaming vidéo live découpé en modules spécialisés pour une meilleure maintenabilité.

## Structure des fichiers

```
src/services/liveStream/
├── types.ts                 (~30 lignes)  - Types TypeScript
├── MediaSourceManager.ts    (~160 lignes) - Gestion Media Source Extensions
├── WebSocketManager.ts      (~100 lignes) - Gestion WebSocket
├── ChunkProcessor.ts        (~80 lignes)  - Traitement queue de chunks
└── index.ts                 (~160 lignes) - Service principal (orchestration)
```

## Responsabilités

### types.ts

- Définition des types et interfaces
- Aucune logique métier
- Exports : `LiveStreamStatus`, `LiveStreamConfig`, `LiveStreamCallbacks`, `SignalingMessage`

### MediaSourceManager.ts

**Responsabilité unique** : Gestion MSE (Media Source Extensions)

- Initialisation du MediaSource
- Création du SourceBuffer avec détection codec
- Gestion du timestampOffset pour timeline continue
- Append des chunks au SourceBuffer
- Validation de l'état (isValid, isReady)
- Cleanup des ressources MSE

### WebSocketManager.ts

**Responsabilité unique** : Gestion WebSocket

- Connexion/déconnexion WebSocket
- Gestion des messages binaires (chunks vidéo)
- Gestion des messages JSON (signaling)
- Envoi de messages
- Callbacks pour dispatch

### ChunkProcessor.ts

**Responsabilité unique** : Traitement des chunks

- Queue des chunks en attente
- Détection des init segments WebM
- Traitement séquentiel (un chunk à la fois)
- Protection contre les appends simultanés
- Gestion de la completion (onAppendComplete)

### index.ts (Service principal)

**Responsabilité unique** : Orchestration

- Coordination des 3 managers
- Gestion du statut global
- Callbacks utilisateur
- API publique simple : startStream / stopStream
- Pas de logique MSE/WebSocket/Chunk (délégué aux managers)

## Utilisation

```typescript
import { liveStreamService } from "@/services/liveStream";

// Démarrer le stream
await liveStreamService.startStream(
  videoElement,
  {
    wsUrl: "ws://localhost:8000/live/ws/stream/id",
    token: "jwt_token",
  },
  {
    onStatusChange: (status) => console.log(status),
    onError: (error) => console.error(error),
    onMetadata: (meta) => console.log(meta),
    onViewerCount: (count) => console.log(count),
  }
);

// Arrêter
liveStreamService.stopStream();
```

## Avantages

✅ **Lisibilité** : Chaque fichier < 170 lignes
✅ **Maintenabilité** : Une responsabilité par fichier
✅ **Testabilité** : Chaque manager testable indépendamment
✅ **Extensibilité** : Facile d'ajouter des fonctionnalités
✅ **Debugging** : Isolation des problèmes simplifiée

## Migration depuis l'ancien service

L'ancien fichier `liveStreamService.ts` redirige automatiquement vers la nouvelle architecture.
Aucun changement nécessaire dans le code existant.
