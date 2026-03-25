import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';

import { Sidebar } from '@/components/layout/Sidebar';
import { AppTopbar } from '@/components/layout/AppTopbar';
import { Button } from '@/components/ui/button';

export function AppShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className='h-screen overflow-hidden bg-slate-100'>
      <div className='flex h-full overflow-hidden'>
        <div className='hidden h-full lg:flex'>
          <Sidebar />
        </div>

        {mobileSidebarOpen && (
          <div className='fixed inset-0 z-50 lg:hidden'>
            <button
              type='button'
              aria-label='Close sidebar'
              className='absolute inset-0 bg-slate-950/70 backdrop-blur-sm'
              onClick={() => setMobileSidebarOpen(false)}
            />

            <div className='absolute left-0 top-0 h-full w-[280px] max-w-[85vw]'>
              <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        <div className='flex min-w-0 flex-1 flex-col overflow-hidden'>
          <header className='sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-slate-100/95 px-4 backdrop-blur lg:hidden'>
            <div className='text-sm font-semibold text-slate-900'>Aledgely</div>

            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => setMobileSidebarOpen(true)}
              className='text-slate-700 hover:bg-slate-200'
            >
              <Menu className='h-5 w-5' />
            </Button>
          </header>

          <main className='flex-1 overflow-hidden p-3 sm:p-4 lg:p-4'>
            <div className='flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-[28px]'>
              <AppTopbar />

              <div className='min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8'>
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
