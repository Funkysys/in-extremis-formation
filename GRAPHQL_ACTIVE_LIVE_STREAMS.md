# Query GraphQL : activeLiveStreams

## Endpoint GraphQL

**URL:** `http://localhost:8000/graphql`

## Query : Récupérer les Lives Actifs

### activeLiveStreams

Retourne la liste de tous les live streams actuellement actifs avec leur nombre de viewers.

**Query GraphQL :**

```graphql
query {
  activeLiveStreams {
    streamId
    viewerCount
    isActive
    startedAt
    title
    description
    streamerUsername
    streamerId
  }
}
```

**Exemple de réponse :**

```json
{
  "data": {
    "activeLiveStreams": [
      {
        "streamId": "live-1764591978662",
        "viewerCount": 15,
        "isActive": true,
        "startedAt": null,
        "title": null,
        "description": null,
        "streamerUsername": null,
        "streamerId": null
      },
      {
        "streamId": "live-1764592123456",
        "viewerCount": 8,
        "isActive": true,
        "startedAt": null,
        "title": null,
        "description": null,
        "streamerUsername": null,
        "streamerId": null
      }
    ]
  }
}
```

### liveStream

Récupère les informations d'un live stream spécifique.

**Query GraphQL :**

```graphql
query {
  liveStream(streamId: "live-1764591978662") {
    streamId
    viewerCount
    isActive
    startedAt
    title
    description
    streamerUsername
    streamerId
  }
}
```

## Implémentation Frontend (React/Next.js)

### Hook avec Polling Automatique

```typescript
// hooks/useActiveLiveStreams.ts
import { useEffect, useState } from 'react';

interface LiveStream {
  streamId: string;
  viewerCount: number;
  isActive: boolean;
  startedAt?: string;
  title?: string;
  description?: string;
  streamerUsername?: string;
  streamerId?: number;
}

const ACTIVE_LIVE_STREAMS_QUERY = `
  query {
    activeLiveStreams {
      streamId
      viewerCount
      isActive
      startedAt
      title
      description
      streamerUsername
      streamerId
    }
  }
`;

export function useActiveLiveStreams(refreshInterval: number = 5000) {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchStreams = async () => {
      try {
        const response = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: ACTIVE_LIVE_STREAMS_QUERY,
          }),
        });

        const data = await response.json();

        if (data.errors) {
          setError(data.errors[0].message);
        } else {
          setStreams(data.data.activeLiveStreams);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Première récupération
    fetchStreams();

    // Polling toutes les X secondes
    intervalId = setInterval(fetchStreams, refreshInterval);

    // Cleanup
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshInterval]);

  return { streams, loading, error };
}
```

### Composant d'Affichage des Lives

```tsx
// components/LiveStreamsList.tsx
import React from 'react';
import { useActiveLiveStreams } from '@/hooks/useActiveLiveStreams';

export default function LiveStreamsList() {
  const { streams, loading, error } = useActiveLiveStreams(5000); // Refresh toutes les 5s

  if (loading && streams.length === 0) {
    return <div>Chargement des lives...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (streams.length === 0) {
    return <div>Aucun live en cours</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streams.map((stream) => (
        <div
          key={stream.streamId}
          className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">
              {stream.title || stream.streamId}
            </h3>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-red-500 font-semibold">LIVE</span>
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-2">
            {stream.description || 'Aucune description'}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              👥 {stream.viewerCount} {stream.viewerCount > 1 ? 'viewers' : 'viewer'}
            </span>

            <button
              onClick={() => window.location.href = `/live/${stream.streamId}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Regarder
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Exemple avec Apollo Client

```typescript
// graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_ACTIVE_LIVE_STREAMS = gql`
  query GetActiveLiveStreams {
    activeLiveStreams {
      streamId
      viewerCount
      isActive
      startedAt
      title
      description
      streamerUsername
      streamerId
    }
  }
`;

export const GET_LIVE_STREAM = gql`
  query GetLiveStream($streamId: String!) {
    liveStream(streamId: $streamId) {
      streamId
      viewerCount
      isActive
      startedAt
      title
      description
      streamerUsername
      streamerId
    }
  }
`;
```

```tsx
// components/LiveStreamsListWithApollo.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ACTIVE_LIVE_STREAMS } from '@/graphql/queries';

export default function LiveStreamsListWithApollo() {
  const { data, loading, error, refetch } = useQuery(GET_ACTIVE_LIVE_STREAMS, {
    pollInterval: 5000, // Polling automatique toutes les 5 secondes
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  const streams = data?.activeLiveStreams || [];

  if (streams.length === 0) {
    return <div>Aucun live en cours</div>;
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => refetch()}
        className="bg-gray-200 px-4 py-2 rounded"
      >
        🔄 Rafraîchir
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream: any) => (
          <div key={stream.streamId} className="border rounded p-4">
            <h3>{stream.streamId}</h3>
            <p>👥 {stream.viewerCount} viewers</p>
            <a href={`/live/${stream.streamId}`}>Regarder →</a>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Test avec cURL

```bash
curl -X POST http://localhost:8000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ activeLiveStreams { streamId viewerCount isActive } }"}'
```

## Test dans GraphQL Playground

Ouvrez `http://localhost:8000/graphql` dans votre navigateur et exécutez :

```graphql
{
  activeLiveStreams {
    streamId
    viewerCount
    isActive
  }
}
```

## Champs Disponibles

| Champ | Type | Description |
|-------|------|-------------|
| `streamId` | `String!` | Identifiant unique du stream |
| `viewerCount` | `Int!` | Nombre de viewers actuels |
| `isActive` | `Boolean!` | Si le stream est actif |
| `startedAt` | `String` | Date de début (nullable) |
| `title` | `String` | Titre du stream (nullable) |
| `description` | `String` | Description (nullable) |
| `streamerUsername` | `String` | Nom du streamer (nullable) |
| `streamerId` | `Int` | ID du streamer (nullable) |

## Notes

- ✅ **Pas d'authentification requise** pour lire les lives actifs
- ⚡ **Temps réel** : Interroge directement les WebSocket actifs en mémoire
- 🔄 **Polling recommandé** : Rafraîchir toutes les 5 secondes
- 📊 **Viewer count dynamique** : Compte les connexions WebSocket actives

## Évolution Future

Pour des métadonnées plus riches (titre, description, streamer), il faudra :

1. Créer un modèle `LiveStream` dans la base de données
2. Associer les streams à des utilisateurs
3. Persister les métadonnées lors de la création du stream
