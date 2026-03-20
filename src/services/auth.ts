import { apiClient } from "./apiClient";

export type AuthResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    created_at?: string;
  };
};

export async function login(payload: { email: string; password: string }) {
  const res = await apiClient.post<AuthResponse>('/auth/login', payload);
  return res.data;
}

export async function register(payload: {
  email: string;
  password: string;
  name: string;
}) {
  const res = await apiClient.post<AuthResponse>('/auth/register', payload);
  return res.data;
}
