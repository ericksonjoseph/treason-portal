import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { ReportsLayout } from '@/components/ReportsLayout';
import ReportsFilters from '@/components/ReportsFilters';
import RevenueGraph from '@/components/RevenueGraph';
import { DateRange } from 'react-day-picker';
import { backendClient } from '@/lib/backendClient';
import type { Strategy } from '@/types/strategy';
import type { RevenueDataPoint } from '@/types/revenue';

export default function RevenueGraphPage() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Data from backend
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [tickers, setTickers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const modes = backendClient.getTradingModes();

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [revenueDataResult, strategiesData, tickersData] = await Promise.all([
          backendClient.getRevenueData(30),
          backendClient.getStrategies(),
          backendClient.getTickers(),
        ]);
        setRevenueData(revenueDataResult);
        setStrategies(strategiesData);
        setTickers(tickersData);
      } catch (error) {
        console.error('Failed to load revenue data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleReset = () => {
    setSelectedStrategies([]);
    setSelectedModes([]);
    setSelectedTickers([]);
    setDateRange(undefined);
  };

  const kpiCards = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card data-testid="card-total-trades">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">+20% from last month</p>
        </CardContent>
      </Card>

      <Card data-testid="card-win-rate">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">68.5%</div>
          <p className="text-xs text-muted-foreground">+2.3% from last month</p>
        </CardContent>
      </Card>

      <Card data-testid="card-total-profit">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      <Card data-testid="card-avg-trade">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Trade</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$36.65</div>
          <p className="text-xs text-muted-foreground">-4% from last month</p>
        </CardContent>
      </Card>
    </div>
  );

  const filters = (
    <ReportsFilters
      strategies={strategies}
      selectedStrategies={selectedStrategies}
      onStrategiesChange={setSelectedStrategies}
      tickers={tickers}
      selectedTickers={selectedTickers}
      onTickersChange={setSelectedTickers}
      modes={modes}
      selectedModes={selectedModes}
      onModesChange={setSelectedModes}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      onReset={handleReset}
    />
  );

  return (
    <ReportsLayout
      title="Revenue Graph"
      description="View revenue trends and performance over time"
      filters={filters}
      kpiCards={kpiCards}
    >
      <RevenueGraph data={revenueData} />
    </ReportsLayout>
  );
}
