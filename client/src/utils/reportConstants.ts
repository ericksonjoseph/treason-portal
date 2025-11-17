import type { Strategy } from '@/types/strategy';

export const MOCK_STRATEGIES: Strategy[] = [
  { id: 'rsi-macd', name: 'RSI + MACD Strategy', createdBy: 'system' },
  { id: 'ema-crossover', name: 'EMA Crossover', createdBy: 'system' },
  { id: 'bollinger', name: 'Bollinger Bands', createdBy: 'system' },
  { id: 'ml-predictor', name: 'ML Price Predictor', createdBy: 'system' },
];

export const MOCK_TICKERS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NVDA', 'AMD'];

export const TRADING_MODES = [
  { value: 'backtest', label: 'Backtest' },
  { value: 'live', label: 'Live Trading' },
];
