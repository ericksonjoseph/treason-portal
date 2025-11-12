import { Run } from '@/types/run';
import { MOCK_TRAITORS, MOCK_TICKERS } from './reportConstants';

export function generateMockRuns(count: number = 50): Run[] {
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
    
    const traitor = MOCK_TRAITORS[Math.floor(Math.random() * MOCK_TRAITORS.length)];
    const ticker = MOCK_TICKERS[Math.floor(Math.random() * MOCK_TICKERS.length)];
    const mode = Math.random() > 0.5 ? 'backtest' : 'live';
    const statuses: Run['status'][] = ['completed', 'running', 'failed'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const totalTrades = Math.floor(Math.random() * 100) + 10;
    const winRate = Math.random() * 0.4 + 0.4;
    const profit = (Math.random() - 0.3) * 10000;
    
    runs.push({
      id: `run-${i + 1}`,
      traitorId: traitor.id,
      traitorName: traitor.name,
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
