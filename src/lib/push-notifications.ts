import { api } from './api/client';
import { isAuthenticated } from './api/auth';

const VAPID_PUBLIC_KEY =
  'BFe72HR5g7JA3ZRoMQgNEBi6ERHp8g3t8v2Tl674-jDXaCJEUPU4uDe7Zzo3d2REw_CH6Pqy5ZKhENv4XK6Gl2M';

const PUSH_TOKEN_KEY = 'mp-push-subscription';

/**
 * Convert VAPID base64 key to Uint8Array for PushManager.subscribe()
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Request notification permission and subscribe to push.
 * Works without authentication — stores subscription locally.
 * If authenticated, also sends token to backend immediately.
 */
export async function subscribeToPush(): Promise<boolean> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

    const registration = await navigator.serviceWorker.ready;

    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return false;

      // Subscribe
      const keyArray = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: keyArray as unknown as ArrayBuffer,
      });
    }

    // Extract keys
    const rawKey = subscription.getKey('p256dh');
    const rawAuth = subscription.getKey('auth');
    if (!rawKey || !rawAuth) return false;

    const p256dh = btoa(String.fromCharCode(...new Uint8Array(rawKey)));
    const auth = btoa(String.fromCharCode(...new Uint8Array(rawAuth)));

    const tokenData = {
      endpoint: subscription.endpoint,
      p256dhKey: p256dh,
      authKey: auth,
      deviceInfo: navigator.userAgent.slice(0, 200),
    };

    // Always save locally (so we can send after login)
    localStorage.setItem(PUSH_TOKEN_KEY, JSON.stringify(tokenData));

    // If authenticated, send to backend now
    if (isAuthenticated()) {
      await sendPushTokenToBackend(tokenData);
    }

    return true;
  } catch {
    // Non-critical — fail silently
    return false;
  }
}

/**
 * Send saved push token to backend.
 * Call this after login to associate the subscription with the user.
 */
export async function syncPushToken(): Promise<void> {
  try {
    if (!isAuthenticated()) return;
    const saved = localStorage.getItem(PUSH_TOKEN_KEY);
    if (!saved) return;

    const tokenData = JSON.parse(saved);
    await sendPushTokenToBackend(tokenData);
  } catch {
    // Non-critical
  }
}

async function sendPushTokenToBackend(tokenData: {
  endpoint: string;
  p256dhKey: string;
  authKey: string;
  deviceInfo: string;
}): Promise<void> {
  await api.post('/api/mp/me/push-token', tokenData);
}

/**
 * Check if push is available and permission is granted.
 */
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/**
 * Check current notification permission state.
 */
export function getPushPermission(): NotificationPermission | 'unsupported' {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}
