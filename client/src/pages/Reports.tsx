import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react';
import ReportsFilters from '@/components/ReportsFilters';
import RevenueOverviewChart from '@/components/RevenueOverviewChart';
import TraitorDetailChart from '@/components/TraitorDetailChart';
import RevenueCalendar from '@/components/RevenueCalendar';
import { DateRange } from 'react-day-picker';
import type { Traitor } from '@/types/traitor';
import type { DailyRevenueData } from '@/types/revenue';

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

  const mockRevenueGraphData = useMemo(() => {
    const data: DailyRevenueData[] = [];
    const startDate = new Date('2025-11-01');
    const allSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'AMD'];
    const traitorConfigs = [
      { id: 'rsi-macd', name: 'RSI + MACD', revenueRatio: 0.4 },
      { id: 'ema-crossover', name: 'EMA Crossover', revenueRatio: 0.35 },
      { id: 'bollinger', name: 'Bollinger Bands', revenueRatio: 0.25 },
    ];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const totalRevenue = Math.floor(Math.random() * 5000) + 1000;
      
      const traitors = traitorConfigs.map((config) => {
        const traitorRevenue = totalRevenue * config.revenueRatio;
        const numSymbols = Math.floor(Math.random() * 4) + 2;
        const selectedSymbols = allSymbols.slice(0, numSymbols);
        
        const symbolRuns = selectedSymbols.flatMap((symbol) => {
          const numRuns = Math.floor(Math.random() * 2) + 1;
          return Array.from({ length: numRuns }, (_, runIndex) => {
            const runId = `${dateStr.replace(/-/g, '')}-${runIndex + 1}`;
            return { symbol, runId, revenue: 0 };
          });
        });
        
        const weights = symbolRuns.map(() => Math.random() + 0.5);
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        
        symbolRuns.forEach((sr, idx) => {
          const normalizedWeight = weights[idx] / totalWeight;
          sr.revenue = traitorRevenue * normalizedWeight;
        });
        
        return {
          traitorId: config.id,
          traitorName: config.name,
          revenue: traitorRevenue,
          symbolRuns,
        };
      });
      
      data.push({
        date: dateStr,
        totalRevenue,
        traitors,
      });
    }
    
    return data;
  }, []);

  const mockCalendarData = useMemo(() => {
    return mockRevenueGraphData.map((d) => {
      const allSymbolsForDay = new Set<string>();
      d.traitors.forEach((t) => {
        t.symbolRuns.forEach((sr) => allSymbolsForDay.add(sr.symbol));
      });
      
      const traitors = d.traitors.map((t) => {
        const symbolsMap = new Map<string, number>();
        t.symbolRuns.forEach((sr) => {
          const current = symbolsMap.get(sr.symbol) || 0;
          symbolsMap.set(sr.symbol, current + sr.revenue);
        });
        
        const symbols = Array.from(symbolsMap.entries()).map(([symbol, revenue]) => ({
          symbol,
          revenue,
        }));
        
        return {
          name: t.traitorName,
          revenue: t.revenue,
          symbols,
        };
      });
      
      return {
        date: d.date,
        revenue: d.totalRevenue,
        symbols: allSymbolsForDay.size,
        traitors,
      };
    });
  }, [mockRevenueGraphData]);

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
                Revenue Graphs
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

          {reportView === 'graph' && (
            <div className="space-y-6">
              <RevenueOverviewChart data={mockRevenueGraphData} />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Individual Traitor Performance</h3>
                <div className="space-y-6">
                  {mockTraitors.map((traitor) => (
                    <TraitorDetailChart
                      key={traitor.id}
                      traitorName={traitor.name}
                      data={mockRevenueGraphData}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          {reportView === 'calendar' && <RevenueCalendar data={mockCalendarData} />}
        </div>
      </div>
    </div>
  );
}
