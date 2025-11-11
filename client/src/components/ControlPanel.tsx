import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Square, Settings } from 'lucide-react';
import AlgorithmSelector from './AlgorithmSelector';
import TickerSelector from './TickerSelector';
import DatePicker from './DatePicker';
import MetricsCard from './MetricsCard';
import TradeTimeline from './TradeTimeline';

interface Algorithm {
  id: string;
  name: string;
  description?: string;
}

interface Metric {
  label: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
}

interface Trade {
  id: string;
  timestamp: string;
  action: 'buy' | 'sell';
  price: number;
  quantity: number;
  pnl?: number;
}

interface ControlPanelProps {
  algorithms: Algorithm[];
  selectedAlgorithm?: string;
  onAlgorithmChange?: (id: string) => void;
  ticker?: string;
  onTickerChange?: (ticker: string) => void;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  mode?: 'backtest' | 'live';
  isRunning: boolean;
  onRunClick?: () => void;
  onStopClick?: () => void;
  onSettingsClick?: () => void;
  metrics: Metric[];
  trades: Trade[];
  onTradeClick?: (trade: Trade) => void;
}

export default function ControlPanel({
  algorithms,
  selectedAlgorithm,
  onAlgorithmChange,
  ticker,
  onTickerChange,
  date,
  onDateChange,
  mode = 'backtest',
  isRunning,
  onRunClick,
  onStopClick,
  onSettingsClick,
  metrics,
  trades,
  onTradeClick,
}: ControlPanelProps) {
  return (
    <div className="space-y-4 h-full overflow-y-auto p-4">
      <Card data-testid="card-controls">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Algorithm Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Stock Ticker</label>
            <TickerSelector value={ticker} onChange={onTickerChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {mode === 'backtest' ? 'Backtest Date' : 'Trading Date'}
            </label>
            <DatePicker
              date={date}
              onDateChange={onDateChange}
              label={mode === 'backtest' ? 'Select backtest date' : 'Select trading date'}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Algorithm</label>
            <AlgorithmSelector
              algorithms={algorithms}
              value={selectedAlgorithm}
              onValueChange={onAlgorithmChange}
            />
          </div>
          <div className="flex gap-2">
            {!isRunning ? (
              <Button onClick={onRunClick} className="flex-1" data-testid="button-run">
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
            ) : (
              <Button onClick={onStopClick} variant="destructive" className="flex-1" data-testid="button-stop">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
            <Button onClick={onSettingsClick} variant="outline" size="icon" data-testid="button-settings">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <MetricsCard title="Performance Metrics" metrics={metrics} />
      <TradeTimeline trades={trades} onTradeClick={onTradeClick} />
    </div>
  );
}
