export type SummaryCategoryItem = {
  category: string;
  percentage: number;
  total: number;
};

export type CategorySummaryResponse = {
  income: SummaryCategoryItem[];
  expense: SummaryCategoryItem[];
  mileage: SummaryCategoryItem[];
};

export type SummaryTotalsResponse = {
  total_income: number;
  total_expenses: number;
  total_mileage: number;
  net_profit: number;
};

export type SummaryTrendItem = {
  date: string;
  income: number;
  expense: number;
  net: number;
};