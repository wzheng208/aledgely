import { SummaryCard } from '@/components/dashboard/SummaryCard';
import { useSummary } from '@/hooks/useSummary';
import { formatCurrency, formatMileage } from '@/utils/format';

type SummaryCardsProps = {
  startDate?: string;
  endDate?: string;
};

export function SummaryCards({ startDate, endDate }: SummaryCardsProps) {
  const { data, loading, error } = useSummary({ startDate, endDate });

  if (loading) {
    return (
      <section className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <SummaryCard
          title='Total Income'
          value='Loading...'
          tone='income'
        />
        <SummaryCard
          title='Total Expenses'
          value='Loading...'
          tone='expense'
        />
        <SummaryCard
          title='Total Mileage'
          value='Loading...'
          tone='mileage'
        />
        <SummaryCard
          title='Net Profit'
          value='Loading...'
          tone='profit'
        />
      </section>
    );
  }

  if (error || !data) {
    return (
      <div className='rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700'>
        Failed to load summary data.
      </div>
    );
  }

  const totalIncome = Number(data.total_income ?? 0);
  const totalExpenses = Number(data.total_expenses ?? 0);
  const totalMileage = Number(data.total_mileage ?? 0);
  const netProfit = Number(data.net_profit ?? totalIncome - totalExpenses);

  return (
    <section className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
      <SummaryCard
        title='Total Income'
        value={formatCurrency(totalIncome)}
        tone='income'
      />
      <SummaryCard
        title='Total Expenses'
        value={formatCurrency(totalExpenses)}
        tone='expense'
      />
      <SummaryCard
        title='Total Mileage'
        value={formatMileage(totalMileage)}
        tone='mileage'
      />
      <SummaryCard
        title='Net Profit'
        value={formatCurrency(netProfit)}
        tone='profit'
      />
    </section>
  );
}
