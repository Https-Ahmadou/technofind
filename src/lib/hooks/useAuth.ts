import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth.store';
import { AuthTokens, User } from '@/types';

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return async () => {
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // ignore
    }
    localStorage.removeItem('access_token');
    logout();
    router.push('/login');
  };
}
