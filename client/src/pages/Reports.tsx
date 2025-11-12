import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';
import ReportsFilters from '@/components/ReportsFilters';
import RevenueGraph from '@/components/RevenueGraph';
import RevenueCalendar from '@/components/RevenueCalendar';
import { DateRange } from 'react-day-picker';
import type { Traitor } from '@/types/traitor';

type ReportView = 'graph' | 'calendar';

export default function Reports() {
  const [selectedTraitors, setSelectedTraitors] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [reportView, setReportView] = useState<ReportView>('graph');

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

  const mockRevenueData = useMemo(() => {
    const data = [];
    const startDate = new Date('2025-11-01');
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 1000,
        trades: Math.floor(Math.random() * 50) + 10,
      });
    }
    
    return data;
  }, []);

  const mockCalendarData = useMemo(() => {
    const allSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'AMD'];
    
    return mockRevenueData.map((d) => {
      const numSymbols = Math.floor(Math.random() * 5) + 3;
      const selectedSymbols = allSymbols.slice(0, numSymbols);
      
      const numTraitors = Math.floor(Math.random() * 3) + 1;
      const traitorOptions = [
        { name: 'RSI + MACD', revenueRatio: 0.4 },
        { name: 'EMA Crossover', revenueRatio: 0.35 },
        { name: 'Bollinger Bands', revenueRatio: 0.25 },
      ];
      
      const selectedTraitors = traitorOptions.slice(0, numTraitors);
      const traitors = selectedTraitors.map((t) => {
        const traitorRevenue = d.revenue * t.revenueRatio;
        const symbolsForTraitor = selectedSymbols.slice(0, Math.floor(Math.random() * numSymbols) + 1);
        
        const weights = symbolsForTraitor.map(() => Math.random() + 0.5);
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        
        const symbols = symbolsForTraitor.map((symbol, idx) => {
          const normalizedWeight = weights[idx] / totalWeight;
          return {
            symbol,
            revenue: traitorRevenue * normalizedWeight,
          };
        });
        
        return {
          name: t.name,
          revenue: traitorRevenue,
          symbols,
        };
      });
      
      return {
        date: d.date,
        revenue: d.revenue,
        symbols: numSymbols,
        traitors,
      };
    });
  }, [mockRevenueData]);

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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Detailed Reports</h2>
            <div className="flex gap-2">
              <Button
                variant={reportView === 'graph' ? 'default' : 'outline'}
                onClick={() => setReportView('graph')}
                data-testid="button-view-graph"
              >
                Revenue Graph
              </Button>
              <Button
                variant={reportView === 'calendar' ? 'default' : 'outline'}
                onClick={() => setReportView('calendar')}
                data-testid="button-view-calendar"
              >
                Revenue Calendar
              </Button>
            </div>
          </div>

          {reportView === 'graph' && <RevenueGraph data={mockRevenueData} />}
          {reportView === 'calendar' && <RevenueCalendar data={mockCalendarData} />}
        </div>
      </div>
    </div>
  );
}
