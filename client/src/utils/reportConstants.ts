import type { Strategy } from '@/types/strategy';

export const MOCK_STRATEGIES: Strategy[] = [
  { id: 'rsi-macd', name: 'RSI + MACD Strategy', description: 'Mean reversion with momentum' },
  { id: 'ema-crossover', name: 'EMA Crossover', description: 'Fast/slow moving average' },
  { id: 'bollinger', name: 'Bollinger Bands', description: 'Volatility breakout' },
  { id: 'ml-predictor', name: 'ML Price Predictor', description: 'Neural network model' },
];

export const MOCK_TICKERS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'AMD'];

export const TRADING_MODES = [
  { value: 'backtest', label: 'Backtest' },
  { value: 'live', label: 'Live Trading' },
];
