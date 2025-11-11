import TradingChart from '../TradingChart';

const mockData = Array.from({ length: 100 }, (_, i) => {
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

const mockTrades = [
  { time: mockData[20].time, type: 'buy' as const, price: mockData[20].close },
  { time: mockData[35].time, type: 'sell' as const, price: mockData[35].close },
  { time: mockData[60].time, type: 'buy' as const, price: mockData[60].close },
  { time: mockData[85].time, type: 'sell' as const, price: mockData[85].close },
];

export default function TradingChartExample() {
  return (
    <div className="h-96 w-full">
      <TradingChart data={mockData} trades={mockTrades} />
    </div>
  );
}
