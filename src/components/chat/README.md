# 💬 Chat Temps Réel - Documentation

## Vue d'ensemble

Le système de chat temps réel utilise WebSocket pour permettre une communication instantanée entre les utilisateurs. Il est basé sur l'architecture décrite dans `FRONTEND_API_REFERENCE.md`.

## Architecture

```
Chat System
├── WebSocketChatService (Service)
│   ├── Connexion/Déconnexion
│   ├── Reconnexion automatique
│   ├── Heartbeat (ping/pong)
│   └── Gestion des événements
├── useWebSocketChat (Hook)
│   ├── État de connexion
│   ├── Liste des messages
│   ├── Indicateurs de frappe
│   └── Gestion automatique du cycle de vie
├── ChatRoom (Composant)
│   ├── Interface utilisateur complète
│   ├── Liste des messages
│   ├── Formulaire d'envoi
│   └── Indicateurs visuels
└── ChatMessage (Composant)
    └── Affichage d'un message individuel
```

## Fichiers créés

### Services

- `src/services/webSocketChatService.ts` - Service WebSocket avec reconnexion automatique

### Hooks

- `src/hooks/useWebSocketChat.ts` - Hook React pour gérer le WebSocket dans les composants

### Composants

- `src/components/chat/ChatRoom.tsx` - Interface principale de chat
- `src/components/chat/ChatMessage.tsx` - Affichage d'un message
- `src/components/chat/index.ts` - Exports

### Pages

- `src/app/(formation)/chat/page.tsx` - Page de chat avec multi-salons

## Utilisation

### 1. Configuration

Ajouter la variable d'environnement dans `.env.local` :

```env
NEXT_PUBLIC_WS_ENDPOINT=ws://localhost:8000
```

### 2. Utilisation basique

```tsx
import { ChatRoom } from "@/components/chat";

function MaPage() {
  return <ChatRoom roomId="general" roomName="Salon Général" />;
}
```

### 3. Utilisation avancée avec le hook

```tsx
import { useWebSocketChat } from "@/hooks/useWebSocketChat";

function MonComposant() {
  const { messages, isConnected, sendMessage, sendTyping, typingUsers } =
    useWebSocketChat({
      roomId: "my-room",
      autoConnect: true,
    });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.message}</div>
      ))}
    </div>
  );
}
```

## Fonctionnalités

### ✅ Implémentées

1. **Connexion WebSocket**

   - Connexion automatique avec token JWT
   - URL configurée : `WS /chat/ws/{room_id}`

2. **Messages en temps réel**

   - Envoi de messages instantané
   - Réception en temps réel
   - Affichage avec avatar et horodatage

3. **Reconnexion automatique**

   - Jusqu'à 5 tentatives
   - Intervalle de 3 secondes
   - Indicateur visuel de l'état

4. **Indicateurs de frappe**

   - Envoi automatique pendant la frappe
   - Affichage des utilisateurs en train d'écrire
   - Timeout automatique après 1 seconde

5. **Heartbeat (Keep-alive)**

   - Ping toutes les 30 secondes
   - Maintient la connexion active

6. **Multi-salons**

   - Changement de salon dynamique
   - Isolation des messages par salon

7. **Interface utilisateur**
   - Design moderne et responsive
   - Messages alignés (droite pour l'utilisateur, gauche pour les autres)
   - Indicateurs de connexion
   - Scroll automatique vers les nouveaux messages

## API WebSocket

### Format des messages

#### Message standard

```json
{
  "room_id": "general",
  "user_id": "123",
  "user_name": "John Doe",
  "message": "Hello world!",
  "type": "message",
  "createdAt": "2025-11-17T10:30:00Z"
}
```

#### Indicateur de frappe

```json
{
  "room_id": "general",
  "type": "typing_start"
}
```

#### Heartbeat

```json
{
  "type": "ping"
}
```

## Configuration du service

Le service WebSocket accepte les options suivantes :

```typescript
{
  url: string;                    // URL WebSocket
  roomId: string;                 // ID du salon
  token?: string;                 // Token JWT d'authentification
  reconnectInterval?: number;     // Intervalle de reconnexion (défaut: 3000ms)
  maxReconnectAttempts?: number;  // Tentatives max (défaut: 5)
  onMessage?: (msg) => void;      // Callback nouveau message
  onConnect?: () => void;         // Callback connexion
  onDisconnect?: () => void;      // Callback déconnexion
  onError?: (error) => void;      // Callback erreur
}
```

## Gestion des erreurs

Le système gère automatiquement :

- Pertes de connexion
- Erreurs de parsing des messages
- Tentatives de reconnexion échouées
- Affichage des erreurs à l'utilisateur

## Sécurité

- ✅ Authentification par token JWT
- ✅ Validation côté serveur
- ✅ Isolation des salons
- ✅ Protection contre les injections

## Prochaines améliorations possibles

- [ ] Historique des messages (intégration GraphQL)
- [ ] Notifications de nouveaux messages
- [ ] Upload de fichiers/images dans le chat
- [ ] Réactions aux messages (emojis)
- [ ] Messages privés entre utilisateurs
- [ ] Modération (suppression, bannissement)
- [ ] Statut en ligne/hors ligne des utilisateurs
- [ ] Recherche dans l'historique
- [ ] Mentions (@utilisateur)
- [ ] Messages épinglés

## Dépendances

Aucune dépendance externe nécessaire ! Le système utilise :

- WebSocket natif du navigateur
- React hooks standards
- Apollo Client pour GraphQL (déjà installé)

## Tests

Pour tester le chat en temps réel :

1. Lancer le serveur backend avec WebSocket activé
2. Naviguer vers `/chat`
3. Ouvrir plusieurs onglets/fenêtres
4. Envoyer des messages pour voir la synchronisation

## Troubleshooting

### Le chat ne se connecte pas

- Vérifier que `NEXT_PUBLIC_WS_ENDPOINT` est défini
- Vérifier que le serveur WebSocket est démarré
- Vérifier la console pour les erreurs

### Les messages ne s'affichent pas

- Vérifier l'authentification (token JWT valide)
- Vérifier que le format des messages correspond au schéma
- Consulter la console réseau (onglet WS)

### Reconnexion en boucle

- Vérifier l'URL WebSocket
- Vérifier les logs serveur
- Augmenter `maxReconnectAttempts` si nécessaire
