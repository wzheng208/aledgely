import { BarChart3, FolderKanban, LogOut, Settings } from 'lucide-react';
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
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
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
    <aside className='flex h-full w-64 flex-col bg-slate-900 px-4 py-5 text-white'>
      {' '}
      <div className='px-4 py-5'>
        <div className='flex items-center gap-3'>
          <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-sm font-semibold text-slate-100 ring-1 ring-white/10'>
            A
          </div>

          <div>
            <h1 className='text-lg font-semibold tracking-tight text-slate-50'>
              Aledgely
            </h1>
            <p className='text-xs text-slate-400'>Business tracking</p>
          </div>
        </div>
      </div>
      <Separator className='bg-white/10' />
      <nav className='flex-1 px-2 py-4'>
        <div className='space-y-2'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Button
                key={item.label}
                variant='ghost'
                className={`h-11 w-full justify-start gap-3 rounded-xl px-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-800 text-slate-50 shadow-sm hover:bg-slate-800'
                    : 'text-slate-300 hover:bg-white/5 hover:text-slate-50'
                }`}
                asChild
              >
                <Link to={item.href}>
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-slate-100' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              </Button>
            );
          })}
        </div>
      </nav>
      <div className='px-4 py-4'>
        <Separator className='mb-4 bg-white/10' />
        <Button
          variant='ghost'
          className='h-11 w-full justify-start gap-3 rounded-xl px-3 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200'
          onClick={handleLogout}
        >
          <LogOut className='h-4 w-4' />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}


