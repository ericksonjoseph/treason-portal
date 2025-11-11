import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface Trade {
  id: string;
  timestamp: string;
  action: 'buy' | 'sell';
  price: number;
  quantity: number;
  pnl?: number;
}

interface TradeTimelineProps {
  trades: Trade[];
  onTradeClick?: (trade: Trade) => void;
}

export default function TradeTimeline({ trades, onTradeClick }: TradeTimelineProps) {
  return (
    <Card data-testid="card-trade-timeline">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Trade History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="px-6 pb-4">
            <div className="space-y-2">
              {trades.map((trade) => (
                <div
                  key={trade.id}
                  onClick={() => onTradeClick?.(trade)}
                  className="flex items-center justify-between gap-4 py-2 px-3 rounded-md hover-elevate active-elevate-2 cursor-pointer border"
                  data-testid={`row-trade-${trade.id}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Badge
                      variant={trade.action === 'buy' ? 'default' : 'secondary'}
                      className={
                        trade.action === 'buy'
                          ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                          : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                      }
                      data-testid={`badge-action-${trade.action}`}
                    >
                      {trade.action.toUpperCase()}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">{trade.timestamp}</div>
                      <div className="text-sm font-mono font-medium">
                        {trade.quantity} @ ${trade.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  {trade.pnl !== undefined && (
                    <div
                      className={`text-sm font-mono font-semibold ${
                        trade.pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                      }`}
                      data-testid={`text-pnl-${trade.id}`}
                    >
                      {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
