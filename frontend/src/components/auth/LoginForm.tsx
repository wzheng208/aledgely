import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCard } from './AuthCard';
import { useLogin } from '@/hooks/useLogin';
import { appToast } from '@/lib/toast';

export function LoginForm() {
  const navigate = useNavigate();
  const { login, loading } = useLogin();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [demoLoading, setDemoLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await appToast.promise(login(form), {
        loading: 'Signing you in...',
        success: 'Welcome back.',
        error: 'Login failed.',
      });

      navigate('/dashboard');
    } catch {
      // toast already handled
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);

    try {
      await appToast.promise(
        login({
          email: 'demo@aledgely.com',
          password: 'password123',
        }),
        {
          loading: 'Opening demo account...',
          success: 'Demo account ready.',
          error: 'Demo login failed.',
        },
      );

      navigate('/dashboard');
    } catch {
      // toast already handled
    } finally {
      setDemoLoading(false);
    }
  };

  const isDisabled = loading || demoLoading;

  return (
    <AuthCard
      title='Welcome back'
      description='Sign in to continue managing your business, or explore the app with a demo account.'
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-5'
      >
        <div className='space-y-2'>
          <Label
            htmlFor='email'
            className='text-sm font-medium text-slate-200'
          >
            Email
          </Label>
          <Input
            id='email'
            name='email'
            type='email'
            value={form.email}
            onChange={handleChange}
            placeholder='you@example.com'
            required
            className='h-11 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-slate-400'
          />
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='password'
            className='text-sm font-medium text-slate-200'
          >
            Password
          </Label>
          <Input
            id='password'
            name='password'
            type='password'
            value={form.password}
            onChange={handleChange}
            placeholder='Enter your password'
            required
            className='h-11 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-slate-400'
          />
        </div>

        <div className='space-y-3'>
          <Button
            type='submit'
            className='h-11 w-full rounded-xl bg-slate-100 text-slate-900 hover:bg-white'
            disabled={isDisabled}
          >
            {loading ? 'Logging in...' : 'Sign in'}
          </Button>

          <Button
            type='button'
            variant='outline'
            className='h-11 w-full rounded-xl border-white/10 bg-slate-900/40 text-slate-100 hover:bg-slate-800'
            onClick={handleDemoLogin}
            disabled={isDisabled}
          >
            {demoLoading ? 'Opening demo...' : 'Try demo'}
          </Button>
        </div>

        <p className='text-center text-sm text-slate-400'>
          Explore the app instantly with sample business data.
        </p>

        <p className='text-center text-sm text-slate-400'>
          Don&apos;t have an account?{' '}
          <Link
            to='/register'
            className='font-medium text-slate-200 underline underline-offset-4 transition hover:text-white'
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
