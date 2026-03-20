import { clearAuth, getToken, getUser } from '@/lib/auth-storage';

export function useAuth() {
  const token = getToken();
  const user = getUser();

  return {
    token,
    user,
    isAuthenticated: !!token,
    logout: clearAuth,
  };
}

//Updating this file to see if github updates