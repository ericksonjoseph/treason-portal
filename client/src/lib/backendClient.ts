import type { Strategy, RunInstance } from '@/types/strategy';
import type { Run } from '@/types/run';
import type { StrategySetting } from '@/types/settings';

// ============================================================================
// EXPORTED TYPES - Single source of truth for revenue/calendar data types
// ============================================================================

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  trades: number;
}

export interface SymbolRevenue {
  symbol: string;
  revenue: number;
}

export interface StrategyRevenue {
  name: string;
  revenue: number;
  symbols: SymbolRevenue[];
}

export interface CalendarDataPoint {
  date: string;
  revenue: number;
  symbols: number;
  strategies: StrategyRevenue[];
}

// ============================================================================
// MOCK DATA - Centralized location for all mock data
// ============================================================================

const MOCK_STRATEGIES: Strategy[] = [
  { id: 'rsi-macd', name: 'RSI + MACD Strategy', description: 'Mean reversion with momentum' },
  { id: 'ema-crossover', name: 'EMA Crossover', description: 'Fast/slow moving average' },
  { id: 'bollinger', name: 'Bollinger Bands', description: 'Volatility breakout' },
  { id: 'ml-predictor', name: 'ML Price Predictor', description: 'Neural network model' },
];

const MOCK_TICKERS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'AMD'];

const TRADING_MODES = [
  { value: 'backtest', label: 'Backtest' },
  { value: 'live', label: 'Live Trading' },
];

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Completed' },
  { value: 'running', label: 'Running' },
  { value: 'failed', label: 'Failed' },
];

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

function generateMockRuns(count: number = 50): Run[] {
  const runs: Run[] = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const timestamp = new Date(date);
    timestamp.setHours(hour, minute, 0, 0);
    
    const strategy = MOCK_STRATEGIES[Math.floor(Math.random() * MOCK_STRATEGIES.length)];
    const ticker = MOCK_TICKERS[Math.floor(Math.random() * MOCK_TICKERS.length)];
    const mode = Math.random() > 0.5 ? 'backtest' : 'live';
    const statuses: Run['status'][] = ['completed', 'running', 'failed'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const totalTrades = Math.floor(Math.random() * 100) + 10;
    const winRate = Math.random() * 0.4 + 0.4;
    const profit = (Math.random() - 0.3) * 10000;
    
    runs.push({
      id: `run-${i + 1}`,
      strategyId: strategy.id,
      strategyName: strategy.name,
      ticker,
      mode,
      date: date.toISOString().split('T')[0],
      timestamp: timestamp.toISOString(),
      status,
      settings: {
        aggressiveness: Math.floor(Math.random() * 10) + 1,
        riskTolerance: Math.floor(Math.random() * 10) + 1,
        stopLoss: Math.floor(Math.random() * 5) + 1,
        takeProfit: Math.floor(Math.random() * 10) + 5,
      },
      results: status === 'completed' ? {
        totalTrades,
        winRate,
        profit,
      } : undefined,
    });
  }
  
  return runs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

function generateRevenueData(days: number = 30): RevenueDataPoint[] {
  const data: RevenueDataPoint[] = [];
  const startDate = new Date('2025-11-01');
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 5000) + 1000,
      trades: Math.floor(Math.random() * 50) + 10,
    });
  }
  
  return data;
}

function generateCalendarData(revenueData: RevenueDataPoint[]): CalendarDataPoint[] {
  return revenueData.map((d) => {
    const numSymbols = Math.floor(Math.random() * 5) + 3;
    const selectedSymbols = MOCK_TICKERS.slice(0, numSymbols);
    
    const numStrategies = Math.floor(Math.random() * 3) + 1;
    const strategyOptions = [
      { name: 'RSI + MACD', revenueRatio: 0.4 },
      { name: 'EMA Crossover', revenueRatio: 0.35 },
      { name: 'Bollinger Bands', revenueRatio: 0.25 },
    ];
    
    const selectedStrategies = strategyOptions.slice(0, numStrategies);
    const strategies = selectedStrategies.map((t) => {
      const strategyRevenue = d.revenue * t.revenueRatio;
      const symbolsForStrategy = selectedSymbols.slice(0, Math.floor(Math.random() * numSymbols) + 1);
      
      const weights = symbolsForStrategy.map(() => Math.random() + 0.5);
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      
      const symbols = symbolsForStrategy.map((symbol, idx) => {
        const normalizedWeight = weights[idx] / totalWeight;
        return {
          symbol,
          revenue: strategyRevenue * normalizedWeight,
        };
      });
      
      return {
        name: t.name,
        revenue: strategyRevenue,
        symbols,
      };
    });
    
    return {
      date: d.date,
      revenue: d.revenue,
      symbols: numSymbols,
      strategies,
    };
  });
}

// ============================================================================
// BACKEND CLIENT - API wrapper methods
// TODO: Replace mock implementations with real API calls to your backend
// ============================================================================

export const backendClient = {
  // ========== AUTHENTICATION ==========
  
  /**
   * Login to the backend
   * TODO: Replace with: POST /api/auth/login
   */
  async login(username: string, password: string): Promise<{ username: string; token: string }> {
    // Mock implementation - accepts any credentials
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    return {
      username,
      token: crypto.randomUUID(), // Generate mock UUID token
    };
    
    // Real implementation would be:
    // const response = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    // });
    // if (!response.ok) throw new Error('Login failed');
    // return await response.json();
  },

  // ========== STRATEGIES ==========
  
  /**
   * Get all available strategies
   * TODO: Replace with: GET /api/strategies
   */
  async getStrategies(): Promise<Strategy[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...MOCK_STRATEGIES];
    
    // Real implementation would be:
    // const response = await fetch('/api/strategies');
    // if (!response.ok) throw new Error('Failed to fetch strategies');
    // return await response.json();
  },

  // ========== TICKERS ==========
  
  /**
   * Get available stock tickers
   * TODO: Replace with: GET /api/tickers
   */
  async getTickers(): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...MOCK_TICKERS];
  },

  // ========== TRADING MODES ==========
  
  /**
   * Get available trading modes
   */
  getTradingModes(): typeof TRADING_MODES {
    return TRADING_MODES;
  },

  // ========== STATUS OPTIONS ==========
  
  /**
   * Get available status options
   */
  getStatusOptions(): typeof STATUS_OPTIONS {
    return STATUS_OPTIONS;
  },

  // ========== RUN INSTANCES ==========
  
  /**
   * Get run instances for a specific strategy and date
   * TODO: Replace with: GET /api/runs/instances?strategyId=X&date=Y
   */
  async getRunInstances(strategyId: string, date: Date): Promise<RunInstance[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Mock data - generate some run instances for the current date
    const dateStr = date.toDateString();
    const mockInstances: RunInstance[] = [
      { 
        id: 'run-1', 
        runNumber: 1, 
        timestamp: '09:30 AM', 
        status: 'completed',
        strategyId: strategyId,
        date: dateStr,
      },
      { 
        id: 'run-2', 
        runNumber: 2, 
        timestamp: '11:45 AM', 
        status: 'completed',
        strategyId: strategyId,
        date: dateStr,
      },
      { 
        id: 'run-3', 
        runNumber: 3, 
        timestamp: '02:15 PM', 
        status: 'running',
        strategyId: strategyId,
        date: dateStr,
      },
    ];
    
    return mockInstances;
  },

  /**
   * Create a new run instance
   * TODO: Replace with: POST /api/runs
   */
  async createRun(params: {
    strategyId: string;
    ticker: string;
    date: Date;
    mode: 'backtest' | 'live';
    settings: StrategySetting[];
  }): Promise<RunInstance> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const runNumber = Math.floor(Math.random() * 100) + 1;
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    
    return {
      id: `run-${crypto.randomUUID()}`,
      runNumber,
      timestamp,
      status: 'running',
      strategyId: params.strategyId,
      date: params.date.toDateString(),
    };
  },

  /**
   * Delete a run instance
   * TODO: Replace with: DELETE /api/runs/:id
   */
  async deleteRun(runId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock - just simulate deletion
  },

  // ========== CHART DATA ==========
  
  /**
   * Get chart data for a specific ticker and date
   * TODO: Replace with: GET /api/chart?ticker=X&date=Y
   */
  async getChartData(ticker: string, date: Date): Promise<Array<{
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
  }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate mock candlestick data
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
  },

  /**
   * Get trades for a specific run
   * TODO: Replace with: GET /api/runs/:runId/trades
   */
  async getTrades(runId: string): Promise<Array<{
    time: number;
    type: 'buy' | 'sell';
    price: number;
  }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Get chart data first to align trade times
    const chartData = await this.getChartData('', new Date());
    
    return [
      { time: chartData[20].time, type: 'buy' as const, price: chartData[20].close },
      { time: chartData[35].time, type: 'sell' as const, price: chartData[35].close },
      { time: chartData[60].time, type: 'buy' as const, price: chartData[60].close },
      { time: chartData[85].time, type: 'sell' as const, price: chartData[85].close },
    ];
  },

  /**
   * Get trade timeline for display
   * TODO: Replace with: GET /api/runs/:runId/timeline
   */
  async getTradeTimeline(): Promise<Array<{
    id: string;
    timestamp: string;
    action: 'buy' | 'sell';
    price: number;
    quantity: number;
    pnl?: number;
  }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      { id: '1', timestamp: '2024-11-11 09:30:15', action: 'buy' as const, price: 152.45, quantity: 100 },
      { id: '2', timestamp: '2024-11-11 11:22:48', action: 'sell' as const, price: 155.80, quantity: 100, pnl: 335.0 },
      { id: '3', timestamp: '2024-11-11 13:15:30', action: 'buy' as const, price: 154.20, quantity: 150 },
      { id: '4', timestamp: '2024-11-11 14:45:12', action: 'sell' as const, price: 153.10, quantity: 150, pnl: -165.0 },
      { id: '5', timestamp: '2024-11-11 15:30:00', action: 'buy' as const, price: 151.90, quantity: 200 },
    ];
  },

  /**
   * Get metrics for a specific run
   * TODO: Replace with: GET /api/runs/:runId/metrics
   */
  async getMetrics(runId: string): Promise<Array<{
    label: string;
    value: string;
    prefix?: string;
    suffix?: string;
    change?: number;
  }>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [
      { label: 'Total P/L', value: '12,450.80', prefix: '$', change: 8.5 },
      { label: 'Win Rate', value: '68.4', suffix: '%' },
      { label: 'Total Trades', value: '156' },
      { label: 'Sharpe Ratio', value: '1.85' },
    ];
  },

  // ========== RUN HISTORY ==========
  
  /**
   * Get run history with optional filters
   * TODO: Replace with: GET /api/runs?filters=...
   */
  async getRunHistory(): Promise<Run[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return generateMockRuns(50);
  },

  /**
   * Delete multiple runs
   * TODO: Replace with: DELETE /api/runs (with body containing IDs)
   */
  async deleteRuns(runIds: string[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock - just simulate deletion
  },

  // ========== REVENUE DATA ==========
  
  /**
   * Get revenue data for reports
   * TODO: Replace with: GET /api/revenue?days=X
   */
  async getRevenueData(days: number = 30): Promise<RevenueDataPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return generateRevenueData(days);
  },

  /**
   * Get calendar data for revenue calendar view
   * TODO: Replace with: GET /api/revenue/calendar?days=X
   */
  async getCalendarData(days: number = 30): Promise<CalendarDataPoint[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const revenueData = generateRevenueData(days);
    return generateCalendarData(revenueData);
  },
};

// Export types for use in components
export type {
  RevenueDataPoint,
  SymbolRevenue,
  StrategyRevenue,
  CalendarDataPoint,
};
