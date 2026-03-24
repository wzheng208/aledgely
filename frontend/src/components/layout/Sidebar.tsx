import { BarChart3, FolderKanban, LogOut, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import aledgelyIcon from '@/assets/aledgely-icon-light.png';

import { clearAuth } from '@/lib/auth-storage';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const menuItems = [
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

const generalItems = [
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

type NavSectionProps = {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  pathname: string;
};

function NavSection({ title, items, pathname }: NavSectionProps) {
  return (
    <div>
      <p className='mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500'>
        {title}
      </p>

      <div className='space-y-2'>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

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
    </div>
  );
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <aside className='flex h-full w-64 flex-col bg-slate-900 px-4 py-5 text-white'>
      <div className='px-4 py-5'>
        <div className='flex items-center gap-3'>
          <img
            src={aledgelyIcon}
            alt='Aledgely icon'
            className='h-20 w-20 object-contain'
          />

          <div>
            <h1 className='text-lg font-semibold tracking-tight text-slate-50'>
              Aledgely
            </h1>
            <p className='text-xs text-slate-400'>Business tracking</p>
          </div>
        </div>
      </div>

      <Separator className='bg-white/10' />

      <div className='flex-1 overflow-y-auto px-2 py-4'>
        <div className='space-y-8'>
          <NavSection
            title='Menu'
            items={menuItems}
            pathname={location.pathname}
          />

          <NavSection
            title='General'
            items={generalItems}
            pathname={location.pathname}
          />
        </div>
      </div>

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
