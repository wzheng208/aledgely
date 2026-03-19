import { ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className='min-h-screen bg-muted/40 text-foreground'>
      <div className='flex min-h-screen'>
        <aside className='hidden w-64 border-r bg-background md:flex md:flex-col'>
          <div className='border-b px-6 py-5'>
            <h1 className='text-2xl font-semibold tracking-tight'>Aledgely</h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Track income, expenses, and mileage
            </p>
          </div>

          <nav className='flex-1 px-4 py-4'>
            <button className='w-full rounded-lg bg-muted px-3 py-2 text-left text-sm font-medium'>
              Dashboard
            </button>
          </nav>
        </aside>

        <main className='flex-1'>
          <div className='mx-auto max-w-6xl p-6 md:p-8'>{children}</div>
        </main>
      </div>
    </div>
  );
}
