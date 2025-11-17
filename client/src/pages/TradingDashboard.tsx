import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import TradingHeader from '@/components/TradingHeader';
import TradingChart from '@/components/TradingChart';
import ControlPanel from '@/components/ControlPanel';
import type { RunInstance } from '@/types/strategy';
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
import { tradeServiceSearchDecisions, tradeServiceSearchBars, tradeServiceSearchStrategys } from '@/../../src/api/generated';
import type { V1Decision, V1Bar, V1Strategy } from '@/../../src/api/generated';
import { configureApiClient } from '@/lib/apiClient';
import type { Strategy } from '@/types/strategy';

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

  useEffect(() => {
    configureApiClient();
  }, []);

  const { data: barsData, isLoading: isLoadingBars, error: barsError } = useQuery({
    queryKey: ['bars', ticker, selectedDate?.toISOString()],
    queryFn: async () => {
      try {
        configureApiClient();
        
        const startOfDay = selectedDate ? new Date(selectedDate) : new Date();
        startOfDay.setHours(0, 0, 0, 0);
        
        const startOfNextDay = new Date(startOfDay);
        startOfNextDay.setDate(startOfNextDay.getDate() + 1);
        
        const response = await tradeServiceSearchBars({
          body: {
            search: {
              where: {
                group: {
                  op: "OP_TYPE_AND",
                  filters: [
                    {
                      symbol: {
                        type: 'FILTER_TYPE_EQUAL',
                        values: [ticker],
                      },
                    },
                    {
                      timeframe: {
                        type: 'FILTER_TYPE_EQUAL',
                        values: ['1Min'],
                      },
                    },
                    {
                      timestamp: {
                        type: 'FILTER_TYPE_RANGE_EXCLUSIVE_MAX',
                        values: [
                          startOfDay.toISOString(),
                          startOfNextDay.toISOString(),
                        ],
                      },
                    }
                  ]

                },
              },
              sort: [{
                field: 'BAR_FIELD_TIMESTAMP',
                direction: 'SORT_DIRECTION_ASC',
              }],
            },
            pageSize: '1000',
          },
        });
        console.log('Bars API Response:', response);
        if (response.error) {
          console.error('Bars API Error:', response.error);
        }
        return response.data || { results: [] };
      } catch (error) {
        console.error('Error fetching bars:', error);
        return { results: [] };
      }
    },
  });

  const { data: decisionsData, isLoading: isLoadingDecisions } = useQuery({
    queryKey: ['decisions', ticker, selectedDate?.toISOString()],
    queryFn: async () => {
      configureApiClient();
      const response = await tradeServiceSearchDecisions({
        body: {
          search: {
            where: {
              symbol: {
                type: 'FILTER_TYPE_EQUAL',
                values: [ticker],
              },
            },
          },
          pageSize: '100',
        },
      });
      return response.data || { results: [] };
    },
    enabled: isRunning,
  });

  const { data: strategiesData, isLoading: isLoadingStrategies } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      try {
        configureApiClient();
        const response = await tradeServiceSearchStrategys({
          body: {
            search: {
              where: {
                isActive: {
                  type: 'FILTER_TYPE_EQUAL',
                  values: [true],
                },
              },
              sort: [{
                field: 'STRATEGY_FIELD_NAME',
                direction: 'SORT_DIRECTION_ASC',
              }],
            },
            pageSize: '100',
          },
        });
        console.log('Strategies API Response:', response);
        if (response.error) {
          console.error('Strategies API Error:', response.error);
        }
        return response.data || { results: [] };
      } catch (error) {
        console.error('Error fetching strategies:', error);
        return { results: [] };
      }
    },
  });

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

  const strategies: Strategy[] = useMemo(() => {
    if (!strategiesData?.results) return [];
    return strategiesData.results.map((s: V1Strategy) => ({
      id: s.id || '',
      name: s.name || '',
      description: s.description,
    }));
  }, [strategiesData]);

  useEffect(() => {
    if (strategies.length > 0 && !selectedStrategy) {
      setSelectedStrategy(strategies[0].id);
    }
  }, [strategies, selectedStrategy]);

  const [allRunInstances, setAllRunInstances] = useState<RunInstance[]>([
    { 
      id: 'run-1', 
      runNumber: 1, 
      timestamp: '09:30 AM', 
      status: 'completed',
      strategyId: 'rsi-macd',
      date: new Date().toDateString(),
    },
    { 
      id: 'run-2', 
      runNumber: 2, 
      timestamp: '11:45 AM', 
      status: 'completed',
      strategyId: 'rsi-macd',
      date: new Date().toDateString(),
    },
    { 
      id: 'run-3', 
      runNumber: 3, 
      timestamp: '02:15 PM', 
      status: 'running',
      strategyId: 'rsi-macd',
      date: new Date().toDateString(),
    },
    { 
      id: 'run-4', 
      runNumber: 1, 
      timestamp: '10:00 AM', 
      status: 'completed',
      strategyId: 'ema-crossover',
      date: new Date().toDateString(),
    },
  ]);

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

  const confirmDelete = () => {
    if (runToDelete) {
      setAllRunInstances(allRunInstances.filter(r => r.id !== runToDelete));
      toast({
        title: 'Run deleted',
        description: 'Successfully deleted the run instance',
      });
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

  const chartData = useMemo(() => {
    if (!barsData?.results || barsData.results.length === 0) {
      return Array.from({ length: 100 }, (_, i) => {
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
    }

    return barsData.results
      .filter((bar: V1Bar) => {
        return bar.timestamp && bar.open?.value && bar.high?.value && bar.low?.value && bar.close?.value;
      })
      .map((bar: V1Bar) => {
        const timestamp = bar.timestamp ? new Date(bar.timestamp).getTime() / 1000 : 0;
        
        return {
          time: timestamp,
          open: parseFloat(bar.open!.value!),
          high: parseFloat(bar.high!.value!),
          low: parseFloat(bar.low!.value!),
          close: parseFloat(bar.close!.value!),
        };
      })
      .sort((a, b) => a.time - b.time);
  }, [barsData]);

  const chartTrades = useMemo(() => {
    if (!decisionsData?.results || !isRunning) {
      return [];
    }

    return decisionsData.results
      .filter((decision: V1Decision) => {
        const signal = decision.signal;
        return signal === 'SIGNAL_TYPE_BUY' || signal === 'SIGNAL_TYPE_SELL';
      })
      .map((decision: V1Decision) => {
        const timestamp = decision.createdAt ? new Date(decision.createdAt).getTime() / 1000 : 0;
        const price = decision.price?.value ? parseFloat(decision.price.value) : 0;
        
        return {
          time: timestamp,
          type: decision.signal === 'SIGNAL_TYPE_BUY' ? ('buy' as const) : ('sell' as const),
          price,
        };
      })
      .filter((trade) => trade.time > 0 && trade.price > 0);
  }, [decisionsData, isRunning]);

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
              <TradingChart data={chartData} trades={chartTrades} />
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
            onRunClick={() => {
              setIsRunning(true);
              console.log('Strategy started', {
                mode,
                ticker,
                date: selectedDate?.toLocaleDateString(),
                strategy: selectedStrategy,
                runInstance: selectedRunInstance,
              });
            }}
            onStopClick={() => {
              setIsRunning(false);
              console.log('Strategy stopped');
            }}
            onSettingsClick={() => console.log('Settings clicked')}
            settings={strategySettings}
            onSettingChange={handleSettingChange}
            metrics={mockMetrics}
            trades={mockTrades}
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
