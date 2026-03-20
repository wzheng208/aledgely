import { BarChart3, FolderKanban, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { clearAuth } from '@/lib/auth-storage';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    label: 'Records',
    href: '/records',
    icon: FolderKanban,
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <aside className='flex h-screen w-64 flex-col border-r border-slate-200 bg-white'>
      <div className='px-6 py-6'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white'>
            A
          </div>

          <div>
            <h1 className='text-lg font-semibold tracking-tight text-slate-900'>
              Aledgely
            </h1>
            <p className='text-xs text-slate-500'>Business tracking</p>
          </div>
        </div>
      </div>

      <Separator />

      <nav className='flex-1 px-4 py-4'>
        <div className='space-y-2'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Button
                key={item.label}
                variant={isActive ? 'secondary' : 'ghost'}
                className='h-11 w-full justify-start gap-3 text-sm'
                asChild
              >
                <Link to={item.href}>
                  <Icon className='h-4 w-4' />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>

      <div className='px-4 py-4'>
        <Separator className='mb-4' />
        <Button
          variant='ghost'
          className='h-11 w-full justify-start gap-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700'
          onClick={handleLogout}
        >
          <LogOut className='h-4 w-4' />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
