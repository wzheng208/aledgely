import { createContext } from 'react';

export type AuthUser = {
  id: number;
  name: string | null;
  email: string;
};

export type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (data: { token: string; user: AuthUser }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
