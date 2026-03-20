import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
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
};

const CHART_COLORS = [
  '#6366f1', // indigo
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
];

export function CategoryPieChartCard({
  title,
  description,
  data,
  valueFormatter = (value) => `$${value.toFixed(2)}`,
}: CategoryPieChartCardProps) {
  return (
    <Card className='shadow-sm border border-slate-200 bg-white'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent className='pt-0'>
        <div className='h-[320px] w-full'>
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
        </div>
      </CardContent>
    </Card>
  );
}
