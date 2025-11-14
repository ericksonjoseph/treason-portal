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

export function generateRevenueData(days: number = 30): RevenueDataPoint[] {
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

export function generateCalendarData(revenueData: RevenueDataPoint[]): CalendarDataPoint[] {
  const allSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'AMD'];
  
  return revenueData.map((d) => {
    const numSymbols = Math.floor(Math.random() * 5) + 3;
    const selectedSymbols = allSymbols.slice(0, numSymbols);
    
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
