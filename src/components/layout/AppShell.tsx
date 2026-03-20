import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShell() {
  return (
    <div className='min-h-screen bg-slate-100 text-slate-900'>
      <div className='flex min-h-screen'>
        <Sidebar />

        <main className='flex-1 p-8'>
          <div className='mx-auto max-w-7xl'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
