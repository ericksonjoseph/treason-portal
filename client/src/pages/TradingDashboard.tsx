import { useState, useEffect } from 'react';
import TradingHeader from '@/components/TradingHeader';
import TradingChart from '@/components/TradingChart';
import ControlPanel from '@/components/ControlPanel';

export default function TradingDashboard() {
  const [mode, setMode] = useState<'backtest' | 'live'>('backtest');
  const [selectedTraitor, setSelectedTraitor] = useState('rsi-macd');
  const [ticker, setTicker] = useState('AAPL');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(!isDarkMode);
  };

  const mockTraitors = [
    { id: 'rsi-macd', name: 'RSI + MACD Strategy', description: 'Mean reversion with momentum' },
    { id: 'ema-crossover', name: 'EMA Crossover', description: 'Fast/slow moving average' },
    { id: 'bollinger', name: 'Bollinger Bands', description: 'Volatility breakout' },
    { id: 'ml-predictor', name: 'ML Price Predictor', description: 'Neural network model' },
  ];

  const mockMetrics = [
    { label: 'Total P/L', value: '12,450.80', prefix: '$', change: 8.5 },
    { label: 'Win Rate', value: '68.4', suffix: '%' },
    { label: 'Total Trades', value: '156' },
    { label: 'Sharpe Ratio', value: '1.85' },
  ];

  const mockTrades = [
    { id: '1', timestamp: '2024-11-11 09:30:15', action: 'buy' as const, price: 152.45, quantity: 100 },
    { id: '2', timestamp: '2024-11-11 11:22:48', action: 'sell' as const, price: 155.80, quantity: 100, pnl: 335.0 },
    { id: '3', timestamp: '2024-11-11 13:15:30', action: 'buy' as const, price: 154.20, quantity: 150 },
    { id: '4', timestamp: '2024-11-11 14:45:12', action: 'sell' as const, price: 153.10, quantity: 150, pnl: -165.0 },
    { id: '5', timestamp: '2024-11-11 15:30:00', action: 'buy' as const, price: 151.90, quantity: 200 },
  ];

  const mockChartData = Array.from({ length: 100 }, (_, i) => {
    const time = Math.floor(Date.now() / 1000) - (100 - i) * 86400;
    const base = 150 + Math.sin(i / 10) * 20;
    return {
      time,
      open: base + Math.random() * 5,
      high: base + Math.random() * 10,
      low: base - Math.random() * 5,
      close: base + Math.random() * 5 - 2.5,
    };
  });

  const mockChartTrades = [
    { time: mockChartData[20].time, type: 'buy' as const, price: mockChartData[20].close },
    { time: mockChartData[35].time, type: 'sell' as const, price: mockChartData[35].close },
    { time: mockChartData[60].time, type: 'buy' as const, price: mockChartData[60].close },
    { time: mockChartData[85].time, type: 'sell' as const, price: mockChartData[85].close },
  ];

  return (
    <div className="flex flex-col h-full">
      <TradingHeader
        mode={mode}
        onModeChange={setMode}
        connectionStatus={isRunning ? 'active' : 'inactive'}
        marketStatus="active"
        traitorStatus={isRunning ? 'active' : 'inactive'}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4">
          <div className="h-full bg-card rounded-lg border p-4">
            <div className="mb-2">
              <h2 className="text-lg font-semibold font-mono">{ticker}</h2>
            </div>
            <div className="h-[calc(100%-2.5rem)]">
              <TradingChart data={mockChartData} trades={isRunning ? mockChartTrades : []} />
            </div>
          </div>
        </div>
        
        <div className="w-96 border-l bg-background overflow-y-auto">
          <ControlPanel
            traitors={mockTraitors}
            selectedTraitor={selectedTraitor}
            onTraitorChange={setSelectedTraitor}
            ticker={ticker}
            onTickerChange={setTicker}
            date={selectedDate}
            onDateChange={setSelectedDate}
            mode={mode}
            isRunning={isRunning}
            onRunClick={() => {
              setIsRunning(true);
              console.log('Traitor started', {
                mode,
                ticker,
                date: selectedDate?.toLocaleDateString(),
                traitor: selectedTraitor,
              });
            }}
            onStopClick={() => {
              setIsRunning(false);
              console.log('Traitor stopped');
            }}
            onSettingsClick={() => console.log('Settings clicked')}
            metrics={mockMetrics}
            trades={mockTrades}
            onTradeClick={(trade) => console.log('Trade clicked:', trade)}
          />
        </div>
      </div>
    </div>
  );
}
