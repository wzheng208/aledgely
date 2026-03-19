import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { SummaryCharts } from '@/components/dashboard/SummaryCharts';
import { Sidebar } from '@/components/layout/Sidebar';
import { TrendsChart } from '@/components/dashboard/TrendsChart';


export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-slate-100 text-slate-900'>
      <div className='flex min-h-screen'>
        <Sidebar />

        <main className='flex-1 p-8'>
          <div className='mx-auto max-w-7xl'>
            <div className='mb-6'>
              <h1 className='text-3xl font-semibold tracking-tight text-slate-900'>
                Dashboard
              </h1>
              <p className='mt-1 text-sm text-slate-500'>
                Welcome to Aledgely.
              </p>
            </div>

            <div className='space-y-6'>
              <SummaryCards />
              <TrendsChart />
              <SummaryCharts />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
