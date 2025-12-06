/**
 * Types PWA
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export interface PushSubscriptionOptions {
  userVisibleOnly: boolean;
  applicationServerKey: string;
}

export const PWA_CONFIG = {
  VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  CACHE_VERSION: "v1.0.0",
  OFFLINE_URL: "/offline",
  NOTIFICATION_ICON: "/icons/icon-192x192.png",
  NOTIFICATION_BADGE: "/icons/icon-96x96.png",
};
