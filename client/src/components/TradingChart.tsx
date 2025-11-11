import { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts';

interface Trade {
  time: number;
  type: 'buy' | 'sell';
  price: number;
}

interface TradingChartProps {
  data: { time: number; open: number; high: number; low: number; close: number }[];
  trades?: Trade[];
}

export default function TradingChart({ data, trades = [] }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);

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
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    });

    candlestickSeriesRef.current = candlestickSeries;
    candlestickSeries.setData(data as any);

    if (trades.length > 0) {
      const markers = trades.map(trade => ({
        time: trade.time as any,
        position: trade.type === 'buy' ? ('belowBar' as const) : ('aboveBar' as const),
        color: trade.type === 'buy' ? '#10b981' : '#ef4444',
        shape: trade.type === 'buy' ? ('arrowUp' as const) : ('arrowDown' as const),
        text: trade.type === 'buy' ? 'B' : 'S',
      }));
      
      createSeriesMarkers(candlestickSeries, markers);
    }

    chart.timeScale().fitContent();

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
    <div ref={chartContainerRef} className="w-full h-full" data-testid="chart-trading" />
  );
}
