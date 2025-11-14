import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Square, Settings } from 'lucide-react';
import AlgorithmSelector from './AlgorithmSelector';
import TickerSelector from './TickerSelector';
import DatePicker from './DatePicker';
import RunInstanceSelector from './RunInstanceSelector';
import MetricsCard from './MetricsCard';
import TradeTimeline from './TradeTimeline';
import TraitorSettings from './TraitorSettings';
import type { Traitor, RunInstance } from '@/types/traitor';
import type { TraitorSetting } from '@/types/settings';

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
  traitors: Traitor[];
  selectedTraitor?: string;
  onTraitorChange?: (id: string) => void;
  runInstances?: RunInstance[];
  selectedRunInstance?: string;
  onRunInstanceChange?: (id: string) => void;
  onDeleteRun?: (instanceId: string) => void;
  ticker?: string;
  onTickerChange?: (ticker: string) => void;
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  mode?: 'backtest' | 'live';
  isRunning: boolean;
  onRunClick?: () => void;
  onStopClick?: () => void;
  onSettingsClick?: () => void;
  settings?: TraitorSetting[];
  onSettingChange?: (field: string, value: string | number) => void;
  metrics: Metric[];
  trades: Trade[];
  onTradeClick?: (trade: Trade) => void;
}

export default function ControlPanel({
  traitors,
  selectedTraitor,
  onTraitorChange,
  runInstances = [],
  selectedRunInstance,
  onRunInstanceChange,
  onDeleteRun,
  ticker,
  onTickerChange,
  date,
  onDateChange,
  mode = 'backtest',
  isRunning,
  onRunClick,
  onStopClick,
  onSettingsClick,
  settings = [],
  onSettingChange,
  metrics,
  trades,
  onTradeClick,
}: ControlPanelProps) {
  const [showSettings, setShowSettings] = useState(false);

  const isToday = (selectedDate: Date | undefined): boolean => {
    if (!selectedDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(selectedDate);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate.getTime() === today.getTime();
  };

  const isRunButtonDisabled = mode === 'live' && !isToday(date);

  const handleSettingsClick = () => {
    setShowSettings(true);
    onSettingsClick?.();
  };

  const handleBackClick = () => {
    setShowSettings(false);
  };

  if (showSettings) {
    return (
      <TraitorSettings
        settings={settings}
        onSettingChange={onSettingChange}
        onBack={handleBackClick}
      />
    );
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto p-4">
      <Card data-testid="card-controls">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Traitor Control</CardTitle>
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
            <label className="text-sm font-medium">Traitor</label>
            <AlgorithmSelector
              algorithms={traitors}
              value={selectedTraitor}
              onValueChange={onTraitorChange}
            />
          </div>
          {runInstances.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Run Instance</label>
              <RunInstanceSelector
                instances={runInstances}
                value={selectedRunInstance}
                onValueChange={onRunInstanceChange}
                onDelete={onDeleteRun}
              />
            </div>
          )}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button 
                onClick={onRunClick} 
                className="flex-1" 
                data-testid="button-run"
                disabled={isRunButtonDisabled}
              >
                <Play className="w-4 h-4 mr-2" />
                Run
              </Button>
            ) : (
              <Button onClick={onStopClick} variant="destructive" className="flex-1" data-testid="button-stop">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
            <Button onClick={handleSettingsClick} variant="outline" size="icon" data-testid="button-settings">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
          {isRunButtonDisabled && (
            <p className="text-xs text-muted-foreground" data-testid="text-run-disabled-message">
              Live trading is only available for the current date
            </p>
          )}
        </CardContent>
      </Card>

      <MetricsCard title="Performance Metrics" metrics={metrics} />
      <TradeTimeline trades={trades} onTradeClick={onTradeClick} />
    </div>
  );
}
