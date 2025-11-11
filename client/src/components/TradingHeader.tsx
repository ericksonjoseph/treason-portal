import { Button } from '@/components/ui/button';
import { Moon, Sun, TrendingUp } from 'lucide-react';
import StatusIndicator from './StatusIndicator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TradingHeaderProps {
  mode: 'backtest' | 'live';
  onModeChange?: (mode: 'backtest' | 'live') => void;
  connectionStatus: 'active' | 'inactive' | 'connecting';
  marketStatus: 'active' | 'inactive';
  traitorStatus: 'active' | 'inactive';
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
}

export default function TradingHeader({
  mode,
  onModeChange,
  connectionStatus,
  marketStatus,
  traitorStatus,
  isDarkMode,
  onThemeToggle,
}: TradingHeaderProps) {
  return (
    <header className="border-b bg-card px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">Treason</h1>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(val) => onModeChange?.(val as 'backtest' | 'live')}>
          <TabsList data-testid="tabs-mode">
            <TabsTrigger value="backtest" data-testid="tab-backtest">
              Backtest
            </TabsTrigger>
            <TabsTrigger value="live" data-testid="tab-live">
              Live Trading
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <StatusIndicator type="connection" status={connectionStatus} />
          <StatusIndicator type="market" status={marketStatus} />
          <StatusIndicator type="traitor" status={traitorStatus} />
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            data-testid="button-theme-toggle"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
