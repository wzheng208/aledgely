import { Bell, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import aledgelyIcon from '@/assets/aledgely-icon.png';
import { useAuth } from '@/hooks/useAuth';
import { getFirstName } from '@/lib/user';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/records': 'Records',
  '/settings': 'Settings',
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getPageLabel(pathname: string) {
  return pageTitles[pathname] ?? 'Aledgely';
}

export function AppTopbar() {
  const location = useLocation();

  const greeting = getGreeting();
  const pageLabel = getPageLabel(location.pathname);
    const { user } = useAuth();
    const userName = getFirstName(user?.name);

  return (
    <div className='hidden shrink-0 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-8'>
      <div className='min-w-0'>
        <h1 className='truncate text-2xl font-semibold tracking-tight text-slate-900'>
          {`${greeting}, ${userName}`}
        </h1>
        <p className='mt-1 text-sm text-slate-500'>{pageLabel}</p>
      </div>

      <div className='ml-6 flex items-center gap-3'>
        {/* <div className='relative hidden xl:block'>
          <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
          <input
            type='text'
            placeholder='Search anything'
            className='h-11 w-[280px] rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white'
          />
        </div> */}

        <button
          type='button'
          className='flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
          aria-label='Notifications'
        >
          <Bell className='h-4 w-4' />
        </button>

        <button
          type='button'
          className='flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-900'
          aria-label='Toggle theme'
        >
          <Moon className='h-4 w-4' />
        </button>

        <button
          type='button'
          className='flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 transition hover:bg-slate-200'
          aria-label='Profile'
        >
          <img
            src={aledgelyIcon}
            alt='Profile'
            className='h-full w-full object-cover'
          />
        </button>
      </div>
    </div>
  );
}
