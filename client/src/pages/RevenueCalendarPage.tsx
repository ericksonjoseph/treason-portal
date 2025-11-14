import { useState, useEffect } from 'react';
import { ReportsLayout } from '@/components/ReportsLayout';
import ReportsFilters from '@/components/ReportsFilters';
import RevenueCalendar from '@/components/RevenueCalendar';
import { DateRange } from 'react-day-picker';
import { backendClient, type CalendarDataPoint } from '@/lib/backendClient';
import type { Strategy } from '@/types/strategy';
import { useToast } from '@/hooks/use-toast';

export default function RevenueCalendarPage() {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { toast } = useToast();

  // Data from backend
  const [calendarData, setCalendarData] = useState<CalendarDataPoint[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [tickers, setTickers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const modes = backendClient.getTradingModes();

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [calendarDataResult, strategiesData, tickersData] = await Promise.all([
          backendClient.getCalendarData(30),
          backendClient.getStrategies(),
          backendClient.getTickers(),
        ]);
        setCalendarData(calendarDataResult);
        setStrategies(strategiesData);
        setTickers(tickersData);
      } catch (error) {
        console.error('Failed to load calendar data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load calendar data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleReset = () => {
    setSelectedStrategies([]);
    setSelectedModes([]);
    setSelectedTickers([]);
    setDateRange(undefined);
  };

  const filters = (
    <ReportsFilters
      strategies={strategies}
      selectedStrategies={selectedStrategies}
      onStrategiesChange={setSelectedStrategies}
      tickers={tickers}
      selectedTickers={selectedTickers}
      onTickersChange={setSelectedTickers}
      modes={modes}
      selectedModes={selectedModes}
      onModesChange={setSelectedModes}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      onReset={handleReset}
    />
  );

  return (
    <ReportsLayout
      title="Revenue Calendar"
      description="View daily revenue performance in calendar format"
      filters={filters}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-96" data-testid="loading-revenue-calendar">
          <p className="text-muted-foreground">Loading calendar data...</p>
        </div>
      ) : (
        <RevenueCalendar data={calendarData} />
      )}
    </ReportsLayout>
  );
}
