import { useState } from 'react';
import TradingHeader from '../TradingHeader';

export default function TradingHeaderExample() {
  const [mode, setMode] = useState<'backtest' | 'live'>('backtest');
  const [isDark, setIsDark] = useState(false);

  return (
    <TradingHeader
      mode={mode}
      onModeChange={(m) => {
        setMode(m);
        console.log('Mode changed to:', m);
      }}
      connectionStatus="active"
      marketStatus="active"
      algorithmStatus="inactive"
      isDarkMode={isDark}
      onThemeToggle={() => {
        setIsDark(!isDark);
        console.log('Theme toggled');
      }}
    />
  );
}
