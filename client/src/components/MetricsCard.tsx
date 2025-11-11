import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface Metric {
  label: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
}

interface MetricsCardProps {
  title: string;
  metrics: Metric[];
}

export default function MetricsCard({ title, metrics }: MetricsCardProps) {
  return (
    <Card data-testid="card-metrics">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex items-baseline justify-between gap-2">
            <span className="text-sm text-muted-foreground">{metric.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono font-medium" data-testid={`text-${metric.label.toLowerCase().replace(/\s+/g, '-')}`}>
                {metric.prefix}
                {metric.value}
                {metric.suffix}
              </span>
              {metric.change !== undefined && (
                <span
                  className={`flex items-center text-xs ${
                    metric.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {metric.change >= 0 ? (
                    <ArrowUpIcon className="w-3 h-3" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3" />
                  )}
                  {Math.abs(metric.change)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
