import { useCategorySummary } from '@/hooks/useCategorySummary';
import { CategoryPieChartCard } from '@/components/dashboard/CategoryPieChartCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency, formatMileage } from '@/utils/format';

type SummaryChartsProps = {
  startDate?: string;
  endDate?: string;
};

export function SummaryCharts({ startDate, endDate }: SummaryChartsProps) {
  const { data, loading, error } = useCategorySummary({ startDate, endDate });

  if (loading) {
    return (
      <section className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
        <Card className='h-[420px]' />
        <Card className='h-[420px]' />
      </section>
    );
  }

  if (error || !data) {
    return (
      <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
        Failed to load chart data.
      </div>
    );
  }

  const mileageTotal = data.mileage.reduce(
    (sum, item) => sum + Number(item.total ?? 0),
    0,
  );

  return (
    <section className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
      <CategoryPieChartCard
        title='Income by Category'
        description='Breakdown of income sources'
        data={data.income}
        valueFormatter={formatCurrency}
      />

      <CategoryPieChartCard
        title='Expenses by Category'
        description='Breakdown of business expenses'
        data={data.expense}
        valueFormatter={formatCurrency}
      />

      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle>Mileage</CardTitle>
          <CardDescription>
            Total mileage tracked for this period
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='flex h-[320px] items-center justify-center'>
            <div className='text-center'>
              <p className='text-sm text-slate-500'>Total Mileage</p>
              <p className='mt-2 text-4xl font-semibold tracking-tight text-slate-900'>
                {formatMileage(mileageTotal)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
