import { useState } from 'react';
import AlgorithmSelector from '../AlgorithmSelector';

const mockAlgorithms = [
  { id: 'rsi-macd', name: 'RSI + MACD Strategy', description: 'Mean reversion with momentum' },
  { id: 'ema-crossover', name: 'EMA Crossover', description: 'Fast/slow moving average' },
  { id: 'bollinger', name: 'Bollinger Bands', description: 'Volatility breakout' },
  { id: 'ml-predictor', name: 'ML Price Predictor', description: 'Neural network model' },
];

export default function AlgorithmSelectorExample() {
  const [selected, setSelected] = useState('rsi-macd');

  return (
    <div className="w-80">
      <AlgorithmSelector
        algorithms={mockAlgorithms}
        value={selected}
        onValueChange={(val) => {
          setSelected(val);
          console.log('Algorithm selected:', val);
        }}
      />
    </div>
  );
}
