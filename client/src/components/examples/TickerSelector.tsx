import { useState } from 'react';
import TickerSelector from '../TickerSelector';

export default function TickerSelectorExample() {
  const [ticker, setTicker] = useState('AAPL');

  return (
    <div className="w-80">
      <TickerSelector
        value={ticker}
        onChange={(val) => {
          setTicker(val);
          console.log('Ticker changed to:', val);
        }}
      />
      <p className="mt-2 text-sm text-muted-foreground">Selected: {ticker}</p>
    </div>
  );
}
