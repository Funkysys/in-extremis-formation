# Implémentation Agora.io pour le système de live

## 📋 Vue d'ensemble

Ce document détaille l'implémentation d'Agora.io pour ajouter la communication audio/vidéo temps réel au système de live existant.

### Architecture actuelle (à conserver)

```
FORMATEUR PRINCIPAL:
  OBS → WebSocket → FastAPI Backend → Chunks vidéo → Viewers
  Chat texte → WebSocket Django ✅

SYSTÈME À AJOUTER (Agora):
  - Caméra formateur secondaire (vidéo)
  - Audio tous formateurs (audio)
  - Audio participants/étudiants (audio)
```

### Pourquoi Agora ?

- ✅ **Coûts optimaux** : 40-60€/mois pour 10 lives (1h30, 8 participants)
- ✅ **Plan gratuit** : 10 000 min/mois = 3-4 lives gratuits
- ✅ **Développement rapide** : 20h vs 100h+ backend custom
- ✅ **Qualité professionnelle** : Codec Opus, adaptation réseau auto
- ✅ **Scalabilité** : 8 à 100+ participants sans changement code
- ✅ **Maintenance zéro** : Infrastructure managée

---

## 💰 Coûts détaillés

### Scénario type : 1 live 1h30, 8 participants

**Formateur secondaire** (caméra + audio):

- Publie vidéo HD : 90 min
- 8 personnes reçoivent : 8 × 90 = 720 min
- Total vidéo : 810 min → **3,23€**

**Participants audio** (3 parlent activement):

- 3 publient audio : 3 × 90 = 270 min
- 8 reçoivent 3 flux : 8 × 3 × 90 = 2160 min
- Total audio : 2430 min → **2,41€**

**Coût par live : ~6€**

**Coût mensuel (10 lives)** :

- Brut : 60€
- Avec plan gratuit (10k min) : **~40€/mois réel**

### Tarification Agora.io

- Vidéo HD (720p) : 3,99€ / 1000 minutes
- Audio : 0,99€ / 1000 minutes
- Plan gratuit : 10 000 minutes/mois
- Facturation à l'usage (pas d'abonnement)

---

## 🛠️ Étape 1 : Setup Agora (30 min)

### 1.1 Créer un compte Agora

1. Aller sur https://www.agora.io/
2. Créer un compte gratuit
3. Créer un nouveau projet dans la console
4. Type de projet : **Secured mode: APP ID + Token**
5. Activer les features :
   - ✅ Video Calling
   - ✅ Voice Calling
   - ✅ Interactive Live Streaming

### 1.2 Récupérer les credentials

Dans la console Agora, projet → Settings :

```
APP ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
APP Certificate: yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

⚠️ **Important** : Ne jamais commiter ces credentials dans Git !

### 1.3 Ajouter au .env

```bash
# Backend Django - .env
AGORA_APP_ID=votre_app_id_ici
AGORA_APP_CERTIFICATE=votre_certificate_ici
```

---

## 🔧 Étape 2 : Backend Django (4-6h)

### 2.1 Installation dépendances

```bash
pip install agora-token-builder==1.0.0
```

Ajouter à `requirements.txt` :

```
agora-token-builder==1.0.0
```

### 2.2 Configuration settings.py

```python
# backend/settings.py

import os

# Agora configuration
AGORA_APP_ID = os.getenv('AGORA_APP_ID')
AGORA_APP_CERTIFICATE = os.getenv('AGORA_APP_CERTIFICATE')

if not AGORA_APP_ID or not AGORA_APP_CERTIFICATE:
    raise ValueError("AGORA_APP_ID et AGORA_APP_CERTIFICATE doivent être définis")
```

### 2.3 Créer le service Agora

**Fichier** : `backend/services/agora_service.py`

```python
from agora_token_builder import RtcTokenBuilder
from datetime import datetime, timedelta
from django.conf import settings

class AgoraService:
    """Service pour générer les tokens Agora"""

    @staticmethod
    def generate_rtc_token(
        channel_name: str,
        uid: int,
        role: str = "publisher",  # "publisher" ou "subscriber"
        expiration_hours: int = 2
    ) -> str:
        """
        Génère un token RTC Agora

        Args:
            channel_name: Nom du canal (ex: "live-123")
            uid: ID unique de l'utilisateur (utiliser user.id)
            role: "publisher" (peut publier audio/vidéo) ou "subscriber" (écoute seulement)
            expiration_hours: Durée de validité du token

        Returns:
            Token JWT Agora
        """
        app_id = settings.AGORA_APP_ID
        app_certificate = settings.AGORA_APP_CERTIFICATE

        # Calculer timestamp expiration
        privilege_expired_ts = int(
            (datetime.now() + timedelta(hours=expiration_hours)).timestamp()
        )

        # Définir le rôle Agora
        agora_role = (
            RtcTokenBuilder.Role_Publisher
            if role == "publisher"
            else RtcTokenBuilder.Role_Subscriber
        )

        # Générer le token
        token = RtcTokenBuilder.buildTokenWithUid(
            app_id,
            app_certificate,
            channel_name,
            uid,
            agora_role,
            privilege_expired_ts
        )

        return token

    @staticmethod
    def get_user_role(user) -> str:
        """
        Détermine le rôle Agora selon le rôle utilisateur

        Args:
            user: Instance utilisateur Django

        Returns:
            "publisher" si formateur, "subscriber" si étudiant
        """
        # Adapter selon votre modèle User
        if hasattr(user, 'role') and user.role == 'formateur':
            return "publisher"

        if hasattr(user, 'is_formateur') and user.is_formateur:
            return "publisher"

        # Par défaut, les étudiants sont publishers aussi (peuvent parler)
        # Ajuster selon vos besoins
        return "publisher"
```

### 2.4 Créer la mutation GraphQL

**Fichier** : `backend/graphql/mutations/agora_mutations.py`

```python
import graphene
from django.conf import settings
from backend.services.agora_service import AgoraService

class GenerateAgoraTokenMutation(graphene.Mutation):
    """
    Génère un token Agora pour rejoindre un canal audio/vidéo

    Usage:
        mutation {
          generateAgoraToken(channelName: "live-123", liveId: "123") {
            token
            appId
            uid
            channelName
            expiresAt
          }
        }
    """

    class Arguments:
        channel_name = graphene.String(required=True, description="Nom du canal (ex: live-123)")
        live_id = graphene.String(required=False, description="ID du live (optionnel, pour logs)")

    # Outputs
    token = graphene.String(description="Token JWT Agora")
    app_id = graphene.String(description="App ID Agora (public)")
    uid = graphene.Int(description="UID de l'utilisateur")
    channel_name = graphene.String(description="Nom du canal")
    expires_at = graphene.String(description="Date expiration token (ISO)")

    def mutate(self, info, channel_name, live_id=None):
        user = info.context.user

        # Vérifier authentification
        if not user.is_authenticated:
            raise Exception("Vous devez être authentifié pour rejoindre un live")

        # Générer UID unique basé sur l'ID utilisateur
        # Agora requiert un entier 32-bit
        if isinstance(user.id, str):
            # Si UUID, convertir en int (hash)
            uid = abs(hash(user.id)) % (2**31)
        else:
            uid = int(user.id)

        # Déterminer le rôle
        role = AgoraService.get_user_role(user)

        # Générer le token
        token = AgoraService.generate_rtc_token(
            channel_name=channel_name,
            uid=uid,
            role=role,
            expiration_hours=2
        )

        # Logger pour debug
        print(f"🎤 Agora token généré: user={user.id}, channel={channel_name}, role={role}")

        # Calculer date expiration
        from datetime import datetime, timedelta
        expires_at = (datetime.now() + timedelta(hours=2)).isoformat()

        return GenerateAgoraTokenMutation(
            token=token,
            app_id=settings.AGORA_APP_ID,
            uid=uid,
            channel_name=channel_name,
            expires_at=expires_at
        )

class Mutation(graphene.ObjectType):
    generate_agora_token = GenerateAgoraTokenMutation.Field()
```

### 2.5 Enregistrer la mutation

**Fichier** : `backend/graphql/schema.py`

```python
import graphene
from backend.graphql.mutations.agora_mutations import Mutation as AgoraMutation

class Mutation(
    AgoraMutation,
    # ... autres mutations existantes
    graphene.ObjectType
):
    pass

schema = graphene.Schema(
    query=Query,
    mutation=Mutation
)
```

### 2.6 Tester le backend

```bash
# Lancer le serveur Django
python manage.py runserver

# Tester dans GraphiQL (http://localhost:8000/graphql)
mutation {
  generateAgoraToken(channelName: "test-channel") {
    token
    appId
    uid
    channelName
    expiresAt
  }
}
```

---

## ⚛️ Étape 3 : Frontend React (8-12h)

### 3.1 Installation dépendances

```bash
npm install agora-rtc-sdk-ng@4.21.0 agora-rtc-react@2.3.0
```

Ajouter à `package.json` :

```json
{
  "dependencies": {
    "agora-rtc-sdk-ng": "^4.21.0",
    "agora-rtc-react": "^2.3.0"
  }
}
```

### 3.2 Créer la query GraphQL

**Fichier** : `src/graphql/queries/agora-queries.ts`

```typescript
import { gql } from "@apollo/client";

export const GENERATE_AGORA_TOKEN = gql`
  mutation GenerateAgoraToken($channelName: String!, $liveId: String) {
    generateAgoraToken(channelName: $channelName, liveId: $liveId) {
      token
      appId
      uid
      channelName
      expiresAt
    }
  }
`;
```

### 3.3 Créer le hook useAgora

**Fichier** : `src/hooks/useAgora.ts`

```typescript
import { useEffect, useState, useCallback, useRef } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IAgoraRTCRemoteUser,
  UID,
} from "agora-rtc-sdk-ng";
import { useMutation } from "@apollo/client";
import { GENERATE_AGORA_TOKEN } from "@/graphql/queries/agora-queries";

// Configuration Agora
AgoraRTC.setLogLevel(3); // 0=debug, 1=info, 2=warning, 3=error, 4=none

interface UseAgoraOptions {
  channelName: string;
  role: "host" | "audience";
  enableVideo?: boolean;
  enableAudio?: boolean;
  publishAudio?: boolean;
  publishVideo?: boolean;
  autoJoin?: boolean;
}

interface AgoraState {
  isJoined: boolean;
  isPublishing: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  localAudioTrack: ILocalAudioTrack | null;
  localVideoTrack: ILocalVideoTrack | null;
  remoteUsers: IAgoraRTCRemoteUser[];
  error: Error | null;
}

export const useAgora = ({
  channelName,
  role,
  enableVideo = false,
  enableAudio = true,
  publishAudio = true,
  publishVideo = false,
  autoJoin = true,
}: UseAgoraOptions) => {
  // État
  const [state, setState] = useState<AgoraState>({
    isJoined: false,
    isPublishing: false,
    isMuted: !publishAudio,
    isVideoOff: !publishVideo,
    localAudioTrack: null,
    localVideoTrack: null,
    remoteUsers: [],
    error: null,
  });

  // Client Agora (singleton)
  const clientRef = useRef<IAgoraRTCClient | null>(null);

  // Mutation pour obtenir le token
  const [getToken] = useMutation(GENERATE_AGORA_TOKEN);

  // Initialiser le client Agora
  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });
      console.log("✅ Agora client créé");
    }
    return () => {
      // Cleanup sera géré par leaveChannel
    };
  }, []);

  /**
   * Rejoindre le canal Agora
   */
  const joinChannel = useCallback(async () => {
    if (!clientRef.current || state.isJoined) return;

    try {
      console.log("🔄 Agora: Connexion au canal", channelName);

      // Obtenir le token depuis le backend
      const { data } = await getToken({
        variables: { channelName },
      });

      if (!data?.generateAgoraToken) {
        throw new Error("Impossible d'obtenir le token Agora");
      }

      const { token, appId, uid } = data.generateAgoraToken;

      // Rejoindre le canal
      await clientRef.current.join(appId, channelName, token, uid);

      console.log("✅ Agora: Canal rejoint", {
        channelName,
        uid,
        role,
      });

      // Créer et publier les tracks si nécessaire
      const tracks: (ILocalAudioTrack | ILocalVideoTrack)[] = [];

      // Track audio
      if (enableAudio && publishAudio) {
        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
          AEC: true, // Annulation écho
          ANS: true, // Suppression bruit
          AGC: true, // Contrôle gain automatique
        });
        setState((prev) => ({ ...prev, localAudioTrack: audioTrack }));
        tracks.push(audioTrack);
        console.log("🎤 Agora: Track audio créé");
      }

      // Track vidéo
      if (enableVideo && publishVideo) {
        const videoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: "720p_2", // 720p, 30fps, bitrate adaptatif
          optimizationMode: "detail", // Optimisé pour partage écran/détails
        });
        setState((prev) => ({ ...prev, localVideoTrack: videoTrack }));
        tracks.push(videoTrack);
        console.log("📹 Agora: Track vidéo créé");
      }

      // Publier les tracks
      if (tracks.length > 0) {
        await clientRef.current.publish(tracks);
        setState((prev) => ({ ...prev, isPublishing: true }));
        console.log("📤 Agora: Tracks publiés", tracks.length);
      }

      setState((prev) => ({ ...prev, isJoined: true, error: null }));
    } catch (error) {
      console.error("❌ Agora: Erreur joinChannel", error);
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error : new Error("Erreur Agora"),
      }));
    }
  }, [
    channelName,
    role,
    enableAudio,
    enableVideo,
    publishAudio,
    publishVideo,
    state.isJoined,
  ]);

  /**
   * Quitter le canal Agora
   */
  const leaveChannel = useCallback(async () => {
    if (!clientRef.current || !state.isJoined) return;

    try {
      console.log("🔄 Agora: Déconnexion du canal");

      // Fermer les tracks locaux
      state.localAudioTrack?.close();
      state.localVideoTrack?.close();

      // Quitter le canal
      await clientRef.current.leave();

      setState({
        isJoined: false,
        isPublishing: false,
        isMuted: true,
        isVideoOff: true,
        localAudioTrack: null,
        localVideoTrack: null,
        remoteUsers: [],
        error: null,
      });

      console.log("✅ Agora: Canal quitté");
    } catch (error) {
      console.error("❌ Agora: Erreur leaveChannel", error);
    }
  }, [state.isJoined, state.localAudioTrack, state.localVideoTrack]);

  /**
   * Toggle mute/unmute audio
   */
  const toggleMute = useCallback(async () => {
    if (!state.localAudioTrack) return;

    try {
      await state.localAudioTrack.setEnabled(state.isMuted);
      setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
      console.log(state.isMuted ? "🔊 Audio activé" : "🔇 Audio coupé");
    } catch (error) {
      console.error("❌ Erreur toggle mute", error);
    }
  }, [state.localAudioTrack, state.isMuted]);

  /**
   * Toggle vidéo on/off
   */
  const toggleVideo = useCallback(async () => {
    if (!state.localVideoTrack) return;

    try {
      await state.localVideoTrack.setEnabled(state.isVideoOff);
      setState((prev) => ({ ...prev, isVideoOff: !prev.isVideoOff }));
      console.log(state.isVideoOff ? "📹 Vidéo activée" : "📴 Vidéo coupée");
    } catch (error) {
      console.error("❌ Erreur toggle video", error);
    }
  }, [state.localVideoTrack, state.isVideoOff]);

  /**
   * Écouter les événements Agora
   */
  useEffect(() => {
    if (!clientRef.current) return;

    const client = clientRef.current;

    // Utilisateur distant publie
    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: "audio" | "video"
    ) => {
      console.log("👤 Agora: User published", user.uid, mediaType);

      // S'abonner au flux
      await client.subscribe(user, mediaType);

      // Jouer l'audio automatiquement
      if (mediaType === "audio" && user.audioTrack) {
        user.audioTrack.play();
      }

      // Mettre à jour la liste des utilisateurs
      setState((prev) => {
        const exists = prev.remoteUsers.find((u) => u.uid === user.uid);
        if (exists) {
          return {
            ...prev,
            remoteUsers: prev.remoteUsers.map((u) =>
              u.uid === user.uid ? user : u
            ),
          };
        }
        return {
          ...prev,
          remoteUsers: [...prev.remoteUsers, user],
        };
      });
    };

    // Utilisateur distant dépublie
    const handleUserUnpublished = (
      user: IAgoraRTCRemoteUser,
      mediaType: "audio" | "video"
    ) => {
      console.log("👤 Agora: User unpublished", user.uid, mediaType);

      setState((prev) => ({
        ...prev,
        remoteUsers: prev.remoteUsers.map((u) =>
          u.uid === user.uid ? user : u
        ),
      }));
    };

    // Utilisateur distant quitte
    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      console.log("👤 Agora: User left", user.uid);

      setState((prev) => ({
        ...prev,
        remoteUsers: prev.remoteUsers.filter((u) => u.uid !== user.uid),
      }));
    };

    // Détection volume (qui parle)
    const handleVolumeIndicator = (volumes: { level: number; uid: UID }[]) => {
      volumes.forEach(({ uid, level }) => {
        if (level > 10) {
          // Niveau de parole détecté
          console.log(`🗣️ User ${uid} parle (level: ${level})`);
        }
      });
    };

    // Enregistrer les listeners
    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("user-left", handleUserLeft);
    client.on("volume-indicator", handleVolumeIndicator);

    // Activer détection volume
    client.enableAudioVolumeIndicator();

    // Cleanup
    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("user-left", handleUserLeft);
      client.off("volume-indicator", handleVolumeIndicator);
    };
  }, []);

  /**
   * Auto-join si activé
   */
  useEffect(() => {
    if (autoJoin && channelName && !state.isJoined) {
      joinChannel();
    }

    // Cleanup : quitter le canal au démontage
    return () => {
      if (state.isJoined) {
        leaveChannel();
      }
    };
  }, [autoJoin, channelName]);

  return {
    // État
    ...state,

    // Méthodes
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleVideo,

    // Helpers
    remoteVideoUsers: state.remoteUsers.filter((u) => u.hasVideo),
    remoteAudioUsers: state.remoteUsers.filter((u) => u.hasAudio),
    participantCount: state.remoteUsers.length + (state.isJoined ? 1 : 0),
  };
};
```

### 3.4 Créer les composants UI

**Fichier** : `src/components/live/AgoraVideoRoom.tsx`

```typescript
"use client";

import { useRef, useEffect } from "react";
import { IAgoraRTCRemoteUser, ILocalVideoTrack } from "agora-rtc-sdk-ng";
import { useAgora } from "@/hooks/useAgora";

interface AgoraVideoRoomProps {
  channelName: string;
  role: "host" | "audience";
  enableVideo?: boolean;
  enableAudio?: boolean;
  publishVideo?: boolean;
  publishAudio?: boolean;
  className?: string;
}

/**
 * Composant principal pour la room audio/vidéo Agora
 */
export const AgoraVideoRoom: React.FC<AgoraVideoRoomProps> = ({
  channelName,
  role,
  enableVideo = false,
  enableAudio = true,
  publishVideo = false,
  publishAudio = true,
  className = "",
}) => {
  const agora = useAgora({
    channelName,
    role,
    enableVideo,
    enableAudio,
    publishVideo,
    publishAudio,
    autoJoin: true,
  });

  return (
    <div className={`agora-video-room ${className}`}>
      {/* Statut connexion */}
      <div className="agora-status">
        {agora.isJoined ? (
          <span className="text-success flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Audio connecté • {agora.participantCount} participant(s)
          </span>
        ) : (
          <span className="text-muted flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            Connexion audio...
          </span>
        )}
      </div>

      {/* Contrôles utilisateur */}
      {(publishAudio || publishVideo) && (
        <div className="agora-controls flex gap-2 mt-2">
          {publishAudio && (
            <button
              onClick={agora.toggleMute}
              className={`btn ${agora.isMuted ? "btn-danger" : "btn-success"}`}
              disabled={!agora.isJoined}
            >
              {agora.isMuted ? "🔇 Micro coupé" : "🎤 Micro actif"}
            </button>
          )}

          {publishVideo && (
            <button
              onClick={agora.toggleVideo}
              className={`btn ${
                agora.isVideoOff ? "btn-danger" : "btn-success"
              }`}
              disabled={!agora.isJoined}
            >
              {agora.isVideoOff ? "📴 Caméra off" : "📹 Caméra on"}
            </button>
          )}
        </div>
      )}

      {/* Vidéo locale */}
      {agora.localVideoTrack && !agora.isVideoOff && (
        <div className="local-video mt-4">
          <h3 className="text-sm font-semibold mb-2">Votre caméra</h3>
          <LocalVideoPlayer videoTrack={agora.localVideoTrack} />
        </div>
      )}

      {/* Vidéos distantes */}
      {agora.remoteVideoUsers.length > 0 && (
        <div className="remote-videos mt-4">
          <h3 className="text-sm font-semibold mb-2">Formateurs</h3>
          <div className="grid grid-cols-1 gap-4">
            {agora.remoteVideoUsers.map((user) => (
              <RemoteVideoPlayer key={user.uid} user={user} />
            ))}
          </div>
        </div>
      )}

      {/* Erreurs */}
      {agora.error && (
        <div className="agora-error mt-2 p-2 bg-red-100 text-red-800 rounded">
          ❌ Erreur Agora: {agora.error.message}
        </div>
      )}
    </div>
  );
};

/**
 * Player pour la vidéo locale
 */
const LocalVideoPlayer: React.FC<{ videoTrack: ILocalVideoTrack }> = ({
  videoTrack,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && videoTrack) {
      videoTrack.play(containerRef.current);
    }
    return () => {
      videoTrack.stop();
    };
  }, [videoTrack]);

  return (
    <div className="video-container relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
        👤 Vous
      </div>
    </div>
  );
};

/**
 * Player pour les vidéos distantes
 */
const RemoteVideoPlayer: React.FC<{ user: IAgoraRTCRemoteUser }> = ({
  user,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && user.videoTrack) {
      user.videoTrack.play(containerRef.current);
    }
    return () => {
      user.videoTrack?.stop();
    };
  }, [user.videoTrack]);

  return (
    <div className="video-container relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
        👨‍🏫 User {user.uid}
      </div>
      {user.hasAudio && (
        <div className="absolute top-2 right-2 bg-green-500 p-1 rounded-full">
          🎤
        </div>
      )}
    </div>
  );
};
```

### 3.5 Intégration dans la page live

**Fichier** : `src/app/(formation)/formation/live/[id]/page.tsx`

```typescript
// Ajouter l'import
import { AgoraVideoRoom } from "@/components/live/AgoraVideoRoom";

// Dans le composant LiveStreamPage

export default function LiveStreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();

  // Déterminer les rôles
  const isFormateurPrincipal = user?.role === "formateur"; // Ajuster selon votre logique
  const isFormateurSecondaire = false; // À implémenter : détection formateur secondaire
  const isParticipant = user?.role === "student";

  return (
    <div className="flex h-[calc(100vh-100px)] bg-gray-900">
      {/* Colonne gauche : Vidéo principale */}
      <div className="flex-1 flex flex-col">
        {/* Écran principal (votre système actuel) */}
        <div className="flex-1">
          {isFormateurPrincipal ? (
            <LiveBroadcaster streamId={id} />
          ) : (
            <LiveStreamPlayer streamId={id} token={null} useWebSocket={true} />
          )}
        </div>

        {/* NOUVEAU : Agora Video Room */}
        <div className="bg-gray-800 p-4 border-t border-gray-700">
          <AgoraVideoRoom
            channelName={`live-${id}`}
            role={
              isFormateurSecondaire || isFormateurPrincipal
                ? "host"
                : "audience"
            }
            enableVideo={isFormateurSecondaire}
            enableAudio={true}
            publishVideo={isFormateurSecondaire}
            publishAudio={isFormateurSecondaire || isParticipant}
          />
        </div>
      </div>

      {/* Colonne droite : Salons de chat (système actuel) */}
      <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
        {/* ... reste du code existant ... */}
      </div>
    </div>
  );
}
```

---

## 🎨 Étape 4 : Styles CSS (optionnel, 1h)

**Fichier** : `src/components/live/AgoraVideoRoom.css`

```css
.agora-video-room {
  /* Styles pour la room */
}

.agora-status {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
}

.agora-controls {
  display: flex;
  gap: 0.5rem;
}

.agora-controls .btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.agora-controls .btn-success {
  background: #10b981;
  color: white;
}

.agora-controls .btn-success:hover {
  background: #059669;
}

.agora-controls .btn-danger {
  background: #ef4444;
  color: white;
}

.agora-controls .btn-danger:hover {
  background: #dc2626;
}

.agora-controls .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #111;
  border-radius: 0.5rem;
  overflow: hidden;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

---

## 🧪 Étape 5 : Tests (2-3h)

### 5.1 Tests backend

```bash
# Terminal 1 : Lancer Django
python manage.py runserver

# Terminal 2 : Tester la mutation
curl -X POST http://localhost:8000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -d '{
    "query": "mutation { generateAgoraToken(channelName: \"test\") { token appId uid } }"
  }'
```

### 5.2 Tests frontend

1. **Test connexion** :

   - Ouvrir 2 navigateurs (Chrome + Firefox)
   - Se connecter avec 2 comptes différents
   - Rejoindre le même live
   - Vérifier que les 2 apparaissent dans la liste

2. **Test audio** :

   - Activer le micro dans le navigateur 1
   - Parler
   - Vérifier que le son est entendu dans le navigateur 2

3. **Test vidéo formateur secondaire** :

   - Se connecter en tant que formateur secondaire
   - Activer la caméra
   - Vérifier que la vidéo apparaît chez les participants

4. **Test qualité réseau** :
   - Chrome DevTools → Network → Throttling → Fast 3G
   - Vérifier que la qualité s'adapte automatiquement

### 5.3 Tests de charge

Tester avec 10+ participants :

```bash
# Utiliser le test de l'Agora console
# https://webdemo.agora.io/agora-web-showcase/examples/Agora-Web-Tutorial-1to1-Web/
```

---

## 📊 Monitoring & Logs

### Dans la console Agora

1. Aller sur https://console.agora.io
2. Projet → Analytics
3. Voir :
   - Nombre d'utilisateurs connectés en temps réel
   - Consommation de minutes
   - Qualité réseau moyenne
   - Taux de perte de paquets

### Logs dans le code

```typescript
// Activer logs détaillés pour debug
AgoraRTC.setLogLevel(0); // 0=debug, 4=none

// Dans useAgora, tous les événements sont déjà loggés :
console.log("✅ Agora: Canal rejoint");
console.log("🎤 Track audio créé");
console.log("👤 User published");
// etc.
```

---

## 🔒 Sécurité

### ✅ Bonnes pratiques

1. **Ne JAMAIS exposer le certificate** :

   ```typescript
   // ❌ MAUVAIS
   const token = generateToken(APP_ID, APP_CERTIFICATE, ...);

   // ✅ BON
   const { token } = await getTokenFromBackend();
   ```

2. **Vérifier les permissions** :

   ```python
   # Backend : vérifier que l'user peut rejoindre ce live
   if not user.has_access_to_live(live_id):
       raise Exception("Accès refusé")
   ```

3. **Limiter la durée des tokens** :

   ```python
   # Token expire après 2h max
   expiration_hours=2
   ```

4. **Logger les accès** :
   ```python
   # Logger qui rejoint quel canal
   AuditLog.objects.create(
       user=user,
       action='join_agora_channel',
       channel=channel_name
   )
   ```

---

## 🐛 Troubleshooting

### Problème : "Failed to join channel"

**Causes** :

- Token invalide/expiré
- App ID incorrect
- Problème réseau/firewall

**Solution** :

```typescript
// Vérifier dans la console
console.log("Token:", token);
console.log("App ID:", appId);
console.log("Channel:", channelName);

// Tester la connexion réseau
fetch("https://ap-web-1.agora.io").then((r) => console.log("Agora accessible"));
```

### Problème : "Cannot access microphone"

**Causes** :

- Permissions navigateur refusées
- Micro déjà utilisé par autre app
- HTTPS requis (pas HTTP)

**Solution** :

```typescript
// Demander les permissions explicitement
navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then(() => console.log("✅ Micro autorisé"))
  .catch((err) => console.error("❌ Micro refusé", err));
```

### Problème : "Echo/larsen audio"

**Causes** :

- Participant sans casque
- AEC (annulation écho) désactivé

**Solution** :

```typescript
// Vérifier que AEC est activé
const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
  AEC: true, // ← Important !
  ANS: true,
  AGC: true,
});
```

### Problème : "Vidéo saccadée"

**Causes** :

- Bande passante insuffisante
- CPU surchargé
- Trop de flux vidéo simultanés

**Solution** :

```typescript
// Limiter la qualité vidéo
const videoTrack = await AgoraRTC.createCameraVideoTrack({
  encoderConfig: "480p_1", // Au lieu de 720p_2
  optimizationMode: "motion", // Optimiser pour mouvement
});
```

---

## 📈 Optimisations futures

### Phase 2 (optionnel)

1. **Raise Hand** : Système pour lever la main avant de parler
2. **Modération** : Formateur peut mute des participants
3. **Enregistrement** : Sauvegarder les lives audio/vidéo
4. **Transcription** : Sous-titres automatiques via Agora AI
5. **Breakout rooms** : Petits groupes de discussion
6. **Screen sharing** : Participants peuvent partager leur écran

### Estimation développement Phase 2

- Raise Hand : 4h
- Modération : 6h
- Enregistrement : 8h
- Transcription : 10h (+ coûts API)
- Breakout rooms : 15h
- Screen sharing : 8h

**Total Phase 2 : ~50h supplémentaires**

---

## 📚 Ressources

### Documentation officielle

- **Agora** : https://docs.agora.io/en/video-calling/get-started/get-started-sdk
- **SDK React** : https://github.com/AgoraIO-Extensions/agora-rtc-react
- **Token Builder** : https://docs.agora.io/en/video-calling/develop/authentication-workflow

### Exemples de code

- **Demo officielle** : https://github.com/AgoraIO/API-Examples-Web
- **Next.js + Agora** : https://github.com/AgoraIO-Community/agora-next-web-app

### Support

- **Forum Agora** : https://agora-community.slack.com/
- **StackOverflow** : Tag `agora.io`

---

## ✅ Checklist finale

### Backend

- [ ] Compte Agora créé
- [ ] App ID et Certificate récupérés
- [ ] Variables d'env configurées
- [ ] `agora-token-builder` installé
- [ ] Service `AgoraService` créé
- [ ] Mutation GraphQL `generateAgoraToken` créée
- [ ] Tests backend OK

### Frontend

- [ ] SDK Agora installé (`agora-rtc-sdk-ng`)
- [ ] Query GraphQL créée
- [ ] Hook `useAgora` créé
- [ ] Composant `AgoraVideoRoom` créé
- [ ] Intégration dans page live
- [ ] Tests multi-navigateurs OK
- [ ] Tests audio/vidéo OK

### Production

- [ ] Variables d'env déployées
- [ ] Logs Agora configurés
- [ ] Monitoring actif
- [ ] Documentation utilisateurs

---

## 💰 Résumé coûts

| Item                        | Coût        |
| --------------------------- | ----------- |
| Développement (25h × 50€/h) | 1250€       |
| Compte Agora (gratuit)      | 0€          |
| Usage mensuel (10 lives)    | 40-60€/mois |
| **Total première année**    | **~2000€**  |

**ROI** : Fonctionnalité différenciante majeure pour formation interactive.

---

## 🎯 Next Steps

1. **Setup Agora** (30 min)

   - Créer compte
   - Récupérer credentials

2. **Backend** (4-6h)

   - Installer dépendances
   - Créer mutation

3. **Frontend** (8-12h)

   - Installer SDK
   - Créer hook + composants

4. **Tests** (2-3h)
   - Tests fonctionnels
   - Tests charge

**Temps total : ~20h de développement**

---

**Document créé le 8 décembre 2025**  
**Version : 1.0**  
**Statut : Prêt pour implémentation** ✅
