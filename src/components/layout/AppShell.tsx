import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShell() {
  return (
    <div className='h-screen overflow-hidden bg-slate-100'>
      <div className='flex h-full'>
        <Sidebar />

        <main className='flex-1 p-4 overflow-hidden'>
          <div className='h-full rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden'>
            <div className='h-full overflow-y-auto p-6 md:p-8'>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
