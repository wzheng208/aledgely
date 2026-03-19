import { BarChart3, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  {
    label: 'Dashboard',
    href: '#',
    icon: BarChart3,
    active: true,
  },
  {
    label: 'Records',
    href: '#',
    icon: FolderKanban,
    active: false,
  },
];

export function Sidebar() {
  return (
    <aside className='flex h-screen w-64 flex-col border-r border-slate-900 bg-white '>
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

            return (
              <Button
                key={item.label}
                variant={item.active ? 'secondary' : 'ghost'}
                className='h-11 w-full justify-start gap-3 text-sm hover:bg-slate-800'
                asChild
              >
                <a href={item.href}>
                  <Icon className='h-4 w-4' />
                  <span>{item.label}</span>
                </a>
              </Button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
