import { useMemo, useState } from 'react';
import { clearAuth, getToken, getUser, saveAuth } from '@/lib/auth-storage';
import { AuthContext, type AuthUser } from '@/contexts/auth-context';

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => getToken());
  const [user, setUser] = useState<AuthUser | null>(() => getUser());

  const setAuth = ({ token, user }: { token: string; user: AuthUser }) => {
    saveAuth({ token, user });
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      setAuth,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
