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
    confirmPassword: '',
  });

  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formError) {
      setFormError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      navigate('/dashboard');
    } catch {
      // handled in hook
    }
  };

  const isSubmitDisabled =
    loading ||
    !form.name.trim() ||
    !form.email.trim() ||
    !form.password.trim() ||
    !form.confirmPassword.trim();

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
            autoComplete='name'
            value={form.name}
            onChange={handleChange}
            placeholder='Jane Doe'
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
            autoComplete='email'
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
            autoComplete='new-password'
            value={form.password}
            onChange={handleChange}
            placeholder='Create a password'
            className='h-11 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-slate-400'
          />
        </div>

        <div className='space-y-2'>
          <Label
            htmlFor='confirmPassword'
            className='text-sm font-medium text-slate-200'
          >
            Confirm Password
          </Label>
          <Input
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            autoComplete='new-password'
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder='Confirm your password'
            className='h-11 rounded-xl border-white/10 bg-slate-900/60 text-white placeholder:text-slate-400'
          />
        </div>

        {formError && (
          <div className='rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300'>
            {formError}
          </div>
        )}

        {error && (
          <div className='rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300'>
            {error}
          </div>
        )}

        <Button
          type='submit'
          className='h-11 w-full rounded-xl bg-slate-100 text-slate-900 hover:bg-white'
          disabled={isSubmitDisabled}
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
