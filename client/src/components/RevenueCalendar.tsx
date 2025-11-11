import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  format,
  isSameMonth,
  isSameDay,
  startOfYear,
  addWeeks,
} from 'date-fns';

interface CalendarDataPoint {
  date: string;
  revenue: number;
  trades: number;
  traitors: string[];
}

interface RevenueCalendarProps {
  data: CalendarDataPoint[];
}

type CalendarView = 'day' | 'week' | 'month' | 'year';

export default function RevenueCalendar({ data }: RevenueCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');

  const getDataForDate = (date: Date): CalendarDataPoint | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return data.find((d) => d.date === dateStr);
  };

  const navigatePrev = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, -1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, -1));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === 'year') {
      setCurrentDate(addMonths(currentDate, -12));
    }
  };

  const navigateNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === 'year') {
      setCurrentDate(addMonths(currentDate, 12));
    }
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows: JSX.Element[] = [];
    let days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const dayData = getDataForDate(day);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            className={`min-h-24 border p-2 ${
              !isCurrentMonth ? 'bg-muted/30 text-muted-foreground' : ''
            } ${isToday ? 'bg-primary/5 border-primary' : ''}`}
            data-testid={`calendar-day-${format(cloneDay, 'yyyy-MM-dd')}`}
          >
            <div className="font-medium text-sm mb-1">{formattedDate}</div>
            {dayData && isCurrentMonth && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-primary">
                  ${dayData.revenue.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {dayData.trades} trades
                </div>
                {dayData.traitors.length > 0 && (
                  <div className="text-xs text-muted-foreground truncate">
                    {dayData.traitors.slice(0, 2).join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-px bg-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
            <div
              key={dayName}
              className="bg-muted p-2 text-center text-sm font-semibold"
            >
              {dayName}
            </div>
          ))}
        </div>
        <div className="space-y-px bg-border">{rows}</div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days: JSX.Element[] = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      const dayData = getDataForDate(day);
      const isToday = isSameDay(day, new Date());

      days.push(
        <div
          key={day.toString()}
          className={`flex-1 border p-4 min-h-48 ${
            isToday ? 'bg-primary/5 border-primary' : ''
          }`}
          data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
        >
          <div className="font-semibold mb-2">
            {format(day, 'EEE d')}
          </div>
          {dayData && (
            <div className="space-y-2">
              <div className="text-lg font-bold text-primary">
                ${dayData.revenue.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {dayData.trades} trades
              </div>
              {dayData.traitors.length > 0 && (
                <div className="space-y-1">
                  {dayData.traitors.map((traitor) => (
                    <div
                      key={traitor}
                      className="text-xs bg-muted px-2 py-1 rounded"
                    >
                      {traitor}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return <div className="flex gap-px bg-border">{days}</div>;
  };

  const renderDayView = () => {
    const dayData = getDataForDate(currentDate);

    return (
      <div className="p-6 space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
        </div>
        {dayData ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                ${dayData.revenue.toLocaleString()}
              </div>
              <div className="text-lg text-muted-foreground">
                Total Revenue
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold">{dayData.trades}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Trades</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold">{dayData.traitors.length}</div>
                  <div className="text-sm text-muted-foreground mt-1">Active Traitors</div>
                </CardContent>
              </Card>
            </div>
            {dayData.traitors.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Active Traitors</h4>
                <div className="grid gap-2">
                  {dayData.traitors.map((traitor) => (
                    <div key={traitor} className="bg-muted px-3 py-2 rounded">
                      {traitor}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No trading activity on this day
          </div>
        )}
      </div>
    );
  };

  const renderYearView = () => {
    const yearStart = startOfYear(currentDate);
    const months: JSX.Element[] = [];

    for (let i = 0; i < 12; i++) {
      const monthDate = addMonths(yearStart, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthStart);
      
      let monthRevenue = 0;
      let monthTrades = 0;
      let day = monthStart;
      
      while (day <= monthEnd) {
        const dayData = getDataForDate(day);
        if (dayData) {
          monthRevenue += dayData.revenue;
          monthTrades += dayData.trades;
        }
        day = addDays(day, 1);
      }

      months.push(
        <div
          key={monthDate.toString()}
          className="border p-4 rounded-md hover-elevate"
          data-testid={`calendar-month-${format(monthDate, 'yyyy-MM')}`}
        >
          <div className="font-semibold mb-2">{format(monthDate, 'MMMM')}</div>
          {monthRevenue > 0 ? (
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary">
                ${monthRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {monthTrades} trades
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No activity</div>
          )}
        </div>
      );
    }

    return <div className="grid grid-cols-3 md:grid-cols-4 gap-4">{months}</div>;
  };

  const getHeaderText = () => {
    if (view === 'day') {
      return format(currentDate, 'MMMM d, yyyy');
    } else if (view === 'week') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else {
      return format(currentDate, 'yyyy');
    }
  };

  return (
    <Card data-testid="card-revenue-calendar">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Revenue Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {(['day', 'week', 'month', 'year'] as CalendarView[]).map((v) => (
                <Button
                  key={v}
                  variant={view === v ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView(v)}
                  data-testid={`button-view-${v}`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={navigatePrev}
            data-testid="button-nav-prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold">{getHeaderText()}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={navigateNext}
            data-testid="button-nav-next"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
        {view === 'year' && renderYearView()}
      </CardContent>
    </Card>
  );
}
