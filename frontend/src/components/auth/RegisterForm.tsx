import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthCard } from './AuthCard';
import { useRegister } from '@/hooks/useRegister';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, loading, error } = useRegister();

  const [form, setForm] = useState({
    name: '',
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
      await register(form);
      navigate('/dashboard');
    } catch {
      // handled in hook
    }
  };

  return (
    <AuthCard
      title='Create account'
      description='Start tracking income, expenses, and mileage with Aledgely.'
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-5'
      >
        <div className='space-y-2'>
          <Label
            htmlFor='name'
            className='text-sm font-medium text-slate-200'
          >
            Name
          </Label>
          <Input
            id='name'
            name='name'
            type='text'
            value={form.name}
            onChange={handleChange}
            placeholder='Demo Operator'
            className='h-11 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-slate-400'
          />
        </div>

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
            placeholder='Create a password'
            className='h-11 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-slate-400'
          />
        </div>

        {error && (
          <div className='rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300'>
            {error}
          </div>
        )}

        <Button
          type='submit'
          className='h-11 w-full rounded-xl bg-slate-100 text-slate-900 hover:bg-white'
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>

        <p className='text-center text-sm text-slate-400'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium text-slate-200 underline underline-offset-4 transition hover:text-white'
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
