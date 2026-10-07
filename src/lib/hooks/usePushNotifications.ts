import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

export function usePushNotifications() {
  const [permission,   setPermission]   = useState<NotificationPermission>('default');
  const [isSupported,  setIsSupported]  = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function subscribe() {
    if (!isSupported) return;
    setIsLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') return;

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      await apiClient.post('/push/subscribe', subscription.toJSON());
      setIsSubscribed(true);
    } catch (err) {
      console.error('Push subscription error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendTestNotification() {
    await apiClient.post('/push/send', {
      title: 'TechnoFind 🔔',
      body:  'Les notifications fonctionnent !',
      url:   '/alerts',
    });
  }

  return {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    subscribe,
    sendTestNotification,
  };
}