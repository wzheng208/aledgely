import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useTrends } from '@/hooks/useTrends';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/utils/format';

type TrendsChartProps = {
  startDate?: string;
  endDate?: string;
};

function formatShortDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function TrendsChart({ startDate, endDate }: TrendsChartProps) {
  const { data, loading, error } = useTrends({ startDate, endDate });

  if (loading) {
    return (
      <Card className='border border-slate-200 bg-white shadow-sm'>
        <CardHeader>
          <CardTitle>Income vs Expenses Trend</CardTitle>
          <CardDescription>
            Track business performance over time
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='h-[320px] animate-pulse rounded-2xl bg-slate-100' />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='border border-red-200 bg-white shadow-sm'>
        <CardHeader>
          <CardTitle>Income vs Expenses Trend</CardTitle>
          <CardDescription>
            Track business performance over time
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
            Failed to load trend data.
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <Card className='border border-slate-200 bg-white shadow-sm'>
      <CardHeader>
        <CardTitle>Income vs Expenses Trend</CardTitle>
        <CardDescription>Track business performance over time</CardDescription>
      </CardHeader>

      <CardContent>
        <div className='h-[320px] w-full'>
          {hasData ? (
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <LineChart data={data}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='#e2e8f0'
                />
                <XAxis
                  dataKey='date'
                  tickFormatter={formatShortDate}
                  tick={{ fontSize: 12 }}
                  stroke='#64748b'
                />
                <YAxis
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 12 }}
                  stroke='#64748b'
                />
                <Tooltip
                  labelFormatter={(label) => formatShortDate(String(label))}
                  formatter={(value) => {
                    const safeValue = Array.isArray(value)
                      ? Number(value[0] ?? 0)
                      : Number(value ?? 0);

                    return formatCurrency(safeValue);
                  }}
                />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='income'
                  stroke='#22c55e'
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type='monotone'
                  dataKey='expense'
                  stroke='#ef4444'
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type='monotone'
                  dataKey='net'
                  stroke='#6366f1'
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className='flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm'>
                <TrendingUp className='h-6 w-6' />
              </div>

              <h3 className='text-sm font-semibold text-slate-900'>
                No trend data yet
              </h3>

              <p className='mt-2 max-w-sm text-sm leading-6 text-slate-500'>
                There is not enough activity in the selected period to show
                income, expenses, and net trends yet.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
