export interface Strategy {
  id: string;
  name: string;
  description?: string;
}

export interface RunInstance {
  id: string;
  runNumber: number;
  timestamp: string;
  status?: 'completed' | 'running' | 'failed';
  strategyId: string;
  date: string;
}
