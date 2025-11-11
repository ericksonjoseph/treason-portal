import TradeTimeline from '../TradeTimeline';

const mockTrades = [
  {
    id: '1',
    timestamp: '2024-11-11 09:30:15',
    action: 'buy' as const,
    price: 152.45,
    quantity: 100,
  },
  {
    id: '2',
    timestamp: '2024-11-11 11:22:48',
    action: 'sell' as const,
    price: 155.80,
    quantity: 100,
    pnl: 335.0,
  },
  {
    id: '3',
    timestamp: '2024-11-11 13:15:30',
    action: 'buy' as const,
    price: 154.20,
    quantity: 150,
  },
  {
    id: '4',
    timestamp: '2024-11-11 14:45:12',
    action: 'sell' as const,
    price: 153.10,
    quantity: 150,
    pnl: -165.0,
  },
  {
    id: '5',
    timestamp: '2024-11-11 15:30:00',
    action: 'buy' as const,
    price: 151.90,
    quantity: 200,
  },
];

export default function TradeTimelineExample() {
  return (
    <TradeTimeline
      trades={mockTrades}
      onTradeClick={(trade) => console.log('Trade clicked:', trade)}
    />
  );
}
