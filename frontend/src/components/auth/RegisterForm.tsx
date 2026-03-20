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
      // error handled in hook
    }
  };

  return (
    <AuthCard
      title='Create account'
      description='Start tracking your business with Alegdely'
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-4'
      >
        <div className='space-y-2'>
          <Label htmlFor='name'>Name</Label>
          <Input
            id='name'
            name='name'
            type='text'
            value={form.name}
            onChange={handleChange}
            placeholder='Demo Operator'
          />
        </div>

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
            placeholder='Create a password'
          />
        </div>

        {error && <p className='text-sm text-red-500'>{error}</p>}

        <Button
          type='submit'
          className='w-full'
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Register'}
        </Button>

        <p className='text-sm text-muted-foreground text-center'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='underline underline-offset-4'
          >
            Login
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
