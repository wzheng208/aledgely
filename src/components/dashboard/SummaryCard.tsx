import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SummaryCardProps = {
  title: string;
  value: string;
  tone?: 'income' | 'expense' | 'mileage' | 'profit';
};

const toneClasses = {
  income: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  expense: 'bg-rose-50 text-rose-700 border-rose-200',
  mileage: 'bg-blue-50 text-blue-700 border-blue-200',
  profit: 'bg-violet-50 text-violet-700 border-violet-200',
};

export function SummaryCard({
  title,
  value,
  tone = 'income',
}: SummaryCardProps) {
  return (
    <Card className='shadow-sm border border-slate-200 bg-white hover:shadow-md transition'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
        <CardTitle className='text-sm font-medium text-slate-500'>
          {title}
        </CardTitle>

        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
        >
          Summary
        </span>
      </CardHeader>

      <CardContent>
        <div className='text-3xl font-semibold tracking-tight text-slate-900'>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
