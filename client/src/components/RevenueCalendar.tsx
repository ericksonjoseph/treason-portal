import { useState } from 'react';
import { useLocation } from 'wouter';
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

interface SymbolRevenue {
  symbol: string;
  revenue: number;
  runId: string;
  strategyId: string;
  mode: string;
}

interface StrategyRevenue {
  name: string;
  revenue: number;
  symbols: SymbolRevenue[];
}

interface CalendarDataPoint {
  date: string;
  revenue: number;
  symbols: number;
  strategies: StrategyRevenue[];
}

interface RevenueCalendarProps {
  data: CalendarDataPoint[];
}

type CalendarView = 'day' | 'week' | 'month' | 'year';

export default function RevenueCalendar({ data }: RevenueCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [, setLocation] = useLocation();

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

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const handleMonthClick = (date: Date) => {
    setCurrentDate(date);
    setView('month');
  };

  const handleSymbolClick = (symbolData: SymbolRevenue, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const params = new URLSearchParams({
      ticker: symbolData.symbol,
      date: dateStr,
      strategy: symbolData.strategyId,
      mode: symbolData.mode,
      run: symbolData.runId,
    });
    console.log('Navigating with params:', {
      ticker: symbolData.symbol,
      date: dateStr,
      dateObject: date,
      strategy: symbolData.strategyId,
      mode: symbolData.mode,
      run: symbolData.runId,
    });
    setLocation(`/?${params.toString()}`);
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
        
        const isProfit = dayData && dayData.revenue > 0;
        const isLoss = dayData && dayData.revenue < 0;

        let bgClass = 'bg-card';
        let textClass = '';
        let borderClass = 'border';
        
        if (!isCurrentMonth) {
          bgClass = 'bg-muted/30';
          textClass = 'text-muted-foreground';
        } else if (dayData) {
          if (isProfit) {
            bgClass = 'bg-emerald-500/10 dark:bg-emerald-500/20';
            borderClass = 'border-emerald-500/30';
            textClass = 'text-emerald-700 dark:text-emerald-400';
          } else if (isLoss) {
            bgClass = 'bg-red-500/10 dark:bg-red-500/20';
            borderClass = 'border-red-500/30';
            textClass = 'text-red-700 dark:text-red-400';
          }
        }
        
        if (isToday) {
          borderClass = 'border-primary border-2';
        }

        days.push(
          <div
            key={day.toString()}
            onClick={() => isCurrentMonth && handleDayClick(cloneDay)}
            className={`min-h-28 ${borderClass} p-3 ${bgClass} ${textClass} transition-colors ${isCurrentMonth ? 'cursor-pointer hover-elevate active-elevate-2' : ''}`}
            data-testid={`calendar-day-${format(cloneDay, 'yyyy-MM-dd')}`}
          >
            <div className="font-semibold text-sm mb-2">
              {formattedDate}
              {isToday && <div className="text-xs font-normal text-primary">Today</div>}
            </div>
            {dayData && isCurrentMonth && (
              <div className="space-y-1">
                <div className={`text-base font-bold ${isProfit ? 'text-emerald-700 dark:text-emerald-400' : isLoss ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>
                  {dayData.revenue >= 0 ? '+' : ''}${dayData.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {dayData.symbols} {dayData.symbols === 1 ? 'symbol' : 'symbols'}
                </div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
            <div
              key={dayName}
              className="bg-muted p-2 text-center text-sm font-semibold rounded-sm"
            >
              {dayName}
            </div>
          ))}
        </div>
        <div className="space-y-1">{rows}</div>
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
      
      const isProfit = dayData && dayData.revenue > 0;
      const isLoss = dayData && dayData.revenue < 0;
      
      let bgClass = 'bg-card';
      let borderClass = 'border';
      
      if (dayData) {
        if (isProfit) {
          bgClass = 'bg-emerald-500/10 dark:bg-emerald-500/20';
          borderClass = 'border-emerald-500/30';
        } else if (isLoss) {
          bgClass = 'bg-red-500/10 dark:bg-red-500/20';
          borderClass = 'border-red-500/30';
        }
      }
      
      if (isToday) {
        borderClass = 'border-primary border-2';
      }

      days.push(
        <div
          key={day.toString()}
          onClick={() => handleDayClick(day)}
          className={`flex-1 ${borderClass} p-4 min-h-64 ${bgClass} transition-colors cursor-pointer hover-elevate active-elevate-2`}
          data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
        >
          <div className="font-bold text-base mb-3">
            {format(day, 'EEE d')}
            {isToday && <div className="text-xs font-normal text-primary">Today</div>}
          </div>
          {dayData && (
            <div className="space-y-3">
              <div className={`text-2xl font-bold ${isProfit ? 'text-emerald-700 dark:text-emerald-400' : isLoss ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>
                {dayData.revenue >= 0 ? '+' : ''}${dayData.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">
                {dayData.symbols} {dayData.symbols === 1 ? 'symbol' : 'symbols'}
              </div>
              {dayData.strategies.length > 0 && (
                <div className="space-y-2">
                  {dayData.strategies.filter(t => t && t.revenue !== undefined).map((strategy) => {
                    const stratIsProfit = strategy.revenue > 0;
                    const stratIsLoss = strategy.revenue < 0;
                    return (
                      <div
                        key={strategy.name}
                        className={`text-sm px-3 py-2 rounded-md border ${
                          stratIsProfit 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
                            : stratIsLoss 
                            ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400'
                            : 'bg-muted/50 border-border text-foreground'
                        }`}
                      >
                        <div className="font-medium mb-1">{strategy.name}</div>
                        <div className="font-bold">
                          {strategy.revenue >= 0 ? '+' : ''}${strategy.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return <div className="flex gap-1">{days}</div>;
  };

  const renderDayView = () => {
    const dayData = getDataForDate(currentDate);
    const isProfit = dayData && dayData.revenue > 0;
    const isLoss = dayData && dayData.revenue < 0;

    return (
      <div className="p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-3xl font-bold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h3>
        </div>
        {dayData ? (
          <div className="space-y-8">
            <div className="text-center">
              <div className={`text-5xl font-bold mb-2 ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : isLoss ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                {dayData.revenue >= 0 ? '+' : ''}${dayData.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xl text-muted-foreground">
                {isProfit ? 'Profit' : isLoss ? 'Loss' : 'Total Revenue'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-card">
                <CardContent className="pt-8 text-center">
                  <div className="text-4xl font-bold">{dayData.symbols}</div>
                  <div className="text-base text-muted-foreground mt-2">
                    Stock {dayData.symbols === 1 ? 'Symbol' : 'Symbols'}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardContent className="pt-8 text-center">
                  <div className="text-4xl font-bold">{dayData.strategies.length}</div>
                  <div className="text-base text-muted-foreground mt-2">Active Strategies</div>
                </CardContent>
              </Card>
            </div>
            {dayData.strategies.length > 0 && (
              <div>
                <h4 className="font-semibold text-lg mb-4">Strategy Performance</h4>
                <div className="grid gap-4">
                  {dayData.strategies.filter(t => t && t.revenue !== undefined).map((strategy) => {
                    const stratIsProfit = strategy.revenue > 0;
                    const stratIsLoss = strategy.revenue < 0;
                    return (
                      <div 
                        key={strategy.name} 
                        className={`px-4 py-4 rounded-md border ${
                          stratIsProfit 
                            ? 'bg-emerald-500/10 border-emerald-500/30' 
                            : stratIsLoss 
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-muted/50 border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`font-medium text-base ${stratIsProfit ? 'text-emerald-700 dark:text-emerald-400' : stratIsLoss ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>
                            {strategy.name}
                          </span>
                          <span className={`font-bold text-lg ${stratIsProfit ? 'text-emerald-700 dark:text-emerald-400' : stratIsLoss ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>
                            {strategy.revenue >= 0 ? '+' : ''}${strategy.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        {strategy.symbols && strategy.symbols.length > 0 && (
                          <div className="space-y-2 pl-4 border-l-2 border-border/30">
                            {strategy.symbols.map((symbolData) => {
                              const symIsProfit = symbolData.revenue > 0;
                              const symIsLoss = symbolData.revenue < 0;
                              return (
                                <div 
                                  key={symbolData.symbol}
                                  onClick={() => handleSymbolClick(symbolData, currentDate)}
                                  className="flex items-center justify-between text-sm cursor-pointer hover-elevate active-elevate-2 rounded px-2 py-1 -mx-2"
                                  data-testid={`symbol-${symbolData.symbol}`}
                                >
                                  <span className="font-medium text-muted-foreground">{symbolData.symbol}</span>
                                  <span className={`font-semibold ${symIsProfit ? 'text-emerald-700 dark:text-emerald-400' : symIsLoss ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>
                                    {symbolData.revenue >= 0 ? '+' : ''}${symbolData.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
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
      let monthSymbolsSet = new Set<string>();
      let day = monthStart;
      
      while (day <= monthEnd) {
        const dayData = getDataForDate(day);
        if (dayData) {
          monthRevenue += dayData.revenue;
          monthSymbolsSet.add(`${format(day, 'yyyy-MM-dd')}-${dayData.symbols}`);
        }
        day = addDays(day, 1);
      }

      const monthSymbols = monthSymbolsSet.size;
      const isProfit = monthRevenue > 0;
      const isLoss = monthRevenue < 0;

      months.push(
        <div
          key={monthDate.toString()}
          onClick={() => handleMonthClick(monthDate)}
          className={`border p-5 rounded-md hover-elevate active-elevate-2 transition-colors cursor-pointer ${
            isProfit 
              ? 'bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-500/20' 
              : isLoss 
              ? 'bg-red-500/10 border-red-500/30 dark:bg-red-500/20'
              : 'bg-card border-border'
          }`}
          data-testid={`calendar-month-${format(monthDate, 'yyyy-MM')}`}
        >
          <div className="font-bold text-base mb-3">{format(monthDate, 'MMMM')}</div>
          {monthRevenue !== 0 ? (
            <div className="space-y-2">
              <div className={`text-xl font-bold ${isProfit ? 'text-emerald-700 dark:text-emerald-400' : isLoss ? 'text-red-700 dark:text-red-400' : 'text-foreground'}`}>
                {monthRevenue >= 0 ? '+' : ''}${monthRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-muted-foreground">
                {monthSymbols} active {monthSymbols === 1 ? 'day' : 'days'}
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
