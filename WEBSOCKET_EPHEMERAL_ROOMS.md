# WebSocket API Reference - Documentation Frontend

## 📡 Endpoints WebSocket Disponibles

### 1. Chat par Room (RECOMMANDÉ)

```
WS ws://localhost:8000/chat/ws/room/{room_id}?token=YOUR_JWT_TOKEN
```

**Description**: WebSocket pour chat temps réel dans une room spécifique. **Les rooms sont éphémères** : elles se créent automatiquement lors de la première connexion et se suppriment automatiquement quand elles sont vides.

**Paramètres**:

- `room_id` (path, required): ID de la room (integer) OU slug (string unique)
- `token` (query, optional): JWT token d'authentification (Bearer token sans le préfixe "Bearer ")

**Comportement éphémère** 🔄:

1. **Auto-création**: Si le `room_id` n'existe pas, la room est créée automatiquement
2. **Auto-suppression**: Quand le dernier utilisateur se déconnecte, la room est supprimée de la base de données
3. **Pas de pré-création nécessaire**: Vous pouvez vous connecter directement avec n'importe quel slug

**Exemples de connexion**:

```javascript
// Avec ID numérique (room existante)
const ws = new WebSocket(
  `ws://localhost:8000/chat/ws/room/1?token=${jwtToken}`
);

// Avec slug string (identifiant lisible) - AUTO-CRÉÉ si inexistant
const ws = new WebSocket(
  `ws://localhost:8000/chat/ws/room/live-general?token=${jwtToken}`
);

// Avec slug dynamique (ex: timestamp) - IDÉAL pour rooms temporaires
const roomSlug = `live-${Date.now()}-${streamId}`;
const ws = new WebSocket(
  `ws://localhost:8000/chat/ws/room/${roomSlug}?token=${jwtToken}`
);
```

**💡 Astuce**: Le slug permet d'avoir des identifiants lisibles et mémorables comme `"live-general"`, `"video-42-chat"`, etc. Vous pouvez générer des slugs uniques avec timestamps pour des rooms temporaires.

---

### 2. Chat par Vidéo (AUTO-CRÉATION DE ROOM)

```
WS ws://localhost:8000/chat/ws/video/{video_id}?token=YOUR_JWT_TOKEN
```

**Description**: WebSocket pour chat lié à une vidéo spécifique. Crée automatiquement une room si elle n'existe pas.

**Paramètres**:

- `video_id` (path, required): ID de la vidéo
- `token` (query, optional): JWT token d'authentification

**Comportement**:

1. Vérifie que la vidéo existe (404 si non trouvée)
2. Récupère la room associée à la vidéo
3. Si aucune room n'existe, en crée une automatiquement
4. Redirige vers le WebSocket de la room

**Exemple**:

```javascript
// Se connecte au chat de la vidéo 42
const ws = new WebSocket(
  `ws://localhost:8000/chat/ws/video/42?token=${jwtToken}`
);
```

---

### 3. Live Stream (BASIQUE - SANS AUTHENTIFICATION)

```
WS ws://localhost:8000/live/ws
```

**Description**: WebSocket simple pour live/broadcast (pas de gestion de rooms, pas d'auth requise).

⚠️ **Note**: Cet endpoint est basique et n'a PAS de gestion d'authentification ni de rooms multiples. Pour un système de chat complet, utilisez `/chat/ws/room/{room_id}`.

---

## 🔐 Authentification

### Comment passer le JWT Token ?

**En Query Parameter** (recommandé pour WebSocket):

```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const ws = new WebSocket(`ws://localhost:8000/chat/ws/room/1?token=${token}`);
```

### Connexion Anonyme

Si aucun token n'est fourni, le backend crée un utilisateur anonyme :

```javascript
{
  "user_id": null,
  "username": "Anonymous_192.168.1.10",
  "email": null,
  "roles": [],
  "is_admin": false,
  "is_moderator": false
}
```

⚠️ **Note**: Les connexions anonymes peuvent être restreintes selon la configuration de la room.

---

## 📨 Format des Messages WebSocket

### Messages ENVOYÉS par le client

Tous les messages doivent être au format JSON avec cette structure :

```json
{
  "type": "MESSAGE_TYPE",
  "data": {
    /* contenu spécifique au type */
  }
}
```

#### 1. Envoyer un message de chat

```json
{
  "type": "chat_message",
  "data": {
    "message": "Hello everyone!"
  }
}
```

**Validations**:

- Le message ne peut pas être vide
- Longueur maximum : 1000 caractères
- Rate limiting : 10 messages par 10 secondes par utilisateur

---

#### 2. Indicateurs de frappe (typing)

```json
{
  "type": "typing_start",
  "data": {}
}
```

```json
{
  "type": "typing_stop",
  "data": {}
}
```

---

#### 3. Actions de modération (ADMIN/MODERATOR uniquement)

```json
{
  "type": "moderation_action",
  "data": {
    "action": "ban", // ou "mute"
    "target_user_id": 123,
    "duration_minutes": 60 // 0 = permanent
  }
}
```

**Actions disponibles**:

- `"ban"`: Bannir un utilisateur (le déconnecte et l'empêche de rejoindre)
- `"mute"`: Mute un utilisateur (il peut lire mais pas écrire)

---

#### 4. Keep-Alive (ping/pong)

```json
{
  "type": "ping",
  "data": {}
}
```

**Description**: Message de keep-alive envoyé par le client pour maintenir la connexion active. Le serveur répond automatiquement avec un `pong`.

---

### Messages REÇUS par le client

#### 1. Confirmation de connexion

```json
{
  "type": "room_joined",
  "data": {
    "room_id": 1,
    "connection_count": 5
  }
}
```

---

#### 2. Nouveau message de chat

```json
{
  "type": "chat_message",
  "data": {
    "id": 42,
    "message": "Hello everyone!",
    "username": "john_doe",
    "user_id": 123,
    "timestamp": "2025-11-27T16:30:00Z",
    "room_id": 1
  }
}
```

---

#### 3. Utilisateur rejoint la room

```json
{
  "type": "user_joined",
  "data": {
    "username": "jane_doe",
    "user_id": 456,
    "timestamp": "2025-11-27T16:31:00Z"
  }
}
```

---

#### 4. Utilisateur quitte la room

```json
{
  "type": "user_left",
  "data": {
    "username": "jane_doe",
    "user_id": 456
  }
}
```

---

#### 5. Indicateur de frappe

```json
{
  "type": "typing_start",
  "data": {
    "username": "john_doe",
    "user_id": 123,
    "timestamp": "2025-11-27T16:32:00Z"
  }
}
```

```json
{
  "type": "typing_stop",
  "data": {
    "username": "john_doe",
    "user_id": 123,
    "timestamp": "2025-11-27T16:32:05Z"
  }
}
```

---

#### 6. Action de modération

```json
{
  "type": "moderation_action",
  "data": {
    "action": "ban",
    "target_user_id": 789,
    "moderator_user_id": 123,
    "duration_minutes": 60,
    "timestamp": "2025-11-27T16:33:00Z"
  }
}
```

---

#### 7. Keep-Alive Response (pong)

```json
{
  "type": "pong",
  "data": {}
}
```

**Description**: Réponse automatique du serveur à un message `ping`. Confirme que la connexion est toujours active.

---

#### 8. Erreur

```json
{
  "type": "error",
  "data": {
    "message": "Rate limit exceeded"
  }
}
```

**Erreurs courantes**:

- `"Rate limit exceeded"`: Trop de messages envoyés
- `"Message cannot be empty"`: Message vide
- `"Message too long"`: Message > 1000 caractères
- `"You are muted or banned"`: Utilisateur mute/ban
- `"You do not have permission to moderate this room"`: Pas de droits de modération
- `"Access denied"`: N'a pas accès à la room
- `"Invalid token"`: Token JWT invalide/expiré

---

## 🏠 Gestion des Rooms

### ⚡ Rooms Éphémères (Mode par défaut)

**Les rooms sont maintenant éphémères** : elles se créent et se détruisent automatiquement selon les connexions.

**✅ Avantages**:

- Pas besoin de créer des rooms à l'avance
- Nettoyage automatique (pas de rooms abandonnées)
- Parfait pour les streams temporaires et chats de vidéos
- Génération de slugs uniques avec timestamps

**🔄 Cycle de vie**:

```javascript
// 1. Connexion → Room créée automatiquement si inexistante
const ws = new WebSocket(
  `ws://localhost:8000/chat/ws/room/my-stream?token=${token}`
);

// 2. Déconnexion du dernier utilisateur → Room supprimée automatiquement
ws.close();
```

### Comment obtenir un room_id ?

**Option 1: Connexion directe avec slug (RECOMMANDÉ pour rooms éphémères)**

```javascript
// Pas besoin de créer la room à l'avance !
// Elle sera créée automatiquement lors de la connexion
const roomSlug = `live-${Date.now()}-${streamId}`;
const ws = new WebSocket(
  `ws://localhost:8000/chat/ws/room/${roomSlug}?token=${token}`
);

// La room sera supprimée automatiquement quand tous les utilisateurs se déconnectent
```

**Option 2: Créer une room persistante via GraphQL (OPTIONNEL)**

```graphql
mutation CreateChatRoom {
  createChatRoom(
    name: "Discussion Générale"
    slug: "live-general" # Identifiant unique lisible (optionnel)
    description: "Chat public"
    isPublic: true
  ) {
    id
    slug
    name
    isPublic
    createdAt
  }
}
```

**⚠️ Note**: Les rooms créées via GraphQL sont aussi éphémères et seront supprimées si elles deviennent vides.

**Option 3: Utiliser l'endpoint vidéo (auto-création)**

```javascript
// Se connecte au chat de la vidéo
// Le backend crée automatiquement une room si nécessaire
const ws = new WebSocket(`ws://localhost:8000/chat/ws/video/42?token=${token}`);
```

**Option 4: Récupérer les rooms actives via GraphQL**

```graphql
query GetChatRooms {
  chatRooms {
    id
    slug
    name
    description
    isPublic
    participantCount
  }
}
```

**💡 Astuce**: Seules les rooms avec des participants actifs apparaissent dans la liste.

### Rooms publiques vs privées

- **Public** (`isPublic: true`): Tout le monde peut rejoindre (par défaut pour rooms auto-créées)
- **Privé** (`isPublic: false`): Nécessite une invitation ou permission spéciale

---

## 🛠️ Exemple d'Implémentation Frontend

### React Hook pour WebSocket Chat

```typescript
import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  type: string;
  data: any;
}

export function useChatWebSocket(roomId: number, token?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const url = token
      ? `ws://localhost:8000/chat/ws/room/${roomId}?token=${token}`
      : `ws://localhost:8000/chat/ws/room/${roomId}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connecté");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("📨 Message reçu:", message);

      setMessages((prev) => [...prev, message]);

      // Gérer les types de messages
      switch (message.type) {
        case "room_joined":
          console.log(`🚪 Connecté à la room ${message.data.room_id}`);
          break;
        case "chat_message":
          console.log(`💬 ${message.data.username}: ${message.data.message}`);
          break;
        case "user_joined":
          console.log(`👋 ${message.data.username} a rejoint le chat`);
          break;
        case "user_left":
          console.log(`👋 ${message.data.username} a quitté le chat`);
          break;
        case "error":
          console.error("❌ Erreur:", message.data.message);
          break;
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket déconnecté");
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [roomId, token]);

  const sendMessage = (message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat_message",
          data: { message },
        })
      );
    }
  };

  const sendTypingIndicator = (isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: isTyping ? "typing_start" : "typing_stop",
          data: {},
        })
      );
    }
  };

  return { messages, isConnected, sendMessage, sendTypingIndicator };
}
```

### Utilisation du Hook

```typescript
function ChatRoom({ roomId }: { roomId: number }) {
  const token = localStorage.getItem("jwt_token");
  const { messages, isConnected, sendMessage, sendTypingIndicator } =
    useChatWebSocket(roomId, token);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div>
      <div>Status: {isConnected ? "🟢 Connecté" : "🔴 Déconnecté"}</div>

      <div>
        {messages
          .filter((m) => m.type === "chat_message")
          .map((msg, i) => (
            <div key={i}>
              <strong>{msg.data.username}:</strong> {msg.data.message}
            </div>
          ))}
      </div>

      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          sendTypingIndicator(true);
        }}
        onBlur={() => sendTypingIndicator(false)}
        placeholder="Tapez un message..."
      />
      <button onClick={handleSend}>Envoyer</button>
    </div>
  );
}
```

---

## 🔒 Permissions et Modération

### Rôles Utilisateur

| Rôle        | Peut envoyer des messages | Peut modérer | Peut bannir |
| ----------- | ------------------------- | ------------ | ----------- |
| `user`      | ✅                        | ❌           | ❌          |
| `moderator` | ✅                        | ✅           | ❌          |
| `admin`     | ✅                        | ✅           | ✅          |
| `superuser` | ✅                        | ✅           | ✅          |

### États d'un Participant

- **Online**: Connecté via WebSocket
- **Offline**: Déconnecté
- **Muted**: Peut lire mais pas écrire (temporaire ou permanent)
- **Banned**: Ne peut ni lire ni écrire (temporaire ou permanent)

---

## 🚀 Tests avec PowerShell

### Test de connexion WebSocket

```powershell
# Installer wscat si nécessaire (via npm)
npm install -g wscat

# Test sans auth
wscat -c "ws://localhost:8000/chat/ws/room/1"

# Test avec auth
wscat -c "ws://localhost:8000/chat/ws/room/1?token=YOUR_JWT_TOKEN"

# Envoyer un message (après connexion)
> {"type":"chat_message","data":{"message":"Hello from PowerShell!"}}
```

---

## 📊 Statistiques et Monitoring

**Endpoint REST** (nécessite authentification admin):

```
GET /monitoring/chat/stats
```

**Réponse**:

```json
{
  "total_connections": 15,
  "active_rooms": 3,
  "rooms": {
    "1": 8,
    "2": 5,
    "3": 2
  }
}
```

---

## ⚠️ Limitations et Rate Limiting

- **Messages par utilisateur**: 10 messages / 10 secondes
- **Longueur des messages**: 1000 caractères max
- **Connexions simultanées**: Pas de limite configurée (à ajuster selon les besoins)

---

## 🐛 Codes d'Erreur WebSocket

| Code | Raison           | Description                                                        |
| ---- | ---------------- | ------------------------------------------------------------------ |
| 1000 | Normal Closure   | Déconnexion normale                                                |
| 1008 | Policy Violation | Violation de politique (token invalide, permissions insuffisantes) |
| 4004 | Not Found        | Room ou vidéo introuvable                                          |
| 4003 | Forbidden        | Accès refusé (banned, muted, permissions insuffisantes)            |

---

## 📝 Résumé pour Implémenter Correctement

### Endpoints à utiliser :

- **Chat par room** : `ws://localhost:8000/chat/ws/room/{room_id}?token=JWT`
- **Chat par vidéo** : `ws://localhost:8000/chat/ws/video/{video_id}?token=JWT`

### Authentification :

- Token JWT passé en **query parameter** `?token=...`
- Optionnel : connexion anonyme possible si la room le permet

### Messages :

- **Format JSON** avec `type` et `data`
- **Types client → serveur** : `chat_message`, `typing_start/stop`, `moderation_action`, `ping`
- **Types serveur → client** : `room_joined`, `chat_message`, `user_joined/left`, `typing_start/stop`, `moderation_action`, `pong`, `error`

### Notifications automatiques :

- ✅ `user_joined` envoyé quand quelqu'un se connecte
- ✅ `user_left` envoyé quand quelqu'un se déconnecte
- ✅ `chat_message` diffusé à tous les participants
- ✅ `typing_start/stop` diffusé (sauf à l'émetteur)
- ✅ `pong` réponse automatique aux messages `ping` (keep-alive)

### Rooms éphémères ⚡ :

- **Auto-création** : Connectez-vous avec n'importe quel slug, la room sera créée si elle n'existe pas
- **Auto-suppression** : La room est supprimée automatiquement quand le dernier utilisateur se déconnecte
- **Pas de pré-création** : Plus besoin de créer des rooms via GraphQL pour un usage temporaire
- **Idéal pour** : Streams live, chats de vidéos, sessions temporaires
- **Slugs dynamiques** : Utilisez des timestamps pour garantir l'unicité : `live-${Date.now()}-${streamId}`

### Configuration des rooms auto-créées :

- `created_by`: 1 (utilisateur système)
- `room_type`: "live"
- `is_public`: true
- `allow_anonymous`: true
- Permissions vérifiées à la connexion

---

## 🆘 Support et Questions

Pour toute question ou problème :

1. Vérifier les logs backend : `docker-compose logs -f app`
2. Vérifier les logs WebSocket dans la console navigateur
3. Tester avec `wscat` pour isoler les problèmes frontend/backend
