import { useState, useMemo } from 'react';
import { ReportsLayout } from '@/components/ReportsLayout';
import ReportsFilters from '@/components/ReportsFilters';
import RevenueCalendar from '@/components/RevenueCalendar';
import { DateRange } from 'react-day-picker';
import { generateRevenueData, generateCalendarData } from '@/utils/mockRevenueData';
import { MOCK_TRAITORS, MOCK_TICKERS, TRADING_MODES } from '@/utils/reportConstants';

export default function RevenueCalendarPage() {
  const [selectedTraitors, setSelectedTraitors] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const mockRevenueData = useMemo(() => generateRevenueData(30), []);
  const mockCalendarData = useMemo(() => generateCalendarData(mockRevenueData), [mockRevenueData]);

  const handleReset = () => {
    setSelectedTraitors([]);
    setSelectedModes([]);
    setSelectedTickers([]);
    setDateRange(undefined);
  };

  const filters = (
    <ReportsFilters
      traitors={MOCK_TRAITORS}
      selectedTraitors={selectedTraitors}
      onTraitorsChange={setSelectedTraitors}
      tickers={MOCK_TICKERS}
      selectedTickers={selectedTickers}
      onTickersChange={setSelectedTickers}
      modes={TRADING_MODES}
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
      <RevenueCalendar data={mockCalendarData} />
    </ReportsLayout>
  );
}
