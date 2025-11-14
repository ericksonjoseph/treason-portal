import { useState, useEffect, useMemo } from 'react';
import TradingHeader from '@/components/TradingHeader';
import TradingChart from '@/components/TradingChart';
import ControlPanel from '@/components/ControlPanel';
import type { RunInstance, Strategy } from '@/types/strategy';
import type { StrategySetting } from '@/types/settings';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { backendClient } from '@/lib/backendClient';

export default function TradingDashboard() {
  const [mode, setMode] = useState<'backtest' | 'live'>('backtest');
  const [selectedStrategy, setSelectedStrategy] = useState('rsi-macd');
  const [ticker, setTicker] = useState('AAPL');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRunInstance, setSelectedRunInstance] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [runToDelete, setRunToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Data from backend
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [allRunInstances, setAllRunInstances] = useState<RunInstance[]>([]);
  const [chartData, setChartData] = useState<Array<{time: number; open: number; high: number; low: number; close: number}>>([]);
  const [chartTrades, setChartTrades] = useState<Array<{time: number; type: 'buy' | 'sell'; price: number}>>([]);
  const [metrics, setMetrics] = useState<Array<{label: string; value: string; prefix?: string; suffix?: string; change?: number}>>([]);
  const [trades, setTrades] = useState<Array<{id: string; timestamp: string; action: 'buy' | 'sell'; price: number; quantity: number; pnl?: number}>>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [strategySettings, setStrategySettings] = useState<StrategySetting[]>([
    {
      field: 'risk tolerance',
      type: 'enum',
      value: 'low',
      options: ['low', 'medium', 'high'],
      default: 'medium',
    },
    {
      field: 'sizing',
      type: 'numeric',
      value: 10,
      options: [0, 100],
      default: 10,
    },
    {
      field: 'stop loss',
      type: 'numeric',
      value: 5,
      options: [0, 20],
      default: 5,
    },
    {
      field: 'take profit',
      type: 'numeric',
      value: 15,
      options: [0, 50],
      default: 15,
    },
    {
      field: 'aggressiveness',
      type: 'enum',
      value: 'moderate',
      options: ['conservative', 'moderate', 'aggressive'],
      default: 'moderate',
    },
  ]);

  // Fetch initial data on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoadingData(true);
        const [strategiesData, metricsData, tradesData] = await Promise.all([
          backendClient.getStrategies(),
          backendClient.getMetrics(''),
          backendClient.getTradeTimeline(),
        ]);
        setStrategies(strategiesData);
        setMetrics(metricsData);
        setTrades(tradesData);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data from backend',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingData(false);
      }
    }
    loadInitialData();
  }, [toast]);

  // Fetch run instances when strategy or date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    async function loadRunInstances() {
      try {
        const instances = await backendClient.getRunInstances(selectedStrategy, selectedDate!);
        setAllRunInstances(instances);
      } catch (error) {
        console.error('Failed to load run instances:', error);
      }
    }
    loadRunInstances();
  }, [selectedStrategy, selectedDate]);

  // Fetch chart data when ticker or date changes
  useEffect(() => {
    if (!selectedDate) return;
    
    async function loadChartData() {
      try {
        const data = await backendClient.getChartData(ticker, selectedDate!);
        setChartData(data);
      } catch (error) {
        console.error('Failed to load chart data:', error);
      }
    }
    loadChartData();
  }, [ticker, selectedDate]);

  // Fetch trades for selected run instance when running
  useEffect(() => {
    if (!isRunning || !selectedRunInstance) {
      setChartTrades([]);
      return;
    }
    
    async function loadTrades() {
      try {
        const tradesData = await backendClient.getTrades(selectedRunInstance);
        setChartTrades(tradesData);
      } catch (error) {
        console.error('Failed to load trades:', error);
      }
    }
    loadTrades();
  }, [isRunning, selectedRunInstance]);

  const filteredRunInstances = useMemo(() => 
    allRunInstances.filter(
      (instance) =>
        instance.strategyId === selectedStrategy &&
        instance.date === selectedDate?.toDateString()
    ),
    [selectedStrategy, selectedDate, allRunInstances]
  );

  useEffect(() => {
    if (filteredRunInstances.length > 0 && !selectedRunInstance) {
      setSelectedRunInstance(filteredRunInstances[0].id);
    } else if (filteredRunInstances.length === 0) {
      setSelectedRunInstance('');
    } else if (!filteredRunInstances.find(i => i.id === selectedRunInstance)) {
      setSelectedRunInstance(filteredRunInstances[0].id);
    }
  }, [filteredRunInstances, selectedRunInstance]);

  const handleDeleteRun = (instanceId: string) => {
    setRunToDelete(instanceId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (runToDelete) {
      try {
        await backendClient.deleteRun(runToDelete);
        setAllRunInstances(allRunInstances.filter(r => r.id !== runToDelete));
        toast({
          title: 'Run deleted',
          description: 'Successfully deleted the run instance',
        });
      } catch (error) {
        console.error('Failed to delete run:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete run instance',
          variant: 'destructive',
        });
      }
    }
    setDeleteDialogOpen(false);
    setRunToDelete(null);
  };

  const handleSettingChange = (field: string, value: string | number) => {
    setStrategySettings((prev) =>
      prev.map((setting) =>
        setting.field === field ? { ...setting, value } : setting
      )
    );
  };

  return (
    <div className="flex flex-col h-full">
      <TradingHeader
        mode={mode}
        onModeChange={setMode}
        connectionStatus={isRunning ? 'active' : 'inactive'}
        marketStatus="active"
        strategyStatus={isRunning ? 'active' : 'inactive'}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-4">
          <div className="h-full bg-card rounded-lg border p-4">
            <div className="mb-2">
              <h2 className="text-lg font-semibold font-mono">{ticker}</h2>
            </div>
            <div className="h-[calc(100%-2.5rem)]">
              <TradingChart data={chartData} trades={isRunning ? chartTrades : []} />
            </div>
          </div>
        </div>
        
        <div className="w-96 border-l bg-background overflow-y-auto">
          <ControlPanel
            strategies={strategies}
            selectedStrategy={selectedStrategy}
            onStrategyChange={setSelectedStrategy}
            runInstances={filteredRunInstances}
            selectedRunInstance={selectedRunInstance}
            onRunInstanceChange={setSelectedRunInstance}
            onDeleteRun={handleDeleteRun}
            ticker={ticker}
            onTickerChange={setTicker}
            date={selectedDate}
            onDateChange={setSelectedDate}
            mode={mode}
            isRunning={isRunning}
            onRunClick={async () => {
              setIsRunning(true);
              try {
                await backendClient.createRun({
                  strategyId: selectedStrategy,
                  ticker,
                  date: selectedDate || new Date(),
                  mode,
                  settings: strategySettings,
                });
                // Reload run instances after creating a new run
                if (selectedDate) {
                  const instances = await backendClient.getRunInstances(selectedStrategy, selectedDate);
                  setAllRunInstances(instances);
                }
                toast({
                  title: 'Strategy started',
                  description: `Running ${selectedStrategy} on ${ticker}`,
                });
              } catch (error) {
                console.error('Failed to start strategy:', error);
                toast({
                  title: 'Error',
                  description: 'Failed to start strategy',
                  variant: 'destructive',
                });
              }
            }}
            onStopClick={() => {
              setIsRunning(false);
              console.log('Strategy stopped');
            }}
            onSettingsClick={() => console.log('Settings clicked')}
            settings={strategySettings}
            onSettingChange={handleSettingChange}
            metrics={metrics}
            trades={trades}
            onTradeClick={(trade) => console.log('Trade clicked:', trade)}
          />
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent data-testid="dialog-delete-confirm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Run Instance</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this run instance? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover-elevate"
                data-testid="button-confirm-delete"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
