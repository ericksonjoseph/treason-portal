export interface SymbolRunRevenue {
  symbol: string;
  runId: string;
  revenue: number;
}

export interface TraitorRevenueData {
  traitorId: string;
  traitorName: string;
  revenue: number;
  symbolRuns: SymbolRunRevenue[];
}

export interface DailyRevenueData {
  date: string;
  totalRevenue: number;
  traitors: TraitorRevenueData[];
}

export interface RevenueTimeSeriesPoint {
  date: string;
  [key: string]: number | string;
}
