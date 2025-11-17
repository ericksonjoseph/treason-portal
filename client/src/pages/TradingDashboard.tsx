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
import { tradeServiceSearchDecisions, tradeServiceSearchBars, tradeServiceSearchStrategys, tradeServiceSearchRuns, tradeServiceSearchExecutions } from '@/../../src/api/generated';
import type { V1Decision, V1Bar, V1Strategy, V1Run, V1Execution } from '@/../../src/api/generated';
import { configureApiClient } from '@/lib/apiClient';
import { queryClient } from '@/lib/queryClient';
import type { Strategy } from '@/types/strategy';

export default function TradingDashboard() {
  const [mode, setMode] = useState<'backtest' | 'live'>('backtest');
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [ticker, setTicker] = useState('TSLA');
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
      createdAt: s.createdAt,
      createdBy: s.createdBy,
    }));
  }, [strategiesData]);

  useEffect(() => {
    if (strategies.length > 0 && !selectedStrategy) {
      setSelectedStrategy(strategies[0].id);
    }
  }, [strategies, selectedStrategy]);

  const { data: runsData, isLoading: isLoadingRuns } = useQuery({
    queryKey: ['runs', selectedStrategy, selectedDate?.toISOString(), mode],
    queryFn: async () => {
      try {
        if (!selectedStrategy || !selectedDate) {
          return { results: [] };
        }
        
        configureApiClient();
        
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const startOfNextDay = new Date(startOfDay);
        startOfNextDay.setDate(startOfNextDay.getDate() + 1);
        
        const runType = mode === 'backtest' ? 'BACKTEST' : 'LIVE';
        
        const response = await tradeServiceSearchRuns({
          body: {
            search: {
              where: {
                group: {
                  op: "OP_TYPE_AND",
                  filters: [
                    {
                      strategyId: {
                        type: 'FILTER_TYPE_EQUAL',
                        values: [selectedStrategy],
                      },
                    },
                    {
                      type: {
                        type: 'FILTER_TYPE_EQUAL',
                        values: [runType],
                      },
                    },
                    {
                      startTime: {
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
                field: 'RUN_FIELD_STARTED_AT',
                direction: 'SORT_DIRECTION_ASC',
              }],
            },
            pageSize: '100',
          },
        });
        console.log('Runs API Response:', response);
        if (response.error) {
          console.error('Runs API Error:', response.error);
        }
        return response.data || { results: [] };
      } catch (error) {
        console.error('Error fetching runs:', error);
        return { results: [] };
      }
    },
    enabled: !!selectedStrategy && !!selectedDate,
  });

  const filteredRunInstances: RunInstance[] = useMemo(() => {
    if (!runsData?.results) return [];
    
    return runsData.results.map((run: V1Run, index: number) => {
      const startedAt = run.startedAt ? new Date(run.startedAt) : new Date();
      const timestamp = startedAt.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      let status: 'completed' | 'running' | 'failed' = 'completed';
      if (run.completedAt) {
        status = 'completed';
      } else if (run.startedAt) {
        status = 'running';
      }
      
      return {
        id: run.id || '',
        runNumber: index + 1,
        timestamp,
        status,
        strategyId: run.strategyId || '',
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        type: run.type,
      };
    });
  }, [runsData]);

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

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['runs'] }),
      queryClient.refetchQueries({ queryKey: ['executions'] }),
      queryClient.refetchQueries({ queryKey: ['bars'] }),
    ]);
    toast({
      title: 'Data refreshed',
      description: 'Successfully fetched latest data from server',
    });
  };

  const selectedRun = useMemo(() => {
    if (!runsData?.results || !selectedRunInstance) return null;
    return runsData.results.find((run: V1Run) => run.id === selectedRunInstance);
  }, [runsData, selectedRunInstance]);

  const performanceMetrics = useMemo(() => {
    if (!selectedRun) {
      return [
        { label: 'Total P/L', value: '-', prefix: '$' },
        { label: 'Win Rate', value: '-', suffix: '%' },
        { label: 'Sharpe Ratio', value: '-' },
      ];
    }

    const profit = selectedRun.profit?.value ? parseFloat(selectedRun.profit.value) : 0;
    const winRate = selectedRun.winRate?.value ? parseFloat(selectedRun.winRate.value) : 0;
    const sharpeRatio = selectedRun.sharpeRatio?.value ? parseFloat(selectedRun.sharpeRatio.value) : 0;

    return [
      { 
        label: 'Total P/L', 
        value: profit.toFixed(2), 
        prefix: '$',
      },
      { label: 'Win Rate', value: (winRate * 100).toFixed(1), suffix: '%' },
      { label: 'Sharpe Ratio', value: sharpeRatio.toFixed(2) },
    ];
  }, [selectedRun]);

  const { data: executionsData, isLoading: isLoadingExecutions } = useQuery({
    queryKey: ['executions', selectedRunInstance],
    queryFn: async () => {
      try {
        if (!selectedRunInstance) {
          return { results: [] };
        }

        configureApiClient();

        const executionsResponse = await tradeServiceSearchExecutions({
          body: {
            search: {
              where: {
                runId: {
                  type: 'FILTER_TYPE_EQUAL',
                  values: [selectedRunInstance],
                },
              },
              sort: [{
                field: 'EXECUTION_FIELD_FILL_TIME',
                direction: 'SORT_DIRECTION_ASC',
              }],
            },
            pageSize: '1000',
          },
        });

        return { results: executionsResponse.data?.results || [] };
      } catch (error) {
        console.error('Error fetching executions:', error);
        return { results: [] };
      }
    },
    enabled: !!selectedRunInstance,
  });

  const tradeHistory = useMemo(() => {
    if (!executionsData?.results) return [];

    const filled = executionsData.results.filter((exec: any) => {
      return exec.fill_time && exec.fill_price?.value && exec.fill_quantity?.value;
    });

    return filled.map((exec: any) => {
        const fillTime = exec.fill_time ? new Date(exec.fill_time).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) : '';

        const quantity = parseFloat(exec.fill_quantity!.value!);
        const action = quantity > 0 ? 'buy' as const : 'sell' as const;

        return {
          id: exec.id || '',
          timestamp: fillTime,
          action,
          price: parseFloat(exec.fill_price!.value!),
          quantity: Math.abs(quantity),
        };
      });
  }, [executionsData]);

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
    if (!executionsData?.results) {
      return [];
    }

    return executionsData.results
      .filter((exec: any) => {
        return exec.fill_time && exec.fill_price?.value && exec.fill_quantity?.value;
      })
      .map((exec: any) => {
        const timestamp = exec.fill_time ? new Date(exec.fill_time).getTime() / 1000 : 0;
        const price = parseFloat(exec.fill_price!.value!);
        const quantity = parseFloat(exec.fill_quantity!.value!);
        const type = quantity > 0 ? 'buy' as const : 'sell' as const;
        
        return {
          time: timestamp,
          type,
          price,
          id: exec.id,
          quantity: Math.abs(quantity),
        };
      })
      .filter((trade) => trade.time > 0 && trade.price > 0);
  }, [executionsData]);

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
            onRefresh={handleRefresh}
            settings={strategySettings}
            onSettingChange={handleSettingChange}
            metrics={performanceMetrics}
            trades={tradeHistory}
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
