import { useState } from 'react';
import ControlPanel from '../ControlPanel';

const mockAlgorithms = [
  { id: 'rsi-macd', name: 'RSI + MACD Strategy', description: 'Mean reversion' },
  { id: 'ema-crossover', name: 'EMA Crossover', description: 'Moving average' },
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
];

export default function ControlPanelExample() {
  const [selected, setSelected] = useState('rsi-macd');
  const [ticker, setTicker] = useState('AAPL');
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="h-screen w-96 bg-card">
      <ControlPanel
        algorithms={mockAlgorithms}
        selectedAlgorithm={selected}
        onAlgorithmChange={setSelected}
        ticker={ticker}
        onTickerChange={setTicker}
        isRunning={isRunning}
        onRunClick={() => {
          setIsRunning(true);
          console.log('Run clicked');
        }}
        onStopClick={() => {
          setIsRunning(false);
          console.log('Stop clicked');
        }}
        onSettingsClick={() => console.log('Settings clicked')}
        metrics={mockMetrics}
        trades={mockTrades}
        onTradeClick={(trade) => console.log('Trade clicked:', trade)}
      />
    </div>
  );
}
