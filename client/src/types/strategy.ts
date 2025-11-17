export interface Strategy {
  id: string;
  name: string;
  createdAt?: string;
  createdBy?: string;
}

export interface RunInstance {
  id: string;
  runNumber: number;
  timestamp: string;
  status?: 'completed' | 'running' | 'failed';
  strategyId: string;
  startedAt?: string;
  completedAt?: string;
  type?: string;
}
