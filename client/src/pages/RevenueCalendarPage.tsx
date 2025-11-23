import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReportsLayout } from '@/components/ReportsLayout';
import ReportsFilters from '@/components/ReportsFilters';
import RevenueCalendar from '@/components/RevenueCalendar';
import { DateRange } from 'react-day-picker';
import { TRADING_MODES } from '@/utils/reportConstants';
import { tradeServiceSearchRuns, tradeServiceSearchStrategys } from '@/../../src/api/generated';
import type { V1Run, V1Strategy } from '@/../../src/api/generated';
import { configureApiClient } from '@/lib/apiClient';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';

interface SymbolRevenue {
  symbol: string;
  revenue: number;
  runId: string;
  strategyId: string;
  mode: string;
}

interface StrategyRevenue {
  name: string;
  revenue: number;
  symbols: SymbolRevenue[];
}

interface CalendarDataPoint {
  date: string;
  revenue: number;
  symbols: number;
  strategies: StrategyRevenue[];
}

export default function RevenueCalendarPage() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const strategiesQuery = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
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
      if (response.error) {
        return { results: [] };
      }
      return response.data || { results: [] };
    },
  });

  const runsQuery = useQuery({
    queryKey: ['runs', selectedStrategies, selectedModes, selectedTickers, dateRange],
    queryFn: async () => {
      configureApiClient();
      
      const filters: any[] = [];
      
      if (selectedStrategies.length > 0) {
        filters.push({
          strategyId: {
            type: 'FILTER_TYPE_IN',
            values: selectedStrategies,
          },
        });
      }
      
      if (selectedModes.length > 0) {
        const modeValues = selectedModes.map(mode => mode === 'backtest' ? 'RUN_TYPE_BACKTEST' : 'RUN_TYPE_LIVE');
        filters.push({
          type: {
            type: 'FILTER_TYPE_IN',
            values: modeValues,
          },
        });
      }
      
      if (selectedTickers.length > 0) {
        filters.push({
          symbol: {
            type: 'FILTER_TYPE_IN',
            values: selectedTickers,
          },
        });
      }
      
      const defaultStartDate = subDays(new Date(), 90);
      const defaultEndDate = new Date();
      
      const startTime = dateRange?.from 
        ? startOfDay(dateRange.from).toISOString()
        : startOfDay(defaultStartDate).toISOString();
      
      const endTime = dateRange?.to 
        ? endOfDay(dateRange.to).toISOString() 
        : dateRange?.from 
          ? endOfDay(dateRange.from).toISOString()
          : endOfDay(defaultEndDate).toISOString();
      
      filters.push({
        completedAt: {
          type: 'FILTER_TYPE_RANGE_EXCLUSIVE_MAX',
          values: [startTime, endTime],
        },
      });
      
      const where = filters.length > 0 ? {
        group: {
          op: 'OP_TYPE_AND' as const,
          filters,
        },
      } : undefined;
      
      const response = await tradeServiceSearchRuns({
        body: {
          search: {
            where,
            sort: [{
              field: 'RUN_FIELD_COMPLETED_AT',
              direction: 'SORT_DIRECTION_DESC',
            }],
          },
          pageSize: '1000',
        },
      });
      
      if (response.error) {
        return { results: [] };
      }
      
      return response.data || { results: [] };
    },
  });

  const calendarData = useMemo(() => {
    if (!runsQuery.data?.results || !strategiesQuery.data?.results) return [];
    
    const strategyMap = new Map<string, string>();
    strategiesQuery.data.results.forEach((strategy: any) => {
      if (strategy.id && strategy.name) {
        strategyMap.set(strategy.id, strategy.name);
      }
    });
    
    const dateMap = new Map<string, CalendarDataPoint>();
    
    runsQuery.data.results.forEach((run: any) => {
      const tradeDate = run.start_time;
      if (!tradeDate) return;
      
      const date = format(new Date(tradeDate), 'yyyy-MM-dd');
      const profit = run.profit?.value ? parseFloat(run.profit.value) : 0;
      const symbol = run.symbol || 'UNKNOWN';
      const strategyId = run.strategy_id || '';
      const strategyName = strategyMap.get(strategyId) || 'Unknown Strategy';
      const runId = run.id || '';
      const mode = run.timeframe ? 'backtest' : 'live';
      
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          date,
          revenue: 0,
          symbols: 0,
          strategies: [],
        });
      }
      
      const dayData = dateMap.get(date)!;
      dayData.revenue += profit;
      
      let strategy = dayData.strategies.find(s => s.name === strategyName);
      if (!strategy) {
        strategy = { name: strategyName, revenue: 0, symbols: [] };
        dayData.strategies.push(strategy);
      }
      
      strategy.revenue += profit;
      
      let symbolData = strategy.symbols.find(s => s.symbol === symbol && s.runId === runId);
      if (!symbolData) {
        symbolData = { symbol, revenue: 0, runId, strategyId, mode };
        strategy.symbols.push(symbolData);
      }
      
      symbolData.revenue += profit;
    });
    
    dateMap.forEach(dayData => {
      const uniqueSymbols = new Set<string>();
      dayData.strategies.forEach(strategy => {
        strategy.symbols.forEach(symbolData => {
          uniqueSymbols.add(symbolData.symbol);
        });
      });
      dayData.symbols = uniqueSymbols.size;
    });
    
    return Array.from(dateMap.values());
  }, [runsQuery.data, strategiesQuery.data]);

  const strategies = useMemo(() => {
    if (!strategiesQuery.data?.results) return [];
    return strategiesQuery.data.results.map((s: V1Strategy) => ({
      id: s.id || '',
      name: s.name || 'Unknown',
    }));
  }, [strategiesQuery.data]);

  const tickers = useMemo(() => {
    if (!runsQuery.data?.results) return [];
    const uniqueTickers = new Set<string>();
    runsQuery.data.results.forEach((run: any) => {
      if (run.symbol) {
        uniqueTickers.add(run.symbol);
      }
    });
    return Array.from(uniqueTickers).sort();
  }, [runsQuery.data]);

  const handleReset = () => {
    setSelectedStrategies([]);
    setSelectedModes([]);
    setSelectedTickers([]);
    setDateRange(undefined);
  };

  const filters = (
    <ReportsFilters
      strategies={strategies}
      selectedStrategies={selectedStrategies}
      onStrategiesChange={setSelectedStrategies}
      tickers={tickers}
      selectedTickers={selectedTickers}
      onTickersChange={setSelectedTickers}
      modes={TRADING_MODES}
      selectedModes={selectedModes}
      onModesChange={setSelectedModes}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      onReset={handleReset}
    />
  );

  return (
    <ReportsLayout
      title="Revenue Calendar"
      description="View daily revenue performance in calendar format"
      filters={filters}
    >
      <RevenueCalendar data={calendarData} />
    </ReportsLayout>
  );
}
