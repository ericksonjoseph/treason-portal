import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts';
import { Card } from '@/components/ui/card';

interface Trade {
  time: number;
  type: 'buy' | 'sell';
  price: number;
  id?: string;
  quantity?: number;
}

interface TradingChartProps {
  data: { time: number; open: number; high: number; low: number; close: number }[];
  trades?: Trade[];
}

export default function TradingChart({ data, trades = [] }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const [tooltipData, setTooltipData] = useState<{
    trade: Trade;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');
    
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#d1d5db' : '#374151',
      },
      grid: {
        vertLines: { color: isDark ? '#1f2937' : '#f3f4f6' },
        horzLines: { color: isDark ? '#1f2937' : '#f3f4f6' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#10b981',
      downColor: '#93b4d4',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#93b4d4',
    });

    candlestickSeriesRef.current = candlestickSeries;
    candlestickSeries.setData(data as any);

    if (trades.length > 0) {
      const markers = trades.map(trade => ({
        time: trade.time as any,
        position: trade.type === 'buy' ? ('belowBar' as const) : ('aboveBar' as const),
        color: trade.type === 'buy' ? '#f97316' : '#a855f7',
        shape: trade.type === 'buy' ? ('arrowUp' as const) : ('arrowDown' as const),
        text: trade.type === 'buy' ? 'B' : 'S',
      }));
      
      createSeriesMarkers(candlestickSeries, markers);
    }

    chart.timeScale().fitContent();

    chart.subscribeClick((param) => {
      if (!param.time || !param.point) {
        setTooltipData(null);
        return;
      }

      const clickedTrade = trades.find((trade) => {
        const timeDiff = Math.abs((trade.time as number) - (param.time as number));
        return timeDiff < 120;
      });

      if (clickedTrade) {
        setTooltipData({
          trade: clickedTrade,
          x: param.point.x,
          y: param.point.y,
        });
      } else {
        setTooltipData(null);
      }
    });

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, trades]);

  return (
    <div className="relative w-full h-full">
      <div ref={chartContainerRef} className="w-full h-full" data-testid="chart-trading" />
      
      {tooltipData && (
        <Card
          className="absolute z-50 p-3 shadow-lg border bg-popover text-popover-foreground"
          style={{
            left: `${tooltipData.x + 10}px`,
            top: `${tooltipData.y - 10}px`,
            minWidth: '200px',
          }}
          data-testid="chart-tooltip"
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold" style={{ color: tooltipData.trade.type === 'buy' ? '#f97316' : '#a855f7' }}>
                {tooltipData.trade.type === 'buy' ? '▲ BUY' : '▼ SELL'}
              </span>
              <button
                onClick={() => setTooltipData(null)}
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-close-tooltip"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-mono">${tooltipData.trade.price.toFixed(2)}</span>
              </div>
              {tooltipData.trade.quantity && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-mono">{tooltipData.trade.quantity}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-mono text-xs">
                  {new Date(tooltipData.trade.time * 1000).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
