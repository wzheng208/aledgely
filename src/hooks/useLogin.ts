import { useState } from 'react';
import { apiClient } from '@/services/apiClient';
import { setAuth } from '@/lib/auth-storage';
import type { AuthResponse, LoginPayload } from '@/types/auth';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async (payload: LoginPayload) => {
    try {
      setLoading(true);
      setError('');

      const res = await apiClient.post<AuthResponse>('/api/auth/login', payload);
      setAuth(res.data.token, res.data.user);

      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
}
