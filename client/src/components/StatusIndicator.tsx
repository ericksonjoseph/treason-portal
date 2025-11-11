import { Badge } from '@/components/ui/badge';

interface StatusIndicatorProps {
  type: 'connection' | 'market' | 'algorithm';
  status: 'active' | 'inactive' | 'connecting';
  label?: string;
}

export default function StatusIndicator({ type, status, label }: StatusIndicatorProps) {
  const getStatusColor = () => {
    if (status === 'active') return 'bg-green-500';
    if (status === 'connecting') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (type === 'connection') {
      return status === 'active' ? 'Connected' : status === 'connecting' ? 'Connecting' : 'Disconnected';
    }
    if (type === 'market') {
      return status === 'active' ? 'Market Open' : 'Market Closed';
    }
    return status === 'active' ? 'Running' : 'Stopped';
  };

  return (
    <Badge variant="outline" className="gap-2" data-testid={`status-${type}`}>
      <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${status === 'connecting' ? 'animate-pulse' : ''}`} />
      {label || getStatusText()}
    </Badge>
  );
}
