export interface Run {
  id: string;
  strategyId: string;
  strategyName: string;
  ticker: string;
  mode: 'backtest' | 'live';
  date: string;
  timestamp: string;
  status: 'completed' | 'running' | 'failed';
  settings: {
    aggressiveness: number;
    riskTolerance: number;
    stopLoss: number;
    takeProfit: number;
  };
  results?: {
    totalTrades: number;
    winRate: number;
    profit: number;
  };
}
