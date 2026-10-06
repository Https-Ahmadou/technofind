import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { apiClient } from '@/lib/api/client';

function setToken(token: string) {
  try {
    localStorage.setItem('access_token', token);
  } catch {
    // localStorage non disponible (mode privé Safari)
  }
}

function removeToken() {
  try {
    localStorage.removeItem('access_token');
  } catch {
    // ignore
  }
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // ignore
    }
    removeToken();
    logout();
    router.push('/login');
  };
}