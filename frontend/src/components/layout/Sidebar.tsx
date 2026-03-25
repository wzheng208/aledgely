import { BarChart3, FolderKanban, LogOut, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import aledgelyIcon from '@/assets/aledgely-icon-light.png';

import { useAuth } from '@/hooks/useAuth';
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

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavSectionProps = {
  title: string;
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
};

type SidebarProps = {
  onNavigate?: () => void;
};

function NavSection({ title, items, pathname, onNavigate }: NavSectionProps) {
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
              <Link
                to={item.href}
                onClick={() => onNavigate?.()}
              >
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

export function Sidebar({ onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    onNavigate?.();
    logout();
    navigate('/login');
  };

  return (
    <aside className='flex h-full w-full max-w-[280px] flex-col border-r border-white/10 bg-slate-900 text-white lg:w-64 lg:max-w-none'>
      <div className='px-4 py-5 sm:px-5'>
        <div className='flex items-center gap-3'>
          <img
            src={aledgelyIcon}
            alt='Aledgely icon'
            className='h-14 w-14 object-contain sm:h-16 sm:w-16'
          />

          <div className='min-w-0'>
            <h1 className='truncate text-lg font-semibold tracking-tight text-slate-50'>
              Aledgely
            </h1>
            <p className='text-xs text-slate-400'>Business tracking</p>
          </div>
        </div>
      </div>

      <Separator className='bg-white/10' />

      <div className='flex flex-1 flex-col px-2 py-4'>
        <NavSection
          title='Menu'
          items={menuItems}
          pathname={location.pathname}
          onNavigate={onNavigate}
        />

        <div className='flex flex-1 items-center'>
          <div className='w-full'>
            <NavSection
              title='General'
              items={generalItems}
              pathname={location.pathname}
              onNavigate={onNavigate}
            />
          </div>
        </div>

        <div className='px-2 pb-0 pt-4'>
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
      </div>
    </aside>
  );
}
