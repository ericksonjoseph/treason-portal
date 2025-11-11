import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangePickerProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  testId?: string;
}

export default function DateRangePicker({
  dateRange,
  onDateRangeChange,
  placeholder = 'Select date range',
  testId = 'date-range',
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onDateRangeChange?.(range);
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  const getDisplayText = () => {
    if (!dateRange?.from) {
      return placeholder;
    }
    if (!dateRange.to) {
      return format(dateRange.from, 'MMM d, yyyy');
    }
    return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          data-testid={`${testId}-trigger`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{getDisplayText()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateRangeChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
