import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ReportsFilters from '@/components/ReportsFilters';
import { DateRange } from 'react-day-picker';
import { MOCK_TRAITORS, MOCK_TICKERS, TRADING_MODES } from '@/utils/reportConstants';
import { generateMockRuns } from '@/utils/mockRunData';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function RunHistoryPage() {
  const [selectedTraitors, setSelectedTraitors] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedRuns, setSelectedRuns] = useState<Set<string>>(new Set());
  const [runs, setRuns] = useState(() => generateMockRuns(50));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [runToDelete, setRunToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReset = () => {
    setSelectedTraitors([]);
    setSelectedModes([]);
    setSelectedTickers([]);
    setDateRange(undefined);
  };

  const filteredRuns = useMemo(() => {
    return runs.filter(run => {
      if (selectedTraitors.length > 0 && !selectedTraitors.includes(run.traitorId)) {
        return false;
      }
      if (selectedModes.length > 0 && !selectedModes.includes(run.mode)) {
        return false;
      }
      if (selectedTickers.length > 0 && !selectedTickers.includes(run.ticker)) {
        return false;
      }
      if (dateRange?.from) {
        const runDate = new Date(run.date);
        if (runDate < dateRange.from) return false;
        if (dateRange.to && runDate > dateRange.to) return false;
      }
      return true;
    });
  }, [runs, selectedTraitors, selectedModes, selectedTickers, dateRange]);

  const toggleSelectAll = () => {
    if (selectedRuns.size === filteredRuns.length) {
      setSelectedRuns(new Set());
    } else {
      setSelectedRuns(new Set(filteredRuns.map(r => r.id)));
    }
  };

  const toggleSelectRun = (runId: string) => {
    const newSelected = new Set(selectedRuns);
    if (newSelected.has(runId)) {
      newSelected.delete(runId);
    } else {
      newSelected.add(runId);
    }
    setSelectedRuns(newSelected);
  };

  const handleDeleteSingle = (runId: string) => {
    setRunToDelete(runId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteBulk = () => {
    if (selectedRuns.size === 0) return;
    setRunToDelete('bulk');
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (runToDelete === 'bulk') {
      setRuns(runs.filter(r => !selectedRuns.has(r.id)));
      toast({
        title: 'Runs deleted',
        description: `Successfully deleted ${selectedRuns.size} run${selectedRuns.size > 1 ? 's' : ''}`,
      });
      setSelectedRuns(new Set());
    } else if (runToDelete) {
      setRuns(runs.filter(r => r.id !== runToDelete));
      const newSelected = new Set(selectedRuns);
      newSelected.delete(runToDelete);
      setSelectedRuns(newSelected);
      toast({
        title: 'Run deleted',
        description: 'Successfully deleted the run',
      });
    }
    setDeleteDialogOpen(false);
    setRunToDelete(null);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      running: 'secondary',
      failed: 'destructive',
    } as const;
    return (
      <Badge variant={variants[status as keyof typeof variants]} data-testid={`badge-status-${status}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Run History</h1>
        <p className="text-muted-foreground" data-testid="text-page-description">
          View and manage all traitor execution runs
        </p>
      </div>

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle data-testid="text-runs-title">
            {filteredRuns.length} Run{filteredRuns.length !== 1 ? 's' : ''}
          </CardTitle>
          {selectedRuns.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteBulk}
              data-testid="button-delete-selected"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedRuns.size})
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRuns.size === filteredRuns.length && filteredRuns.length > 0}
                      onCheckedChange={toggleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                  </TableHead>
                  <TableHead data-testid="header-date">Date</TableHead>
                  <TableHead data-testid="header-traitor">Traitor</TableHead>
                  <TableHead data-testid="header-ticker">Ticker</TableHead>
                  <TableHead data-testid="header-mode">Mode</TableHead>
                  <TableHead data-testid="header-status">Status</TableHead>
                  <TableHead data-testid="header-aggressiveness">Aggressiveness</TableHead>
                  <TableHead data-testid="header-risk">Risk Tolerance</TableHead>
                  <TableHead data-testid="header-stop-loss">Stop Loss</TableHead>
                  <TableHead data-testid="header-take-profit">Take Profit</TableHead>
                  <TableHead data-testid="header-trades">Trades</TableHead>
                  <TableHead data-testid="header-win-rate">Win Rate</TableHead>
                  <TableHead data-testid="header-profit">Profit</TableHead>
                  <TableHead className="w-12" data-testid="header-actions"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRuns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center text-muted-foreground py-8" data-testid="text-no-runs">
                      No runs found matching the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRuns.map(run => (
                    <TableRow key={run.id} data-testid={`row-run-${run.id}`}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRuns.has(run.id)}
                          onCheckedChange={() => toggleSelectRun(run.id)}
                          data-testid={`checkbox-run-${run.id}`}
                        />
                      </TableCell>
                      <TableCell data-testid={`text-date-${run.id}`}>
                        {format(new Date(run.timestamp), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                      <TableCell data-testid={`text-traitor-${run.id}`}>{run.traitorName}</TableCell>
                      <TableCell data-testid={`text-ticker-${run.id}`}>{run.ticker}</TableCell>
                      <TableCell data-testid={`text-mode-${run.id}`}>
                        <Badge variant="outline">{run.mode}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(run.status)}</TableCell>
                      <TableCell data-testid={`text-aggressiveness-${run.id}`}>{run.settings.aggressiveness}</TableCell>
                      <TableCell data-testid={`text-risk-${run.id}`}>{run.settings.riskTolerance}</TableCell>
                      <TableCell data-testid={`text-stop-loss-${run.id}`}>{run.settings.stopLoss}%</TableCell>
                      <TableCell data-testid={`text-take-profit-${run.id}`}>{run.settings.takeProfit}%</TableCell>
                      <TableCell data-testid={`text-trades-${run.id}`}>
                        {run.results?.totalTrades ?? '-'}
                      </TableCell>
                      <TableCell data-testid={`text-win-rate-${run.id}`}>
                        {run.results ? `${(run.results.winRate * 100).toFixed(1)}%` : '-'}
                      </TableCell>
                      <TableCell data-testid={`text-profit-${run.id}`} className={run.results && run.results.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-[#93b4d4]'}>
                        {run.results ? `$${run.results.profit.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSingle(run.id)}
                          data-testid={`button-delete-${run.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="dialog-delete-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {runToDelete === 'bulk'
                ? `Are you sure you want to delete ${selectedRuns.size} run${selectedRuns.size > 1 ? 's' : ''}? This action cannot be undone.`
                : 'Are you sure you want to delete this run? This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover-elevate"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
