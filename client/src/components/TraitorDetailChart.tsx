import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { useMemo } from 'react';
import type { DailyRevenueData, RevenueTimeSeriesPoint } from '@/types/revenue';
import { getSymbolRunColor, formatCurrency } from '@/utils/chartColors';

interface TraitorDetailChartProps {
  traitorName: string;
  data: DailyRevenueData[];
}

export default function TraitorDetailChart({ traitorName, data }: TraitorDetailChartProps) {
  const { chartData, symbolRunKeys } = useMemo(() => {
    const timeSeriesData: RevenueTimeSeriesPoint[] = [];
    const keys = new Set<string>();

    data.forEach((day) => {
      const traitor = day.traitors.find((t) => t.traitorName === traitorName);
      if (!traitor) return;

      const point: RevenueTimeSeriesPoint = {
        date: day.date,
      };

      traitor.symbolRuns.forEach((symbolRun) => {
        const key = `${symbolRun.symbol} (Run ${symbolRun.runId})`;
        point[key] = symbolRun.revenue;
        keys.add(key);
      });

      timeSeriesData.push(point);
    });

    return { chartData: timeSeriesData, symbolRunKeys: Array.from(keys) };
  }, [data, traitorName]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d');
    } catch {
      return dateStr;
    }
  };

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card data-testid={`card-traitor-chart-${traitorName.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader>
        <CardTitle>{traitorName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Revenue by symbol and run
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-sm"
            />
            <YAxis
              tickFormatter={formatCurrency}
              className="text-sm"
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={formatDate}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            {symbolRunKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={getSymbolRunColor(index)}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: getSymbolRunColor(index), r: 3 }}
                activeDot={{ r: 5 }}
                name={key}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
