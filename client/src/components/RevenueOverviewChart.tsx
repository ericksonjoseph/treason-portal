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
import { TOTAL_REVENUE_COLOR, getTraitorColor, formatCurrency } from '@/utils/chartColors';

interface RevenueOverviewChartProps {
  data: DailyRevenueData[];
}

export default function RevenueOverviewChart({ data }: RevenueOverviewChartProps) {
  const chartData = useMemo(() => {
    const timeSeriesData: RevenueTimeSeriesPoint[] = data.map((day) => {
      const point: RevenueTimeSeriesPoint = {
        date: day.date,
        Total: day.totalRevenue,
      };

      day.traitors.forEach((traitor) => {
        point[traitor.traitorName] = traitor.revenue;
      });

      return point;
    });

    return timeSeriesData;
  }, [data]);

  const traitorNames = useMemo(() => {
    if (data.length === 0) return [];
    const names = new Set<string>();
    data.forEach((day) => {
      day.traitors.forEach((traitor) => names.add(traitor.traitorName));
    });
    return Array.from(names);
  }, [data]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d');
    } catch {
      return dateStr;
    }
  };

  return (
    <Card data-testid="card-revenue-overview-chart">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total revenue and individual traitor performance
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
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
            <Line
              type="monotone"
              dataKey="Total"
              stroke={TOTAL_REVENUE_COLOR}
              strokeWidth={3}
              dot={{ fill: TOTAL_REVENUE_COLOR, r: 5 }}
              activeDot={{ r: 7 }}
              name="Total Revenue"
            />
            {traitorNames.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={getTraitorColor(index)}
                strokeWidth={2}
                dot={{ fill: getTraitorColor(index), r: 3 }}
                activeDot={{ r: 5 }}
                name={name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
