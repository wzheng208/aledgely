import { useState } from 'react';
import { apiClient } from '@/services/apiClient';
import { useAuth } from '@/hooks/useAuth';
import type { AuthResponse, RegisterPayload } from '@/types/auth';

export function useRegister() {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const register = async (payload: RegisterPayload) => {
    try {
      setLoading(true);
      setError('');

      const res = await apiClient.post<AuthResponse>(
        '/api/auth/register',
        payload,
      );

      setAuth({
        token: res.data.token,
        user: res.data.user,
      });

      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
}
