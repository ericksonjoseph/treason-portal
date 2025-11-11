import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';
import ReportsFilters from '@/components/ReportsFilters';
import { DateRange } from 'react-day-picker';
import type { Traitor } from '@/types/traitor';

export default function Reports() {
  const [selectedTraitors, setSelectedTraitors] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const mockTraitors: Traitor[] = [
    { id: 'rsi-macd', name: 'RSI + MACD Strategy', description: 'Mean reversion with momentum' },
    { id: 'ema-crossover', name: 'EMA Crossover', description: 'Fast/slow moving average' },
    { id: 'bollinger', name: 'Bollinger Bands', description: 'Volatility breakout' },
    { id: 'ml-predictor', name: 'ML Price Predictor', description: 'Neural network model' },
  ];

  const mockTickers = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'AMD'];

  const modes = [
    { value: 'backtest', label: 'Backtest' },
    { value: 'live', label: 'Live Trading' },
  ];

  const handleReset = () => {
    setSelectedTraitors([]);
    setSelectedModes([]);
    setSelectedTickers([]);
    setDateRange(undefined);
  };

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-2">
            View comprehensive trading reports and analytics
          </p>
        </div>

        <ReportsFilters
          traitors={mockTraitors}
          selectedTraitors={selectedTraitors}
          onTraitorsChange={setSelectedTraitors}
          tickers={mockTickers}
          selectedTickers={selectedTickers}
          onTickersChange={setSelectedTickers}
          modes={modes}
          selectedModes={selectedModes}
          onModesChange={setSelectedModes}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onReset={handleReset}
        />

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

        <Card data-testid="card-reports-placeholder">
          <CardHeader>
            <CardTitle>Detailed Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center space-y-2">
                <BarChart3 className="h-12 w-12 mx-auto opacity-50" />
                <p>Detailed reports and analytics will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
