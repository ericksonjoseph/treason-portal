import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import MultiSelect from './MultiSelect';
import DateRangePicker from './DateRangePicker';
import { DateRange } from 'react-day-picker';
import type { Strategy } from '@/types/strategy';

interface ReportsFiltersProps {
  strategies: Strategy[];
  selectedStrategies: string[];
  onStrategiesChange: (selected: string[]) => void;
  tickers: string[];
  selectedTickers: string[];
  onTickersChange: (selected: string[]) => void;
  modes: Array<{ value: string; label: string }>;
  selectedModes: string[];
  onModesChange: (selected: string[]) => void;
  statuses?: Array<{ value: string; label: string }>;
  selectedStatuses?: string[];
  onStatusesChange?: (selected: string[]) => void;
  dateRange?: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onReset: () => void;
}

export default function ReportsFilters({
  strategies,
  selectedStrategies,
  onStrategiesChange,
  tickers,
  selectedTickers,
  onTickersChange,
  modes,
  selectedModes,
  onModesChange,
  statuses,
  selectedStatuses = [],
  onStatusesChange,
  dateRange,
  onDateRangeChange,
  onReset,
}: ReportsFiltersProps) {
  const strategyOptions = strategies.map((t) => ({ value: t.id, label: t.name }));
  const tickerOptions = tickers.map((t) => ({ value: t, label: t }));
  const hasStatusFilter = statuses && onStatusesChange;

  return (
    <Card data-testid="card-filters">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">Filters</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          data-testid="button-reset-filters"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${hasStatusFilter ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy</label>
          <MultiSelect
            options={strategyOptions}
            selected={selectedStrategies}
            onChange={onStrategiesChange}
            placeholder="Select strategies"
            allLabel="All Strategies"
            testId="filter-strategies"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mode</label>
          <MultiSelect
            options={modes}
            selected={selectedModes}
            onChange={onModesChange}
            placeholder="Select modes"
            allLabel="All Modes"
            testId="filter-modes"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stock Ticker</label>
          <MultiSelect
            options={tickerOptions}
            selected={selectedTickers}
            onChange={onTickersChange}
            placeholder="Select tickers"
            allLabel="All Tickers"
            testId="filter-tickers"
          />
        </div>

        {hasStatusFilter && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <MultiSelect
              options={statuses}
              selected={selectedStatuses}
              onChange={onStatusesChange}
              placeholder="Select status"
              allLabel="All Statuses"
              testId="filter-statuses"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            placeholder="Select date range"
            testId="filter-date-range"
          />
        </div>
      </CardContent>
    </Card>
  );
}
