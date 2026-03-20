import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCard } from './AuthCard';
import { useLogin } from '@/hooks/useLogin';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, loading, error } = useLogin();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(form);
      navigate('/dashboard');
    } catch {
      // error handled in hook
    }
  };

  return (
    <AuthCard
      title='Welcome back'
      description='Login to continue to Alegdely'
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            value={form.email}
            onChange={handleChange}
            placeholder='you@example.com'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            value={form.password}
            onChange={handleChange}
            placeholder='Enter your password'
          />
        </div>

        {error && <p className='text-sm text-red-500'>{error}</p>}

        <Button
          type='submit'
          className='w-full'
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <p className='text-sm text-muted-foreground text-center'>
          Don&apos;t have an account?{' '}
          <Link
            to='/register'
            className='underline underline-offset-4'
          >
            Register
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
