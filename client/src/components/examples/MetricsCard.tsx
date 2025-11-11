import MetricsCard from '../MetricsCard';

export default function MetricsCardExample() {
  const metrics = [
    { label: 'Total P/L', value: '12,450.80', prefix: '$', change: 8.5 },
    { label: 'Win Rate', value: '68.4', suffix: '%' },
    { label: 'Total Trades', value: '156' },
    { label: 'Sharpe Ratio', value: '1.85' },
  ];

  return <MetricsCard title="Performance Metrics" metrics={metrics} />;
}
