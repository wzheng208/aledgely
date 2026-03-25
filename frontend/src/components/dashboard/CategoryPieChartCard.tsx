import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ChartItem = {
  category: string;
  total: number;
};

type CategoryPieChartCardProps = {
  title: string;
  description?: string;
  data: ChartItem[];
  valueFormatter?: (value: number) => string;
  emptyTitle?: string;
  emptyDescription?: string;
};

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];

export function CategoryPieChartCard({
  title,
  description,
  data,
  valueFormatter = (value) => `$${value.toFixed(2)}`,
  emptyTitle = 'No data yet',
  emptyDescription = 'There is not enough data to display this chart for the selected period.',
}: CategoryPieChartCardProps) {
  const hasData = data.length > 0;

  return (
    <Card className='border border-slate-200 bg-white shadow-sm'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent className='pt-0'>
        <div className='h-[320px] w-full'>
          {hasData ? (
            <ResponsiveContainer
              width='100%'
              height='100%'
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey='total'
                  nameKey='category'
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`${entry.category}-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(value) => valueFormatter(Number(value ?? 0))}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className='flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm'>
                <PieChartIcon className='h-6 w-6' />
              </div>

              <h3 className='text-sm font-semibold text-slate-900'>
                {emptyTitle}
              </h3>

              <p className='mt-2 max-w-xs text-sm leading-6 text-slate-500'>
                {emptyDescription}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
