import { useState, useMemo } from 'react';
import { ReportsLayout } from '@/components/ReportsLayout';
import ReportsFilters from '@/components/ReportsFilters';
import RevenueCalendar from '@/components/RevenueCalendar';
import { DateRange } from 'react-day-picker';
import type { Traitor } from '@/types/traitor';
import { generateRevenueData, generateCalendarData } from '@/utils/mockRevenueData';

export default function RevenueCalendarPage() {
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

  const mockRevenueData = useMemo(() => generateRevenueData(30), []);
  const mockCalendarData = useMemo(() => generateCalendarData(mockRevenueData), [mockRevenueData]);

  const handleReset = () => {
    setSelectedTraitors([]);
    setSelectedModes([]);
    setSelectedTickers([]);
    setDateRange(undefined);
  };

  return (
    <ReportsLayout
      title="Revenue Calendar"
      description="View daily revenue performance in calendar format"
    >
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

      <RevenueCalendar data={mockCalendarData} />
    </ReportsLayout>
  );
}
